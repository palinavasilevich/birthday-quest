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

export interface DiceOutcome {
  min: number;
  max: number;
  title: string;
  text: string;
  nextScene: string;
}

export interface DiceCheckContent {
  type: "diceCheck";
  title: string;
  description: string;
  skill: string;
  difficulty: number;
  outcomes: DiceOutcome[];
  tag?: CheckTag;
  achievement?: GameAchievement;
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
  | TerminalContent
  | DiceCheckContent;

type PuzzleTypeData = "runes" | "cyberpunk" | "final";

export type PuzzleData = {
  id: string;
  type: PuzzleTypeData;
  nextScene: string;
  mode?: "discovery" | "puzzle";
};

export type ItemType = "equipment" | "tool" | "story";

export type Characteristic = "dexterity" | "intelligence" | "mastery";

// export type Characteristic = "Ловкость" | "Интеллект" | "Мастерство";

export type CheckTag = "chase" | "navigation" | "repair" | "assembly";

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  image?: string;
  bonuses?: Partial<Record<Characteristic, number>>;
  situationalBonuses?: Partial<Record<CheckTag, number>>;
}

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

export type GameAchievement =
  | "keenEye"
  | "runeKnowledge"
  | "owlbearClues"
  | "mi01Master"
  | "dragonWeakness";

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
  itemsToCollect?: string[];
  isFinish?: boolean;
}

export interface ChapterData {
  id: string;
  title: string;
  scenes: SceneData[];
}
