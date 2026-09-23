"use client";

import { useEffect, useRef, useState } from "react";

import { useGameStore } from "@/store/game-store";
import { useRunePlayback } from "@/hooks/puzzle/use-rune-playback";

import { DISCOVERY_MELODY, RUNES } from "@/data/puzzle/rune-data";

interface RuneDiscoveryProps {
  nextScene: string;
}

type DiscoveryPhase = "explore" | "demo" | "complete";

const DISCOVERY_START_DELAY = 1_000;
const AFTER_MELODY_DELAY = 10;

const MELODY_DURATION = DISCOVERY_MELODY.reduce(
  (total, note) => total + note.duration + note.gap,
  0,
);

export function RuneDiscovery({ nextScene }: RuneDiscoveryProps) {
  const setScene = useGameStore((state) => state.setScene);

  const [discoveredRunes, setDiscoveredRunes] = useState<string[]>([]);
  const [introFinished, setIntroFinished] = useState(false);
  const [phase, setPhase] = useState<DiscoveryPhase>("explore");

  const demoStartedRef = useRef(false);

  const { isPlaying, activeRune, playRune, playNote, replay } = useRunePlayback(
    {
      runes: RUNES,
      sequence: DISCOVERY_MELODY,
      autoPlay: false,
    },
  );

  /**
   * Intro:
   *
   * QUEN reacts on its own when the scene opens.
   *
   * The player still has to discover QUEN manually.
   */
  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      playNote("quen", 1200);
    }, 300);

    const finishTimer = window.setTimeout(() => {
      setIntroFinished(true);
    }, 3000);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
    };
  }, [playNote]);

  /**
   * Handle rune interaction.
   */
  const handleRuneClick = (runeId: string) => {
    if (isPlaying || phase !== "explore" || !introFinished) {
      return;
    }

    playRune(runeId);

    setDiscoveredRunes((current) =>
      current.includes(runeId) ? current : [...current, runeId],
    );
  };

  /**
   * All five runes have been discovered.
   *
   * Wait a moment, then play the complete
   * discovery melody.
   */
  useEffect(() => {
    if (
      phase !== "explore" ||
      discoveredRunes.length !== RUNES.length ||
      demoStartedRef.current
    ) {
      return;
    }

    demoStartedRef.current = true;

    const timeout = window.setTimeout(() => {
      setPhase("demo");
      replay();
    }, DISCOVERY_START_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [discoveredRunes.length, phase, replay]);

  /**
   * Discovery melody has finished.
   *
   * Continue to the actual rune puzzle.
   */
  useEffect(() => {
    if (phase !== "demo") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPhase("complete");
    }, MELODY_DURATION + AFTER_MELODY_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [phase]);

  /**
   * Give the final message a moment to breathe,
   * then continue to the actual rune puzzle.
   */
  useEffect(() => {
    if (phase !== "complete") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [phase, nextScene, setScene]);

  const message = (() => {
    switch (phase) {
      case "explore":
        if (!introFinished) {
          return "Руна откликается на прикосновение и начинает едва заметно светиться. Звук эхом разносится по лесу...";
        }

        return discoveredRunes.length === 0
          ? "Теперь попробуй сам."
          : "Другой звук...";

      case "demo":
        return "Вслушайся...";

      case "complete":
        return "Мелодия эхом разносится по лесу...";
    }
  })();

  return (
    <div
      className="
        relative
        mt-10
        m-auto
        flex
        w-full
        max-w-2xl
        flex-col
        items-center
        rounded-2xl
        border
        border-white/10
        bg-black/60
        p-12
        shadow-2xl
        backdrop-blur-md
      "
    >
      {/* Message */}

      <p
        className="
          mb-8
          min-h-16
          whitespace-pre-line
          text-center
          font-story
          text-2xl
          italic
          text-white/70
        "
      >
        {message}
      </p>

      {/* Runes */}

      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {RUNES.map((rune) => {
          const isActive = activeRune === rune.id;
          const isDiscovered = discoveredRunes.includes(rune.id);

          return (
            <button
              key={rune.id}
              type="button"
              disabled={!introFinished || isPlaying || phase !== "explore"}
              onClick={() => handleRuneClick(rune.id)}
              aria-label={`Руна ${rune.label}`}
              className={`
                group
                relative
                flex
                h-20
                w-16
                cursor-pointer
                flex-col
                items-center
                justify-center
                border
                bg-black/60
                outline-none
                transition-all
                duration-200
                sm:h-24
                sm:w-20

                ${
                  isActive
                    ? `
                      scale-105
                      border-[#ff9b00]
                      bg-[#ff9b00]/20
                      shadow-[0_0_30px_rgba(255,155,0,0.55)]
                    `
                    : isDiscovered
                      ? `
                        border-[#ff9b00]/80
                        bg-[#ff9b00]/10
                      `
                      : `
                        border-[#ff9b00]/40
                        text-[#ff9b00]
                      `
                }

                hover:border-[#ff9b00]
                hover:bg-[#ff9b00]/10

                focus-visible:border-[#ff9b00]
                focus-visible:shadow-[0_0_20px_rgba(255,155,0,0.35)]

                disabled:cursor-default
                disabled:opacity-60
                disabled:hover:border-[#ff9b00]/40
                disabled:hover:bg-black/60
              `}
            >
              <img
                src={rune.symbolImage}
                alt={rune.label}
                className={`
                  w-12
                  transition-transform
                  duration-200
                  ${isActive ? "scale-110" : ""}
                `}
              />

              <span
                className="
                  mt-2
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                  text-[#ff9b00]/70
                  sm:text-[10px]
                  sm:tracking-[0.2em]
                "
              >
                {rune.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Discovery progress */}

      <div
        className="
          mt-8
          flex
          flex-wrap
          justify-center
          gap-1.5
          sm:gap-2
        "
      >
        {RUNES.map((rune) => {
          const isDiscovered = discoveredRunes.includes(rune.id);

          return (
            <span
              key={rune.id}
              className={`
                h-1.5
                w-6
                transition-all
                duration-300
                sm:w-8

                ${
                  isDiscovered
                    ? `
                      bg-[#ff9b00]
                      shadow-[0_0_8px_rgba(255,155,0,0.6)]
                    `
                    : "bg-white/10"
                }
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
