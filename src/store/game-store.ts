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

  "chapter1-rune": "runeSolved",
  "chapter1-door": "doorOpened",

  "chapter2-night-city": "nightCityEntered",
  "chapter2-workshop-3": "workshopEntered",
};

interface GameState {
  currentSceneId: string;
  inventory: string[];
  completedPuzzles: string[];
  completedActions: string[];

  gameStartedAt: number | null;
  storyTimestamps: Partial<Record<StoryEvent, number>>;

  isSoundEnabled: boolean;
  isSfxPlaying: boolean;

  setScene: (sceneId: string) => void;
  addItem: (itemId: string) => void;
  completePuzzle: (puzzleId: string) => void;
  completeAction: (actionId: string) => void;

  toggleSound: () => void;
  setSfxPlaying: (playing: boolean) => void;

  startGame: () => void;
  markStoryEvent: (event: StoryEvent) => void;
}

export const useGameStore = create<GameState>()(
  // persist(
  (set) => ({
    gameStartedAt: null,
    storyTimestamps: {},
    currentSceneId: "chapter1-chamber-3",
    completedPuzzles: [],
    completedActions: [],
    inventory: [],
    isSoundEnabled: true,
    isSfxPlaying: false,

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

    setSfxPlaying: (playing) => set({ isSfxPlaying: playing }),

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
