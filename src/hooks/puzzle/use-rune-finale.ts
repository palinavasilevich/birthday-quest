import { useEffect, useRef, useState } from "react";
import { Soundfont } from "smplr";

import {
  connectToRuneMix,
  frequencyToNoteName,
  getRuneAudioContext,
  getRuneInstrument,
  preloadRuneInstrument,
  RUNE_INSTRUMENT,
  RUNE_PAD_INSTRUMENT,
  type RuneEcho,
} from "@/hooks/puzzle/use-rune-playback";

/**
 * A finale melody note. Same shape as the puzzle's RuneNote, plus an
 * optional harmony voice a fixed interval away — used only on the
 * climax cell, where a fifth below happens to land exactly on the
 * tonic (see FINALE_MELODY for the specific notes).
 */
interface FinaleNote {
  frequency: number;
  duration: number;
  gap: number;
  velocity?: number;
  echo?: RuneEcho;
  harmonyFrequency?: number;
  harmonyVelocity?: number;
}

/*
 * Rune frequencies, restated here in Hz so this module doesn't need
 * to depend on rune-data.ts just for five numbers.
 * quen=B4, axii=D5, igni=E5, aard=F#5, yrden=G5
 */
const QUEN = 493.88;
const AXII = 587.33;
const IGNI = 659.25;
const AARD = 739.99;
const YRDEN = 783.99;

/*
 * A perfect fifth below G5 (yrden) is C5; a perfect fifth below F#5
 * (aard) is B4 — the tonic itself. So harmonizing the fragmented
 * climax cell a fifth down means the harmony voice keeps landing on
 * "home" while the melody is still building tension.
 */
const C5 = 523.25;

/**
 * The same theme as Round 3 (Motif A + Motif B + fragmented Motif C
 * + cadence), restated slower and fuller as a "grand finale":
 * durations and gaps are stretched, the climax cell is harmonized a
 * fifth below, and the final tonic's echo lingers longer under the
 * drone's fade-out.
 */
export const FINALE_MELODY: FinaleNote[] = [
  { frequency: QUEN, duration: 650, gap: 160 },
  { frequency: AXII, duration: 650, gap: 160 },
  { frequency: IGNI, duration: 850, gap: 280 },

  { frequency: AARD, duration: 650, gap: 160 },
  { frequency: IGNI, duration: 650, gap: 160 },
  { frequency: AXII, duration: 850, gap: 300 },

  {
    frequency: YRDEN,
    duration: 750,
    gap: 170,
    harmonyFrequency: C5,
    harmonyVelocity: 40,
  },
  {
    frequency: AARD,
    duration: 550,
    gap: 150,
    harmonyFrequency: QUEN,
    harmonyVelocity: 40,
  },
  {
    frequency: YRDEN,
    duration: 700,
    gap: 160,
    harmonyFrequency: C5,
    harmonyVelocity: 42,
  },
  {
    frequency: AARD,
    duration: 550,
    gap: 150,
    harmonyFrequency: QUEN,
    harmonyVelocity: 42,
  },
  { frequency: AXII, duration: 850, gap: 300 },

  { frequency: IGNI, duration: 650, gap: 220 },
  {
    frequency: QUEN,
    duration: 1600,
    gap: 0,
    echo: { delay: 650, velocity: 40, duration: 1300 },
  },
];

interface UseRuneFinaleOptions {
  /** Called once the arrangement (including the final echo) has finished. */
  onFinished: () => void;
  /** Set false to build the hook without starting playback yet. Defaults to true. */
  autoStart?: boolean;
}

interface UseRuneFinaleResult {
  isPlaying: boolean;
}

/*
 * How long, in ms, the drone takes to fade in and out. Kept short
 * relative to the piece so it reads as "swelling in" rather than
 * being audible as a separate event.
 */
const DRONE_FADE_IN_MS = 1500;
const DRONE_FADE_OUT_MS = 2200;
const DRONE_PEAK_GAIN = 0.14;
const DRONE_NOTE = "B3"; // one octave below the tonic (quen)

/**
 * Plays the Round 3 finale arrangement once: a sustained drone fades
 * in, the harp melody (with fifth-harmony on the climax) plays over
 * it, and the drone fades out under the final note's echo. Calls
 * `onFinished` when the whole thing is done.
 *
 * Call `preloadFinaleInstruments()` earlier (e.g. on mount of the
 * puzzle screen, alongside the harp preload) to avoid a load delay
 * on the drone's very first entrance.
 */
export function useRuneFinale({
  onFinished,
  autoStart = true,
}: UseRuneFinaleOptions): UseRuneFinaleResult {
  const [isPlaying, setIsPlaying] = useState(false);

  const finishedRef = useRef(false);

  useEffect(() => {
    if (!autoStart) {
      return;
    }

    const context = getRuneAudioContext();

    if (!context) {
      onFinished();

      return;
    }

    if (context.state === "suspended") {
      void context.resume();
    }

    let cancelled = false;
    const timeoutIds: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutIds.push(window.setTimeout(resolve, ms));
      });

    let droneGain: GainNode | null = null;
    let padInstance: ReturnType<typeof Soundfont> | null = null;

    const finish = () => {
      if (finishedRef.current) {
        return;
      }

      finishedRef.current = true;
      setIsPlaying(false);
      onFinished();
    };

    const run = async () => {
      setIsPlaying(true);

      /*
       * The harp reuses the puzzle's shared, cached instrument — its
       * output is permanently routed into the shared mix, which is
       * exactly where melody notes should go.
       *
       * The drone needs its own gain envelope for the fade in/out,
       * and smplr only accepts a `destination` node at construction
       * time (not per note), so it gets its own one-off Soundfont
       * instance routed straight into `droneGain` instead of the
       * shared cache.
       */
      droneGain = context.createGain();
      droneGain.gain.value = 0;
      connectToRuneMix(droneGain);

      const pad = Soundfont(context, {
        instrument: RUNE_PAD_INSTRUMENT,
        destination: droneGain,
      });

      const [harp] = await Promise.all([
        getRuneInstrument(context, RUNE_INSTRUMENT),
        pad.ready,
      ]);

      padInstance = pad;

      if (cancelled) {
        pad.dispose();

        return;
      }

      const totalDurationMs =
        FINALE_MELODY.reduce((sum, note) => sum + note.duration + note.gap, 0) +
        DRONE_FADE_OUT_MS;

      const droneSeconds = totalDurationMs / 1000 + 0.5;

      pad.start({
        note: DRONE_NOTE,
        duration: droneSeconds,
        velocity: 70,
      });

      const now = context.currentTime;

      droneGain.gain.linearRampToValueAtTime(
        DRONE_PEAK_GAIN,
        now + DRONE_FADE_IN_MS / 1000,
      );

      for (const note of FINALE_MELODY) {
        if (cancelled) {
          break;
        }

        harp.start({
          note: frequencyToNoteName(note.frequency),
          duration: note.duration / 1000,
          velocity: note.velocity ?? 85,
        });

        if (note.harmonyFrequency) {
          harp.start({
            note: frequencyToNoteName(note.harmonyFrequency),
            duration: note.duration / 1000,
            velocity: note.harmonyVelocity ?? 40,
          });
        }

        if (note.echo) {
          const echo = note.echo;
          const frequency = note.frequency;

          timeoutIds.push(
            window.setTimeout(() => {
              if (cancelled) {
                return;
              }

              harp.start({
                note: frequencyToNoteName(frequency),
                duration: (echo.duration ?? 700) / 1000,
                velocity: echo.velocity,
              });
            }, echo.delay),
          );
        }

        await wait(note.duration);

        if (cancelled) {
          break;
        }

        if (note.gap > 0) {
          await wait(note.gap);
        }
      }

      if (cancelled) {
        return;
      }

      const fadeOutStart = context.currentTime;

      droneGain.gain.linearRampToValueAtTime(
        0,
        fadeOutStart + DRONE_FADE_OUT_MS / 1000,
      );

      await wait(DRONE_FADE_OUT_MS);

      if (!cancelled) {
        droneGain.disconnect();
        padInstance?.dispose();
        padInstance = null;

        finish();
      }
    };

    void run();

    return () => {
      cancelled = true;

      timeoutIds.forEach((id) => window.clearTimeout(id));

      if (droneGain) {
        const node = droneGain;
        const stopAt = context.currentTime + 0.3;

        node.gain.cancelScheduledValues(context.currentTime);
        node.gain.linearRampToValueAtTime(0, stopAt);

        window.setTimeout(() => {
          node.disconnect();
          padInstance?.dispose();
        }, 400);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return { isPlaying };
}

/**
 * Warms up both instruments the finale needs. Call this alongside
 * the puzzle screen's mount effect (next to the harp preload) so
 * neither voice has a load delay by the time Round 3 finishes.
 */
export function preloadFinaleInstruments(): void {
  preloadRuneInstrument(RUNE_INSTRUMENT);
  preloadRuneInstrument(RUNE_PAD_INSTRUMENT);
}
