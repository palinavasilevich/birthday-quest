import { useEffect } from "react";

import { useGameStore } from "@/store/game-store";

import { usePhaserGame } from "./usePhaserGame";
import { DragonHud, PlayerHud } from "./hud";
import { GameOverlay } from "./game-overlay";

import "./styles.css";

interface DragonFightProps {
  puzzleId?: string;
  nextScene?: string;
}

export function DragonFight({
  puzzleId,
  nextScene,
}: DragonFightProps) {
  const setScene = useGameStore((state) => state.setScene);
  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const {
    hostRef,
    stats,
    status,
    endReason,
    announcement,
    dashRun,
    booted,
    restart,
  } = usePhaserGame();

  useEffect(() => {
    if (status === "playing") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" || event.key === "к") {
        restart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, restart]);

  useEffect(() => {
    if (status !== "won" || !puzzleId || !nextScene) return;

    completePuzzle(puzzleId);

    const timer = window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [status, puzzleId, nextScene, completePuzzle, setScene]);

  return (
    <div className="dragon-fight">
      <h1 className="dragon-title">Fight with the Dragon</h1>

      <PlayerHud stats={stats} dashRun={dashRun} />

      <div className="stage">
        <div ref={hostRef} className="canvas-host" />

        {announcement && (
          <p key={announcement} className="announce">
            {announcement}
          </p>
        )}

        {!booted && <p className="loading">Загружаем арену...</p>}

        <GameOverlay
          status={status}
          endReason={endReason}
          onRestart={restart}
        />
      </div>

      <DragonHud stats={stats} />
    </div>
  );
}
