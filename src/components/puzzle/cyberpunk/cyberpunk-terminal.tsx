import { useEffect, useState } from "react";

export interface TerminalLine {
  text: string;
  type?: "default" | "success" | "warning" | "error" | "system";
  delay?: number;
}

interface TerminalAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface CyberpunkTerminalProps {
  title?: string;
  status?: string;
  date?: string;
  lines: TerminalLine[];
  action?: TerminalAction;
  bootDuration?: number;
}

export function CyberpunkTerminal({
  title = "LOCAL TERMINAL",
  status = "ONLINE",
  date = "21/11/2026",
  lines,
  action,
  bootDuration = 500,
}: CyberpunkTerminalProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  /*
   * ------------------------------------------------------------
   * BOOT / TEXT SEQUENCE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (lines.length === 0) {
      return;
    }

    const timers: number[] = [];

    lines.forEach((line, index) => {
      const delay = line.delay ?? bootDuration + index * 350;

      const timer = window.setTimeout(() => {
        setVisibleLines((current) => Math.max(current, index + 1));
      }, delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [lines, bootDuration]);

  /*
   * ------------------------------------------------------------
   * CURSOR
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShowCursor((current) => !current);
    }, 650);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const isFinished = visibleLines >= lines.length;

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-3xl
        overflow-hidden
        border
        border-[#d99b22]/35
        bg-[#030504]
        font-mono
        text-[#d8d2b0]
        shadow-[0_0_45px_rgba(0,0,0,0.65)]
      "
    >
      {/* ======================================================
          TOP FRAME
          ====================================================== */}

      <div
        className="
          relative
          flex
          items-center
          justify-between
          border-b
          border-[#d99b22]/30
          bg-[#090b09]
          px-5
          py-3
        "
      >
        {/* decorative circuit lines */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-px
         bg-linear-to-r
            from-transparent
            via-[#d99b22]/60
            to-transparent
          "
        />

        <div>
          <div
            className="
              text-[11px]
              font-semibold
              tracking-[0.2em]
              text-[#e4a72c]
            "
          >
            {title}
          </div>

          <div
            className="
              mt-1
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-[#65705f]
            "
          >
            {status}
          </div>
        </div>

        <div className="text-right">
          <div
            className="
              text-[8px]
              tracking-[0.15em]
              text-[#56605a]
            "
          >
            LOCAL SYSTEM
          </div>

          <div
            className="
              mt-1
              text-[10px]
              tracking-[0.12em]
              text-[#d99b22]/80
            "
          >
            {date}
          </div>
        </div>
      </div>

      {/* ======================================================
          SCREEN
          ====================================================== */}

      <div
        className="
          relative
          min-h-90
          overflow-hidden
          px-6
          py-7
          sm:min-h-100
          sm:px-8
          sm:py-8
        "
      >
        {/* CRT / scanlines */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.06]
            [background:repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(255,255,255,0.25)_4px)]
          "
        />

        {/* subtle grid */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.08]
            [background-image:radial-gradient(circle,#d99b22_0.7px,transparent_0.7px)]
            [background-size:18px_18px]
          "
        />

        {/* vignette */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]
          "
        />

        {/* terminal content */}

        <div className="relative z-10">
          <div
            className="
              mb-6
              flex
              items-center
              gap-2
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-[#5f6961]
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#d99b22]
                shadow-[0_0_8px_rgba(217,155,34,0.7)]
              "
            />
            SYSTEM CONSOLE
          </div>

          <div
            className="
              space-y-2
              text-[11px]
              leading-relaxed
              sm:text-xs
            "
          >
            {lines.slice(0, visibleLines).map((line, index) => {
              const typeClass = {
                default: "text-[#aeb5a4]",
                success:
                  "text-[#78c98c] drop-shadow-[0_0_5px_rgba(120,201,140,0.25)]",
                warning: "text-[#d99b22]",
                error: "text-[#d85c4c]",
                system: "text-[#55bfc3]",
              }[line.type ?? "default"];

              return (
                <div
                  key={`${line.text}-${index}`}
                  className={`${typeClass} animate-[terminalLine_180ms_ease-out]`}
                >
                  {line.text}
                </div>
              );
            })}

            {/* cursor */}

            <div className="mt-3">
              <span
                className={`
                  inline-block
                  text-[#d99b22]
                  ${showCursor ? "opacity-100" : "opacity-0"}
                `}
              >
                _
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          SYSTEM LOG
          ====================================================== */}

      <div
        className="
          border-t
          border-[#d99b22]/15
          bg-black/30
          px-5
          py-2.5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            text-[7px]
            uppercase
            tracking-[0.16em]
          "
        >
          <span className="text-[#465149]">SYSTEM LOG</span>

          <span className={isFinished ? "text-[#78c98c]" : "text-[#d99b22]/60"}>
            {isFinished ? "READY" : "PROCESSING"}
          </span>
        </div>
      </div>

      {/* ======================================================
          ACTION
          ====================================================== */}

      {action && isFinished && (
        <div
          className="
            border-t
            border-[#d99b22]/15
            p-4
          "
        >
          <button
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className="
              w-full
              border
              border-[#d99b22]/40
              bg-[#d99b22]/5
              px-5
              py-3
              font-mono
              text-[10px]
              uppercase
              tracking-[0.22em]
              text-[#d99b22]
              transition-all
              duration-200
              hover:border-[#d99b22]
              hover:bg-[#d99b22]/10
              hover:shadow-[0_0_20px_rgba(217,155,34,0.12)]
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            &gt; {action.label}
          </button>
        </div>
      )}

      {/* ======================================================
          LOCAL CSS
          ====================================================== */}

      <style>{`
        @keyframes terminalLine {
          from {
            opacity: 0;
            transform: translateY(3px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
