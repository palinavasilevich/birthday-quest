import { useEffect, useRef } from "react";

type MusicMode = "chapter" | "puzzle";

interface GameMusicProps {
  mode: MusicMode;
  chapterSrc: string;
  puzzleSrc: string;
  volume?: number;
  fadeDuration?: number;
}

export function GameMusic({
  mode,
  chapterSrc,
  puzzleSrc,
  volume = 0.25,
  fadeDuration = 1200,
}: GameMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);

  const targetSrc = mode === "puzzle" ? puzzleSrc : chapterSrc;

  useEffect(() => {
    const currentAudio = audioRef.current;

    if (!currentAudio) {
      const audio = new Audio(targetSrc);

      audio.loop = true;
      audio.volume = 0;

      audioRef.current = audio;
      currentSrcRef.current = targetSrc;

      const start = async () => {
        try {
          await audio.play();
        } catch {
          // Browser may block autoplay.
          // The next user interaction will allow playback.
        }

        const startTime = performance.now();

        const fadeIn = (time: number) => {
          const progress = Math.min((time - startTime) / fadeDuration, 1);

          audio.volume = volume * progress;

          if (progress < 1) {
            requestAnimationFrame(fadeIn);
          }
        };

        requestAnimationFrame(fadeIn);
      };

      void start();

      return;
    }

    if (currentSrcRef.current === targetSrc) {
      return;
    }

    const oldAudio = currentAudio;
    const oldVolume = oldAudio.volume;

    const fadeOutStart = performance.now();

    const fadeOut = (time: number) => {
      const progress = Math.min((time - fadeOutStart) / fadeDuration, 1);

      oldAudio.volume = oldVolume * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(fadeOut);
        return;
      }

      oldAudio.pause();
      oldAudio.currentTime = 0;

      const newAudio = new Audio(targetSrc);

      newAudio.loop = true;
      newAudio.volume = 0;

      audioRef.current = newAudio;
      currentSrcRef.current = targetSrc;

      const start = async () => {
        try {
          await newAudio.play();
        } catch {
          return;
        }

        const startTime = performance.now();

        const fadeIn = (currentTime: number) => {
          const progress = Math.min(
            (currentTime - startTime) / fadeDuration,
            1,
          );

          newAudio.volume = volume * progress;

          if (progress < 1) {
            requestAnimationFrame(fadeIn);
          }
        };

        requestAnimationFrame(fadeIn);
      };

      void start();
    };

    requestAnimationFrame(fadeOut);
  }, [targetSrc, volume, fadeDuration]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      audioRef.current = null;
      currentSrcRef.current = null;
    };
  }, []);

  return null;
}
