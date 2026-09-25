import * as Tone from "tone";

import type { MelodyNote, Note } from "@/data/puzzle/rune-puzzle/rune-melody";

import { RUNE_NOTES } from "@/data/puzzle/rune-puzzle/rune-notes";

let piano: Tone.Sampler | null = null;
let pianoPromise: Promise<Tone.Sampler> | null = null;

async function getPiano() {
  await Tone.start();

  if (piano) {
    return piano;
  }

  if (!pianoPromise) {
    pianoPromise = new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: {
          A4: "A4.mp3",
          C5: "C5.mp3",
          "D#5": "Ds5.mp3",
          "F#5": "Fs5.mp3",
        },
        baseUrl: "/audio/piano/",
        release: 1,

        onload: () => {
          piano = sampler;
          resolve(sampler);
        },

        onerror: (error) => {
          pianoPromise = null;
          reject(error);
        },
      }).toDestination();
    });
  }

  return pianoPromise;
}

export async function playNote(note: Note) {
  const instrument = await getPiano();

  instrument.triggerAttackRelease(note, "8n");
}

export async function playRune(runeId: string) {
  const note = RUNE_NOTES[runeId];

  if (!note) {
    console.warn(`No note configured for rune: ${runeId}`);
    return;
  }

  await playNote(note);
}

export async function playMelodyNote(note: Note, duration: number) {
  const instrument = await getPiano();

  instrument.triggerAttackRelease(note, duration);

  // Ждём окончания ноты.
  // Это нужно для последовательного проигрывания мелодии.
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration * 1000);
  });
}

export async function playMelody(melody: MelodyNote[]) {
  const instrument = await getPiano();

  const now = Tone.now();
  let time = now;

  for (const item of melody) {
    instrument.triggerAttackRelease(item.note, item.duration, time);

    time += item.duration + (item.pause ?? 0);
  }
}
