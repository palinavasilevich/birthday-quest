import { useState } from "react";

import { useGameStore } from "@/store/game-store";

import { useRunePlayback } from "@/hooks/use-rune-playback";

interface Rune {
  id: string;
  label: string;
  symbol: string;
  frequency: number;
}

interface RunePuzzleProps {
  puzzleId: string;
  nextScene: string;
}

const RUNES: Rune[] = [
  {
    id: "quen",
    label: "QUEN",
    symbol: "ᛩ",
    frequency: 493.88,
  },
  {
    id: "igni",
    label: "IGNI",
    symbol: "ᛁ",
    frequency: 659.25,
  },
  {
    id: "aard",
    label: "AARD",
    symbol: "ᚨ",
    frequency: 739.99,
  },
  {
    id: "axii",
    label: "AXII",
    symbol: "ᚨ",
    frequency: 587.33,
  },
  {
    id: "yrden",
    label: "YRDEN",
    symbol: "ᛦ",
    frequency: 783.99,
  },
];

const PUZZLE_ROUNDS = [
  ["quen", "igni", "aard", "axii"],

  ["quen", "igni", "aard", "axii", "quen", "igni", "aard", "axii"],

  [
    "quen",
    "igni",
    "aard",
    "axii",
    "quen",
    "igni",
    "aard",
    "axii",
    "quen",
    "yrden",
    "aard",
  ],
];

export function RunePuzzle({ puzzleId, nextScene }: RunePuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isMistake, setIsMistake] = useState(false);

  const currentSequence = PUZZLE_ROUNDS[round];

  const { isPlaying, activeRune, playRune, replay } = useRunePlayback({
    runes: RUNES,
    sequence: currentSequence,
  });

  const handleRuneClick = (rune: Rune) => {
    if (isPlaying || isSolved) {
      return;
    }

    // Play the note when the player presses a rune.
    playRune(rune.id);

    const expectedRune = currentSequence[sequence.length];

    /*
     * Wrong rune.
     */
    if (rune.id !== expectedRune) {
      setIsMistake(true);
      setSequence([]);

      window.setTimeout(() => {
        setIsMistake(false);
      }, 500);

      return;
    }

    /*
     * Correct rune.
     */
    const nextSequence = [...sequence, rune.id];

    setSequence(nextSequence);

    /*
     * Round is not complete yet.
     */
    if (nextSequence.length < currentSequence.length) {
      return;
    }

    /*
     * Round completed.
     */
    if (round < PUZZLE_ROUNDS.length - 1) {
      setSequence([]);

      window.setTimeout(() => {
        setRound((currentRound) => currentRound + 1);
      }, 900);

      return;
    }

    /*
     * Puzzle completed.
     */
    setIsSolved(true);
    completePuzzle(puzzleId);

    window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);
  };

  return (
    <div className="mt-10 flex w-full max-w-2xl flex-col items-center">
      {/* Message */}
      <p className="mb-3 min-h-8 text-center font-story text-xl italic text-white/70">
        {isSolved
          ? "Мелодия отозвалась в камне."
          : isPlaying
            ? "Вслушайся в мелодию..."
            : isMistake
              ? "Солнышко давай, я тебя люблю давай..."
              : "Теперь повтори её."}
      </p>

      {/* Round */}
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-[#ff9b00]/60">
        Фрагмент {round + 1} / {PUZZLE_ROUNDS.length}
      </p>

      {/* Runes */}
      <div className="grid grid-cols-5 gap-4">
        {RUNES.map((rune) => {
          const isActive = activeRune === rune.id;

          return (
            <button
              key={rune.id}
              type="button"
              disabled={isPlaying || isSolved}
              onClick={() => handleRuneClick(rune)}
              aria-label={`Руна ${rune.label}`}
              className={`
                group relative flex h-24 w-20
                cursor-pointer flex-col items-center justify-center
                border
                bg-black/60
                outline-none
                transition-all duration-200

                ${
                  isMistake && isActive
                    ? "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                    : "border-[#ff9b00]/40 text-[#ff9b00]"
                }

                hover:border-[#ff9b00]
                hover:bg-[#ff9b00]/10

                focus-visible:border-[#ff9b00]
                focus-visible:shadow-[0_0_20px_rgba(255,155,0,0.35)]

                disabled:cursor-default

                ${
                  isActive && !isMistake
                    ? "scale-105 border-[#ff9b00] bg-[#ff9b00]/20 shadow-[0_0_30px_rgba(255,155,0,0.55)]"
                    : ""
                }
              `}
            >
              <span
                className={`
                  font-serif text-4xl
                  transition-all duration-200
                  ${isActive ? "scale-110 text-white" : ""}
                `}
              >
                {rune.symbol}
              </span>

              <span
                className="
                  mt-2 text-[10px] uppercase
                  tracking-[0.2em] text-[#ff9b00]/70
                "
              >
                {rune.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-8 flex gap-2">
        {currentSequence.map((_, index) => {
          const isCompleted = index < sequence.length;

          return (
            <span
              key={index}
              className={`
                h-1.5 w-8
                transition-all duration-300

                ${
                  isCompleted
                    ? "bg-[#ff9b00] shadow-[0_0_8px_rgba(255,155,0,0.6)]"
                    : "bg-white/10"
                }
              `}
            />
          );
        })}
      </div>

      {/* Replay button */}
      {!isSolved && (
        <button
          type="button"
          disabled={isPlaying}
          onClick={() => {
            setSequence([]);
            setIsMistake(false);
            replay();
          }}
          className="
            mt-8 cursor-pointer
            text-xs uppercase tracking-[0.2em]
            text-white/40
            transition-colors
            hover:text-[#ff9b00]
            disabled:cursor-default
            disabled:opacity-30
          "
        >
          Послушать мелодию ещё раз
        </button>
      )}
    </div>
  );
}
