import { ActionButton } from "@/components/scene/action-button";
import { useGameStore } from "@/store/game-store";
import type { SceneAction } from "@/types/game";

interface SceneActionsProps {
  actions: SceneAction[];
  disabled?: boolean;
}

export function SceneActions({ actions, disabled }: SceneActionsProps) {
  const setScene = useGameStore((state) => state.setScene);

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          text={action.label}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;

            if (action.nextScene) {
              setScene(action.nextScene);
            }
          }}
        />
      ))}
    </div>
  );
}
