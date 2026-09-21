import type { PuzzleData } from "@/types/game";
import { RunePuzzle } from "./rune-puzzle/rune-puzzle";
import { CyberpunkPuzzle } from "./cyberpunk-puzzle";
import { DragonFight } from "./dragon-fight-redesign/dragon-fight";
import { RuneDiscovery } from "./rune-puzzle/rune-discovery";

interface PuzzleProps {
  puzzle: PuzzleData;
}

export function Puzzle({ puzzle }: PuzzleProps) {
  switch (puzzle.type) {
    case "runes":
      if (puzzle.mode === "discovery") {
        return <RuneDiscovery nextScene={puzzle.nextScene} />;
      }

      return <RunePuzzle puzzleId={puzzle.id} nextScene={puzzle.nextScene} />;

    case "cyberpunk":
      return (
        <CyberpunkPuzzle puzzleId={puzzle.id} nextScene={puzzle.nextScene} />
      );

    case "final":
      return <DragonFight puzzleId={puzzle.id} nextScene={puzzle.nextScene} />;

    default:
      return null;
  }
}
