import { useState } from "react";
import { GameLayout } from "@/components/layout/game-layout";
import { Puzzle } from "@/components/puzzle/puzzle";
import { SceneActions } from "@/components/scene/scene-actions";
import { ActionButton } from "@/components/scene/action-button";
import { SceneContent } from "@/components/scene/scene-content";

import { useGameStore } from "@/store/game-store";

import type { SceneData } from "@/types/game";

interface SceneProps {
  scene: SceneData;
}

export function Scene({ scene }: SceneProps) {
  const setScene = useGameStore((state) => state.setScene);
  const [typingCompleteFor, setTypingCompleteFor] = useState<string | null>(
    null,
  );

  const isTyping = typingCompleteFor !== scene.id;

  return (
    <GameLayout
      backgroundImg={scene.background}
      sceneKey={scene.id}
      isPuzzle={Boolean(scene.puzzle)}
      music={scene.audio}
    >
      <SceneContent
        content={scene.content}
        onTypingComplete={() => setTypingCompleteFor(scene.id)}
      />

      {scene.puzzle ? (
        <Puzzle puzzle={scene.puzzle} />
      ) : scene.actions?.length ? (
        <SceneActions actions={scene.actions} disabled={isTyping} />
      ) : scene.nextScene ? (
        <div className="mt-10 flex justify-center">
          <ActionButton
            text="Continue"
            disabled={isTyping}
            onClick={() => {
              if (isTyping) return;

              if (scene.nextScene) {
                setScene(scene.nextScene);
              }
            }}
          />
        </div>
      ) : null}
    </GameLayout>
  );
}
