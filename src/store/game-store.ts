import { create } from "zustand";

interface GameState {
  currentSceneId: string;
  inventory: string[];
  completedPuzzles: string[];
  completedActions: string[];

  isSoundEnabled: boolean;

  setScene: (sceneId: string) => void;
  addItem: (itemId: string) => void;
  completePuzzle: (puzzleId: string) => void;
  completeAction: (actionId: string) => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentSceneId: "chapter1-melody",

  inventory: [],

  completedPuzzles: [],

  completedActions: [],

  isSoundEnabled: true,

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
}));
