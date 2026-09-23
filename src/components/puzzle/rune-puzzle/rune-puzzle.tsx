"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useGameStore } from "@/store/game-store";
import { useRunePlayback } from "@/hooks/puzzle/use-rune-playback";

import { PUZZLE_ROUNDS, RUNES, type Rune } from "@/data/puzzle/rune-data";

interface RunePuzzleProps {
  puzzleId: string;
  nextScene: string;
}

interface YouTubePlayer {
  playVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
}

interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: {
        autoplay?: number;
        controls?: number;
        disablekb?: number;
        fs?: number;
        iv_load_policy?: number;
        modestbranding?: number;
        playsinline?: number;
        rel?: number;
      };
    },
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ROLLBACK = 2;

const DISCOVERY_START_DELAY = 1200;

const RICKROLL_VIDEO_ID = "dQw4w9WgXcQ";
const RICKROLL_DURATION = 10_000;
const AFTER_RICKROLL_DELAY = 1_800;

type PuzzlePhase = "discovery" | "round";

export function RunePuzzle({ puzzleId, nextScene }: RunePuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);
  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [phase, setPhase] = useState<PuzzlePhase>("discovery");

  const [discoveredRunes, setDiscoveredRunes] = useState<string[]>([]);

  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);

  const [isSolved, setIsSolved] = useState(false);

  const [isMistake, setIsMistake] = useState(false);
  const [mistakeRune, setMistakeRune] = useState<string | null>(null);

  const [replayFrom, setReplayFrom] = useState(0);

  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);

  const discoveryStartedRef = useRef(false);

  const currentSequence = PUZZLE_ROUNDS[round];

  const playbackSequence = useMemo(
    () => currentSequence.slice(replayFrom),
    [currentSequence, replayFrom],
  );

  const { isPlaying, activeRune, playRune, playNote, replay } = useRunePlayback(
    {
      runes: RUNES,
      sequence: playbackSequence,
      autoPlay: phase === "round",
    },
  );

  /*
   * ------------------------------------------------------------
   * YouTube / Rickroll
   * ------------------------------------------------------------
   */

  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      playNote("quen", 1200);
    }, 100);

    const finishTimer = window.setTimeout(() => {
      setIntroFinished(true);
    }, 3500);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
    };
  }, [playNote]);

  useEffect(() => {
    let cancelled = false;

    const createPlayer = () => {
      if (
        cancelled ||
        !window.YT ||
        !youtubeContainerRef.current ||
        youtubePlayerRef.current
      ) {
        return;
      }

      youtubePlayerRef.current = new window.YT.Player(
        youtubeContainerRef.current,
        {
          videoId: RICKROLL_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
        },
      );
    };

    if (window.YT) {
      createPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;

        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;

      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * Discovery
   * ------------------------------------------------------------
   *
   * Player can press every rune in any order.
   * Each rune plays its own note.
   */

  const handleDiscoveryRune = (rune: Rune) => {
    if (!introFinished || phase !== "discovery" || isPlaying || isSolved) {
      return;
    }

    playRune(rune.id);

    setDiscoveredRunes((current) => {
      if (current.includes(rune.id)) {
        return current;
      }

      return [...current, rune.id];
    });
  };

  /*
   * ------------------------------------------------------------
   * Start first puzzle round
   * ------------------------------------------------------------
   *
   * After all five runes have been discovered:
   *
   * discovery
   *    ↓
   * short pause
   *    ↓
   * Round 1 playback
   */

  useEffect(() => {
    if (
      phase !== "discovery" ||
      discoveredRunes.length !== RUNES.length ||
      discoveryStartedRef.current
    ) {
      return;
    }

    discoveryStartedRef.current = true;

    const timeout = window.setTimeout(() => {
      setPhase("round");
      setRound(0);
      setSequence([]);
      setReplayFrom(0);
    }, DISCOVERY_START_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [discoveredRunes.length, phase]);

  /*
   * ------------------------------------------------------------
   * Player interaction during puzzle
   * ------------------------------------------------------------
   */

  const handleRuneClick = (rune: Rune) => {
    if (phase !== "round" || isPlaying || isSolved) {
      return;
    }

    /*
     * Play the note selected by the player.
     */
    playRune(rune.id);

    const expectedRune = currentSequence[sequence.length]?.runeId;

    /*
     * ----------------------------------------------------------
     * Wrong rune
     * ----------------------------------------------------------
     */

    if (rune.id !== expectedRune) {
      const rollback = Math.max(0, sequence.length - ROLLBACK);

      setMistakeRune(rune.id);
      setIsMistake(true);

      /*
       * Сохраняем всё, кроме последних двух нот.
       */
      setSequence(
        currentSequence.slice(0, rollback).map((note) => note.runeId),
      );

      if (rollback === replayFrom) {
        replay();
      } else {
        setReplayFrom(rollback);
      }

      window.setTimeout(() => {
        setIsMistake(false);
        setMistakeRune(null);
      }, 700);

      return;
    }

    /*
     * ----------------------------------------------------------
     * Correct rune
     * ----------------------------------------------------------
     */

    const nextSequence = [...sequence, rune.id];

    setSequence(nextSequence);

    /*
     * Current round is not complete.
     */
    if (nextSequence.length < currentSequence.length) {
      return;
    }

    /*
     * ----------------------------------------------------------
     * Move to next round
     * ----------------------------------------------------------
     */

    if (round < PUZZLE_ROUNDS.length - 1) {
      setSequence([]);
      setReplayFrom(0);

      window.setTimeout(() => {
        setRound((currentRound) => currentRound + 1);
      }, 900);

      return;
    }

    /*
     * ----------------------------------------------------------
     * Puzzle completed
     * ----------------------------------------------------------
     */

    setIsSolved(true);

    completePuzzle(puzzleId);

    /*
     * Final reward.
     */
    youtubePlayerRef.current?.playVideo();

    window.setTimeout(() => {
      youtubePlayerRef.current?.stopVideo();

      window.setTimeout(() => {
        setScene(nextScene);
      }, AFTER_RICKROLL_DELAY);
    }, RICKROLL_DURATION);
  };

  /*
   * ------------------------------------------------------------
   * Replay current round
   * ------------------------------------------------------------
   */

  const handleReplay = () => {
    if (phase !== "round" || isPlaying || isSolved) {
      return;
    }

    setIsMistake(false);
    setMistakeRune(null);

    replay();
  };

  /*
   * ------------------------------------------------------------
   * Messages
   * ------------------------------------------------------------
   */

  const message = () => {
    if (isSolved) {
      return "Мелодия отозвалась в камне.";
    }

    if (phase === "discovery") {
      if (!introFinished) {
        return "Руна откликается на прикосновение и начинает едва заметно светиться. Звук эхом разносится по лесу...";
      }

      if (discoveredRunes.length === 0) {
        return "Коснись рун и послушай, что они скажут.";
      }

      if (discoveredRunes.length === 2) {
        return "ЛЯ...";
      }

      if (discoveredRunes.length === 3) {
        return "ЛЯ...ЛЯ...";
      }

      if (discoveredRunes.length === 4) {
        return "ЛЯ...ЛЯ...ЛЯ...";
      }

      if (discoveredRunes.length === 5) {
        return "Брависсимо! Прекрасное «ЛЯ», прекрасное!";
      }

      if (discoveredRunes.length < RUNES.length) {
        return "Другой звук...";
      }

      return "Вслушайся...";
    }

    if (isMistake) {
      return "Солнышко, давай... я тебя люблю... давай... ";
    }

    if (isPlaying) {
      return replayFrom > 0
        ? "Слушай с того места, где сбился..."
        : "Вслушайся в мелодию...";
    }

    return sequence.length > 0
      ? "Продолжай."
      : "Мелодия всё ещё звучит в памяти. Повтори её.";
  };

  /*
   * ------------------------------------------------------------
   * Render
   * ------------------------------------------------------------
   */

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
      {/* Hidden YouTube player */}

      <div
        ref={youtubeContainerRef}
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-px
          w-px
          overflow-hidden
          opacity-0
        "
        aria-hidden="true"
      />

      {/* Message */}

      <p
        className="
          mb-10
          min-h-8
          whitespace-pre-line
          text-center
          font-story
          text-2xl
          italic
          text-white/70
        "
      >
        {message()}
      </p>

      {/* Round */}

      {phase === "round" && (
        <p
          className="
            mb-8
            text-center
            text-xs
            uppercase
            tracking-[0.3em]
            text-[#ff9b00]/60
          "
        >
          Фрагмент {round + 1} / {PUZZLE_ROUNDS.length}
        </p>
      )}

      {/* Discovery hint */}

      {/* {phase === "discovery" && (
        <p
          className="
            mb-8
            text-center
            text-xs
            uppercase
            tracking-[0.25em]
            text-white/30
          "
        >
          Открыто {discoveredRunes.length} / {RUNES.length}
        </p>
      )} */}

      {/* Runes */}

      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {RUNES.map((rune) => {
          const isActive = activeRune === rune.id;

          const isDiscovered = discoveredRunes.includes(rune.id);

          const isMistakeRune = isMistake && mistakeRune === rune.id;

          return (
            <button
              key={rune.id}
              type="button"
              disabled={isPlaying || isSolved}
              onClick={() =>
                phase === "discovery"
                  ? handleDiscoveryRune(rune)
                  : handleRuneClick(rune)
              }
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
                  isMistakeRune
                    ? `
                      border-red-500
                      bg-red-500/10
                      text-red-400
                      shadow-[0_0_25px_rgba(239,68,68,0.45)]
                    `
                    : isActive
                      ? `
                        scale-105
                        border-[#ff9b00]
                        bg-[#ff9b00]/20
                        shadow-[0_0_30px_rgba(255,155,0,0.55)]
                      `
                      : isDiscovered && phase === "discovery"
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
              `}
            >
              <img
                alt={rune.label}
                src={rune.symbolImage}
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

      {phase === "discovery" && (
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
      )}

      {/* Puzzle progress */}

      {phase === "round" && (
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
          {currentSequence.map((_, index) => {
            const isCompleted = index < sequence.length;

            return (
              <span
                key={index}
                className={`
                    h-1.5
                    w-6
                    transition-all
                    duration-300
                    sm:w-8

                    ${
                      isCompleted
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
      )}

      {/* Replay */}

      {phase === "round" && !isSolved && (
        <button
          type="button"
          disabled={isPlaying}
          onClick={handleReplay}
          className="
              mt-8
              cursor-pointer
              text-xs
              uppercase
              tracking-[0.2em]
              text-white/40
              transition-colors
              hover:text-[#ff9b00]
              disabled:cursor-default
              disabled:opacity-30
            "
        >
          Послушать мелодию ещё раз
        </button>
      )}
    </div>
  );
}
