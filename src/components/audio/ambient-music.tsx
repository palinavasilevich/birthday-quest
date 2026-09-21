import { useEffect } from "react";

interface AmbientMusicProps {
  src?: string;
  volume?: number;
  fadeDuration?: number;
}

let currentAudio: HTMLAudioElement | null = null;
let currentSrc: string | null = null;

let interactionListenersAttached = false;

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
  useEffect(() => {
    if (!src) return;

    const targetVolume = clamp(volume);

    /*
     * Same track:
     * don't restart the music when React re-renders.
     */
    if (currentAudio && currentSrc === src && !currentAudio.paused) {
      return;
    }

    const oldAudio = currentAudio;

    /*
     * Create the new track.
     */
    const audio = new Audio(src);

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;

    currentAudio = audio;
    currentSrc = src;

    /*
     * Fade out the previous track.
     */
    if (oldAudio && !oldAudio.paused) {
      fade(oldAudio, oldAudio.volume, 0, fadeDuration, () => {
        oldAudio.pause();
        oldAudio.currentTime = 0;
      });
    }

    let started = false;

    const startMusic = async () => {
      if (started) return;

      try {
        await audio.play();

        started = true;

        fade(audio, 0, targetVolume, fadeDuration);

        removeInteractionListeners();
      } catch {
        /*
         * Autoplay blocked.
         * We'll wait for user interaction.
         */
      }
    };

    const handleInteraction = () => {
      void startMusic();
    };

    const addInteractionListeners = () => {
      if (interactionListenersAttached) return;

      window.addEventListener("pointerdown", handleInteraction);

      window.addEventListener("keydown", handleInteraction);

      window.addEventListener("touchstart", handleInteraction);

      interactionListenersAttached = true;
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", handleInteraction);

      window.removeEventListener("keydown", handleInteraction);

      window.removeEventListener("touchstart", handleInteraction);

      interactionListenersAttached = false;
    };

    addInteractionListeners();

    /*
     * Try immediately.
     */
    void startMusic();

    return () => {
      /*
       * IMPORTANT:
       * Don't stop `audio` here.
       *
       * React will unmount this component when the scene changes,
       * but the music manager must keep the audio alive during
       * the crossfade.
       */
    };
  }, [src, volume, fadeDuration]);

  return null;
}
