import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientParticles } from "@/components/layout/ambient-particles";

interface GameLayoutProps {
  backgroundImg?: string;
  children: ReactNode;
  sceneKey?: string;
  isPuzzle?: boolean;
  classNameContentBlock?: string;
}

export function GameLayout({
  backgroundImg,
  children,
  sceneKey,
  isPuzzle = false,
  classNameContentBlock = "",
}: GameLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [sceneKey]);

  return (
    <div
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black text-gray-100 font-story"
    >
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
        className={`z-10 w-full max-w-2xl px-6 py-8 text-shadow-lg ${classNameContentBlock}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col items-center rounded-2xl border border-white/10 bg-black/60 p-12 shadow-2xl backdrop-blur-md ${
              isPuzzle ? "px-2" : ""
            }`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-3">
        {/* <SoundToggleButton />
        <FullscreenButton /> */}
      </div>
    </div>
  );
}
