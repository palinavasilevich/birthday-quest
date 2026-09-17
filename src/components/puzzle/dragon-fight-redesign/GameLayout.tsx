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
}

export function GameLayout({
  backgroundImg,
  children,
  sceneKey,
  isPuzzle = false,
  classNameContentBlock = "",
  music,
}: GameLayoutProps) {
  return (
    <div
      className="relative flex h-[100dvh] min-h-0 w-full items-center justify-center overflow-hidden bg-black font-story text-gray-100"
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
        className={`z-10 w-full px-4 text-shadow-lg ${
          isPuzzle ? "max-w-[1120px] py-1" : "max-w-2xl py-8"
        } ${classNameContentBlock}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneKey}
            initial={{ opacity: 0, y: isPuzzle ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isPuzzle ? 0 : -20 }}
            transition={{ duration: isPuzzle ? 0.35 : 0.8 }}
            className={
              !isPuzzle
                ? "flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-12 shadow-2xl backdrop-blur-md"
                : "w-full"
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
