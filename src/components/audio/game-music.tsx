import { useEffect, useRef } from "react";

import { useGameStore } from "@/store/game-store";

interface GameMusicProps {
  src?: string;
  enabled?: boolean;
  volume?: number;
  fadeDuration?: number;
}

function clampVolume(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function GameMusic({
  src,
  enabled = true,
  volume = 0.25,
  fadeDuration = 1000,
}: GameMusicProps) {
  const soundEnabled = useGameStore((state) => state.isSoundEnabled);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const stopFade = () => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const fadeTo = (audio: HTMLAudioElement, targetVolume: number) => {
    stopFade();

    const startVolume = audio.volume;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / fadeDuration, 1);

      audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(animate);
      } else {
        fadeFrameRef.current = null;
        audio.volume = targetVolume;
      }
    };

    fadeFrameRef.current = requestAnimationFrame(animate);
  };

  /*
   * Create / change music.
   */
  useEffect(() => {
    if (!enabled || !src) {
      return;
    }

    const currentAudio = audioRef.current;

    /*
     * Same track — don't restart it.
     */
    if (currentAudio && currentSrcRef.current === src) {
      if (soundEnabled) {
        fadeTo(currentAudio, clampVolume(volume));
      }

      return;
    }

    /*
     * New track.
     */
    if (currentAudio) {
      stopFade();
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(src);

    audio.loop = true;
    audio.preload = "auto";

    /*
     * Start muted and fade in.
     */
    audio.volume = soundEnabled ? 0 : 0;

    audioRef.current = audio;
    currentSrcRef.current = src;

    if (soundEnabled) {
      void audio
        .play()
        .then(() => {
          fadeTo(audio, clampVolume(volume));
        })
        .catch(() => {});
    }

    return () => {
      stopFade();
    };
  }, [src, enabled]);

  /*
   * Sound ON / OFF.
   *
   * IMPORTANT:
   * We DO NOT pause the audio.
   * We only change volume.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !enabled) {
      return;
    }

    if (soundEnabled) {
      /*
       * Resume volume from zero.
       * currentTime stays untouched.
       */
      if (audio.paused) {
        void audio.play().catch(() => {});
      }

      fadeTo(audio, clampVolume(volume));
    } else {
      /*
       * Keep audio playing.
       * Only make it silent.
       */
      fadeTo(audio, 0);
    }

    return () => {
      stopFade();
    };
  }, [soundEnabled, enabled, volume]);

  /*
   * Browser autoplay fallback.
   */
  useEffect(() => {
    if (!enabled || !soundEnabled) {
      return;
    }

    const handleInteraction = () => {
      const audio = audioRef.current;

      if (!audio || !audio.paused) {
        return;
      }

      void audio
        .play()
        .then(() => {
          fadeTo(audio, clampVolume(volume));
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", handleInteraction);

    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);

      window.removeEventListener("keydown", handleInteraction);
    };
  }, [enabled, soundEnabled, volume]);

  /*
   * Cleanup only when GameMusic itself is removed.
   */
  useEffect(() => {
    return () => {
      stopFade();

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
