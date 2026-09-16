import type { EndReason, GameStatus } from "../types";

interface GameOverlayProps {
  status: GameStatus;
  endReason: EndReason | null;
  onRestart: () => void;
}

function getEnding(status: GameStatus, endReason: EndReason | null) {
  if (status === "won") {
    return {
      title: "Дракон повержен",
      note: null,
      button: null,
    };
  }

  if (endReason === "owlbear") {
    return {
      title: "Ты не успел",
      note: "Медвесыч не выдержал огня. В следующий раз доберись до него первым — дракон подождёт.",
      button: "Попробовать снова",
    };
  }

  return {
    title: "Ты пал",
    note: "Дракон оказался быстрее. Держись на расстоянии и уходи рывком.",
    button: "Сразиться снова",
  };
}

export function GameOverlay({
  status,
  endReason,
  onRestart,
}: GameOverlayProps) {
  if (status === "playing") return null;

  const won = status === "won";

  const { title, note, button } = getEnding(status, endReason);

  return (
    <div className="overlay">
      <p className={won ? "overlay-title overlay-title--won" : "overlay-title"}>
        {title}
      </p>

      {note && <p className="overlay-note">{note}</p>}

      {button && (
        <button type="button" className="overlay-button" onClick={onRestart}>
          {button}
        </button>
      )}
    </div>
  );
}
