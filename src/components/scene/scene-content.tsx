import { TextTyper } from "@/components/scene/text-typer";

import type { SceneContent as SceneContentType } from "@/types/game";

interface SceneContentProps {
  content: SceneContentType;
  onTypingComplete?: () => void;
}

export function SceneContent({ content, onTypingComplete }: SceneContentProps) {
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

    default:
      return null;
  }
}
