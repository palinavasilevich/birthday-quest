import { motion } from "framer-motion";

export function EndingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-end overflow-hidden pb-8">
      <motion.svg
        viewBox="0 0 760 180"
        className="w-[65vw] max-w-[620px] drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
        initial={{ x: "110vw", opacity: 0 }}
        animate={{
          x: ["110vw", "-2vw", "0vw"],
          opacity: [0, 1, 1],
        }}
        transition={{
          x: {
            duration: 1.5,
            times: [0, 0.82, 1],
            ease: ["easeOut", "easeInOut"],
          },
          opacity: {
            duration: 0.35,
            ease: "easeOut",
          },
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arrow body */}
        <g
          fill="#111111"
          stroke="#f5f2ed"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M590 52 L155 52 L155 15 L65 90 L155 165 L155 128 L590 128 Z" />

          {/* JoJo-style symbols on the right */}
          <path d="M606 52 L641 52 L641 128 L606 128 Z" />
          <path d="M650 52 L685 128 L685 52 Z" />
          <path d="M695 52 L733 52 L714 128 L695 128 Z" />
        </g>

        {/* Lettering */}
        <text
          x="375"
          y="103"
          fill="#f5f2ed"
          fontSize="38"
          fontFamily="Comic Sans MS, cursive"
          textAnchor="middle"
          letterSpacing="1"
        >
          To Be Continued
        </text>
      </motion.svg>
    </div>
  );
}
