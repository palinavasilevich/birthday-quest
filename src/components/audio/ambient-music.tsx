import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/game-store";

interface AmbientMusicProps {
  src?: string;
  volume?: number;
  fadeDuration?: number;
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

function fade(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  duration: number,
  onComplete?: () => void,
) {
  const start = performance.now();

  const animate = (time: number) => {
    const progress = clamp((time - start) / duration);

    audio.volume = from + (to - from) * progress;

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    onComplete?.();
  };

  requestAnimationFrame(animate);
}

export function AmbientMusic({
  src,
  volume = 0.35,
  fadeDuration = 1000,
}: AmbientMusicProps) {
  const soundEnabled = useGameStore((state) => state.isSoundEnabled);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcRef = useRef<string | undefined>(undefined);

  /*
   * Create / change music
   */
  useEffect(() => {
    if (!src) return;

    const targetVolume = clamp(volume);

    // Same track — don't restart it
    if (audioRef.current && srcRef.current === src) {
      return;
    }

    const oldAudio = audioRef.current;

    const audio = new Audio(src);

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;

    audioRef.current = audio;
    srcRef.current = src;

    // Fade out previous track
    if (oldAudio && !oldAudio.paused) {
      fade(oldAudio, oldAudio.volume, 0, fadeDuration, () => {
        oldAudio.pause();
        oldAudio.currentTime = 0;
      });
    }

    let disposed = false;

    const startMusic = async () => {
      if (disposed || !soundEnabled) return;

      try {
        await audio.play();

        if (disposed) return;

        fade(audio, audio.volume, targetVolume, fadeDuration);
      } catch {
        // Browser blocked autoplay.
        // We'll start after user interaction.
      }
    };

    const handleInteraction = () => {
      void startMusic();
    };

    /*
     * Browser autoplay workaround
     */
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    void startMusic();

    return () => {
      disposed = true;

      window.removeEventListener("pointerdown", handleInteraction);

      window.removeEventListener("keydown", handleInteraction);

      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [src, volume, fadeDuration, soundEnabled]);

  /*
   * Sound ON / OFF
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const targetVolume = soundEnabled ? clamp(volume) : 0;

    if (soundEnabled) {
      audio
        .play()
        .then(() => {
          fade(audio, audio.volume, targetVolume, fadeDuration);
        })
        .catch(() => {
          // Autoplay may still be blocked.
        });

      return;
    }

    fade(audio, audio.volume, 0, fadeDuration, () => {
      audio.pause();
    });
  }, [soundEnabled, volume, fadeDuration]);

  /*
   * Stop audio when the component is completely unmounted
   */
  useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (!audio) return;

      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
      srcRef.current = undefined;
    };
  }, []);

  return null;
}
