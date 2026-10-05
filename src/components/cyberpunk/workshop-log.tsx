import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useGameStore } from "@/store/game-store";
import {
  CyberpunkConsoleLabel,
  CyberpunkFrame,
} from "@/components/puzzle/cyberpunk/cyberpunk-frame";

const LOG_EVENTS = [
  {
    event: "forestEntered",
    text: "subject entered the forest",
  },
  {
    event: "trailFound",
    text: "subject found the trail",
  },
  {
    event: "runeSolved",
    text: "subject touched the rune",
  },
  {
    event: "doorOpened",
    text: "subject opened the door",
  },

  {
    event: "nightCityEntered",
    text: "subject entered the night city",
  },
  {
    event: "workshopEntered",
    text: "subject entered the workshop",
  },
] as const;

const REVEAL_DELAY = 1100;

function formatTime(timestamp?: number) {
  if (timestamp == null) return "--:--";

  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export function WorkshopLog() {
  const [visibleCount, setVisibleCount] = useState(0);

  const storyTimestamps = useGameStore((state) => state.storyTimestamps);
  const events = LOG_EVENTS;

  useEffect(() => {
    if (visibleCount >= events.length) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, REVEAL_DELAY);

    return () => window.clearTimeout(timer);
  }, [visibleCount, events.length]);

  return (
    <CyberpunkFrame
      title="ACTIVITY LOG"
      status="ACTIVE"
      date="LOCAL SYSTEM"
      className="max-w-3xl"
    >
      <CyberpunkConsoleLabel>WORKSHOP / SUBJECT TRACKING</CyberpunkConsoleLabel>

      <div className="min-h-[220px]">
        <div className="mb-5 border-b border-[#d99b22]/15 pb-3 text-[8px] uppercase tracking-[0.16em] text-[#56605a]">
          EVENT HISTORY
        </div>

        <div className="space-y-3 font-mono text-[11px] leading-relaxed sm:text-[12px]">
          <AnimatePresence initial={false}>
            {events.slice(0, visibleCount).map((event) => (
              <motion.div
                key={event.event}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="flex gap-4"
              >
                <span className="shrink-0 text-[#d99b22]">
                  {formatTime(storyTimestamps[event.event])}
                </span>

                <span className="text-[#aeb5a4]">{event.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleCount < events.length && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mt-4 text-[#d99b22]"
            >
              _
            </motion.div>
          )}

          {visibleCount === events.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 1] }}
              transition={{ duration: 0.5 }}
              className="mt-5 text-[#d99b22]/60"
            >
              _
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-[#d99b22]/15 pt-3">
        <div className="flex items-center justify-between text-[7px] uppercase tracking-[0.16em]">
          <span className="text-[#465149]">SYSTEM LOG</span>

          <span
            className={
              visibleCount === events.length
                ? "text-[#78c98c]"
                : "text-[#d99b22]/60"
            }
          >
            {visibleCount === events.length ? "COMPLETE" : "WRITING"}
          </span>
        </div>
      </div>
    </CyberpunkFrame>
  );
}
