import type { ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { AmbientParticles } from "@/components/layout/ambient-particles";
import { FullscreenButton } from "@/components/layout/fullscreen-button";
import { SoundToggleButton } from "@/components/layout/sound-toggle-button";
import { SceneEffects } from "@/components/layout/scene-effects";

import type { SpecialEffect } from "@/types/game";

interface GameLayoutProps {
  backgroundImg?: string;
  children: ReactNode;
  sceneKey?: string;
  isPuzzle?: boolean;
  classNameContentBlock?: string;
  showBackgroundOnly?: boolean;
  specialEffects?: SpecialEffect[];
  effectDelay?: number;
  onEffectComplete?: () => void;
}

export function GameLayout({
  backgroundImg,
  children,
  sceneKey,
  isPuzzle = false,
  classNameContentBlock = "",
  showBackgroundOnly = false,
  specialEffects = [],
  effectDelay,
  onEffectComplete,
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
        font-medium
        text-gray-100
      "
    >
      {backgroundImg && (
        <SceneEffects
          active={specialEffects.length > 0}
          effects={specialEffects}
          sceneId={sceneKey ?? backgroundImg}
          effectDelay={effectDelay}
          onComplete={onEffectComplete}
          containerClassName="absolute inset-0 overflow-hidden"
        >
          <motion.img
            key={backgroundImg}
            src={backgroundImg}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </SceneEffects>
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
                  ? "flex max-h-[calc(100dvh-2rem)] flex-col items-center overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-md sm:p-10"
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
