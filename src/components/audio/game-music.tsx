import { useEffect, useRef } from "react";

type MusicMode = "chapter" | "puzzle";

interface GameMusicProps {
  mode: MusicMode;
  chapterSrc: string;
  puzzleSrc: string;
  volume?: number;
  fadeDuration?: number;
}

function clampVolume(value: number) {
  return Math.max(0, Math.min(1, value));
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
  const animationRef = useRef<number | null>(null);

  const targetSrc = mode === "puzzle" ? puzzleSrc : chapterSrc;

  useEffect(() => {
    const stopAnimation = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const startFadeIn = (audio: HTMLAudioElement) => {
      const startTime = performance.now();

      const fadeIn = (time: number) => {
        const progress = Math.min((time - startTime) / fadeDuration, 1);

        audio.volume = clampVolume(volume * progress);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(fadeIn);
        } else {
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(fadeIn);
    };

    const startNewAudio = (src: string) => {
      const audio = new Audio(src);

      audio.loop = true;
      audio.volume = 0;

      audioRef.current = audio;
      currentSrcRef.current = src;

      void audio
        .play()
        .then(() => {
          startFadeIn(audio);
        })
        .catch(() => {
          // Browser blocked autoplay.
        });
    };

    const currentAudio = audioRef.current;

    /*
     * First track.
     */
    if (!currentAudio) {
      startNewAudio(targetSrc);

      return stopAnimation;
    }

    /*
     * Same track — nothing to do.
     */
    if (currentSrcRef.current === targetSrc) {
      return stopAnimation;
    }

    /*
     * Different track.
     */
    stopAnimation();

    const oldAudio = currentAudio;
    const oldVolume = oldAudio.volume;
    const fadeOutStart = performance.now();

    const fadeOut = (time: number) => {
      const progress = Math.min((time - fadeOutStart) / fadeDuration, 1);

      oldAudio.volume = clampVolume(oldVolume * (1 - progress));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(fadeOut);

        return;
      }

      oldAudio.pause();
      oldAudio.currentTime = 0;

      startNewAudio(targetSrc);
    };

    animationRef.current = requestAnimationFrame(fadeOut);

    return stopAnimation;
  }, [targetSrc, volume, fadeDuration]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

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
