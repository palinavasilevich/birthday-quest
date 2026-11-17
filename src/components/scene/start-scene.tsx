import { motion } from "framer-motion";
import { ActionButton } from "./action-button";

interface StartScreenProps {
  onStart: () => void;
  isLeaving?: boolean;
}

export function StartScreen({ onStart, isLeaving = false }: StartScreenProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center text-center">
      <motion.div
        className="absolute inset-0 bg-[url('/fx/fog.png')] bg-cover opacity-20"
        animate={{ opacity: [0.1, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isLeaving ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={
          isLeaving
            ? { duration: 0.5, ease: "easeIn" }
            : { duration: 1.2, ease: "easeOut" }
        }
      >
        <motion.h1
          className="mb-3 text-2xl leading-snug font-bold tracking-wide text-balance text-amber-100 drop-shadow-[0_0_18px_rgba(251,191,36,0.55)] [text-shadow:0_0_6px_rgba(255,214,140,0.6),0_2px_10px_rgba(0,0,0,0.8)] sm:text-[1.8rem]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
        >
          Опасное это дело — выходить за порог.
          <br />
          Ступишь на дорогу, и если дашь волю ногам, неизвестно, куда тебя
          занесёт.
        </motion.h1>

        <motion.p
          className="mb-8 text-sm italic tracking-wide text-amber-200/60 sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          — Бильбо Бэггинс
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            className="drop-shadow-[0_0_14px_rgba(251,191,36,0.5)] transition-[filter] duration-300 hover:drop-shadow-[0_0_24px_rgba(251,191,36,0.8)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.4 }}
          >
            <ActionButton text="В путь" onClick={onStart} variant="warm" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
