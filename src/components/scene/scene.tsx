import { useEffect, useState } from "react";

import { useGameStore } from "@/store/game-store";

import { GameLayout } from "@/components/layout/game-layout";
import { SceneContent } from "@/components/scene/scene-content";
import { SceneActions } from "@/components/scene/scene-actions";
import { ActionButton } from "@/components/scene/action-button";
import { Puzzle } from "@/components/puzzle/puzzle";
import { WorkshopLog } from "../cyberpunk/workshop-log";
import { EndingOverlay } from "./ending-overlay";
import { DiceCheck } from "./dice-check";
import { ItemNotification } from "@/components/scene/item-notification";
import { ITEMS } from "@/data/items";
import type { SceneData } from "@/types/game";
interface SceneProps {
  scene: SceneData;
}

export function Scene({ scene }: SceneProps) {
  const setScene = useGameStore((state) => state.setScene);
  const addItem = useGameStore((state) => state.addItem);

  const itemNotification = useGameStore((state) => state.itemNotification);
  const dismissItemNotification = useGameStore(
    (state) => state.dismissItemNotification,
  );

  const notifiedItem = itemNotification ? ITEMS[itemNotification] : null;

  const [completedSceneId, setCompletedSceneId] = useState<string | null>(null);

  const isTypingComplete = completedSceneId === scene.id;

  const isTerminal = scene.content.type === "terminal";

  const isSpecialComponent = Boolean(scene.specialComponent);

  const showBackgroundOnly = scene.showBackgroundOnly === true;

  const handleTypingComplete = () => {
    setCompletedSceneId(scene.id);
  };

  const handleContinue = () => {
    if (!isTypingComplete) return;

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
          <ActionButton text="Продолжить" onClick={handleContinue} />
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!scene.autoTransitionToNextScene || !scene.nextScene) {
      return;
    }

    const requiresTyping =
      !showBackgroundOnly &&
      !isSpecialComponent &&
      !scene.puzzle &&
      scene.content.type !== "diceCheck" &&
      scene.content.type !== "terminal";

    if (requiresTyping && !isTypingComplete) {
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
    scene.content.type,
    isTypingComplete,
    showBackgroundOnly,
    isSpecialComponent,
    scene.puzzle,
    setScene,
  ]);

  useEffect(() => {
    scene.itemsToCollect?.forEach((itemId) => {
      addItem(itemId);
    });
  }, [scene.id, scene.itemsToCollect, addItem]);

  return (
    <div className="relative h-full w-full">
      <GameLayout
        backgroundImg={scene.background}
        sceneKey={scene.id}
        isPuzzle={Boolean(scene.puzzle)}
        showBackgroundOnly={scene.showBackgroundOnly}
        specialEffects={scene.specialEffects}
        effectDelay={scene.effectDelay}
        classNameContentBlock={
          scene.puzzle?.id === "final-battle-puzzle" ? "max-w-240" : ""
        }
      >
        {!showBackgroundOnly &&
          !isSpecialComponent &&
          (scene.content.type === "diceCheck" ? (
            <DiceCheck content={scene.content} />
          ) : (
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
          ))}

        {!showBackgroundOnly &&
          (isTypingComplete || isTerminal || isSpecialComponent) && (
            <>{sceneContent()}</>
          )}
      </GameLayout>

      {scene.isFinish && <EndingOverlay />}

      {notifiedItem && (
        <ItemNotification
          itemId={notifiedItem.id}
          name={notifiedItem.name}
          description={notifiedItem.description}
          image={notifiedItem.image}
          onClose={dismissItemNotification}
        />
      )}
    </div>
  );
}
