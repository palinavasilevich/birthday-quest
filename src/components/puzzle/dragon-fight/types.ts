import type Phaser from "phaser";

export type GameStatus = "playing" | "won" | "lost";

export type AiState =
  | "intro"
  | "stagger"
  | "recover"
  | "reposition"
  | "telegraph"
  | "volley"
  | "ring"
  | "breath"
  | "charge"
  | "rain";

export type AttackName = "volley" | "ring" | "breath" | "charge" | "rain";

export interface GameStats {
  hp: number;
  dragonHp: number;
  phase: 1 | 2 | 3;
  poise: number;
  owlbearHp: number;
  owlbearMaxHp: number;
  owlbearSafe: boolean;
}

export interface GameHooks {
  onStats: (stats: GameStats) => void;
  onEnd: (won: boolean) => void;
  onDash: (cooldownMs: number) => void;
  onAnnounce: (text: string) => void;
}

export type Fireball = Phaser.Physics.Arcade.Sprite & {
  life: number;
};

export type FirePool = Phaser.GameObjects.Image & {
  life: number;
  hitTimer: number;
};
