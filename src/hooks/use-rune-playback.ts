import { useCallback, useEffect, useRef, useState } from "react";

interface Rune {
  id: string;
  frequency: number;
}

interface UseRunePlaybackOptions {
  runes: Rune[];
  sequence: string[];
  replayKey?: number;
  noteDuration?: number;
  noteGap?: number;
  startDelay?: number;
}

interface UseRunePlaybackResult {
  isPlaying: boolean;
  activeRune: string | null;
  playRune: (runeId: string) => void;
  replay: () => void;
}

function playRuneSound(frequency: number) {
  const AudioContext =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof window.AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const context = new AudioContext();

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  gain.gain.setValueAtTime(0, context.currentTime);

  gain.gain.linearRampToValueAtTime(0.18, context.currentTime + 0.03);

  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.55);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.6);

  window.setTimeout(() => {
    void context.close();
  }, 1000);
}

export function useRunePlayback({
  runes,
  sequence,
  replayKey = 0,
  noteDuration = 650,
  noteGap = 120,
  startDelay = 800,
}: UseRunePlaybackOptions): UseRunePlaybackResult {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeRune, setActiveRune] = useState<string | null>(null);

  const [replayVersion, setReplayVersion] = useState(0);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const replay = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    setActiveRune(null);
    setIsPlaying(true);
    setReplayVersion((version) => version + 1);
  }, []);

  const playRune = useCallback(
    (runeId: string) => {
      const rune = runes.find((item) => item.id === runeId);

      if (!rune) {
        return;
      }

      playRuneSound(rune.frequency);
      setActiveRune(rune.id);

      window.setTimeout(() => {
        setActiveRune((current) => (current === rune.id ? null : current));
      }, 250);
    },
    [runes],
  );

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, duration);
        timers.push(timer);
      });

    const playSequence = async () => {
      await wait(startDelay);

      if (cancelled) {
        return;
      }

      for (const runeId of sequence) {
        if (cancelled) {
          return;
        }

        const rune = runes.find((item) => item.id === runeId);

        if (!rune) {
          continue;
        }

        setActiveRune(rune.id);

        playRuneSound(rune.frequency);

        await wait(noteDuration);

        if (cancelled) {
          return;
        }

        setActiveRune(null);

        await wait(noteGap);
      }

      if (!cancelled) {
        setActiveRune(null);
        setIsPlaying(false);
      }
    };

    void playSequence();

    return () => {
      cancelled = true;

      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [
    runes,
    sequence,
    replayKey,
    replayVersion,
    noteDuration,
    noteGap,
    startDelay,
  ]);

  return {
    isPlaying,
    activeRune,
    playRune,
    replay,
  };
}
