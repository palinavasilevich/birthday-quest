import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface SceneEffectsProps {
  children: ReactNode;
  active: boolean;
  effects: ("fade" | "shake" | "flash")[];
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
  const controls = useAnimationControls();

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active || !hasShake) {
      controls.set({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      });

      return;
    }

    // Бесконечный shake
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

    const timer = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, effectDelay);

    return () => {
      window.clearTimeout(timer);
      controls.stop();
    };
  }, [sceneId, active, hasShake, effectDelay, controls]);

  return (
    <motion.div className="relative h-full w-full" animate={controls}>
      {children}
    </motion.div>
  );
}
