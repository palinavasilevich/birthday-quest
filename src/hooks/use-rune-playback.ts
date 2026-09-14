import { useCallback, useEffect, useRef, useState } from "react";

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
  startDelay = 800,
}: UseRunePlaybackOptions): UseRunePlaybackResult {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeRune, setActiveRune] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);

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
   * Play one rune when the player clicks it.
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

      playRuneSound(rune.frequency);

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
   * Replay the current melody.
   */
  const replay = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    setActiveRune(null);
    setIsPlaying(true);
    setReplayKey((key) => key + 1);
  }, []);

  /*
   * Automatically play the current melody.
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

        /*
         * Highlight rune.
         */
        setActiveRune(note.runeId);

        /*
         * Play note.
         */
        playRuneSound(rune.frequency);

        /*
         * Keep rune highlighted while the note plays.
         */
        await wait(note.duration);

        if (cancelled || !mountedRef.current) {
          return;
        }

        setActiveRune(null);

        /*
         * Pause before the next note.
         */
        await wait(note.gap);
      }

      if (!cancelled && mountedRef.current) {
        setActiveRune(null);
        setIsPlaying(false);
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
  }, [runes, sequence, replayKey, startDelay]);

  return {
    isPlaying,
    activeRune,
    playRune,
    replay,
  };
}
