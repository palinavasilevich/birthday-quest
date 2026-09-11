import { ActionButton } from "@/components/scene/action-button";
import { GameLayout } from "@/components/layout/game-layout";
import { SceneContent } from "@/components/scene/scene-content";

import { useGameStore } from "@/store/game-store";
import type { SceneData } from "@/types/game";
import { Puzzle } from "@/components/puzzle/puzzle";

interface SceneProps {
  scene: SceneData;
}

export function Scene({ scene }: SceneProps) {
  const setScene = useGameStore((state) => state.setScene);

  return (
    <GameLayout backgroundImg={scene.background} sceneKey={scene.id}>
      <SceneContent content={scene.content} />

      {scene.puzzle ? (
        <Puzzle puzzle={scene.puzzle} />
      ) : scene.nextScene ? (
        <div className="mt-10 flex justify-center">
          <ActionButton
            text="Continue"
            onClick={() => setScene(scene.nextScene!)}
          />
        </div>
      ) : null}
    </GameLayout>
  );
}
