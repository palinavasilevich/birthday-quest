import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Soundfont } from "smplr";

/**
 * A quiet repeat of a note, played a short while after the note
 * itself starts — used on resolution/tonic notes so the melody
 * feels like it "echoes in the stone" rather than simply stopping.
 */
export interface RuneEcho {
  /** Delay in ms, from the start of the main note, before the echo fires. */
  delay: number;
  /** 0–127 MIDI velocity for the echo. Kept low so it reads as a resonance, not a repeat. */
  velocity: number;
  /** Duration in ms for the echo note. Defaults to a shorter tail than the main note. */
  duration?: number;
}

export interface RuneNote {
  runeId: string;
  duration: number;
  gap: number;
  /** 0–127 MIDI velocity for this note. Defaults to 85 if omitted. */
  velocity?: number;
  /** Optional quiet echo played after this note — used on resolution/tonic notes. */
  echo?: RuneEcho;
}

interface Rune {
  id: string;
  frequency: number;
}

interface UseRunePlaybackOptions {
  runes: Rune[];
  sequence: RuneNote[];
  startDelay?: number;
  autoPlay?: boolean;
}

interface UseRunePlaybackResult {
  isPlaying: boolean;
  activeRune: string | null;
  playRune: (runeId: string) => void;
  playNote: (runeId: string, duration?: number) => void;
  replay: () => void;
}

/*
 * The GM instrument used for rune notes.
 *
 * Any name from the FluidR3 General MIDI set works here — a few that
 * fit the "bardic rune" character well:
 *   "orchestral_harp"        — warm, plucked, clearly melodic (default)
 *   "kalimba"                — soft, wooden, a bit more mysterious
 *   "music_box"               — delicate, magical, slightly eerie
 *   "tubular_bells"           — closer to the previous synth tone
 *   "celesta"                 — bright, crystalline
 */
const RUNE_INSTRUMENT = "orchestral_harp";

let audioContext: AudioContext | null = null;

let reverb: ConvolverNode | null = null;
let dryBus: GainNode | null = null;
let wetBus: GainNode | null = null;
let instrumentOutput: GainNode | null = null;

let instrument: Soundfont | null = null;
let instrumentPromise: Promise<Soundfont> | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext) {
    return audioContext;
  }

  const Ctor =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof window.AudioContext;
      }
    ).webkitAudioContext;

  if (!Ctor) {
    return null;
  }

  audioContext = new Ctor();

  /*
   * Large stone hall / ancient chamber reverb.
   *
   * Kept from the synth version — sampled notes still benefit from
   * the same sense of space as the rest of the scene.
   */
  const seconds = 3;
  const decay = 2.4;

  const length = Math.floor(audioContext.sampleRate * seconds);

  const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);

  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);

    for (let i = 0; i < length; i += 1) {
      const progress = i / length;

      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - progress, decay);
    }
  }

  reverb = audioContext.createConvolver();
  reverb.buffer = impulse;

  dryBus = audioContext.createGain();
  dryBus.gain.value = 0.75;

  wetBus = audioContext.createGain();
  wetBus.gain.value = 0.3;

  dryBus.connect(audioContext.destination);

  wetBus.connect(reverb);
  reverb.connect(audioContext.destination);

  /*
   * Single node the sampled instrument renders into, which then
   * feeds both the dry signal and the reverb send.
   */
  instrumentOutput = audioContext.createGain();
  instrumentOutput.gain.value = 1;

  instrumentOutput.connect(dryBus);
  instrumentOutput.connect(wetBus);

  return audioContext;
}

/**
 * Lazily loads the sampled instrument (once per AudioContext) and
 * returns it. Loading happens over the network the first time it's
 * called, so the very first note may have a short silent gap while
 * the soundfont fetches — call `preloadRuneInstrument` earlier
 * (e.g. when the puzzle screen mounts) to hide that gap.
 */
function getInstrument(context: AudioContext): Promise<Soundfont> {
  if (instrument) {
    return Promise.resolve(instrument);
  }

  if (!instrumentPromise) {
    const player = new Soundfont(context, {
      instrument: RUNE_INSTRUMENT,
      destination: instrumentOutput ?? context.destination,
    });

    instrumentPromise = player.load.then(() => {
      instrument = player;

      return player;
    });
  }

  return instrumentPromise;
}

/**
 * Call this as early as convenient (e.g. on mount of the puzzle
 * screen) to start fetching the soundfont before the player's first
 * click, avoiding a delay on the very first note.
 *
 * Safe to call without a user gesture — it only warms the network
 * fetch and decode; actual playback still waits for a real click,
 * which is what resumes the (autoplay-restricted) AudioContext.
 */
export function preloadRuneInstrument(): void {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  void getInstrument(context);
}

/*
 * Converts a frequency in Hz to a note name ("C4", "F#5", ...) using
 * standard 12-TET / A4 = 440Hz tuning, since the rune data defines
 * pitches as frequencies rather than note names.
 */
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function frequencyToNoteName(frequency: number): string {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;

  return `${name}${octave}`;
}

/**
 * Plays a single rune note using the sampled instrument.
 *
 * Fire-and-forget, same as the previous oscillator-based version —
 * callers don't need to await anything.
 */
function playRuneSound(frequency: number, duration = 900, velocity = 85): void {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume();
  }

  const note = frequencyToNoteName(frequency);
  const seconds = duration / 1000;

  void getInstrument(context).then((player) => {
    player.start({
      note,
      duration: seconds,
      velocity,
    });
  });
}

export function useRunePlayback({
  runes,
  sequence,
  startDelay = 0,
  autoPlay = true,
}: UseRunePlaybackOptions): UseRunePlaybackResult {
  const [activeRune, setActiveRune] = useState<string | null>(null);

  const [replayKey, setReplayKey] = useState(0);

  const [finishedToken, setFinishedToken] = useState<object | null>(null);

  const activeTimeoutRef = useRef<number | null>(null);

  /*
   * Every replay gets a new token.
   *
   * This makes isPlaying correctly describe the current playback.
   */
  const playbackToken = useMemo(() => ({}), [replayKey]);

  const hasPlaybackStarted = autoPlay || replayKey > 0;

  const isPlaying = hasPlaybackStarted && finishedToken !== playbackToken;

  /**
   * Play one rune manually.
   */
  const playNote = useCallback(
    (runeId: string, duration = 520) => {
      const rune = runes.find((item) => item.id === runeId);

      if (!rune) {
        return;
      }

      playRuneSound(rune.frequency, duration);

      setActiveRune(runeId);

      if (activeTimeoutRef.current) {
        window.clearTimeout(activeTimeoutRef.current);
      }

      activeTimeoutRef.current = window.setTimeout(() => {
        setActiveRune(null);
      }, duration);
    },
    [runes],
  );

  /**
   * Normal player interaction.
   */
  const playRune = useCallback(
    (runeId: string) => {
      playNote(runeId, 520);
    },
    [playNote],
  );

  /**
   * Replay the complete sequence.
   */
  const replay = useCallback(() => {
    if (activeTimeoutRef.current) {
      window.clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    setActiveRune(null);
    setFinishedToken(null);

    setReplayKey((key) => key + 1);
  }, []);

  /**
   * Automatic sequence playback.
   */
  useEffect(() => {
    if (!autoPlay && replayKey === 0) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    /*
     * Echoes are scheduled independently of the main note/gap timing
     * (they fire partway through a note's sustain, not between
     * notes), so their timeouts are tracked separately and swept up
     * on cleanup along with everything else.
     */
    const echoTimeoutIds: number[] = [];

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, duration);
      });

    const playSequence = async () => {
      if (startDelay > 0) {
        await wait(startDelay);

        if (cancelled) {
          return;
        }
      }

      for (const note of sequence) {
        if (cancelled) {
          return;
        }

        const rune = runes.find((item) => item.id === note.runeId);

        if (!rune) {
          continue;
        }

        setActiveRune(note.runeId);

        playRuneSound(rune.frequency, note.duration, note.velocity);

        if (note.echo) {
          const echo = note.echo;
          const frequency = rune.frequency;

          const echoTimeoutId = window.setTimeout(() => {
            playRuneSound(frequency, echo.duration ?? 700, echo.velocity);
          }, echo.delay);

          echoTimeoutIds.push(echoTimeoutId);
        }

        await wait(note.duration);

        if (cancelled) {
          return;
        }

        setActiveRune(null);

        if (note.gap > 0) {
          await wait(note.gap);
        }
      }

      if (!cancelled) {
        setActiveRune(null);
        setFinishedToken(playbackToken);
      }
    };

    void playSequence();

    return () => {
      cancelled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      echoTimeoutIds.forEach((id) => window.clearTimeout(id));

      if (activeTimeoutRef.current) {
        window.clearTimeout(activeTimeoutRef.current);
        activeTimeoutRef.current = null;
      }

      setActiveRune(null);
    };
  }, [autoPlay, replayKey, runes, sequence, startDelay, playbackToken]);

  /**
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      if (activeTimeoutRef.current) {
        window.clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    activeRune,
    playRune,
    playNote,
    replay,
  };
}
