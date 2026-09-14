import { DRAGON, OWLBEAR, PLAYER } from "../constants";
import type { GameStats } from "../types";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 22" width="18" height="17" aria-hidden="true">
      <path
        d="M12 21S2 14.6 2 8.2A5.2 5.2 0 0 1 12 5.4 5.2 5.2 0 0 1 22 8.2C22 14.6 12 21 12 21z"
        fill={filled ? "#d6493f" : "#2a2e42"}
        stroke={filled ? "#ff7a6a" : "#3a3f58"}
        strokeWidth="1.4"
      />
    </svg>
  );
}

interface HudProps {
  stats: GameStats;
  dashRun: number;
}

export function PlayerHud({ stats, dashRun }: HudProps) {
  return (
    <div className="hud-row">
      <div
        className="hearts"
        role="img"
        aria-label={`Жизни: ${stats.hp} из ${PLAYER.maxHp}`}
      >
        {Array.from({ length: PLAYER.maxHp }, (_, i) => (
          <Heart key={i} filled={i < stats.hp} />
        ))}
      </div>

      <div className="dash-track">
        <div
          key={dashRun}
          className="dash-fill"
          style={{ animationDuration: `${PLAYER.dashCooldown}ms` }}
        />
      </div>

      <span className="hud-label">рывок</span>
      <span className="hud-phase">
        Фаза {stats.phase} · {stats.dragonHp} HP
      </span>
    </div>
  );
}

export function DragonHud({ stats }: { stats: GameStats }) {
  const hpPercent = Math.max(0, (stats.dragonHp / DRAGON.maxHp) * 100);
  const poisePercent = Math.min(100, (stats.poise / DRAGON.poiseMax) * 100);

  return (
    <>
      <div className="boss-bar">
        <div className="poise-track">
          <div className="poise-fill" style={{ width: `${poisePercent}%` }} />
        </div>

        <div
          className="hp-track"
          role="progressbar"
          aria-label="Здоровье дракона"
          aria-valuenow={stats.dragonHp}
          aria-valuemin={0}
          aria-valuemax={DRAGON.maxHp}
        >
          <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
          <div className="hp-tick" style={{ left: "33%" }} />
          <div className="hp-tick" style={{ left: "66%" }} />
        </div>
      </div>

      <div className={`owlbear-status ${stats.owlbearSafe ? "is-safe" : ""}`}>
        <span>Медвесыч</span>
        <span>
          {stats.owlbearSafe
            ? "спасён"
            : `${stats.owlbearHp}/${OWLBEAR.maxHp} HP`}
        </span>
      </div>
    </>
  );
}
