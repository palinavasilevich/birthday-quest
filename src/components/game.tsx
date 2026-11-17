import { useState } from "react";

import { GameMusic } from "@/components/audio/game-music";
import { GameSfx } from "@/components/audio/game-sfx";

import { Scene } from "@/components/scene/scene";

import { finalChapter } from "@/data/story/final";
import { firstChapter } from "@/data/story/chapter1";
import { secondChapter } from "@/data/story/chapter2";

import { useGameStore } from "@/store/game-store";

import { GameLayout } from "./layout/game-layout";
import { StartScreen } from "./scene/start-scene";

import startScreen from "../../public/images/start_new.jpeg";

export function Game() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const currentSceneId = useGameStore((state) => state.currentSceneId);

  const startGame = useGameStore((state) => state.startGame);

  const story = [
    ...firstChapter.scenes,
    ...secondChapter.scenes,
    ...finalChapter.scenes,
  ];

  const scene = story.find((scene) => scene.id === currentSceneId);

  if (!scene) {
    return <div>Scene not found</div>;
  }

  // Music and game state start right on click (browsers allow audio only
  // inside a user gesture); the scene itself appears after the exit animation.
  const handleStart = () => {
    if (isLeaving) return;
    startGame();
    setIsLeaving(true);
  };

  return (
    <>
      <GameMusic src={scene.audio} enabled={isLeaving || isStarted} />

      {isStarted && <GameSfx src={scene.sfx} trigger={scene.id} />}

      {!isStarted ? (
        <div className="h-dvh w-full overflow-hidden bg-black">
          <GameLayout
            backgroundImg={startScreen}
            sceneKey="start-screen"
            contentOpacity={1}
            particles="fireflies"
            isLeaving={isLeaving}
            onLeaveComplete={() => setIsStarted(true)}
          >
            <StartScreen onStart={handleStart} isLeaving={isLeaving} />
          </GameLayout>
        </div>
      ) : (
        <Scene scene={scene} />
      )}
    </>
  );
}
