import { Scene } from "@/components/scene/scene";
import { firstChapter } from "@/data/story/first-chapter";
import { useGameStore } from "@/store/game-store";

export function Game() {
  const currentSceneId = useGameStore((state) => state.currentSceneId);

  const scene = firstChapter.scenes.find(
    (scene) => scene.id === currentSceneId,
  );

  if (!scene) {
    return <div>Scene not found</div>;
  }

  return <Scene scene={scene} />;
}
