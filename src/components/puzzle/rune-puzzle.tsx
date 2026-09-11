import { useGameStore } from "@/store/game-store";

interface RunePuzzleProps {
  nextScene: string;
}

export function RunePuzzle({ nextScene }: RunePuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const handleComplete = () => {
    setScene(nextScene);
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex gap-4">
        <button type="button">QUEN</button>
        <button type="button">IGNI</button>
        <button type="button">AARD</button>
        <button type="button">AXII</button>
        <button type="button">YRDEN</button>
      </div>

      {/* TODO */}
      <button type="button" onClick={handleComplete} className="mt-8">
        TEST COMPLETE
      </button>
    </div>
  );
}
