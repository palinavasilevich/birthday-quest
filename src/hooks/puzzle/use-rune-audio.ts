import * as Tone from "tone";

import { RUNE_NOTES, type Note } from "@/data/puzzle/rune-puzzle/rune-melody";

let synth: Tone.FMSynth | null = null;

async function getSynth() {
  await Tone.start();

  if (!synth) {
    synth = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 3,
      oscillator: {
        type: "sine",
      },
      modulation: {
        type: "triangle",
      },
      envelope: {
        attack: 0.01,
        decay: 0.15,
        sustain: 0.3,
        release: 0.8,
      },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.5,
      },
      volume: -8,
    }).toDestination();
  }

  return synth;
}

export async function playNote(note: Note) {
  const instrument = await getSynth();

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

export async function playMelody(melody: Note[]) {
  const instrument = await getSynth();

  const noteDuration = "8n";
  const gap = 0.08;

  for (const note of melody) {
    instrument.triggerAttackRelease(note, noteDuration);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 350);
    });
  }
}
