import { useEffect, useRef, useState } from "react";

interface RuneMelodyRevealProps {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  onFinished: () => void;
  className?: string;
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }) => void;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/*
 * Loads the YouTube IFrame API script once and resolves once
 * `window.YT.Player` is ready to use. Safe to call multiple times —
 * subsequent calls share the same loading promise. `window.onYouTubeIframeAPIReady`
 * is a single global callback owned by the YouTube script, so any
 * previously registered callback is chained rather than overwritten.
 */
let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

/**
 * Shows a small, visibly-embedded YouTube player and plays a short
 * clip of it (startSeconds → endSeconds), then calls `onFinished`.
 *
 * The player is kept visible on screen rather than hidden — YouTube's
 * Terms of Service don't allow embeds used solely to extract audio
 * with the player concealed. Sizing it small/unobtrusive (see the
 * usage example) is fine; hiding it entirely is not.
 *
 * Autoplay with sound can be blocked by the browser if too much time
 * has passed since the player's last genuine user gesture (a click
 * elsewhere in the app doesn't necessarily count once async delays
 * are involved). If that happens, a "Play" button is shown instead
 * so the clip is never silently skipped.
 *
 * Requires network access to www.youtube.com — if the person is
 * offline, or if the request is blocked (ad blockers, restrictive
 * network policies), the embed simply won't load; there is no local
 * fallback audio, since that would mean hosting the copyrighted track.
 */
export function RuneMelodyReveal({
  videoId,
  startSeconds = 0,
  endSeconds = 4,
  onFinished,
  className,
}: RuneMelodyRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const finishedRef = useRef(false);

  const [needsManualPlay, setNeedsManualPlay] = useState(false);

  const finish = () => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    onFinished();
  };

  useEffect(() => {
    let cancelled = false;
    let autoplayCheckTimeoutId: number | null = null;
    let endTimeoutId: number | null = null;

    void loadYouTubeIframeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) {
        return;
      }

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          start: startSeconds,
        },
        events: {
          onReady: () => {
            if (cancelled) {
              return;
            }

            /*
             * If nothing has started playing shortly after load, the
             * browser likely blocked autoplay — fall back to a
             * visible "Play" button rather than silently doing
             * nothing.
             */
            autoplayCheckTimeoutId = window.setTimeout(() => {
              if (!cancelled) {
                setNeedsManualPlay(true);
              }
            }, 800);
          },
          onStateChange: (event) => {
            if (cancelled || !window.YT) {
              return;
            }

            const isPlaying = event.data === window.YT.PlayerState.PLAYING;

            if (isPlaying) {
              setNeedsManualPlay(false);

              if (autoplayCheckTimeoutId !== null) {
                window.clearTimeout(autoplayCheckTimeoutId);
                autoplayCheckTimeoutId = null;
              }

              const clipSeconds = Math.max(0, endSeconds - startSeconds);

              endTimeoutId = window.setTimeout(() => {
                playerRef.current?.pauseVideo();
                finish();
              }, clipSeconds * 1000);
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              finish();
            }
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      cancelled = true;

      if (autoplayCheckTimeoutId !== null) {
        window.clearTimeout(autoplayCheckTimeoutId);
      }

      if (endTimeoutId !== null) {
        window.clearTimeout(endTimeoutId);
      }

      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, startSeconds, endSeconds]);

  const handleManualPlay = () => {
    playerRef.current?.loadVideoById({ videoId, startSeconds, endSeconds });
    setNeedsManualPlay(false);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[#ff9b00]/40 bg-black/80 ${className ?? ""}`}
    >
      <div className="aspect-video w-full" ref={containerRef} />

      {needsManualPlay && (
        <button
          type="button"
          onClick={handleManualPlay}
          className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm uppercase tracking-[0.2em] text-[#ff9b00] transition-colors hover:bg-black/60"
        >
          ▶ Слушать
        </button>
      )}
    </div>
  );
}
