import { useEffect } from "react";
import { usePhaserGame } from "../hooks/usePhaserGame";
import { DragonHud, PlayerHud } from "./hud";
import { GameOverlay } from "./game-overlay";

import "../styles.css";

export function DragonFight() {
  const { hostRef, stats, status, announcement, dashRun, booted, restart } =
    usePhaserGame();

  // Рестарт по R доступен только на экране конца боя,
  // чтобы клавиша не срабатывала во время боя.
  useEffect(() => {
    if (status === "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" || event.key === "к") restart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, restart]);

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

        {!booted && <p className="loading">Загружаем арену…</p>}

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
