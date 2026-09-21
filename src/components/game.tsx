import { GameMusic } from "@/components/audio/game-music";
import { Scene } from "@/components/scene/scene";
import { finalChapter } from "@/data/story/final";

import { firstChapter } from "@/data/story/first-chapter";
import { secondChapter } from "@/data/story/second-chapter";
import { useGameStore } from "@/store/game-store";
import { useState } from "react";
import { GameLayout } from "./layout/game-layout";
import { StartScreen } from "./scene/start-scene";

const CHAPTER1_MUSIC = "/audio/chapter1/background.mp3";
const RUNE_PUZZLE_MUSIC = "/audio/chapter1/rune-puzzle.mp3";

import startScreen from "../../public/images/chapter1/forest.png";

export function Game() {
  const [isStarted, setIsStarted] = useState(false);

  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const story = [
    ...firstChapter.scenes,
    ...secondChapter.scenes,
    ...finalChapter.scenes,
  ];

  const scene = story.find((scene) => scene.id === currentSceneId);

  if (!scene) {
    return <div>Scene not found</div>;
  }

  const startGame = () => {
    // initAudio();
    setIsStarted(true);
  };

  const musicMode = scene.puzzle ? "puzzle" : "chapter";

  if (!isStarted) {
    return (
      <GameLayout backgroundImg={startScreen} sceneKey="start-screen">
        <StartScreen onStart={startGame} />
      </GameLayout>
    );
  }

  return (
    <>
      <GameMusic
        mode={musicMode}
        chapterSrc={CHAPTER1_MUSIC}
        puzzleSrc={RUNE_PUZZLE_MUSIC}
      />

      <Scene scene={scene} />
    </>
  );
}
