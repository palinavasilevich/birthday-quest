import { useMemo, useState } from "react";

import { useGameStore } from "@/store/game-store";
import { useRunePlayback } from "@/hooks/use-rune-playback";

import { PUZZLE_ROUNDS, RUNES, type Rune } from "@/data/puzzle/rune-data";

interface RunePuzzleProps {
  puzzleId: string;
  nextScene: string;
}

const ROLLBACK = 2;

export function RunePuzzle({ puzzleId, nextScene }: RunePuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isMistake, setIsMistake] = useState(false);
  const [mistakeRune, setMistakeRune] = useState<string | null>(null);
  const [replayFrom, setReplayFrom] = useState(0);

  const currentSequence = PUZZLE_ROUNDS[round];

  const playbackSequence = useMemo(
    () => currentSequence.slice(replayFrom),
    [currentSequence, replayFrom],
  );

  const { isPlaying, activeRune, playRune, replay } = useRunePlayback({
    runes: RUNES,
    sequence: playbackSequence,
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
      const rollback = Math.max(0, sequence.length - ROLLBACK);

      setMistakeRune(rune.id);
      setIsMistake(true);

      /*
       * Сохраняем всё, кроме последних двух нот.
       */
      setSequence(
        currentSequence.slice(0, rollback).map((note) => note.runeId),
      );

      if (rollback === replayFrom) {
        replay();
      } else {
        setReplayFrom(rollback);
      }

      window.setTimeout(() => {
        setIsMistake(false);
        setMistakeRune(null);
      }, 700);

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
      setReplayFrom(0);

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

    setIsMistake(false);
    setMistakeRune(null);

    replay();
  };

  const message = () => {
    if (isSolved) {
      return "Мелодия отозвалась в камне.";
    }

    if (isMistake) {
      return "Солнышко, давай... я тебя люблю... давай... ";
    }

    if (isPlaying) {
      return replayFrom > 0
        ? "Слушай с того места, где сбился..."
        : "Вслушайся в мелодию...";
    }

    return sequence.length > 0
      ? "Продолжай."
      : "Мелодия всё ещё звучит в памяти.\n\nПовтори её.";
  };

  return (
    <div className="mt-10 m-auto w-full max-w-2xl flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-12 shadow-2xl backdrop-blur-md">
      {/* Message */}
      <p className="mb-3 min-h-8 text-center font-story text-2xl italic text-white/70">
        {message()}
      </p>

      {/* Round */}
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-[#ff9b00]/60">
        Фрагмент {round + 1} / {PUZZLE_ROUNDS.length}
      </p>

      {/* Runes */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
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
                group relative flex
                h-20 w-16 sm:h-24 sm:w-20
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
              {/* <span
                className={`
                  font-serif text-3xl sm:text-4xl
                  transition-all duration-200
                  ${isActive ? "scale-110 text-white" : ""}
                `}
              >
                {rune.symbol}
              </span> */}

              <img alt={rune.label} src={rune.symbolImage} className="w-12" />

              <span
                className="
                  mt-2 text-[9px] uppercase sm:text-[10px]
                  tracking-[0.15em] text-[#ff9b00]/70 sm:tracking-[0.2em]
                "
              >
                {rune.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-8 flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {currentSequence.map((_, index) => {
          const isCompleted = index < sequence.length;

          return (
            <span
              key={index}
              className={`
                h-1.5 w-6 sm:w-8
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
