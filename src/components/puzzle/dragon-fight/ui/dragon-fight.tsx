import { useEffect } from "react";

import { useGameStore } from "@/store/game-store";

import { usePhaserGame } from "../hooks/usePhaserGame";
import { DragonHud, PlayerHud } from "./hud";
import { GameOverlay } from "./game-overlay";

import "../styles.css";

interface DragonFightProps {
  puzzleId?: string;
  nextScene?: string;
}

export function DragonFight({ puzzleId, nextScene }: DragonFightProps) {
  const setScene = useGameStore((state) => state.setScene);
  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const { hostRef, stats, status, announcement, dashRun, booted, restart } =
    usePhaserGame();

  // Рестарт по R доступен только на экране конца боя,
  // чтобы клавиша не срабатывала во время боя.
  useEffect(() => {
    if (status === "playing") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" || event.key === "к") {
        restart();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [status, restart]);

  // Если битва запущена из основной истории,
  // после победы завершаем puzzle и переходим к следующей сцене.
  useEffect(() => {
    if (status !== "won" || !puzzleId || !nextScene) {
      return;
    }

    completePuzzle(puzzleId);

    const timer = window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [status, puzzleId, nextScene, completePuzzle, setScene]);

  return (
    <div className="app">
      <h1 className="title">Fight with the Dragon</h1>

      <PlayerHud stats={stats} dashRun={dashRun} />

      <div className="stage">
        <div ref={hostRef} className="canvas-host" />

        {announcement && (
          <p key={announcement} className="announce">
            {announcement}
          </p>
        )}

        {!booted && <p className="loading">Загружаем арену...</p>}

        <GameOverlay status={status} onRestart={restart} />
      </div>

      <DragonHud stats={stats} />

      <div className="controls">
        <span>
          <b>WASD</b> двигаться
        </span>

        <span>
          <b>Мышь</b> целиться
        </span>

        <span>
          <b>Пробел / ЛКМ</b> удар
        </span>

        <span>
          <b>Shift</b> рывок
        </span>
      </div>
    </div>
  );
}
