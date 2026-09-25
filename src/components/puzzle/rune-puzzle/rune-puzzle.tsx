import { useEffect, useRef, useState } from "react";

import { useGameStore } from "@/store/game-store";

import {
  playMelodyNote,
  playRune,
} from "@/hooks/puzzle/rune-puzzle/use-rune-piano";

import {
  LEVEL_MELODIES,
  type MelodyNote,
} from "@/data/puzzle/rune-puzzle/rune-melody";

import { RUNES, type Rune } from "@/data/puzzle/rune-data";

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

const DISCOVERY_START_DELAY = 900;

const RICKROLL_VIDEO_ID = "dQw4w9WgXcQ";
const RICKROLL_DURATION = 10_000;
const AFTER_RICKROLL_DELAY = 1_800;

/**
 * Note -> Rune mapping
 *
 * G4  -> QUEN
 * A#4 -> AXII
 * A4  -> IGNI
 * D4  -> AARD
 * D#4 -> YRDEN
 */
const NOTE_TO_RUNE: Record<string, string> = {
  G4: "quen",
  "A#4": "axii",
  A4: "igni",
  D4: "aard",
  "D#4": "yrden",
};

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

  const [isPlaying, setIsPlaying] = useState(false);

  const [activeRune, setActiveRune] = useState<string | null>(null);

  const [introFinished, setIntroFinished] = useState(false);

  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);

  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);

  const discoveryStartedRef = useRef(false);

  const currentMelody: MelodyNote[] = LEVEL_MELODIES[round];

  /*
   * ------------------------------------------------------------
   * INTRO
   * ------------------------------------------------------------
   *
   * При загрузке игры звучит первая нота G4.
   * QUEN подсвечивается ДО начала звучания.
   */

  useEffect(() => {
    let cancelled = false;

    const startIntro = async () => {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 100);
      });

      if (cancelled) {
        return;
      }

      setIsPlaying(true);
      setActiveRune("quen");

      try {
        await playMelodyNote("G4", 1.2);
      } finally {
        if (!cancelled) {
          setActiveRune(null);
          setIsPlaying(false);
        }
      }

      if (!cancelled) {
        window.setTimeout(() => {
          if (!cancelled) {
            setIntroFinished(true);
          }
        }, 1800);
      }
    };

    void startIntro();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * YOUTUBE
   * ------------------------------------------------------------
   */

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
   * DISCOVERY
   * ------------------------------------------------------------
   */

  const handleDiscoveryRune = async (rune: Rune) => {
    if (!introFinished || phase !== "discovery" || isPlaying || isSolved) {
      return;
    }

    setIsPlaying(true);
    setActiveRune(rune.id);

    try {
      await playRune(rune.id);

      setDiscoveredRunes((current) => {
        if (current.includes(rune.id)) {
          return current;
        }

        return [...current, rune.id];
      });
    } finally {
      setActiveRune(null);
      setIsPlaying(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * START FIRST ROUND
   * ------------------------------------------------------------
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
   * PLAY CURRENT MELODY
   * ------------------------------------------------------------
   */

  const playCurrentMelody = async (fromIndex = 0) => {
    if (isPlaying || isSolved) {
      return;
    }

    setIsPlaying(true);

    try {
      for (let index = fromIndex; index < currentMelody.length; index += 1) {
        const item = currentMelody[index];

        const runeId = NOTE_TO_RUNE[item.note];

        if (!runeId) {
          console.warn(`No rune configured for note: ${item.note}`);

          continue;
        }

        /*
         * VERY IMPORTANT:
         *
         * First highlight the rune.
         * Only then play the note.
         */

        setActiveRune(runeId);

        await playMelodyNote(item.note, item.duration);

        setActiveRune(null);

        /*
         * Pause after the note.
         */

        if (item.pause) {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, item.pause! * 1000);
          });
        }
      }
    } finally {
      setActiveRune(null);
      setIsPlaying(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * AUTOPLAY ROUND
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (phase !== "round" || isSolved) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void playCurrentMelody(0);
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };

    // playCurrentMelody intentionally excluded.
    // We only want to trigger when the round changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  /*
   * ------------------------------------------------------------
   * PLAYER INPUT
   * ------------------------------------------------------------
   */

  const handleRuneClick = async (rune: Rune) => {
    if (phase !== "round" || isPlaying || isSolved) {
      return;
    }

    const expectedNote = currentMelody[sequence.length];

    const expectedRune = expectedNote
      ? NOTE_TO_RUNE[expectedNote.note]
      : undefined;

    const isCorrectRune = rune.id === expectedRune;

    /*
     * ----------------------------------------------------------
     * PLAY PLAYER'S NOTE
     * ----------------------------------------------------------
     */

    setIsPlaying(true);
    setActiveRune(rune.id);

    try {
      if (isCorrectRune && expectedNote) {
        await playMelodyNote(expectedNote.note, expectedNote.duration);
      } else {
        await playRune(rune.id);
      }
    } finally {
      setActiveRune(null);
      setIsPlaying(false);
    }

    /*
     * ----------------------------------------------------------
     * WRONG RUNE
     * ----------------------------------------------------------
     */

    if (!isCorrectRune) {
      const rollback = Math.max(0, sequence.length - ROLLBACK);

      setMistakeRune(rune.id);
      setIsMistake(true);

      /*
       * Keep only the part before the rollback.
       */

      const rolledBackSequence = currentMelody
        .slice(0, rollback)
        .map((note) => NOTE_TO_RUNE[note.note]);

      setSequence(rolledBackSequence);

      setReplayFrom(rollback);

      /*
       * Play the melody again from the rollback point.
       */

      window.setTimeout(() => {
        void playCurrentMelody(rollback);
      }, 700);

      window.setTimeout(() => {
        setIsMistake(false);
        setMistakeRune(null);
      }, 700);

      return;
    }

    /*
     * ----------------------------------------------------------
     * CORRECT RUNE
     * ----------------------------------------------------------
     */

    const nextSequence = [...sequence, rune.id];

    setSequence(nextSequence);

    /*
     * Current fragment is not complete.
     */

    if (nextSequence.length < currentMelody.length) {
      return;
    }

    /*
     * ----------------------------------------------------------
     * NEXT ROUND
     * ----------------------------------------------------------
     */

    if (round < LEVEL_MELODIES.length - 1) {
      setSequence([]);
      setReplayFrom(0);

      window.setTimeout(() => {
        setRound((currentRound) => currentRound + 1);
      }, 900);

      return;
    }

    /*
     * ----------------------------------------------------------
     * PUZZLE COMPLETED
     * ----------------------------------------------------------
     */

    setIsSolved(true);

    completePuzzle(puzzleId);

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
   * REPLAY
   * ------------------------------------------------------------
   */

  const handleReplay = () => {
    if (phase !== "round" || isPlaying || isSolved) {
      return;
    }

    setIsMistake(false);
    setMistakeRune(null);

    void playCurrentMelody(0);
  };

  /*
   * ------------------------------------------------------------
   * MESSAGE
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

      return "Вслушайся...";
    }

    if (isMistake) {
      return "Солнышко, давай... я тебя люблю... давай...";
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
   * RENDER
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
          Фрагмент {round + 1} / {LEVEL_MELODIES.length}
        </p>
      )}

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
                  ? void handleDiscoveryRune(rune)
                  : void handleRuneClick(rune)
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
          {currentMelody.map((_, index) => {
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
