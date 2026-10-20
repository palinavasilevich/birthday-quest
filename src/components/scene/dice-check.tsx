import { useState } from "react";
import { useGameStore } from "@/store/game-store";
import type { DiceCheckContent, DiceOutcome } from "@/types/game";
import { Dice3D } from "./dice-3d";
import { ActionButton } from "./action-button";
import { ITEMS } from "@/data/items";

interface DiceCheckProps {
  content: DiceCheckContent;
}

export function DiceCheck({ content }: DiceCheckProps) {
  const setScene = useGameStore((state) => state.setScene);
  const inventory = useGameStore((state) => state.inventory);

  const [isSettled, setIsSettled] = useState(false);

  const [roll, setRoll] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<DiceOutcome | null>(null);

  const handleRoll = () => {
    if (roll !== null) return;

    setIsSettled(false);

    const result = Math.floor(Math.random() * 20) + 1;

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

    setRoll(result);
    setOutcome(resultOutcome);
  };

  return (
    <div className="mt-8 w-full max-w-xl mx-auto space-y-6 text-center">
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

      <div className="flex justify-center gap-8 text-lg text-stone-300">
        <div>
          <p className="text-stone-500">Характеристика</p>
          <p className="mt-1 text-amber-200">{content.skill}</p>
        </div>

        <div>
          <p className="text-stone-500">Сложность</p>
          <p className="mt-1 text-amber-200">{content.difficulty}</p>
        </div>
      </div>

      {roll === null ? (
        <ActionButton
          text="Пройти проверку"
          onClick={handleRoll}
          className="cursor-pointer"
        />
      ) : (
        <div className="space-y-2">
          <Dice3D result={roll} onSettled={() => setIsSettled(true)} />

          {roll === null ? (
            <ActionButton
              text="Пройти проверку"
              onClick={handleRoll}
              className="cursor-pointer"
            />
          ) : isSettled ? (
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
                  if (outcome) setScene(outcome.nextScene);
                }}
                className="cursor-pointer"
              />
            </div>
          ) : (
            <p className="text-sm text-amber-200/80"></p>
          )}
        </div>
      )}
    </div>
  );
}
