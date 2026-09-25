import { useEffect, useState } from "react";

import {
  CyberpunkAction,
  CyberpunkConsoleLabel,
  CyberpunkFrame,
  CyberpunkSystemLog,
} from "./cyberpunk-frame";

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
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [lines, bootDuration]);

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
    <CyberpunkFrame
      title={title}
      status={status}
      date={date}
      footer={
        <>
          <CyberpunkSystemLog ready={isFinished} />

          {action && isFinished && (
            <div className="border-t border-[#d99b22]/15 p-4">
              <CyberpunkAction
                label={action.label}
                onClick={action.onClick}
                disabled={action.disabled}
              />
            </div>
          )}
        </>
      }
    >
      <CyberpunkConsoleLabel />

      <div className="space-y-2 text-[11px] leading-relaxed sm:text-xs">
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

        <div className="mt-3">
          <span
            className={`inline-block text-[#d99b22] ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
          >
            _
          </span>
        </div>
      </div>

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
    </CyberpunkFrame>
  );
}
