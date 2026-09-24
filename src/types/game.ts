export type SceneContent =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    };

type PuzzleTypeData = "runes" | "cyberpunk" | "final";

export type PuzzleData = {
  id: string;
  type: PuzzleTypeData;
  nextScene: string;
  mode?: "discovery" | "puzzle";
};

export interface SceneAction {
  id: string;
  label: string;
  nextScene?: string;
  puzzle?: PuzzleData;
}

export type SpecialEffect = "fade" | "shake" | "flash";

export interface SceneData {
  id: string;
  background?: string;
  content: SceneContent;
  audio?: string;
  nextScene?: string;
  puzzle?: PuzzleData;
  actions?: SceneAction[];
  specialEffects?: SpecialEffect[];
  effectDelay?: number;
  autoTransitionToNexScene?: boolean;
}

export interface ChapterData {
  id: string;
  title: string;
  scenes: SceneData[];
}
