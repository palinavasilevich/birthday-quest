import { useEffect, useRef } from "react";

import { useGameStore } from "@/store/game-store";

interface GameSfxProps {
  src?: string;
  trigger?: string;
  volume?: number;
}

export function GameSfx({ src, trigger, volume = 1 }: GameSfxProps) {
  const soundEnabled = useGameStore((state) => state.isSoundEnabled);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src || !soundEnabled) {
      return;
    }

    /*
     * Stop previous effect.
     */
    const previousAudio = audioRef.current;

    if (previousAudio) {
      previousAudio.pause();
      previousAudio.currentTime = 0;
    }

    /*
     * Create new effect.
     */
    const audio = new Audio(src);

    audio.preload = "auto";
    audio.volume = Math.max(0, Math.min(1, volume));

    audioRef.current = audio;

    void audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [src, trigger]);

  /*
   * If sound is switched off while
   * an effect is playing — stop it.
   */
  useEffect(() => {
    if (soundEnabled) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audioRef.current = null;
  }, [soundEnabled]);

  return null;
}
