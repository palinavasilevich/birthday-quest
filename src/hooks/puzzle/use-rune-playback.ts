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
  playWrittenNote: (runeId: string, note: RuneNote) => void;
  replay: () => void;
}

/*
 * GM instruments used in this file.
 *
 * RUNE_INSTRUMENT is the plucked voice used for every rune note.
 * RUNE_PAD_INSTRUMENT is a soft sustained voice, used only for the
 * finale's drone — alternates that fit equally well:
 *   "string_ensemble_1"   — warmer, more "orchestral"
 *   "choir_aahs"          — more ethereal / vocal
 */
const RUNE_INSTRUMENT = "orchestral_harp";
const RUNE_PAD_INSTRUMENT = "pad_2_warm";

let audioContext: AudioContext | null = null;

let reverb: ConvolverNode | null = null;
let dryBus: GainNode | null = null;
let wetBus: GainNode | null = null;
let instrumentOutput: GainNode | null = null;

/*
 * One Soundfont instance per GM instrument name, loaded lazily and
 * cached for the lifetime of the page. Both the puzzle's harp and
 * the finale's pad share this cache and the same AudioContext/mix
 * buses, so nothing is duplicated between the two.
 */
const instrumentCache = new Map<string, Promise<Soundfont>>();

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
 * Lazily loads a sampled instrument (once per name, per page load)
 * and returns it. Loading happens over the network the first time
 * it's requested, so the very first note may have a short silent
 * gap while the soundfont fetches — call `preloadRuneInstrument`
 * earlier (e.g. when a screen mounts) to hide that gap.
 */
function getInstrument(
  context: AudioContext,
  name: string = RUNE_INSTRUMENT,
): Promise<Soundfont> {
  const cached = instrumentCache.get(name);

  if (cached) {
    return cached;
  }

  const player = Soundfont(context, {
    instrument: name,
    destination: instrumentOutput ?? context.destination,
  });

  const promise = player.ready.then(() => player);

  instrumentCache.set(name, promise);

  return promise;
}

/**
 * Call this as early as convenient (e.g. on mount of a screen) to
 * start fetching a soundfont before it's actually needed, avoiding a
 * delay on the first note. Defaults to the rune/harp instrument;
 * pass `RUNE_PAD_INSTRUMENT` to warm up the finale's drone voice too.
 *
 * Safe to call without a user gesture — it only warms the network
 * fetch and decode; actual playback still waits for a real click,
 * which is what resumes the (autoplay-restricted) AudioContext.
 */
export function preloadRuneInstrument(name: string = RUNE_INSTRUMENT): void {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  void getInstrument(context, name);
}

/*
 * Shared internals exported for use by the finale module
 * (use-rune-finale.ts), which needs the same AudioContext, mix
 * buses and instrument cache rather than a second, duplicate setup.
 */
export {
  RUNE_INSTRUMENT,
  RUNE_PAD_INSTRUMENT,
  getAudioContext as getRuneAudioContext,
  getInstrument as getRuneInstrument,
};

/**
 * Connects an arbitrary audio node into the shared dry/reverb mix,
 * the same one every rune note and the finale's drone render into.
 * Ensures `getRuneAudioContext` has been called at least once first.
 */
export function connectToRuneMix(node: AudioNode): void {
  if (!dryBus || !wetBus) {
    return;
  }

  node.connect(dryBus);
  node.connect(wetBus);
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

export function frequencyToNoteName(frequency: number): string {
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

/**
 * Schedules a note's echo (a single quieter repeat after `echo.delay`
 * ms), returning the timeout id so the caller can cancel it if
 * needed. Shared by both automatic sequence playback and manual
 * (player-triggered) note playback so the two don't duplicate this
 * logic.
 */
function scheduleRuneEcho(frequency: number, echo: RuneEcho): number {
  return window.setTimeout(() => {
    playRuneSound(frequency, echo.duration ?? 700, echo.velocity);
  }, echo.delay);
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
   * Echo timeouts spawned by manual (player-triggered) notes via
   * playWrittenNote — tracked separately from the sequence effect's
   * own echoes so they can be cancelled if the component unmounts
   * mid-echo.
   */
  const manualEchoTimeoutsRef = useRef<number[]>([]);

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
   * Plays a rune the way it's actually written in the sequence data —
   * its own duration, velocity, and echo — rather than the generic
   * 520ms/default-velocity click `playRune` uses. Intended for the
   * moment the player taps the *correct* rune, so solving the puzzle
   * by hand reproduces the same nuance (the resolving tonic's quiet
   * echo, in particular) as listening to the melody play automatically.
   */
  const playWrittenNote = useCallback(
    (runeId: string, note: RuneNote) => {
      const rune = runes.find((item) => item.id === runeId);

      if (!rune) {
        return;
      }

      playRuneSound(rune.frequency, note.duration, note.velocity);

      setActiveRune(runeId);

      if (activeTimeoutRef.current) {
        window.clearTimeout(activeTimeoutRef.current);
      }

      activeTimeoutRef.current = window.setTimeout(() => {
        setActiveRune(null);
      }, note.duration);

      if (note.echo) {
        const echoTimeoutId = scheduleRuneEcho(rune.frequency, note.echo);

        manualEchoTimeoutsRef.current.push(echoTimeoutId);
      }
    },
    [runes],
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
          const echoTimeoutId = scheduleRuneEcho(rune.frequency, note.echo);

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

      manualEchoTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
      manualEchoTimeoutsRef.current = [];
    };
  }, []);

  return {
    isPlaying,
    activeRune,
    playRune,
    playNote,
    playWrittenNote,
    replay,
  };
}
