import { TextTyper } from "@/components/scene/text-typer";
import { CyberpunkTerminal } from "@/components/puzzle/cyberpunk/cyberpunk-terminal";

import type { SceneContent as SceneContentType } from "@/types/game";

interface SceneContentProps {
  sceneId: string;
  content: SceneContentType;
  onTypingComplete?: () => void;
  onAction?: () => void;
}

export function SceneContent({
  sceneId,
  content,
  onTypingComplete,
  onAction,
}: SceneContentProps) {
  switch (content.type) {
    case "text":
      return <TextTyper text={content.text} onComplete={onTypingComplete} />;

    case "image":
      return (
        <img
          src={content.src}
          alt={content.alt}
          className="max-h-[60vh] max-w-full object-contain"
        />
      );

    case "terminal":
      return (
        <CyberpunkTerminal
          key={sceneId}
          title={content.title}
          status={content.status}
          date={content.date}
          lines={content.lines}
          action={
            content.actionLabel
              ? {
                  label: content.actionLabel,
                  onClick: () => onAction?.(),
                }
              : undefined
          }
        />
      );

    default:
      return null;
  }
}
