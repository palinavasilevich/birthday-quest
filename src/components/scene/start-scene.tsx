import { motion } from "framer-motion";
import { ActionButton } from "./action-button";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className="text-2xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-8 tracking-wide max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
        >
          A journey through shadows, secrets and forgotten dreams.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.4 }}
          >
            <ActionButton text="Start" onClick={onStart} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
