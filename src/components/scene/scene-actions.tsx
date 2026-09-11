import { ActionButton } from "@/components/scene/action-button";
import { useGameStore } from "@/store/game-store";
import type { SceneAction } from "@/types/game";

interface SceneActionsProps {
  actions: SceneAction[];
}

export function SceneActions({ actions }: SceneActionsProps) {
  const setScene = useGameStore((state) => state.setScene);

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          text={action.label}
          onClick={() => {
            if (action.nextScene) {
              setScene(action.nextScene);
            }
          }}
        />
      ))}
    </div>
  );
}
