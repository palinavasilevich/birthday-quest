import { create } from "zustand";
// import { persist } from "zustand/middleware";

type StoryEvent =
  | "forestEntered"
  | "trailFound"
  | "runeSolved"
  | "doorOpened"
  | "nightCityEntered"
  | "workshopEntered"
  | "mi01Opened"
  | "finalBattleStarted"
  | "owbearRescued";

interface GameState {
  currentSceneId: string;
  inventory: string[];
  completedPuzzles: string[];
  completedActions: string[];

  gameStartedAt: number | null;
  storyTimestamps: Partial<Record<StoryEvent, number>>;

  isSoundEnabled: boolean;

  setScene: (sceneId: string) => void;
  addItem: (itemId: string) => void;
  completePuzzle: (puzzleId: string) => void;
  completeAction: (actionId: string) => void;
  toggleSound: () => void;
  startGame: () => void;
  markStoryEvent: (event: StoryEvent) => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set) => ({
    gameStartedAt: null,
    storyTimestamps: {},

    // currentSceneId: "chapter2-transition-back-3",
    // currentSceneId: "final-victory",
    currentSceneId: "chapter1-ending-3",

    inventory: [],

    completedPuzzles: [],

    completedActions: [],

    isSoundEnabled: true,

    startGame: () =>
      set({
        gameStartedAt: Date.now(),
      }),

    markStoryEvent: (event) =>
      set((state) => ({
        storyTimestamps: {
          ...state.storyTimestamps,
          [event]: state.storyTimestamps[event] ?? Date.now(),
        },
      })),

    setScene: (sceneId) =>
      set({
        currentSceneId: sceneId,
      }),

    addItem: (itemId) =>
      set((state) => ({
        inventory: state.inventory.includes(itemId)
          ? state.inventory
          : [...state.inventory, itemId],
      })),

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

    toggleSound: () =>
      set((state) => ({
        isSoundEnabled: !state.isSoundEnabled,
      })),
  }),
  // {
  //   name: "birthday-quest",
  // },
  // ),
);
