import { AmbientMusic } from "@/components/audio/ambient-music";
import { Scene } from "@/components/scene/scene";

import { firstChapter } from "@/data/story/first-chapter";
import { useGameStore } from "@/store/game-store";

const CHAPTER1_MUSIC = "/audio/chapter1/background.mp3";

export function Game() {
  const currentSceneId = useGameStore((state) => state.currentSceneId);

  const scene = firstChapter.scenes.find(
    (scene) => scene.id === currentSceneId,
  );

  if (!scene) {
    return <div>Scene not found</div>;
  }

  return (
    <>
      <AmbientMusic src={CHAPTER1_MUSIC} volume={0.25} />

      <Scene scene={scene} />
    </>
  );
}
