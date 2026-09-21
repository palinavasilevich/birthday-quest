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
    frequency: 659.25,
  },
  {
    id: "aard",
    label: "AARD",
    symbolImage: runes.aard,
    frequency: 739.99,
  },
  {
    id: "yrden",
    label: "YRDEN",
    symbolImage: runes.yrden,

    frequency: 783.99,
  },
  {
    id: "axii",
    label: "AXII",
    symbolImage: runes.axii,

    frequency: 587.33,
  },
];

export const PUZZLE_ROUNDS: RuneNote[][] = [
  [
    { runeId: "quen", duration: 900, gap: 140 },
    { runeId: "aard", duration: 800, gap: 120 },
    { runeId: "igni", duration: 260, gap: 80 },
    { runeId: "aard", duration: 260, gap: 80 },
    { runeId: "yrden", duration: 1000, gap: 180 },
    { runeId: "axii", duration: 1200, gap: 200 },
  ],

  [
    { runeId: "quen", duration: 650, gap: 120 },
    { runeId: "yrden", duration: 650, gap: 120 },
    { runeId: "igni", duration: 300, gap: 80 },
    { runeId: "aard", duration: 300, gap: 80 },
    { runeId: "axii", duration: 650, gap: 120 },
    { runeId: "yrden", duration: 500, gap: 100 },
    { runeId: "aard", duration: 300, gap: 80 },
    { runeId: "igni", duration: 500, gap: 100 },
    { runeId: "axii", duration: 650, gap: 160 },
  ],

  [
    { runeId: "quen", duration: 650, gap: 120 },
    { runeId: "yrden", duration: 650, gap: 120 },
    { runeId: "igni", duration: 300, gap: 80 },
    { runeId: "aard", duration: 300, gap: 80 },
    { runeId: "axii", duration: 650, gap: 120 },
    { runeId: "yrden", duration: 500, gap: 100 },
    { runeId: "aard", duration: 300, gap: 80 },
    { runeId: "igni", duration: 500, gap: 100 },
    { runeId: "axii", duration: 500, gap: 100 },
    { runeId: "aard", duration: 300, gap: 80 },
    { runeId: "igni", duration: 650, gap: 160 },
  ],
];

export const DISCOVERY_MELODY = PUZZLE_ROUNDS[0];
