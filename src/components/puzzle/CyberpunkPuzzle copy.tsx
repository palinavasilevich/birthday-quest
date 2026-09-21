import { useState } from "react";

import { useGameStore } from "@/store/game-store";

interface CyberpunkPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

interface Attempt {
  guess: string;
  /** Сколько цифр кода угадано, независимо от позиции. */
  total: number;
  /** Сколько из них стоит на своём месте. */
  exact: number;
  /** Чужая попытка из лога или своя. */
  own: boolean;
}

/*
 * Код из четырёх разных цифр.
 *
 * Четыре записи в логе задают его однозначно — проверено перебором
 * всех 5040 вариантов. Менять подсказки без такой проверки нельзя:
 * очень легко получить два решения или ни одного.
 */
const CODE = "5281";

const LOG: Attempt[] = [
  { guess: "1234", total: 2, exact: 1, own: false },
  { guess: "5678", total: 2, exact: 1, own: false },
  { guess: "9012", total: 2, exact: 0, own: false },
  { guess: "8215", total: 4, exact: 1, own: false },
];

/** После скольких своих попыток предложить аварийный вход. */
const MERCY_AFTER = 6;

function score(guess: string) {
  const total = new Set(guess).size
    ? [...new Set(guess)].filter((digit) => CODE.includes(digit)).length
    : 0;

  const exact = [...guess].filter((digit, index) => CODE[index] === digit)
    .length;

  return { total, exact };
}

export function CyberpunkPuzzle({
  puzzleId,
  nextScene,
}: CyberpunkPuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>(LOG);
  const [isMistake, setIsMistake] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const ownAttempts = attempts.filter((item) => item.own).length;

  const showMercy = ownAttempts >= MERCY_AFTER && !isSolved;

  const finish = () => {
    setIsSolved(true);
    completePuzzle(puzzleId);

    window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);
  };

  const handleSubmit = () => {
    if (isSolved || value.length !== 4) {
      return;
    }

    if (value === CODE) {
      setAttempts((list) => [
        ...list,
        { guess: value, total: 4, exact: 4, own: true },
      ]);

      finish();

      return;
    }

    /*
     * Своя попытка тоже получает ответ системы и попадает в лог:
     * промах должен сужать круг, а не просто отнимать время.
     */
    const { total, exact } = score(value);

    setAttempts((list) => [...list, { guess: value, total, exact, own: true }]);

    setIsMistake(true);
    setValue("");

    window.setTimeout(() => {
      setIsMistake(false);
    }, 500);
  };

  const message = () => {
    if (isSolved) {
      return "> ACCESS GRANTED";
    }

    if (isMistake) {
      return "> ACCESS DENIED";
    }

    return "Четыре цифры. Все разные.";
  };

  return (
    <div className="mt-10 flex w-full max-w-2xl flex-col items-center">
      {/* Message */}
      <p className="mb-3 min-h-8 text-center font-story text-xl italic text-white/70">
        {message()}
      </p>

      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-[#35d6e8]/60">
        Журнал попыток
      </p>

      {/* Log */}
      <div className="w-full overflow-x-auto border border-white/10 bg-black/60">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-white/35">
              <th className="px-4 py-2 font-normal">код</th>
              <th className="px-4 py-2 font-normal">цифр верно</th>
              <th className="px-4 py-2 font-normal">на месте</th>
            </tr>
          </thead>

          <tbody>
            {attempts.map((attempt, index) => (
              <tr
                key={`${attempt.guess}-${index}`}
                className={
                  attempt.own
                    ? "border-t border-white/5 text-[#35d6e8]"
                    : "border-t border-white/5 text-white/70"
                }
              >
                <td className="px-4 py-2 tracking-[0.3em]">{attempt.guess}</td>
                <td className="px-4 py-2">{attempt.total}</td>
                <td className="px-4 py-2">{attempt.exact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Input */}
      {!isSolved && (
        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3">
          <input
            value={value}
            inputMode="numeric"
            maxLength={4}
            spellCheck={false}
            autoComplete="off"
            placeholder="0000"
            aria-label="Код доступа"
            onChange={(event) =>
              setValue(event.target.value.replace(/\D/g, "").slice(0, 4))
            }
            onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
            className={`
              h-12 w-40 border bg-black/60
              px-4 text-center font-mono text-lg tracking-[0.4em]
              outline-none transition-all duration-200
              ${
                isMistake
                  ? `
                    border-red-500
                    text-red-400
                    shadow-[0_0_25px_rgba(239,68,68,0.45)]
                  `
                  : "border-white/20 text-white/90"
              }
              focus:border-[#35d6e8]
              focus:shadow-[0_0_20px_rgba(53,214,232,0.35)]
            `}
          />

          <button
            type="button"
            disabled={value.length !== 4}
            onClick={handleSubmit}
            className="
              h-12 cursor-pointer border border-[#35d6e8]/50
              px-6 text-xs uppercase tracking-[0.2em] text-[#35d6e8]
              transition-all duration-200
              hover:border-[#35d6e8] hover:bg-[#35d6e8]/10
              disabled:cursor-default disabled:opacity-30
            "
          >
            Ввести
          </button>
        </div>
      )}

      {/* Mercy */}
      {showMercy && (
        <button
          type="button"
          onClick={finish}
          className="
            mt-8 cursor-pointer text-xs uppercase tracking-[0.2em]
            text-white/40 transition-colors
            hover:text-[#ff9b00]
          "
        >
          Аварийная разблокировка
        </button>
      )}
    </div>
  );
}
