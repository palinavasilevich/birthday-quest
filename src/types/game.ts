export interface TerminalLine {
  text: string;
  type?: "default" | "success" | "warning" | "error" | "system";
  delay?: number;
}

export interface TerminalContent {
  type: "terminal";
  title?: string;
  status?: string;
  date?: string;
  lines: TerminalLine[];
  actionLabel?: string;
}

export type SceneContent =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | TerminalContent;

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

export type SpecialEffect =
  | "shake"
  | "flash"
  | "signal"
  | "glow"
  | "static"
  | "warp"
  | "warp-in"
  | "glitch"
  | "rumble"
  | "vignette-pulse"
  | "zoom-in"
  | "fade"
  | "fade-in"
  | "impact"
  | "shimmer";

export interface SceneData {
  id: string;
  background?: string;
  content: SceneContent;
  audio?: string;
  sfx?: string;
  nextScene?: string;
  puzzle?: PuzzleData;
  actions?: SceneAction[];
  specialEffects?: SpecialEffect[];
  effectDelay?: number;
  autoTransitionToNextScene?: boolean;
  showBackgroundOnly?: boolean;
  autoTransitionDelay?: number;
  specialComponent?: "workshop-log";
  isFinish?: boolean;
}

export interface ChapterData {
  id: string;
  title: string;
  scenes: SceneData[];
}
