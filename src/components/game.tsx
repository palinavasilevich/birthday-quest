import { GameMusic } from "@/components/audio/game-music";
import { Scene } from "@/components/scene/scene";
import { finalChapter } from "@/data/story/final";

import { firstChapter } from "@/data/story/first-chapter";
import { secondChapter } from "@/data/story/second-chapter";
import { useGameStore } from "@/store/game-store";
import { DragonFight } from "./puzzle/dragon-fight-redesign/DragonFight";

const CHAPTER1_MUSIC = "/audio/chapter1/background.mp3";
const RUNE_PUZZLE_MUSIC = "/audio/chapter1/rune-puzzle.mp3";

export function Game() {
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

  const musicMode = scene.puzzle ? "puzzle" : "chapter";

  return (
    <>
      <GameMusic
        mode={musicMode}
        chapterSrc={CHAPTER1_MUSIC}
        puzzleSrc={RUNE_PUZZLE_MUSIC}
      />

      {/* <Scene scene={scene} /> */}
      <DragonFight />
    </>
  );
}
