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
  autoPlay?: boolean;
}

interface UseRunePlaybackResult {
  isPlaying: boolean;
  activeRune: string | null;
  playRune: (runeId: string) => void;
  playNote: (runeId: string, duration?: number) => void;
  replay: () => void;
}

/* ============================================================
 * AUDIO
 * ============================================================ */

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

function playRuneSound(frequency: number, duration = 900) {
  const context = getAudioContext();

  if (!context || !dryBus || !wetBus) {
    return;
  }

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
    {
      type: "sine",
      ratio: 1,
      detune: 0,
      gain: 1,
    },
    {
      type: "sine",
      ratio: 1,
      detune: 7,
      gain: 0.55,
    },
    {
      type: "triangle",
      ratio: 0.5,
      detune: 0,
      gain: 0.4,
    },
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
  autoPlay = true,
}: UseRunePlaybackOptions): UseRunePlaybackResult {
  const [activeRune, setActiveRune] = useState<string | null>(null);

  const [replayKey, setReplayKey] = useState(0);

  const playbackToken = useMemo(() => ({}), []);

  const [finishedToken, setFinishedToken] = useState<object | null>(null);

  /*
   * If autoPlay is disabled, the initial render
   * must not be considered a playback.
   *
   * After replay() increments replayKey,
   * playback starts normally.
   */
  const hasPlaybackStarted = autoPlay || replayKey > 0;

  const isPlaying = hasPlaybackStarted && finishedToken !== playbackToken;

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
   * Play one rune selected by the player.
   */
  const playNote = useCallback(
    (runeId: string, duration = 520) => {
      const rune = runes.find((item) => item.id === runeId);

      if (!rune) return;

      playRuneSound(rune.frequency, duration);

      setActiveRune(runeId);

      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }

      activeTimeoutRef.current = setTimeout(() => {
        setActiveRune(null);
      }, duration);
    },
    [runes],
  );

  const playRune = useCallback(
    (runeId: string) => {
      playNote(runeId, 520);
    },
    [playNote],
  );

  /*
   * Replay the current sequence.
   */
  const replay = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    setActiveRune(null);
    setReplayKey((key) => key + 1);
  }, []);

  /*
   * Automatically play the sequence.
   *
   * With autoPlay=false:
   * - initial mount does nothing;
   * - replay() starts the sequence.
   */
  useEffect(() => {
    if (!autoPlay && replayKey === 0) {
      return;
    }

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
  }, [autoPlay, replayKey, runes, sequence, startDelay, playbackToken]);

  return {
    isPlaying,
    activeRune,
    playRune,
    playNote,
    replay,
  };
}
