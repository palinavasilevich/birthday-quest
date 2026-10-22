import { useState } from "react";
import { useGameStore } from "@/store/game-store";
import type {
  DiceCheckContent,
  DiceOutcome,
  // GameAchievement,
} from "@/types/game";
import { Dice3D } from "./dice-3d";
import { ActionButton } from "./action-button";
import { ITEMS } from "@/data/items";

interface DiceCheckProps {
  content: DiceCheckContent;
}

type RollMode = "game" | "physical";

export function DiceCheck({ content }: DiceCheckProps) {
  const setScene = useGameStore((state) => state.setScene);
  const inventory = useGameStore((state) => state.inventory);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);
  const setRuneHintLevel = useGameStore((state) => state.setRuneHintLevel);

  const [mode, setMode] = useState<RollMode | null>(null);
  const [manualRoll, setManualRoll] = useState("");
  const [roll, setRoll] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<DiceOutcome | null>(null);
  const [isSettled, setIsSettled] = useState(false);

  const resolveRoll = (result: number) => {
    const itemBonus = content.tag
      ? inventory.reduce((total, itemId) => {
          const item = ITEMS[itemId];
          return total + (item?.situationalBonuses?.[content.tag!] ?? 0);
        }, 0)
      : 0;

    const total = result + itemBonus;

    let resultOutcome: DiceOutcome | undefined;

    if (result === 1) {
      resultOutcome = content.outcomes.find(
        (item) => item.min === 1 && item.max === 1,
      );
    } else if (result === 20) {
      resultOutcome = content.outcomes.find(
        (item) => item.min === 20 && item.max === 20,
      );
    } else {
      const success = total >= content.difficulty;

      resultOutcome = content.outcomes.find((item) => {
        if (item.min === 1 && item.max === 1) return false;
        if (item.min === 20 && item.max === 20) return false;

        return success ? item.title === "Успех" : item.title === "Неудача";
      });
    }

    if (!resultOutcome) {
      console.error("Не найден подходящий исход проверки", {
        result,
        total,
        difficulty: content.difficulty,
        tag: content.tag,
      });
      return;
    }

    setRuneHintLevel(resultOutcome.runeHintLevel ?? "none");

    const isNaturalCritical = result === 1 || result === 20;
    const isSuccess = total >= content.difficulty;

    if (content.achievement && !isNaturalCritical && isSuccess) {
      unlockAchievement(content.achievement);
    }

    setRoll(result);
    setOutcome(resultOutcome);
    setIsSettled(mode === "physical");
  };

  const handleGameRoll = () => {
    setMode("game");

    if (roll !== null) return;

    resolveRoll(Math.floor(Math.random() * 20) + 1);
  };

  const handlePhysicalRoll = () => {
    const result = Number(manualRoll);

    if (
      manualRoll.trim() === "" ||
      !Number.isInteger(result) ||
      result < 1 ||
      result > 20
    ) {
      return;
    }

    resolveRoll(result);
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-xl space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Проверка характеристики
        </p>

        <h2 className="text-2xl font-semibold text-amber-100">
          {content.title}
        </h2>

        {!isSettled && (
          <p className="text-xl leading-relaxed text-stone-300">
            {content.description}
          </p>
        )}
      </div>

      {roll === null && mode === null && (
        <div className="space-y-3">
          <p className="text-stone-400">Как ты хочешь бросить кубик?</p>

          <div className="flex justify-center gap-2">
            <ActionButton
              text="Бросить D20 в игре"
              onClick={handleGameRoll}
              className="cursor-pointer"
            />

            <ActionButton
              text="Бросить настоящий D20"
              onClick={() => setMode("physical")}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}

      {roll === null && mode === "physical" && (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handlePhysicalRoll();
          }}
        >
          <label htmlFor="physical-roll" className="block text-stone-300">
            Какое число выпало на кубике?
          </label>

          <input
            id="physical-roll"
            type="number"
            min={1}
            max={20}
            step={1}
            required
            value={manualRoll}
            onChange={(event) => setManualRoll(event.target.value)}
            className="mx-auto block w-32 rounded-md border border-amber-700/60 bg-zinc-900 px-4 py-3 text-center text-2xl text-amber-100 outline-none focus:border-amber-400"
          />

          <ActionButton
            text="Подтвердить результат"
            onClick={handlePhysicalRoll}
            className="cursor-pointer"
          />
        </form>
      )}

      {roll !== null && (
        <div className="space-y-4">
          {mode === "game" ? (
            <Dice3D result={roll} onSettled={() => setIsSettled(true)} />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-500/50 bg-zinc-900 text-5xl font-bold text-amber-300 shadow-lg">
                {roll}
              </div>
              <p className="text-sm text-stone-400">Твой результат</p>
            </div>
          )}

          {isSettled && (
            <div className="space-y-4">
              <div className="text-2xl font-semibold text-amber-300">
                {roll} — {outcome?.title}
              </div>

              <p className="text-xl leading-relaxed text-stone-300">
                {outcome?.text}
              </p>

              <ActionButton
                text="Continue"
                onClick={() => {
                  if (outcome) {
                    setScene(outcome.nextScene);
                  }
                }}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
