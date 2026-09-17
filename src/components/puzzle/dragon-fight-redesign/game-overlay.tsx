import type { EndReason, GameStatus } from "./types";

interface GameOverlayProps {
  status: GameStatus;
  endReason: EndReason | null;
  onRestart: () => void;
}

export function GameOverlay({ status, endReason, onRestart }: GameOverlayProps) {
  if (status === "playing") return null;

  const won = status === "won";

  return (
    <div className="overlay">
      <div className="overlay-frame">
        <span className="overlay-kicker">
          {won ? "ПОСЛЕДНИЙ БОЙ" : "БИТВА ОКОНЧЕНА"}
        </span>

        <p
          className={
            won
              ? "overlay-title overlay-title--won"
              : "overlay-title"
          }
        >
          {won
            ? "Дракон повержен"
            : endReason === "owlbear"
              ? "Медвесыч погиб"
              : "Вы пали"}
        </p>

        <p className="overlay-note">
          {won
            ? "Вы прошли последний бой вместе."
            : endReason === "owlbear"
              ? "Его нужно было защищать до самого конца."
              : "Попробуйте ещё раз."}
        </p>

        <button type="button" className="overlay-button" onClick={onRestart}>
          Сразиться снова
        </button>

        <span className="overlay-hint">или нажмите R</span>
      </div>
    </div>
  );
}
