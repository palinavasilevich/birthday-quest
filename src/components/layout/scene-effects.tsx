import type { SpecialEffect } from "@/types/game";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface SceneEffectsProps {
  children: ReactNode;
  active: boolean;
  effects: SpecialEffect[];
  sceneId: string;
  effectDelay?: number;
  onComplete?: () => void;
}

export function SceneEffects({
  children,
  active,
  effects,
  sceneId,
  effectDelay = 5000,
  onComplete,
}: SceneEffectsProps) {
  const hasShake = effects.includes("shake");
  const hasFlash = effects.includes("flash");
  const hasSignal = effects.includes("signal");

  const controls = useAnimationControls();

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      controls.set({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      });

      return;
    }

    if (hasShake) {
      controls.start(
        {
          x: [0, -3, 4, -5, 6, -5, 4, -3, 0],
          y: [0, 2, -3, 4, -4, 3, -2, 1, 0],
          rotate: [0, -0.1, 0.15, -0.2, 0.2, -0.15, 0.1, 0],
          scale: [1, 1.002, 1.004, 1.006, 1.008, 1.005, 1.002, 1],
        },
        {
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
        },
      );
    }

    const timer = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, effectDelay);

    return () => {
      window.clearTimeout(timer);
      controls.stop();
    };
  }, [sceneId, active, hasShake, effectDelay, controls]);

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden">
      <motion.div
        className="relative h-full w-full min-h-0"
        animate={hasShake ? controls : undefined}
      >
        {children}
      </motion.div>
      {/* FLASH */}

      {active && hasFlash && (
        <motion.div
          key={`flash-${sceneId}`}
          className="pointer-events-none fixed inset-0 z-100 bg-white"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
      )}

      {/* SIGNAL RETURN */}

      {active && hasSignal && (
        <>
          {/* 1. Полный чёрный экран */}
          <motion.div
            key={`signal-dark-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-100 bg-white"
            initial={{ opacity: 1 }}
            animate={{
              opacity: [1, 1, 0.92, 0.7, 0.35, 0],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.25, 0.4, 0.6, 0.8, 1],
              ease: "linear",
            }}
          />

          {/* 2. Горизонтальные scanlines */}
          <motion.div
            key={`signal-scanlines-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-101"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0.5, 1, 0.25, 0],
            }}
            transition={{
              duration: 2.3,
              times: [0, 0.3, 0.45, 0.55, 0.75, 1],
              ease: "linear",
            }}
            style={{
              background: `
          repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(255,255,255,0.18) 3px,
            transparent 4px
          )
        `,
            }}
          />

          {/* 3. Первый резкий glitch */}
          <motion.div
            key={`signal-glitch-one-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-102"
            initial={{
              opacity: 0,
              x: 0,
              scaleX: 1,
            }}
            animate={{
              opacity: [0, 0, 1, 0, 0.8, 0],
              x: [0, 0, -18, 12, -7, 0],
              scaleX: [1, 1, 1.03, 0.97, 1.02, 1],
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.35, 0.42, 0.48, 0.55, 1],
              ease: "linear",
            }}
            style={{
              background: `
          linear-gradient(
            to bottom,
            transparent 0%,
            transparent 38%,
            rgba(217,155,34,0.25) 39%,
            rgba(217,155,34,0.08) 43%,
            transparent 44%,
            transparent 62%,
            rgba(255,255,255,0.18) 63%,
            transparent 66%,
            transparent 100%
          )
        `,
            }}
          />

          {/* 4. Разрыв изображения */}
          <motion.div
            key={`signal-glitch-two-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-103"
            initial={{
              opacity: 0,
              x: 0,
            }}
            animate={{
              opacity: [0, 0, 0, 1, 0, 0.7, 0],
              x: [0, 0, 0, 22, -16, 8, 0],
            }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              times: [0, 0.35, 0.45, 0.5, 0.55, 0.62, 1],
              ease: "linear",
            }}
            style={{
              background: `
          repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 7px,
            rgba(255,255,255,0.12) 8px,
            transparent 10px
          )
        `,
            }}
          />

          {/* 5. Янтарный импульс */}
          <motion.div
            key={`signal-pulse-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-104"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0.7, 0.15, 0],
            }}
            transition={{
              duration: 1.8,
              delay: 1.45,
              times: [0, 0.45, 0.52, 0.62, 1],
              ease: "linear",
            }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(217,155,34,0.18), transparent 55%)",
            }}
          />

          {/* 6. Финальный короткий flash */}
          <motion.div
            key={`signal-flash-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-105 bg-[#0e0d0d]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0, 0.35, 0],
            }}
            transition={{
              duration: 0.45,
              delay: 2.15,
              times: [0, 0.5, 0.7, 0.78, 1],
              ease: "linear",
            }}
          />
        </>
      )}
    </div>
  );
}
