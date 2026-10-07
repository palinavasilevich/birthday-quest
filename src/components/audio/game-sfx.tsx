import { useEffect, useRef } from "react";

import { useGameStore } from "@/store/game-store";

interface GameSfxProps {
  src?: string;
  trigger?: string;
  volume?: number;
}

export function GameSfx({ src, trigger, volume = 1 }: GameSfxProps) {
  const soundEnabled = useGameStore((state) => state.isSoundEnabled);

  const setSfxPlaying = useGameStore((state) => state.setSfxPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src || !soundEnabled) {
      return;
    }

    const previousAudio = audioRef.current;

    if (previousAudio) {
      previousAudio.pause();
      previousAudio.currentTime = 0;
    }

    const audio = new Audio(src);

    audio.preload = "auto";
    audio.volume = Math.max(0, Math.min(1, volume));

    audioRef.current = audio;

    setSfxPlaying(true);

    const handleEnded = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setSfxPlaying(false);
      }
    };

    const handleError = () => {
      console.error(
        "🔊 SFX ERROR:",
        audio.src,
        audio.error?.code,
        audio.error?.message,
      );

      if (audioRef.current === audio) {
        audioRef.current = null;
        setSfxPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);

    audio.addEventListener("error", handleError);

    void audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
        setSfxPlaying(false);
      }
    });

    return () => {
      audio.removeEventListener("ended", handleEnded);

      audio.removeEventListener("error", handleError);

      audio.pause();
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      // ВАЖНО:
      // здесь больше НЕТ setSfxPlaying(false)
    };
  }, [src, trigger, soundEnabled, volume, setSfxPlaying]);

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

    setSfxPlaying(false);
  }, [soundEnabled, setSfxPlaying]);

  return null;
}
