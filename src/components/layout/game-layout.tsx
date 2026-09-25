import type { ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { AmbientMusic } from "@/components/audio/ambient-music";
import { AmbientParticles } from "@/components/layout/ambient-particles";
import { FullscreenButton } from "@/components/layout/fullscreen-button";
import { SoundToggleButton } from "@/components/layout/sound-toggle-button";

interface GameLayoutProps {
  backgroundImg?: string;
  children: ReactNode;
  sceneKey?: string;
  isPuzzle?: boolean;
  classNameContentBlock?: string;
  music?: string;
  showBackgroundOnly?: boolean;
}

export function GameLayout({
  backgroundImg,
  children,
  sceneKey,
  isPuzzle = false,
  classNameContentBlock = "",
  music,
  showBackgroundOnly = false,
}: GameLayoutProps) {
  return (
    <div
      className="
        relative
        flex
        h-dvh
        min-h-0
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-black
        font-story
        text-gray-100
      "
    >
      {music && <AmbientMusic src={music} />}

      {backgroundImg && (
        <motion.img
          key={backgroundImg}
          src={backgroundImg}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <AmbientParticles />

      <div
        className={`
          z-10
          w-full
          px-4
          text-shadow-lg
          ${showBackgroundOnly ? "" : "max-w-180 py-2"}
          ${classNameContentBlock}
        `}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneKey}
            initial={{ opacity: 0 }}
            animate={{
              opacity: showBackgroundOnly ? 1 : isPuzzle ? 1 : 0.85,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
            }}
            className={
              showBackgroundOnly
                ? "w-full"
                : !isPuzzle
                  ? "flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-10 shadow-2xl backdrop-blur-md"
                  : ""
            }
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-3">
        <SoundToggleButton />
        <FullscreenButton />
      </div>
    </div>
  );
}
