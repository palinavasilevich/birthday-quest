import { useEffect, useState } from "react";

import { useGameStore } from "@/store/game-store";

import { GameLayout } from "@/components/layout/game-layout";
import { SceneContent } from "@/components/scene/scene-content";
import { SceneActions } from "@/components/scene/scene-actions";
import { SceneEffects } from "@/components/layout/scene-effects";
import { ActionButton } from "@/components/scene/action-button";
import { Puzzle } from "@/components/puzzle/puzzle";

import type { SceneData } from "@/types/game";

interface SceneProps {
  scene: SceneData;
}

export function Scene({ scene }: SceneProps) {
  const setScene = useGameStore((state) => state.setScene);

  const [completedSceneId, setCompletedSceneId] = useState<string | null>(null);

  const hasEffects = (scene.specialEffects?.length ?? 0) > 0;
  const isTypingComplete = completedSceneId === scene.id;
  const isTerminal = scene.content.type === "terminal";
  const showBackgroundOnly = scene.showBackgroundOnly === true;

  const handleTypingComplete = () => {
    setCompletedSceneId(scene.id);
  };

  const handleContinue = () => {
    if (!isTypingComplete) {
      return;
    }

    if (scene.nextScene) {
      setScene(scene.nextScene);
    }
  };

  useEffect(() => {
    if (!scene.autoTransitionToNextScene) {
      return;
    }

    if (!scene.nextScene) {
      return;
    }

    const timer = window.setTimeout(() => {
      setScene(scene.nextScene!);
    }, scene.autoTransitionDelay ?? 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    scene.id,
    scene.autoTransitionToNextScene,
    scene.autoTransitionDelay,
    scene.nextScene,
    setScene,
  ]);

  return (
    <SceneEffects
      active={hasEffects}
      effects={scene.specialEffects ?? []}
      sceneId={scene.id}
      onComplete={() => {
        if (scene.nextScene) {
          setScene(scene.nextScene);
        }
      }}
    >
      <GameLayout
        backgroundImg={scene.background}
        sceneKey={scene.id}
        isPuzzle={Boolean(scene.puzzle)}
        music={scene.audio}
        showBackgroundOnly={scene.showBackgroundOnly}
      >
        {!showBackgroundOnly && (
          <SceneContent
            sceneId={scene.id}
            content={scene.content}
            onTypingComplete={handleTypingComplete}
            onAction={() => {
              if (scene.nextScene) {
                setScene(scene.nextScene);
              }
            }}
          />
        )}

        {!showBackgroundOnly && (isTypingComplete || isTerminal) && (
          <>
            {scene.puzzle ? (
              <Puzzle puzzle={scene.puzzle} />
            ) : scene.actions?.length ? (
              <SceneActions actions={scene.actions} />
            ) : scene.nextScene &&
              !scene.autoTransitionToNextScene &&
              !isTerminal ? (
              <div className="mt-10 flex justify-center">
                <ActionButton text="Continue" onClick={handleContinue} />
              </div>
            ) : null}
          </>
        )}
      </GameLayout>
    </SceneEffects>
  );
}
