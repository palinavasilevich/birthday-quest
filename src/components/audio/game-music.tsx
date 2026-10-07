import { useEffect, useRef } from "react";

import { useGameStore } from "@/store/game-store";

interface GameMusicProps {
  src?: string;
  enabled?: boolean;
  volume?: number;
}

const FADE_DURATION = 250;

function clampVolume(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function GameMusic({
  src,
  enabled = true,
  volume = 0.25,
}: GameMusicProps) {
  const soundEnabled = useGameStore((state) => state.isSoundEnabled);

  const isSfxPlaying = useGameStore((state) => state.isSfxPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const MUSIC_VOLUME = clampVolume(volume);
  const DUCKED_VOLUME = 0.05;

  const stopFade = () => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const fadeTo = (
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number,
  ) => {
    stopFade();

    const startVolume = clampVolume(audio.volume);
    const safeTargetVolume = clampVolume(targetVolume);

    if (duration <= 0) {
      audio.volume = safeTargetVolume;
      return;
    }

    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min(Math.max((time - startTime) / duration, 0), 1);

      audio.volume = clampVolume(
        startVolume + (safeTargetVolume - startVolume) * progress,
      );

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(animate);
      } else {
        fadeFrameRef.current = null;
        audio.volume = safeTargetVolume;
      }
    };

    fadeFrameRef.current = requestAnimationFrame(animate);
  };

  /*
   * Create music when the scene changes.
   */
  useEffect(() => {
    if (!enabled || !src) {
      return;
    }

    const currentAudio = audioRef.current;

    if (currentAudio && currentSrcRef.current === src) {
      return;
    }

    stopFade();

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(src);

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = isSfxPlaying ? DUCKED_VOLUME : MUSIC_VOLUME;

    audioRef.current = audio;
    currentSrcRef.current = src;

    if (soundEnabled) {
      void audio.play().catch(() => {});
    }

    return () => {
      stopFade();

      audio.pause();
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [src, enabled]);

  /*
   * Change music volume when SFX starts/ends.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !enabled || !soundEnabled) {
      return;
    }

    const targetVolume = isSfxPlaying ? DUCKED_VOLUME : MUSIC_VOLUME;

    console.log("🎵 MUSIC VOLUME →", targetVolume, "SFX:", isSfxPlaying);

    fadeTo(audio, targetVolume, FADE_DURATION);
  }, [isSfxPlaying, soundEnabled, enabled, MUSIC_VOLUME]);

  /*
   * Global sound toggle.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !enabled) {
      return;
    }

    if (!soundEnabled) {
      stopFade();
      audio.volume = 0;
      return;
    }

    const targetVolume = isSfxPlaying ? DUCKED_VOLUME : MUSIC_VOLUME;

    fadeTo(audio, targetVolume, FADE_DURATION);
  }, [soundEnabled, enabled, isSfxPlaying, MUSIC_VOLUME]);

  /*
   * Resume music after a user interaction
   * if autoplay was blocked.
   */
  useEffect(() => {
    const handleInteraction = () => {
      const audio = audioRef.current;

      if (!audio || !enabled || !soundEnabled) {
        return;
      }

      if (audio.paused) {
        void audio.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", handleInteraction);

    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);

      window.removeEventListener("keydown", handleInteraction);
    };
  }, [enabled, soundEnabled]);

  /*
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      stopFade();

      const audio = audioRef.current;

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  return null;
}
