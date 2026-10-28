import type { BattleBonuses } from "@/components/puzzle/dragon-fight/types";
import type { GameAchievement } from "@/types/game";
import { create } from "zustand";
// import { persist } from "zustand/middleware";

type StoryEvent =
  | "forestEntered"
  | "trailFound"
  | "runeSolved"
  | "doorOpened"
  | "nightCityEntered"
  | "workshopEntered";

const SCENE_STORY_EVENTS: Partial<Record<string, StoryEvent>> = {
  "chapter1-forest": "forestEntered",
  "chapter1-footprints-2": "trailFound",

  "chapter1-door": "runeSolved",
  "chapter1-door-3": "doorOpened",

  "chapter2-night-city": "nightCityEntered",
  "chapter2-workshop-3": "workshopEntered",
};

export type RuneHintLevel = "none" | "sound" | "first-rune";

interface GameState {
  currentSceneId: string;
  inventory: string[];
  completedPuzzles: string[];
  completedActions: string[];

  gameStartedAt: number | null;
  storyTimestamps: Partial<Record<StoryEvent, number>>;

  achievements: GameAchievement[];

  isSoundEnabled: boolean;
  isSfxPlaying: boolean;
  itemNotification: string | null;

  runeHintLevel: RuneHintLevel;
  setRuneHintLevel: (level: RuneHintLevel) => void;

  setScene: (sceneId: string) => void;
  addItem: (itemId: string) => void;
  completePuzzle: (puzzleId: string) => void;
  completeAction: (actionId: string) => void;

  toggleSound: () => void;
  setSfxPlaying: (playing: boolean) => void;

  startGame: () => void;
  markStoryEvent: (event: StoryEvent) => void;

  unlockAchievement: (achievement: GameAchievement) => void;
  getBattleBonuses: () => BattleBonuses;

  showItemNotification: (itemId: string) => void;
  dismissItemNotification: () => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set, get) => ({
    gameStartedAt: null,
    storyTimestamps: {},
    // currentSceneId: "final-victory",
    // currentSceneId: "chapter2-code-puzzle",
    currentSceneId: "chapter2-table-3",
    // currentSceneId: "chapter1-forest",
    completedPuzzles: [],
    completedActions: [],
    inventory: [],
    achievements: [],
    isSoundEnabled: true,
    isSfxPlaying: false,
    itemNotification: null,

    runeHintLevel: "none",

    setRuneHintLevel: (level) => set({ runeHintLevel: level }),

    startGame: () =>
      set({
        gameStartedAt: Date.now(),
        runeHintLevel: "none",
      }),

    markStoryEvent: (event) =>
      set((state) => ({
        storyTimestamps: {
          ...state.storyTimestamps,
          [event]: state.storyTimestamps[event] ?? Date.now(),
        },
      })),

    setScene: (sceneId) =>
      set((state) => {
        const event = SCENE_STORY_EVENTS[sceneId];

        if (!event || state.storyTimestamps[event]) {
          return {
            currentSceneId: sceneId,
          };
        }

        return {
          currentSceneId: sceneId,
          storyTimestamps: {
            ...state.storyTimestamps,
            [event]: Date.now(),
          },
        };
      }),

    addItem: (itemId) =>
      set((state) => {
        if (state.inventory.includes(itemId)) {
          return state;
        }

        return {
          inventory: [...state.inventory, itemId],
          itemNotification: itemId,
        };
      }),

    completePuzzle: (puzzleId) =>
      set((state) => ({
        completedPuzzles: state.completedPuzzles.includes(puzzleId)
          ? state.completedPuzzles
          : [...state.completedPuzzles, puzzleId],
      })),

    completeAction: (actionId) =>
      set((state) => ({
        completedActions: state.completedActions.includes(actionId)
          ? state.completedActions
          : [...state.completedActions, actionId],
      })),

    unlockAchievement: (achievement) =>
      set((state) => ({
        achievements: state.achievements.includes(achievement)
          ? state.achievements
          : [...state.achievements, achievement],
      })),

    getBattleBonuses: () => {
      const { achievements } = get();

      let extraPlayerHp = 0;
      let extraOwlbearHp = 0;
      let damageMultiplier = 1;
      let mi01InterruptAvailable = false;

      if (achievements.includes("keenEye")) {
        extraPlayerHp += 1;
      }

      if (achievements.includes("owlbearClues")) {
        extraOwlbearHp += 1;
      }

      if (achievements.includes("dragonWeakness")) {
        damageMultiplier = 1.1;
      }

      if (achievements.includes("mi01Master")) {
        mi01InterruptAvailable = true;
      }

      return {
        extraPlayerHp: Math.min(extraPlayerHp, 2),
        extraOwlbearHp: Math.min(extraOwlbearHp, 2),
        damageMultiplier,
        mi01InterruptAvailable,
        mi01HealOwlbearAvailable: achievements.includes("threadFinder"),
      };
    },

    setSfxPlaying: (playing) => set({ isSfxPlaying: playing }),

    toggleSound: () =>
      set((state) => ({
        isSoundEnabled: !state.isSoundEnabled,
      })),

    showItemNotification: (itemId) => set({ itemNotification: itemId }),

    dismissItemNotification: () => set({ itemNotification: null }),
  }),

  // {
  //   name: "birthday-quest",
  // },
  // ),
);
