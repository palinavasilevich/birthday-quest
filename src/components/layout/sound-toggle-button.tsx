import { Volume2, VolumeX } from "lucide-react";

import { useGameStore } from "@/store/game-store";

export function SoundToggleButton() {
  const isSoundEnabled = useGameStore((state) => state.isSoundEnabled);

  const toggleSound = useGameStore((state) => state.toggleSound);

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="
        cursor-pointer rounded-full
        border border-white/20
        bg-black/50 p-3
        transition
        hover:bg-black/70
      "
      title={isSoundEnabled ? "Mute" : "Unmute"}
      aria-label={isSoundEnabled ? "Mute sound" : "Unmute sound"}
    >
      {isSoundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
    </button>
  );
}
