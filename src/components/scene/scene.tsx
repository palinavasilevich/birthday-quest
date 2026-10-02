import { useEffect, useState } from "react";

import { useGameStore } from "@/store/game-store";

import { GameLayout } from "@/components/layout/game-layout";
import { SceneContent } from "@/components/scene/scene-content";
import { SceneActions } from "@/components/scene/scene-actions";
import { ActionButton } from "@/components/scene/action-button";
import { Puzzle } from "@/components/puzzle/puzzle";

import type { SceneData } from "@/types/game";
import { WorkshopLog } from "../cyberpunk/workshop-log";

interface SceneProps {
  scene: SceneData;
}

export function Scene({ scene }: SceneProps) {
  const setScene = useGameStore((state) => state.setScene);

  const [completedSceneId, setCompletedSceneId] = useState<string | null>(null);

  const isTypingComplete = completedSceneId === scene.id;
  const isTerminal = scene.content.type === "terminal";
  const isSpecialComponent = Boolean(scene.specialComponent);
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

  const sceneContent = () => {
    if (scene.puzzle) {
      return <Puzzle puzzle={scene.puzzle} />;
    }

    if (scene.specialComponent === "workshop-log") {
      return <WorkshopLog />;
    }

    if (scene.actions?.length) {
      return <SceneActions actions={scene.actions} />;
    }

    if (scene.nextScene && !scene.autoTransitionToNextScene && !isTerminal) {
      return (
        <div className="mt-10 flex justify-center">
          <ActionButton text="Continue" onClick={handleContinue} />
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!scene.autoTransitionToNextScene || !scene.nextScene) {
      return;
    }

    const delay = scene.autoTransitionDelay ?? 3000;

    const timer = window.setTimeout(() => {
      setScene(scene.nextScene!);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    scene.id,
    scene.autoTransitionToNextScene,
    scene.autoTransitionDelay,
    scene.nextScene,
  ]);

  return (
    <GameLayout
      backgroundImg={scene.background}
      sceneKey={scene.id}
      isPuzzle={Boolean(scene.puzzle)}
      music={scene.audio}
      showBackgroundOnly={scene.showBackgroundOnly}
      specialEffects={scene.specialEffects}
      effectDelay={scene.effectDelay}
    >
      {!showBackgroundOnly && !isSpecialComponent && (
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

      {!showBackgroundOnly &&
        (isTypingComplete || isTerminal || isSpecialComponent) && (
          <>{sceneContent()}</>
        )}
    </GameLayout>
  );
}
