import { useState } from "react";

import { useGameStore } from "@/store/game-store";

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
    frequency: 261.63,
  },
  {
    id: "igni",
    label: "IGNI",
    symbol: "ᛁ",
    frequency: 329.63,
  },
  {
    id: "aard",
    label: "AARD",
    symbol: "ᚨ",
    frequency: 392,
  },
  {
    id: "axii",
    label: "AXII",
    symbol: "ᚨ",
    frequency: 440,
  },
  {
    id: "yrden",
    label: "YRDEN",
    symbol: "ᛦ",
    frequency: 523.25,
  },
];

const CORRECT_SEQUENCE = ["quen", "aard", "igni", "yrden", "axii"];

function playRuneSound(frequency: number) {
  const AudioContext =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof window.AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const context = new AudioContext();

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  gain.gain.setValueAtTime(0, context.currentTime);

  gain.gain.linearRampToValueAtTime(0.18, context.currentTime + 0.02);

  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 1);
}

export function RunePuzzle({ puzzleId, nextScene }: RunePuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);
  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [sequence, setSequence] = useState<string[]>([]);
  const [activeRune, setActiveRune] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Коснись рун. Найди правильную мелодию.",
  );
  const [isSolved, setIsSolved] = useState(false);

  const handleRuneClick = (rune: Rune) => {
    if (isSolved) {
      return;
    }

    playRuneSound(rune.frequency);

    setActiveRune(rune.id);

    window.setTimeout(() => {
      setActiveRune(null);
    }, 250);

    const expectedRune = CORRECT_SEQUENCE[sequence.length];

    if (rune.id !== expectedRune) {
      setSequence([]);
      setMessage("Мелодия нарушена. Попробуй снова.");
      return;
    }

    const nextSequence = [...sequence, rune.id];

    setSequence(nextSequence);

    if (nextSequence.length === CORRECT_SEQUENCE.length) {
      setIsSolved(true);
      completePuzzle(puzzleId);
      setMessage("Мелодия отозвалась в камне.");

      window.setTimeout(() => {
        setScene(nextScene);
      }, 1600);

      return;
    }

    setMessage("Звук отозвался в тишине...");
  };

  return (
    <div className="mt-10 flex w-full max-w-2xl flex-col items-center">
      <p className="mb-8 text-center font-story text-xl italic text-white/70">
        {message}
      </p>

      <div className="grid grid-cols-5 gap-4">
        {RUNES.map((rune) => {
          const isActive = activeRune === rune.id;

          return (
            <button
              key={rune.id}
              type="button"
              disabled={isSolved}
              onClick={() => handleRuneClick(rune)}
              aria-label={`Руна ${rune.label}`}
              className={`
                group relative flex h-24 w-20
                cursor-pointer flex-col items-center justify-center
                border border-[#ff9b00]/40
                bg-black/60
                text-[#ff9b00]
                outline-none
                transition-all duration-200
                hover:border-[#ff9b00]
                hover:bg-[#ff9b00]/10
                focus-visible:border-[#ff9b00]
                focus-visible:shadow-[0_0_20px_rgba(255,155,0,0.35)]
                disabled:cursor-default
                ${
                  isActive
                    ? "scale-105 border-[#ff9b00] bg-[#ff9b00]/20 shadow-[0_0_25px_rgba(255,155,0,0.45)]"
                    : ""
                }
              `}
            >
              <span
                className={`
                  font-serif text-4xl
                  transition-all duration-200
                  ${isActive ? "scale-110 text-white" : "text-[#ff9b00]"}
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

      <div className="mt-8 flex gap-2">
        {CORRECT_SEQUENCE.map((_, index) => {
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
    </div>
  );
}
