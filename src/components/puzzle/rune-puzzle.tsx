import { useState } from "react";

import { useGameStore } from "@/store/game-store";

import { useRunePlayback, type RuneNote } from "@/hooks/use-rune-playback";

interface Rune {
  id: string;
  label: string;
  symbol: string;
  frequency: number;
}

// interface RuneNote {
//   runeId: string;
//   duration: number;
//   gap: number;
// }

interface RunePuzzleProps {
  puzzleId: string;
  nextScene: string;
}

const RUNES: Rune[] = [
  {
    id: "quen",
    label: "QUEN",
    symbol: "ᛩ",
    frequency: 493.88, // B4
  },
  {
    id: "igni",
    label: "IGNI",
    symbol: "ᛁ",
    frequency: 659.25, // E5
  },
  {
    id: "aard",
    label: "AARD",
    symbol: "ᚨ",
    frequency: 739.99, // F#5
  },
  {
    id: "axii",
    label: "AXII",
    symbol: "◈",
    frequency: 587.33, // D5
  },
  {
    id: "yrden",
    label: "YRDEN",
    symbol: "ᛦ",
    frequency: 783.99, // G5
  },
];

/*
 * The melody is based on the recognizable BG3 Main Theme motif:
 *
 * B → G → E → F# → D
 *
 * The later rounds extend the same musical idea.
 */
const PUZZLE_ROUNDS: RuneNote[][] = [
  [
    {
      runeId: "quen",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "yrden",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "igni",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "aard",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "axii",
      duration: 650,
      gap: 160,
    },
  ],

  [
    {
      runeId: "quen",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "yrden",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "igni",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "aard",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "axii",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "yrden",
      duration: 500,
      gap: 100,
    },
    {
      runeId: "aard",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "igni",
      duration: 500,
      gap: 100,
    },
    {
      runeId: "axii",
      duration: 650,
      gap: 160,
    },
  ],

  [
    {
      runeId: "quen",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "yrden",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "igni",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "aard",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "axii",
      duration: 650,
      gap: 120,
    },
    {
      runeId: "yrden",
      duration: 500,
      gap: 100,
    },
    {
      runeId: "aard",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "igni",
      duration: 500,
      gap: 100,
    },
    {
      runeId: "axii",
      duration: 500,
      gap: 100,
    },
    {
      runeId: "aard",
      duration: 300,
      gap: 80,
    },
    {
      runeId: "igni",
      duration: 650,
      gap: 160,
    },
  ],
];

export function RunePuzzle({ puzzleId, nextScene }: RunePuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isMistake, setIsMistake] = useState(false);
  const [mistakeRune, setMistakeRune] = useState<string | null>(null);

  const currentSequence = PUZZLE_ROUNDS[round];

  const { isPlaying, activeRune, playRune, replay } = useRunePlayback({
    runes: RUNES,
    sequence: currentSequence,
  });

  const handleRuneClick = (rune: Rune) => {
    if (isPlaying || isSolved) {
      return;
    }

    /*
     * Play the note selected by the player.
     */
    playRune(rune.id);

    const expectedRune = currentSequence[sequence.length]?.runeId;

    /*
     * Wrong rune.
     */
    if (rune.id !== expectedRune) {
      setMistakeRune(rune.id);
      setIsMistake(true);
      setSequence([]);

      window.setTimeout(() => {
        setIsMistake(false);
        setMistakeRune(null);
      }, 500);

      return;
    }

    /*
     * Correct rune.
     */
    const nextSequence = [...sequence, rune.id];

    setSequence(nextSequence);

    /*
     * Current round is not complete.
     */
    if (nextSequence.length < currentSequence.length) {
      return;
    }

    /*
     * Move to the next round.
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

  const handleReplay = () => {
    if (isPlaying || isSolved) {
      return;
    }

    setSequence([]);
    setIsMistake(false);
    setMistakeRune(null);

    replay();
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
              ? "Мелодия нарушена."
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

          const isMistakeRune = isMistake && mistakeRune === rune.id;

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
                  isMistakeRune
                    ? `
                      border-red-500
                      bg-red-500/10
                      text-red-400
                      shadow-[0_0_25px_rgba(239,68,68,0.45)]
                    `
                    : `
                      border-[#ff9b00]/40
                      text-[#ff9b00]
                    `
                }

                hover:border-[#ff9b00]
                hover:bg-[#ff9b00]/10

                focus-visible:border-[#ff9b00]
                focus-visible:shadow-[0_0_20px_rgba(255,155,0,0.35)]

                disabled:cursor-default

                ${
                  isActive && !isMistakeRune
                    ? `
                      scale-105
                      border-[#ff9b00]
                      bg-[#ff9b00]/20
                      shadow-[0_0_30px_rgba(255,155,0,0.55)]
                    `
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
                    ? `
                      bg-[#ff9b00]
                      shadow-[0_0_8px_rgba(255,155,0,0.6)]
                    `
                    : "bg-white/10"
                }
              `}
            />
          );
        })}
      </div>

      {/* Replay */}
      {!isSolved && (
        <button
          type="button"
          disabled={isPlaying}
          onClick={handleReplay}
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
