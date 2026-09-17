import { DRAGON, PLAYER } from "./constants";
import type { GameStats } from "./types";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`hud-heart ${filled ? "is-filled" : ""}`}
      viewBox="0 0 24 22"
      aria-hidden="true"
    >
      <path d="M12 21S2 14.6 2 8.2A5.2 5.2 0 0 1 12 5.4 5.2 5.2 0 0 1 22 8.2C22 14.6 12 21 12 21z" />
    </svg>
  );
}

interface PlayerHudProps {
  stats: GameStats;
  dashRun: number;
}

export function PlayerHud({ stats, dashRun }: PlayerHudProps) {
  const dragonPercent = Math.max(0, (stats.dragonHp / DRAGON.maxHp) * 100);
  const poisePercent = Math.min(100, (stats.poise / DRAGON.poiseMax) * 100);

  return (
    <div className="battle-topbar">
      <div className="player-hud">
        <div className="player-hud__health">
          <div
            className="hearts"
            role="img"
            aria-label={`Жизни: ${stats.hp} из ${PLAYER.maxHp}`}
          >
            {Array.from({ length: PLAYER.maxHp }, (_, index) => (
              <Heart key={index} filled={index < stats.hp} />
            ))}
          </div>
        </div>

        <div className="dash-widget" aria-label="Перезарядка рывка">
          <div className="dash-track">
            <div
              key={dashRun}
              className="dash-fill"
              style={{ animationDuration: `${PLAYER.dashCooldown}ms` }}
            />
          </div>
          <span>РЫВОК</span>
        </div>
      </div>

      <div className="boss-hud">
        <div className="boss-hud__meta">
          <span>ФАЗА {stats.phase}</span>
          <strong>{stats.dragonHp} HP</strong>
        </div>

        <div className="boss-hud__poise" aria-hidden="true">
          <div
            className="boss-hud__poise-fill"
            style={{ width: `${poisePercent}%` }}
          />
        </div>

        <div
          className="boss-hud__track"
          role="progressbar"
          aria-label="Здоровье дракона"
          aria-valuenow={stats.dragonHp}
          aria-valuemin={0}
          aria-valuemax={DRAGON.maxHp}
        >
          <div
            className="boss-hud__fill"
            style={{ width: `${dragonPercent}%` }}
          />
          <span className="boss-hud__tick boss-hud__tick--one" />
          <span className="boss-hud__tick boss-hud__tick--two" />
        </div>
      </div>
    </div>
  );
}

export function DragonHud({ stats }: { stats: GameStats }) {
  const owlbearPercent = Math.max(
    0,
    (stats.owlbearHp / stats.owlbearMaxHp) * 100,
  );

  return (
    <div className="battle-bottom">
      <div
        className={`owlbear-panel ${
          stats.owlbearSafe ? "is-safe" : ""
        } ${stats.owlbearHp <= 1 ? "is-critical" : ""}`}
      >
        <div className="owlbear-portrait" aria-hidden="true">
          <span>🐻</span>
        </div>

        <div className="owlbear-copy">
          <div className="owlbear-title-row">
            <span>Медвесыч</span>
            {stats.owlbearSafe && <small>СПУТНИК</small>}
          </div>

          <div className="owlbear-hp-row">
            <div className="owlbear-hp-track">
              <div
                className="owlbear-hp-fill"
                style={{ width: `${owlbearPercent}%` }}
              />
            </div>
            <strong>
              {stats.owlbearHp} / {stats.owlbearMaxHp} HP
            </strong>
          </div>
        </div>
      </div>

      <div className="battle-controls" aria-label="Управление">
        <div className="control-group movement">
          <div className="wasd" aria-hidden="true">
            <kbd>W</kbd>
            <div>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
            </div>
          </div>
          <span>Движение</span>
        </div>

        <div className="control-group">
          <div className="mouse-icon" aria-hidden="true">
            <span />
          </div>
          <span>
            Атака
            <br />
            (ЛКМ)
          </span>
        </div>

        <div className="control-group">
          <kbd className="shift-key">Shift</kbd>
          <span>Рывок</span>
        </div>
      </div>

      <div className="protect-panel">
        <div className="shield-icon" aria-hidden="true">
          ♜
        </div>
        <p>
          <strong>Продолжай защищать Медвесыча.</strong>
          <span>Дракон всё ещё может его убить!</span>
        </p>
      </div>
    </div>
  );
}
