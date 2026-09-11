import { useEffect, useRef } from "react";

interface AmbientMusicProps {
  src: string;
  volume?: number;
  fadeDuration?: number;
}

export function AmbientMusic({
  src,
  volume = 0.35,
  fadeDuration = 1000,
}: AmbientMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);

    audio.loop = true;
    audio.volume = 0;

    audioRef.current = audio;

    const play = async () => {
      try {
        await audio.play();
      } catch {
        // Autoplay can be blocked by the browser.
      }
    };

    play();

    const startTime = performance.now();

    const fadeIn = (time: number) => {
      const progress = Math.min((time - startTime) / fadeDuration, 1);

      audio.volume = volume * progress;

      if (progress < 1) {
        requestAnimationFrame(fadeIn);
      }
    };

    requestAnimationFrame(fadeIn);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [src, volume, fadeDuration]);

  return null;
}
