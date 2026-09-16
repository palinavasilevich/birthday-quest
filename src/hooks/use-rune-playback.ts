import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface RuneNote {
  runeId: string;
  duration: number;
  gap: number;
}

interface Rune {
  id: string;
  frequency: number;
}

interface UseRunePlaybackOptions {
  runes: Rune[];
  sequence: RuneNote[];
  startDelay?: number;
}

interface UseRunePlaybackResult {
  isPlaying: boolean;
  activeRune: string | null;
  playRune: (runeId: string) => void;
  replay: () => void;
}

/* ============================================================
 * AUDIO
 * ============================================================ */

/*
 * Один контекст на всё приложение.
 *
 * Раньше контекст создавался на каждую ноту: Safari разрешает
 * около шести одновременно, и длинная мелодия его роняла.
 */
let audioContext: AudioContext | null = null;
let reverb: ConvolverNode | null = null;
let dryBus: GainNode | null = null;
let wetBus: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext) {
    return audioContext;
  }

  const Ctor =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof window.AudioContext;
      }
    ).webkitAudioContext;

  if (!Ctor) {
    return null;
  }

  audioContext = new Ctor();

  /*
   * Каменный зал: сгенерированный импульс с экспоненциальным хвостом.
   * Именно он даёт ощущение объёма, а не сами ноты.
   */
  const seconds = 2.6;
  const decay = 2.2;
  const length = Math.floor(audioContext.sampleRate * seconds);
  const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);

  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);

    for (let i = 0; i < length; i += 1) {
      const progress = i / length;

      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - progress, decay);
    }
  }

  reverb = audioContext.createConvolver();
  reverb.buffer = impulse;

  dryBus = audioContext.createGain();
  dryBus.gain.value = 0.75;

  wetBus = audioContext.createGain();
  wetBus.gain.value = 0.55;

  dryBus.connect(audioContext.destination);
  wetBus.connect(reverb);
  reverb.connect(audioContext.destination);

  return audioContext;
}

/*
 * Голос руны: основной тон, расстроенный дубль и октава снизу.
 */
function playRuneSound(frequency: number, duration = 900) {
  const context = getAudioContext();

  if (!context || !dryBus || !wetBus) {
    return;
  }

  /*
   * Браузер мог приглушить контекст до жеста пользователя.
   */
  if (context.state === "suspended") {
    void context.resume();
  }

  const now = context.currentTime;
  const seconds = duration / 1000;

  const attack = 0.12;
  const release = Math.max(seconds, 0.4) + 1.1;

  const voice = context.createGain();

  voice.gain.setValueAtTime(0, now);
  voice.gain.linearRampToValueAtTime(0.16, now + attack);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + release);

  /*
   * Снимаем стерильную верхушку — ближе к колоколу, чем к тест-тону.
   */
  const filter = context.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(frequency * 6, now);
  filter.Q.value = 0.6;

  const layers: Array<{
    type: OscillatorType;
    ratio: number;
    detune: number;
    gain: number;
  }> = [
    { type: "sine", ratio: 1, detune: 0, gain: 1 },
    { type: "sine", ratio: 1, detune: 7, gain: 0.55 },
    { type: "triangle", ratio: 0.5, detune: 0, gain: 0.4 },
  ];

  const oscillators = layers.map((layer) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = layer.type;
    oscillator.frequency.setValueAtTime(frequency * layer.ratio, now);
    oscillator.detune.setValueAtTime(layer.detune, now);

    gain.gain.value = layer.gain;

    oscillator.connect(gain);
    gain.connect(filter);

    oscillator.start(now);
    oscillator.stop(now + release + 0.1);

    return oscillator;
  });

  filter.connect(voice);
  voice.connect(dryBus);
  voice.connect(wetBus);

  const last = oscillators[oscillators.length - 1];

  last.onended = () => {
    voice.disconnect();
    filter.disconnect();
  };
}

/* ============================================================
 * HOOK
 * ============================================================ */

export function useRunePlayback({
  runes,
  sequence,
  startDelay = 800,
}: UseRunePlaybackOptions): UseRunePlaybackResult {
  const [activeRune, setActiveRune] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  /*
   * Токен текущего проигрывания: новая ссылка на каждый запуск мелодии.
   */
  const playbackToken = useMemo(
    () => ({}),
    [runes, sequence, replayKey, startDelay],
  );

  /*
   * Токен последнего доигравшего проигрывания.
   */
  const [finishedToken, setFinishedToken] = useState<object | null>(null);

  /*
   * isPlaying — производная величина, а не состояние.
   *
   * Так флаг сам поднимается для каждой новой мелодии,
   * и его не нужно сбрасывать вручную в теле эффекта.
   */
  const isPlaying = finishedToken !== playbackToken;

  const mountedRef = useRef(true);
  const timersRef = useRef<number[]>([]);
  const activeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      timersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timersRef.current = [];

      if (activeTimeoutRef.current !== null) {
        window.clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  /*
   * Нота, которую нажал игрок.
   */
  const playRune = useCallback(
    (runeId: string) => {
      if (!mountedRef.current) {
        return;
      }

      const rune = runes.find((item) => item.id === runeId);

      if (!rune) {
        return;
      }

      playRuneSound(rune.frequency, 520);

      setActiveRune(runeId);

      if (activeTimeoutRef.current !== null) {
        window.clearTimeout(activeTimeoutRef.current);
      }

      activeTimeoutRef.current = window.setTimeout(() => {
        if (mountedRef.current) {
          setActiveRune((current) => (current === runeId ? null : current));
        }
      }, 250);
    },
    [runes],
  );

  /*
   * Проиграть мелодию заново.
   */
  const replay = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    setActiveRune(null);
    setReplayKey((key) => key + 1);
  }, []);

  /*
   * Автоматическое проигрывание текущей мелодии.
   */
  useEffect(() => {
    let cancelled = false;

    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current = [];

    if (activeTimeoutRef.current !== null) {
      window.clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, duration);

        timersRef.current.push(timer);
      });

    const playSequence = async () => {
      await wait(startDelay);

      if (cancelled || !mountedRef.current) {
        return;
      }

      for (const note of sequence) {
        if (cancelled || !mountedRef.current) {
          return;
        }

        const rune = runes.find((item) => item.id === note.runeId);

        if (!rune) {
          continue;
        }

        setActiveRune(note.runeId);

        playRuneSound(rune.frequency, note.duration);

        await wait(note.duration);

        if (cancelled || !mountedRef.current) {
          return;
        }

        setActiveRune(null);

        await wait(note.gap);
      }

      if (!cancelled && mountedRef.current) {
        setActiveRune(null);

        /*
         * Мелодия доиграла — отмечаем именно этот запуск.
         */
        setFinishedToken(playbackToken);
      }
    };

    void playSequence();

    return () => {
      cancelled = true;

      timersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });

      timersRef.current = [];
    };
  }, [runes, sequence, startDelay, playbackToken]);

  return {
    isPlaying,
    activeRune,
    playRune,
    replay,
  };
}
