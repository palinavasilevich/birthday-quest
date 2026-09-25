export type Note = "D4" | "D#4" | "G4" | "A4" | "A#4" | "C5";

export interface MelodyNote {
  note: Note;
  duration: number;
  pause?: number;
}

/*
 * Raphael's Final Act
 * Source: uploaded MIDI, French Horn track.
 *
 * 79 BPM
 *
 * Для первой фразы:
 * G4 — длинная
 * A#4 A4 G4 — короткие
 * D#4 — длинная
 * G4 — короткая
 * D4 — длинная
 */

export const LEVEL_MELODIES: MelodyNote[][] = [
  // Level 1
  [
    { note: "G4", duration: 1.7 },
    { note: "A#4", duration: 0.38 },
    { note: "A4", duration: 0.38 },
    { note: "G4", duration: 0.38 },
    { note: "D#4", duration: 2.28 },
  ],

  // Level 2
  [
    { note: "G4", duration: 1.7 },
    { note: "A#4", duration: 0.38 },
    { note: "A4", duration: 0.38 },
    { note: "G4", duration: 0.38 },
    { note: "D#4", duration: 2.28 },

    { note: "G4", duration: 0.38 },
    { note: "D4", duration: 2.28 },
  ],

  // Level 3
  [
    { note: "G4", duration: 1.7 },
    { note: "A#4", duration: 0.38 },
    { note: "A4", duration: 0.38 },
    { note: "G4", duration: 0.38 },
    { note: "D#4", duration: 2.28 },

    { note: "G4", duration: 0.38 },
    { note: "D4", duration: 2.28 },

    { note: "G4", duration: 1.7 },
    { note: "A#4", duration: 0.38 },
    { note: "A4", duration: 0.38 },
    { note: "G4", duration: 0.38 },
    { note: "A#4", duration: 2.09 },
  ],
];

export const AVAILABLE_NOTES: Note[] = ["D4", "D#4", "G4", "A4", "A#4", "C5"];
