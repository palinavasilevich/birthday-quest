import { useEffect, useRef, useState } from "react";

import { useGameStore } from "@/store/game-store";

import { CppCodeBlock } from "./cyberpunk-code-block";

interface CyberpunkPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

type ModuleId = "operator" | "unsigned" | "preprocessor";

interface Module {
  id: ModuleId;
  title: string;
  description: string;
}

const MODULES: Module[] = [
  {
    id: "operator",
    title: "OPERATOR ANOMALY",
    description: "What will the loop output?",
  },
  {
    id: "unsigned",
    title: "UNSIGNED WRAPAROUND",
    description: "What will the program output on a standard 32-bit platform?",
  },
  {
    id: "preprocessor",
    title: "PREPROCESSOR CORRUPTION",
    description: "What happens when the system executes this code?",
  },
];

const ANSWERS: Record<ModuleId, string> = {
  operator: "sequence",
  unsigned: "4294967271",
  preprocessor: "nothing",
};

// The backslash must remain the final character before the newline.

const PREPROCESSOR_CODE = [
  "#include <iostream>",
  "",
  "#define SYSTEM_FAILURE \\",
  '    std::cout << "ACCESS GRANTED!";',
  "",
  "int main() {",
  "    return 0;",
  "}",
].join("\n");

let terminalAudioContext: AudioContext | null = null;

function getTerminalAudioContext(): AudioContext | null {
  if (terminalAudioContext) {
    return terminalAudioContext;
  }

  const Ctor =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof window.AudioContext;
      }
    ).webkitAudioContext;

  if (!Ctor) {
    return null;
  }

  terminalAudioContext = new Ctor();

  return terminalAudioContext;
}

function playTerminalTone(
  frequency: number,
  duration = 0.08,
  type: OscillatorType = "square",
  gain = 0.05,
): void {
  const context = getTerminalAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume();
  }

  const now = context.currentTime;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);

  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);

  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
}

function playSelectTone(): void {
  playTerminalTone(720, 0.045, "square", 0.035);
}

function playMismatchTone(): void {
  playTerminalTone(160, 0.2, "sawtooth", 0.06);
}

function playModuleOnlineTone(): void {
  playTerminalTone(660, 0.08, "square", 0.05);
  window.setTimeout(() => playTerminalTone(880, 0.14, "square", 0.05), 90);
}

function playAccessGrantedTone(): void {
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    window.setTimeout(
      () => playTerminalTone(frequency, 0.24, "square", 0.05),
      index * 110,
    );
  });
}

/*
 * ------------------------------------------------------------
 * Log formatting
 * ------------------------------------------------------------
 */

function logStatusLine(label: string, status: string, width = 14): string {
  const dots = ".".repeat(Math.max(3, width - label.length));

  return `> ${label} ${dots} ${status}`;
}

interface OptionsProps {
  values: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  labels?: Record<string, string>;
}

function Options({ values, selected, onSelect, labels }: OptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {values.map((value) => {
        const isSelected = selected === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={[
              "flex min-h-8 items-center gap-3 sm:min-h-9",
              "border px-3 py-1 sm:py-1.5",
              "font-mono text-left text-[12px] sm:text-[13px]",
              "transition-all duration-150 cursor-pointer",
              isSelected
                ? [
                    "border-[#35d6e8]",
                    "bg-[#35d6e8]/10",
                    "text-[#9be8b4]",
                    "shadow-[inset_0_0_18px_rgba(217,155,34,0.04)]",
                  ].join(" ")
                : [
                    "border-[#1d3a2e]",
                    "bg-black/25",
                    "text-[#9be8b4]",
                    "hover:border-[#35d6e8]/50",
                    "hover:bg-[#35d6e8]/5",
                    "hover:text-[#c6f4d3]",
                  ].join(" "),
            ].join(" ")}
          >
            <span className={isSelected ? "text-[#35d6e8]" : "text-[#4e7a65]"}>
              {isSelected ? ">" : "_"}
            </span>

            <span>{labels?.[value] ?? value}</span>
          </button>
        );
      })}
    </div>
  );
}

function ExecuteButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="w-full border border-[#35d6e8]/40 bg-[#35d6e8]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#35d6e8] transition-all duration-200 hover:border-[#35d6e8] hover:bg-[#35d6e8]/10 hover:shadow-[0_0_20px_rgba(217,155,34,0.12)] disabled:cursor-not-allowed disabled:opacity-30 sm:px-5 sm:py-2.5 cursor-pointer"
      >
        &gt; EXECUTE
      </button>
    </div>
  );
}

function ModuleStatus({
  module,
  index,
  currentIndex,
  solved,
}: {
  module: Module;
  index: number;
  currentIndex: number;
  solved: boolean;
}) {
  const isComplete = index < currentIndex || solved;
  const isActive = index === currentIndex && !solved;

  return (
    <div
      className={[
        "flex items-center justify-center gap-2",
        "font-mono text-[10px] uppercase tracking-[0.08em]",
        isComplete
          ? "text-[#78c98c]"
          : isActive
            ? "text-[#35d6e8]"
            : "text-[#4c534b]",
      ].join(" ")}
    >
      <span className="text-[9px]">
        {isComplete ? "●" : isActive ? "◆" : "○"}
      </span>

      <span>{module.id.toUpperCase()}</span>
    </div>
  );
}

function SystemLog({ lines, solved }: { lines: string[]; solved: boolean }) {
  /*
   * Lines print one at a time rather than all appearing instantly —
   * more of a "terminal actually working" feel, especially noticeable
   * on the multi-line success block at the end.
   */
  const [visibleCount, setVisibleCount] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((count) => (count < lines.length ? count + 1 : count));
    }, 55);

    return () => window.clearInterval(interval);
  }, [lines.length]);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [visibleCount]);

  const visibleLines = lines.slice(0, visibleCount);
  const isPrinting = visibleCount < lines.length;

  return (
    <div className="mt-2 border-t border-[#35d6e8]/15 bg-black/30 px-2 py-1.5 sm:mt-2 sm:px-3 sm:py-1.5">
      <div className="mb-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em]">
        <span className="text-[#4e7a65]">SYSTEM LOG</span>

        <span className={solved ? "text-[#78c98c]" : "text-[#35d6e8]/60"}>
          {solved ? "READY" : "PROCESSING"}
        </span>
      </div>

      <div
        ref={containerRef}
        className="cyberpunk-scroll max-h-20 overflow-y-auto font-mono text-[9px] leading-[1.35] sm:max-h-22"
      >
        {visibleLines.map((line, index) => {
          const isError = line.includes("MISMATCH") || line.includes("FAILED");

          const isSuccess =
            line.includes("OK") ||
            line.includes("ONLINE") ||
            line.includes("GRANTED");

          const isSystem = line.includes("SYSTEM") || line.includes("WORKSHOP");

          return (
            <p
              key={`${line}-${index}`}
              className={
                isError
                  ? "text-[#d85c4c]"
                  : isSuccess
                    ? "text-[#78c98c]"
                    : isSystem
                      ? "text-[#35d6e8]"
                      : "text-[#4e7a65]"
              }
            >
              {line}
            </p>
          );
        })}

        {(!solved || isPrinting) && (
          <span className="text-[#35d6e8] animate-[terminalCursor_650ms_steps(1)_infinite]">
            _
          </span>
        )}
      </div>
    </div>
  );
}

/*
 * Brief scrambled boot readout before the first module appears —
 * echoes the scene text ("экран вспыхивает... несколько секунд —
 * только помехи") rather than jumping straight to MODULE 01.
 */
function BootSequence() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const scripted = [
      "> ...",
      "> RE-INITIALIZING CONTROL SYSTEM",
      "> LOADING RECOVERY PROTOCOL",
    ];

    const timeoutIds = scripted.map((line, index) =>
      window.setTimeout(() => {
        setLines((current) => [...current, line]);
      }, index * 260),
    );

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section className="flex min-h-48 flex-col items-center justify-center border border-[#35d6e8]/20 bg-black/20 px-4 py-5 text-center sm:min-h-72 sm:px-5 sm:py-8">
      <div className="w-full max-w-sm space-y-2 text-left font-mono text-[9px] text-[#78c98c]">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <span className="text-[#35d6e8] animate-[terminalCursor_650ms_steps(1)_infinite]">
          _
        </span>
      </div>
    </section>
  );
}

const BOOT_DURATION = 1100;

export function CyberpunkPuzzle({ puzzleId, nextScene }: CyberpunkPuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [isBooting, setIsBooting] = useState(true);

  const [moduleIndex, setModuleIndex] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);

  const [solved, setSolved] = useState(false);

  const [isMismatch, setIsMismatch] = useState(false);

  const [log, setLog] = useState<string[]>([
    "> WORKSHOP CONTROL SYSTEM",
    "> CONTROL MODULE: OFFLINE",
    "> SYSTEM STATUS: CRITICAL",
    "> 3 MODULES REQUIRED",
    "> AWAITING INPUT...",
  ]);

  const currentModule = MODULES[moduleIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBooting(false);
    }, BOOT_DURATION);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!solved) {
      return;
    }

    const timer = window.setTimeout(() => {
      setScene(nextScene);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [solved, nextScene, setScene]);

  function pushLog(...lines: string[]) {
    setLog((previous) => [...previous, ...lines]);
  }

  function handleSelectOption(value: string) {
    playSelectTone();
    setSelected(value);
  }

  function checkAnswer() {
    if (!selected) {
      return;
    }

    pushLog(`> INPUT: ${selected}`);

    if (selected !== ANSWERS[currentModule.id]) {
      playMismatchTone();

      pushLog("> MISMATCH", "> RECOVERY ATTEMPT FAILED", "> ROLLBACK...");

      setSelected(null);

      setIsMismatch(true);

      window.setTimeout(() => setIsMismatch(false), 400);

      return;
    }

    pushLog(
      `> ${currentModule.title} ............ OK`,
      `> ${currentModule.title} ............ RESTORED`,
    );

    if (moduleIndex === MODULES.length - 1) {
      playAccessGrantedTone();

      pushLog(
        `> MODULE 0${moduleIndex + 1} ............... ONLINE`,
        ">",
        ...MODULES.map((module) => logStatusLine(module.title, "OK")),
        ">",
        "> SYSTEM RESTORED",
        logStatusLine("CONTROL SYSTEM", "ONLINE", 18),
        logStatusLine("WORKSHOP ACCESS", "GRANTED", 18),
        logStatusLine("DOOR CONTROL", "ONLINE", 18),
        ">",
        "> WELCOME BACK.",
      );

      completePuzzle(puzzleId);

      setSolved(true);

      return;
    }

    playModuleOnlineTone();

    setModuleIndex((index) => index + 1);
    setSelected(null);
  }

  return (
    <div
      className={[
        "cyberpunk-scroll relative mx-auto w-full max-w-3xl overflow-x-hidden overflow-y-auto",
        "max-h-[calc(100dvh-24px)] border border-[#1d3a2e]",
        "bg-[#070f0c] font-mono text-[#9be8b4] shadow-[0_0_32px_rgba(0,0,0,0.5)]",
        "p-2 sm:p-3",
        isBooting ? "animate-[screenGlitch_220ms_steps(2)_4]" : "",
        isMismatch ? "animate-[mismatchShake_400ms_ease-in-out]" : "",
        solved ? "animate-[systemRestored_700ms_ease-out]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background:repeating-linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(255,255,255,0.25)_4px)]" />
      <div className="relative z-10">
        {solved && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-50 animate-[successFlash_700ms_ease-out_forwards]"
          />
        )}
        {/* Compact terminal header replaces the nested CyberpunkFrame header. */}
        <div className="mb-2 flex items-center justify-between gap-3 border-b border-[#1d3a2e] pb-2">
          <div>
            <div className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#5cf2a0]">
              WORKSHOP CONTROL SYSTEM
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#4e7a65]">
              Recovery interface · BDA249
            </div>
          </div>
          <div className="shrink-0 text-right font-mono text-[9px] tracking-[0.12em] text-[#35d6e8]">
            {solved ? "ONLINE" : `MODULE 0${moduleIndex + 1}/03`}
          </div>
        </div>

        {isBooting ? (
          <BootSequence />
        ) : (
          <>
            {/* SYSTEM INTRO */}

            {!solved && (
              <div className="mb-1 border-l border-[#35d6e8]/40 pl-3 font-mono text-[11px] leading-[1.35] sm:mb-1.5">
                <div className="text-[#35d6e8]">
                  &gt; SYSTEM REPAIR PROTOCOL
                </div>

                <div className="text-[#4e7a65]">
                  &gt; MANUAL RECOVERY REQUIRED
                </div>

                <div className="text-[#4e7a65]">&gt; 3 MODULES OFFLINE</div>
              </div>
            )}

            {/* MODULE STATUS */}

            <div className="mb-1.5 grid grid-cols-3 border-y border-[#35d6e8]/15">
              {MODULES.map((module, index) => (
                <div
                  key={module.id}
                  className={[
                    "flex items-center justify-center",
                    "border-r border-[#35d6e8]/10",
                    "px-1.5 py-1.5 last:border-r-0",
                  ].join(" ")}
                >
                  <ModuleStatus
                    module={module}
                    index={index}
                    currentIndex={moduleIndex}
                    solved={solved}
                  />
                </div>
              ))}
            </div>

            {!solved ? (
              <section
                className={["border border-[#35d6e8]/20 bg-black/20"]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* MODULE HEADER */}

                <div
                  className={[
                    "flex items-center justify-between border-b px-3 py-1 sm:px-3 sm:py-1.5",
                    isMismatch
                      ? "border-[#d85c4c]/40 bg-[#d85c4c]/5"
                      : "border-[#35d6e8]/15",
                  ].join(" ")}
                >
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[#35d6e8]">
                    MODULE 0{moduleIndex + 1}
                  </span>

                  <span
                    className={[
                      "font-mono text-[10px] tracking-[0.1em]",
                      isMismatch ? "text-[#d85c4c]" : "text-[#4e7a65]",
                    ].join(" ")}
                  >
                    {isMismatch ? "MISMATCH" : "OFFLINE"}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3">
                  <h2 className="font-mono text-lg font-semibold tracking-[0.04em] text-[#c6f4d3]">
                    {currentModule.title}
                  </h2>

                  <p className="mt-1 font-mono text-[11px] leading-snug text-[#8bb99b]">
                    {currentModule.description}
                  </p>

                  {/* syntax */}

                  {currentModule.id === "operator" && (
                    <div className="mt-1.5">
                      <CppCodeBlock
                        code={`#include <stdio.h>

int main(void) {
    int x = 10;
    while (x --> 0) {
        printf("%d ", x);
    }
    return 0;
}`}
                      />
                      {/* <div className="mt-1.5 border border-[#35d6e8]/10 bg-black/25 p-2 font-mono text-[10px] leading-snug text-[#8bb99b]">
                        <div className="text-[#4e7a65]">
                          &gt; WHAT DOES THE COMPILER SEE?
                        </div>
                        <div className="mt-1 text-[12px] text-[#c6f4d3]">
                          x-- &gt; 0
                        </div>
                      </div> */}
                      <div className="mb-1 mt-2 font-mono text-[10px] tracking-[0.06em] text-[#8bb99b]">
                        &gt; SELECT OUTPUT
                      </div>
                      <Options
                        values={[
                          "sequence",
                          "starts-at-10",
                          "stops-at-1",
                          "ERROR",
                        ]}
                        labels={{
                          sequence: "9 8 7 6 5 4 3 2 1 0",
                          "starts-at-10": "10 9 8 7 6 5 4 3 2 1",
                          "stops-at-1": "9 8 7 6 5 4 3 2 1",
                          ERROR: "Ошибка компиляции",
                        }}
                        selected={selected}
                        onSelect={handleSelectOption}
                      />
                      <ExecuteButton
                        disabled={!selected}
                        onClick={checkAnswer}
                      />
                    </div>
                  )}

                  {currentModule.id === "unsigned" && (
                    <div className="mt-1.5">
                      <CppCodeBlock
                        code={`#include <iostream>

int main() {
    std::cout << 25u - 50;
    return 0;
}`}
                      />
                      {/* <div className="mt-1.5 border border-[#35d6e8]/10 bg-black/25 p-2 font-mono text-[10px] leading-snug text-[#8bb99b]">
                        <div className="text-[#4e7a65]">
                          &gt; UNSIGNED ARITHMETIC
                        </div>
                        <div className="mt-1 flex items-center justify-center gap-2 text-[12px] text-[#c6f4d3]">
                          <span>25u</span>
                          <span className="text-[#35d6e8]">−</span>
                          <span>50</span>
                        </div>
                      </div> */}
                      <div className="mb-1 mt-2 font-mono text-[10px] tracking-[0.06em] text-[#8bb99b]">
                        &gt; SELECT OUTPUT
                      </div>
                      <Options
                        values={["-25", "25", "4294967271", "ERROR"]}
                        labels={{ ERROR: "Ошибка компиляции" }}
                        selected={selected}
                        onSelect={handleSelectOption}
                      />
                      <ExecuteButton
                        disabled={!selected}
                        onClick={checkAnswer}
                      />
                    </div>
                  )}

                  {currentModule.id === "preprocessor" && (
                    <div className="mt-1.5">
                      <CppCodeBlock code={PREPROCESSOR_CODE} />
                      {/* <p className="mt-1.5 border border-[#35d6e8]/10 bg-black/25 p-2 font-mono text-[10px] leading-snug text-[#8bb99b]">
                        Что произойдёт при запуске программы?
                      </p> */}
                      <div className="mb-1 mt-2 font-mono text-[10px] tracking-[0.06em] text-[#8bb99b]">
                        &gt; SELECT RESULT
                      </div>
                      <Options
                        values={["access", "failure", "nothing", "ERROR"]}
                        labels={{
                          access: `"ACCESS GRANTED!" is displayed`,
                          failure: `"SYSTEM FAILURE" is displayed`,
                          nothing: "The terminal remains silent",
                          ERROR: "Compilation error",
                        }}
                        selected={selected}
                        onSelect={handleSelectOption}
                      />
                      <ExecuteButton
                        disabled={!selected}
                        onClick={checkAnswer}
                      />
                    </div>
                  )}
                </div>
              </section>
            ) : (
              /* SUCCESS */

              <section className="flex min-h-48 flex-col items-center justify-center border border-[#35d6e8]/20 bg-black/20 px-4 py-5 text-center sm:min-h-72 sm:px-5 sm:py-8">
                <div className="font-mono text-[8px] tracking-[0.15em] text-[#35d6e8]">
                  &gt; SYSTEM RESTORED
                </div>

                <div className="mt-2 font-mono text-lg font-semibold tracking-[0.06em] text-[#78c98c] drop-shadow-[0_0_14px_rgba(120,201,140,0.25)] sm:text-xl">
                  CONTROL SYSTEM ONLINE
                </div>

                <div className="mt-2 flex flex-col gap-1 text-left font-mono text-[10px] text-[#8bb99b]">
                  <span>MEMORY .............. OK</span>

                  <span>LOGIC ............... OK</span>

                  <span>OUTPUT .............. OK</span>

                  <span className="text-[#35d6e8]">
                    DOOR CONTROL ........ ONLINE
                  </span>
                </div>

                <div className="mt-3 font-mono text-[12px] tracking-[0.1em] text-[#78c98c] animate-[accessPulse_1.5s_ease-in-out_infinite]">
                  ACCESS GRANTED
                </div>

                <div className="mt-1 font-mono text-[9px] tracking-[0.08em] text-[#6f927d]">
                  WELCOME BACK.
                </div>
              </section>
            )}

            {/* SYSTEM LOG */}

            <SystemLog lines={log} solved={solved} />
          </>
        )}

        <style>{`
        .mi01-green-frame {
          padding: 0.75rem !important;
          border-color: #1d3a2e !important;
          background: radial-gradient(circle at 50% 0%, #10251b 0%, #070f0c 55%) !important;
          color: #9be8b4 !important;
          box-shadow: 0 20px 70px rgba(0, 0, 0, .45) !important;
        }

        @media (max-height: 800px) {
          .mi01-green-frame { padding: 0.6rem !important; }
        }
        .mi01-green-frame button:focus-visible {
          outline: 1px solid #35d6e8;
          outline-offset: 2px;
        }

        /* Cyberpunk scrollbar */
        .cyberpunk-scroll {
          scrollbar-width: thin;
          scrollbar-color: #35d6e8 #07110c;
          scrollbar-gutter: stable;
        }
        .cyberpunk-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .cyberpunk-scroll::-webkit-scrollbar-track {
          background: #07110c;
          border-left: 1px solid rgba(53, 214, 232, 0.12);
        }
        .cyberpunk-scroll::-webkit-scrollbar-thumb {
          background: #1d6b60;
          border: 1px solid #35d6e8;
          border-radius: 0;
        }
        .cyberpunk-scroll::-webkit-scrollbar-thumb:hover {
          background: #35d6e8;
          box-shadow: 0 0 8px rgba(53, 214, 232, 0.45);
        }
        .cyberpunk-scroll::-webkit-scrollbar-corner {
          background: #07110c;
        }
        @keyframes terminalCursor {
          0%,
          49% {
            opacity: 1;
          }

          50%,
          100% {
            opacity: 0;
          }
        }

        @keyframes accessPulse {
          0%,
          100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes screenGlitch {
          0% {
            transform: translate(0);
            filter: none;
          }

          20% {
            transform: translate(-1px, 1px);
            filter: hue-rotate(8deg);
          }

          40% {
            transform: translate(1px, -1px);
            filter: hue-rotate(-8deg);
          }

          60% {
            transform: translate(-1px, 0);
          }

          80% {
            transform: translate(1px, 0);
          }

          100% {
            transform: translate(0);
            filter: none;
          }
        }

        @keyframes systemRestored {
          0%, 100% { filter: brightness(1); }
          15% { filter: brightness(1.8) saturate(1.5); }
          30% { filter: brightness(0.75); }
          55% { filter: brightness(1.5) saturate(1.3); }
        }

        @keyframes successFlash {
          0% { background: rgba(120, 201, 140, 0.35); opacity: 1; }
          25% { background: rgba(120, 201, 140, 0.12); opacity: 0.7; }
          100% { background: rgba(120, 201, 140, 0); opacity: 0; }
        }

        @keyframes mismatchShake {
          0%,
          100% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(-4px);
          }

          40% {
            transform: translateX(4px);
          }

          60% {
            transform: translateX(-3px);
          }

          80% {
            transform: translateX(3px);
          }
        }
      `}</style>
      </div>
    </div>
  );
}
