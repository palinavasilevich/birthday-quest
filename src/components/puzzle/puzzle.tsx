import type { PuzzleData } from "@/types/game";
import { RunePuzzle } from "./rune-puzzle";
import { CyberpunkPuzzle } from "./cyberpunk-puzzle";

interface PuzzleProps {
  puzzle: PuzzleData;
}

export function Puzzle({ puzzle }: PuzzleProps) {
  switch (puzzle.type) {
    case "runes":
      return <RunePuzzle puzzleId={puzzle.id} nextScene={puzzle.nextScene} />;

    case "cyberpunk":
      return (
        <CyberpunkPuzzle puzzleId={puzzle.id} nextScene={puzzle.nextScene} />
      );

    default:
      return null;
  }
}
