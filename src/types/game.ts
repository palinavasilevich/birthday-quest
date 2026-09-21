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

export type PuzzleData = {
  id: string;
  type: "runes" | "assembly" | "cyberpunk" | "final";
  nextScene: string;
  mode?: "discovery" | "puzzle";
};

export interface SceneAction {
  id: string;
  label: string;
  nextScene?: string;
  puzzle?: PuzzleData;
}

export interface SceneData {
  id: string;
  background?: string;
  content: SceneContent;
  audio?: string;
  nextScene?: string;
  puzzle?: PuzzleData;
  actions?: SceneAction[];
}

export interface ChapterData {
  id: string;
  title: string;
  scenes: SceneData[];
}
