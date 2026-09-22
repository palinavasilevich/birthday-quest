import type { RuneNote } from "@/hooks/use-rune-playback";
import { runes } from "@/data/images/puzzle/runes";

export interface Rune {
  id: string;
  label: string;
  symbolImage: string;
  frequency: number;
}

export const RUNES: Rune[] = [
  {
    id: "quen",
    label: "QUEN",
    symbolImage: runes.quen,
    frequency: 493.88,
  },
  {
    id: "igni",
    label: "IGNI",
    symbolImage: runes.igni,
    frequency: 659.25, // E5
  },
  {
    id: "aard",
    label: "AARD",
    symbolImage: runes.aard,
    frequency: 739.99, // F#5
  },
  {
    id: "yrden",
    label: "YRDEN",
    symbolImage: runes.yrden,
    frequency: 783.99, // G5
  },
  {
    id: "axii",
    label: "AXII",
    symbolImage: runes.axii,
    frequency: 587.33, // D5
  },
];

/**
 * The first melody is used during Rune Discovery.
 *
 * It previews Motif A of the ballad theme (see PUZZLE_ROUNDS) in a
 * slower, more rubato phrasing — the player should recognize it when
 * the same motif returns, tightened up, in Round 1 of the puzzle.
 *
 * The final tonic carries a quiet echo — the melody audibly settling
 * into the stone after it finishes.
 *
 * Key: B minor (quen=B4, axii=D5, igni=E5, aard=F#5, yrden=G5)
 */
export const DISCOVERY_MELODY: RuneNote[] = [
  { runeId: "quen", duration: 900, gap: 260 }, // B4 — motif A start, unhurried
  { runeId: "axii", duration: 850, gap: 240 }, // D5
  { runeId: "igni", duration: 1200, gap: 320 }, // E5 — motif A peak, lingered on
  {
    runeId: "quen",
    duration: 1300,
    gap: 300,
    echo: { delay: 550, velocity: 30, duration: 1100 },
  }, // B4 — home, held, then echoes once, quietly
];

/**
 * Main Rune Puzzle melodies.
 *
 * Each round becomes progressively longer.
 *
 * The musical character is inspired by:
 * - medieval fantasy
 * - bardic ballads
 * - mysterious magical themes
 *
 * It does NOT reproduce the melody of Song of Balduran.
 *
 * The three rounds are a motivic development of one theme, not just
 * longer copies of each other:
 *   Round 1 — Motif A (question) + cadence.
 *   Round 2 — Motif A + Motif B (contrasting answer) + cadence.
 *   Round 3 — Motif A + Motif B + a fragmented, quickening
 *             restatement of Motif C's head (the climax proper)
 *             before the final, longest cadence.
 *
 * The fragmentation in Round 3 is a standard ballad-development
 * device: instead of stating the climax once, its opening two-note
 * cell (yrden → aard) repeats with tightening rhythm, building
 * tension before the phrase opens out and resolves. This also makes
 * Round 3 harder in a way that isn't just "longer" — the stutter
 * itself has to be memorized correctly.
 *
 * Every round's final tonic carries a quiet echo — the melody
 * audibly resolving into the stone rather than simply cutting off.
 */
export const PUZZLE_ROUNDS: RuneNote[][] = [
  // Round 1 — Motif A + cadence: "the question, and a simple answer"
  [
    { runeId: "quen", duration: 500, gap: 120 }, // B4 — motif A start
    { runeId: "axii", duration: 500, gap: 120 }, // D5
    { runeId: "igni", duration: 650, gap: 220 }, // E5 — motif A peak, held
    {
      runeId: "quen",
      duration: 1050,
      gap: 260,
      echo: { delay: 450, velocity: 32, duration: 900 },
    }, // B4 — home, then echoes
  ],

  // Round 2 — Motif A + Motif B + cadence: "question, contrasting response, home"
  [
    { runeId: "quen", duration: 500, gap: 120 }, // B4 — motif A
    { runeId: "axii", duration: 500, gap: 120 }, // D5
    { runeId: "igni", duration: 650, gap: 220 }, // E5 — motif A peak

    { runeId: "aard", duration: 500, gap: 120 }, // F#5 — motif B (contrast)
    { runeId: "igni", duration: 500, gap: 120 }, // E5
    { runeId: "axii", duration: 650, gap: 240 }, // D5 — half cadence, not home yet

    { runeId: "igni", duration: 500, gap: 160 }, // E5 — cadence
    {
      runeId: "quen",
      duration: 1050,
      gap: 260,
      echo: { delay: 450, velocity: 34, duration: 900 },
    }, // B4 — home, then echoes
  ],

  // Round 3 — Motif A + Motif B + fragmented Motif C (climax) + cadence: full ballad
  [
    { runeId: "quen", duration: 500, gap: 120 }, // B4 — motif A
    { runeId: "axii", duration: 500, gap: 120 }, // D5
    { runeId: "igni", duration: 650, gap: 220 }, // E5 — motif A peak

    { runeId: "aard", duration: 500, gap: 120 }, // F#5 — motif B
    { runeId: "igni", duration: 500, gap: 120 }, // E5
    { runeId: "axii", duration: 650, gap: 240 }, // D5 — half cadence

    // Fragmented climax: the yrden→aard cell stated, then repeated
    // faster — tension building before the phrase opens out.
    { runeId: "yrden", duration: 600, gap: 140 }, // G5 — climax cell, first statement
    { runeId: "aard", duration: 450, gap: 120 }, // F#5
    { runeId: "yrden", duration: 550, gap: 130 }, // G5 — same cell, tighter
    { runeId: "aard", duration: 450, gap: 120 }, // F#5
    { runeId: "axii", duration: 650, gap: 240 }, // D5 — the stutter resolves, opens out

    { runeId: "igni", duration: 500, gap: 180 }, // E5 — cadence
    {
      runeId: "quen",
      duration: 1200,
      gap: 320,
      echo: { delay: 500, velocity: 38, duration: 1000 },
    }, // B4 — home, final and longest, then echoes
  ],
];
