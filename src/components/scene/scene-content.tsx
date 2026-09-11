import { TextTyper } from "@/components/scene/text-typer";

import type { SceneContent as SceneContentType } from "@/types/game";

interface SceneContentProps {
  content: SceneContentType;
}

export function SceneContent({ content }: SceneContentProps) {
  switch (content.type) {
    case "text":
      return <TextTyper text={content.text} />;

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
