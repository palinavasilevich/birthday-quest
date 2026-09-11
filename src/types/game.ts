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
  type: "runes";
  nextScene: string;
};

export interface SceneData {
  id: string;
  background?: string;
  content: SceneContent;
  nextScene?: string;
  puzzle?: PuzzleData;
}

export interface ChapterData {
  id: string;
  title: string;
  scenes: SceneData[];
}
