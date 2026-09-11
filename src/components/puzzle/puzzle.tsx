import type { PuzzleData } from "@/types/game";

import { RunePuzzle } from "@/components/puzzle/rune-puzzle";

interface PuzzleProps {
  puzzle: PuzzleData;
}

export function Puzzle({ puzzle }: PuzzleProps) {
  switch (puzzle.type) {
    case "runes":
      return <RunePuzzle nextScene={puzzle.nextScene} />;

    default:
      return null;
  }
}
