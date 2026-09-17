import { useCallback, useEffect, useRef, useState } from "react";
import Phaser from "phaser";

import { createGameConfig } from "./config";
import { DRAGON, OWLBEAR, PLAYER, SCENE_KEYS } from "./constants";
import { ArenaScene } from "./arena-scene";
import type {
  EndReason,
  GameHooks,
  GameStats,
  GameStatus,
} from "./types";

const INITIAL_STATS: GameStats = {
  hp: PLAYER.maxHp,
  dragonHp: DRAGON.maxHp,
  phase: 1,
  poise: 0,
  owlbearHp: OWLBEAR.initialMaxHp,
  owlbearMaxHp: OWLBEAR.initialMaxHp,
  owlbearSafe: false,
};

export function usePhaserGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const announceTimer = useRef<number | null>(null);

  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [endReason, setEndReason] = useState<EndReason | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [dashRun, setDashRun] = useState(0);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const hooks: GameHooks = {
      onStats: setStats,

      onEnd: (won, reason) => {
        setEndReason(won ? null : reason ?? "player");
        setStatus(won ? "won" : "lost");
      },

      onDash: () => setDashRun((n) => n + 1),

      onAnnounce: (text) => {
        setAnnouncement(text);

        if (announceTimer.current !== null) {
          window.clearTimeout(announceTimer.current);
        }

        announceTimer.current = window.setTimeout(() => {
          setAnnouncement(null);
        }, 1400);
      },
    };

    const game = new Phaser.Game(
      createGameConfig(host, new ArenaScene(hooks)),
    );

    gameRef.current = game;
    setBooted(true);

    return () => {
      if (announceTimer.current !== null) {
        window.clearTimeout(announceTimer.current);
      }

      game.destroy(true);
      gameRef.current = null;
      setBooted(false);
    };
  }, []);

  const restart = useCallback(() => {
    const scene = gameRef.current?.scene.getScene(SCENE_KEYS.arena);

    if (!scene) return;

    setStatus("playing");
    setEndReason(null);
    setAnnouncement(null);
    setStats(INITIAL_STATS);

    scene.scene.restart();
  }, []);

  return {
    hostRef,
    stats,
    status,
    endReason,
    announcement,
    dashRun,
    booted,
    restart,
  };
}
