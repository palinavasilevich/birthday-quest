import type { GameStatus } from "../types";

interface GameOverlayProps {
  status: GameStatus;
  onRestart: () => void;
}

export function GameOverlay({ status, onRestart }: GameOverlayProps) {
  if (status === "playing") return null;

  const won = status === "won";

  return (
    <div className="overlay">
      <p className={won ? "overlay-title overlay-title--won" : "overlay-title"}>
        {won ? "Дракон повержен" : "Вы пали"}
      </p>

      {!won && (
        <>
          <button type="button" className="overlay-button" onClick={onRestart}>
            Сразиться снова
          </button>
          {/* <span className="hud-label">или нажмите R</span> */}
        </>
      )}
    </div>
  );
}
