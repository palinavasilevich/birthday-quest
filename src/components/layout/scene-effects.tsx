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
  effectDelay = 0,
  onComplete,
}: SceneEffectsProps) {
  const hasShake = effects.includes("shake");
  const hasFlash = effects.includes("flash");
  const hasSignal = effects.includes("signal");
  const hasFade = effects.includes("fade");
  const hasFadeIn = effects.includes("fade-in");

  /*
   * "warp" / "warp-in" — a softer, color-tinted cousin of "signal":
   * the world blurs/dissolves rather than cutting to a flat black
   * screen, for transitions between the game's two realities (forest
   * ↔ city) rather than a generic scene cut.
   *
   * ⚠️ Needs adding to the SpecialEffect union in @/types/game.
   */
  const hasWarp = effects.includes("warp" as SpecialEffect);
  const hasWarpIn = effects.includes("warp-in" as SpecialEffect);

  /*
   * New:
   *  - "glow"   — a warm amber pulse radiating from the center,
   *               for moments where something magical lights up
   *               (e.g. the runes activating).
   *  - "static" — a short, green-tinted flicker/glitch burst —
   *               lighter and shorter than "signal", for a screen
   *               waking up rather than a full scene transition.
   *
   * ⚠️ These need to be added to the SpecialEffect union in
   * @/types/game for TypeScript to accept them in scene data.
   */
  const hasGlow = effects.includes("glow" as SpecialEffect);
  const hasStatic = effects.includes("static" as SpecialEffect);

  const controls = useAnimationControls();

  const onCompleteRef = useRef(onComplete);

  const delaySeconds = effectDelay / 1000;

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
      const timeoutId = window.setTimeout(() => {
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
      }, effectDelay);

      return () => window.clearTimeout(timeoutId);
    }
  }, [sceneId, active, hasShake, effectDelay, controls]);

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden">
      <motion.div
        className="relative h-full w-full min-h-0"
        animate={
          hasShake
            ? controls
            : hasWarp
              ? { filter: ["blur(0px)", "blur(14px)"], scale: [1, 1.06] }
              : hasWarpIn
                ? { filter: ["blur(14px)", "blur(0px)"], scale: [1.06, 1] }
                : undefined
        }
        transition={
          hasWarp || hasWarpIn
            ? { delay: delaySeconds, duration: 2.5, ease: "easeInOut" }
            : undefined
        }
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
            delay: delaySeconds,
            duration: 0.5,
            ease: "easeOut",
          }}
          onAnimationComplete={() => {
            onCompleteRef.current?.();
          }}
        />
      )}

      {/* GLOW — warm pulse for magical activation moments */}

      {active && hasGlow && (
        <motion.div
          key={`glow-${sceneId}`}
          className="pointer-events-none absolute inset-0 z-100"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.85, 0.4, 1, 0],
          }}
          transition={{
            delay: delaySeconds,
            duration: 1.8,
            times: [0, 0.3, 0.5, 0.7, 1],
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,201,92,0.55), rgba(217,155,34,0.18) 45%, transparent 75%)",
          }}
          onAnimationComplete={() => {
            onCompleteRef.current?.();
          }}
        />
      )}

      {/* STATIC — short green flicker for a screen waking up */}

      {active && hasStatic && (
        <>
          <motion.div
            key={`static-noise-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-100"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0.3, 0.9, 0.15, 0.6, 0],
            }}
            transition={{
              delay: delaySeconds,
              duration: 1.1,
              times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1],
              ease: "linear",
            }}
            style={{
              background: `
          repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(120,255,170,0.16) 3px,
            transparent 4px
          )
        `,
            }}
          />

          <motion.div
            key={`static-tint-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-101 bg-[#3dffa0]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.22, 0, 0.15, 0],
            }}
            transition={{
              delay: delaySeconds,
              duration: 1.1,
              times: [0, 0.2, 0.4, 0.6, 1],
              ease: "linear",
            }}
            onAnimationComplete={() => {
              onCompleteRef.current?.();
            }}
          />
        </>
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
              delay: delaySeconds,
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
              delay: delaySeconds,
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
              delay: delaySeconds,
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
              delay: delaySeconds + 0.8,
              duration: 1.2,
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

          {/* 5. Янтарный импульс — последний по времени завершения слой,
               поэтому именно он сигнализирует о полном завершении эффекта. */}
          <motion.div
            key={`signal-pulse-${sceneId}`}
            className="pointer-events-none absolute inset-0 z-104"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0.7, 0.15, 0],
            }}
            transition={{
              delay: delaySeconds + 1.45,
              duration: 1.8,
              times: [0, 0.45, 0.52, 0.62, 1],
              ease: "linear",
            }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(217,155,34,0.18), transparent 55%)",
            }}
            onAnimationComplete={() => {
              onCompleteRef.current?.();
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
              delay: delaySeconds + 2.15,
              duration: 0.45,
              times: [0, 0.5, 0.7, 0.78, 1],
              ease: "linear",
            }}
          />
        </>
      )}

      {/* WARP — reality dissolving into distortion, replaces a flat fade-to-black */}

      {active && hasWarp && (
        <motion.div
          key={`warp-${sceneId}`}
          className="pointer-events-none absolute inset-0 z-[110]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delaySeconds,
            duration: 2.5,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(30,20,10,0.4), rgba(5,5,5,0.97) 80%)",
          }}
          onAnimationComplete={() => {
            onCompleteRef.current?.();
          }}
        />
      )}

      {/* WARP IN — the reverse: distortion resolving back into clarity */}

      {active && hasWarpIn && (
        <motion.div
          key={`warp-in-${sceneId}`}
          className="pointer-events-none absolute inset-0 z-[110]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            delay: delaySeconds,
            duration: 2.5,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(30,20,10,0.4), rgba(5,5,5,0.97) 80%)",
          }}
          onAnimationComplete={() => {
            onCompleteRef.current?.();
          }}
        />
      )}

      {/* FADE */}
      {active && hasFade && (
        <motion.div
          key={`fade-${sceneId}`}
          className="pointer-events-none absolute inset-0 z-[110] bg-[#050505]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delaySeconds,
            duration: 2.5,
            ease: "easeInOut",
          }}
          onAnimationComplete={() => {
            onCompleteRef.current?.();
          }}
        />
      )}
      {/* FADE IN */}
      {active && hasFadeIn && (
        <motion.div
          key={`fade-in-${sceneId}`}
          className="pointer-events-none absolute inset-0 z-[110] bg-[#050505]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            delay: delaySeconds,
            duration: 2.2,
            ease: "easeInOut",
          }}
          onAnimationComplete={() => {
            onCompleteRef.current?.();
          }}
        />
      )}
    </div>
  );
}
