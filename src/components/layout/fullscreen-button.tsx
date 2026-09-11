import { useCallback, useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      className="
        cursor-pointer
        rounded-full
        border border-white/20
        bg-black/50
        p-3
        transition
        hover:bg-black/70
      "
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );
}
