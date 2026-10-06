import { useState } from "react";

import { GameMusic } from "@/components/audio/game-music";
import { GameSfx } from "@/components/audio/game-sfx";

import { Scene } from "@/components/scene/scene";

import { finalChapter } from "@/data/story/final";
import { firstChapter } from "@/data/story/first-chapter";
import { secondChapter } from "@/data/story/second-chapter";

import { useGameStore } from "@/store/game-store";

import { GameLayout } from "./layout/game-layout";
import { StartScreen } from "./scene/start-scene";

import startScreen from "../../public/images/chapter1/forest.png";

export function Game() {
  const [isStarted, setIsStarted] = useState(false);

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

  const handleStart = () => {
    startGame();
    setIsStarted(true);
  };

  return (
    <>
      <GameMusic src={scene.audio} enabled={isStarted} />

      {isStarted && <GameSfx src={scene.sfx} trigger={scene.id} />}

      {!isStarted ? (
        <GameLayout backgroundImg={startScreen} sceneKey="start-screen">
          <StartScreen onStart={handleStart} />
        </GameLayout>
      ) : (
        <Scene scene={scene} />
      )}
    </>
  );
}
