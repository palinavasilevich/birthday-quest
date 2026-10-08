import { useEffect, useRef, useState } from "react";

import { useGameStore } from "@/store/game-store";

import { CyberpunkConsoleLabel, CyberpunkFrame } from "./cyberpunk-frame";

interface CyberpunkPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

type ModuleId = "syntax" | "array" | "polymorph";

interface Module {
  id: ModuleId;
  title: string;
  description: string;
}

const MODULES: Module[] = [
  {
    id: "syntax",
    title: "SYNTAX MODULE",
    description: "Определите, что на самом деле выведет компилятор.",
  },
  {
    id: "array",
    title: "ARRAY MODULE",
    description: "Найдите результат необычной индексации массива.",
  },
  {
    id: "polymorph",
    title: "POLYMORPH MODULE",
    description: "Определите, какой метод вызовет компилятор.",
  },
];

const ANSWERS: Record<ModuleId, string> = {
  syntax: "No",
  array: "20",
  polymorph: "Base",
};

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
              "font-mono text-left text-[10px]",
              "transition-all duration-150 cursor-pointer",
              isSelected
                ? [
                    "border-[#d99b22]",
                    "bg-[#d99b22]/10",
                    "text-[#e4a72c]",
                    "shadow-[inset_0_0_18px_rgba(217,155,34,0.04)]",
                  ].join(" ")
                : [
                    "border-[#494947]",
                    "bg-black/25",
                    "text-[#7d806e]",
                    "hover:border-[#d99b22]/50",
                    "hover:bg-[#d99b22]/5",
                    "hover:text-[#c8c2a2]",
                  ].join(" "),
            ].join(" ")}
          >
            <span className={isSelected ? "text-[#d99b22]" : "text-[#50574c]"}>
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
        className="w-full border border-[#d99b22]/40 bg-[#d99b22]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d99b22] transition-all duration-200 hover:border-[#d99b22] hover:bg-[#d99b22]/10 hover:shadow-[0_0_20px_rgba(217,155,34,0.12)] disabled:cursor-not-allowed disabled:opacity-30 sm:px-5 sm:py-2.5"
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
        "font-mono text-[8px] uppercase tracking-[0.12em]",
        isComplete
          ? "text-[#78c98c]"
          : isActive
            ? "text-[#d99b22]"
            : "text-[#4c534b]",
      ].join(" ")}
    >
      <span className="text-[7px]">
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
    <div className="mt-3 border-t border-[#d99b22]/15 bg-black/30 px-3 py-1.5 sm:mt-4 sm:px-4 sm:py-2">
      <div className="mb-1 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.16em]">
        <span className="text-[#465149]">SYSTEM LOG</span>

        <span className={solved ? "text-[#78c98c]" : "text-[#d99b22]/60"}>
          {solved ? "READY" : "PROCESSING"}
        </span>
      </div>

      <div
        ref={containerRef}
        className="max-h-20 overflow-y-auto font-mono text-[7px] leading-[1.5] sm:max-h-24"
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
                      ? "text-[#55bfc3]"
                      : "text-[#69705f]"
              }
            >
              {line}
            </p>
          );
        })}

        {(!solved || isPrinting) && (
          <span className="text-[#d99b22] animate-[terminalCursor_650ms_steps(1)_infinite]">
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
    <section className="flex min-h-48 flex-col items-center justify-center border border-[#d99b22]/20 bg-black/20 px-4 py-5 text-center sm:min-h-72 sm:px-5 sm:py-8">
      <div className="w-full max-w-sm space-y-2 text-left font-mono text-[9px] text-[#78c98c]">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <span className="text-[#d99b22] animate-[terminalCursor_650ms_steps(1)_infinite]">
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
        ...MODULES.map((module) =>
          logStatusLine(module.id.toUpperCase(), "OK"),
        ),
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
    <CyberpunkFrame
      title="WORKSHOP CONTROL SYSTEM"
      status="RECOVERY INTERFACE"
      className={[
        "max-w-3xl",
        isBooting ? "animate-[screenGlitch_220ms_steps(2)_4]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* CONSOLE LABEL */}

      <CyberpunkConsoleLabel>
        SYSTEM CONSOLE / RECOVERY PROTOCOL
      </CyberpunkConsoleLabel>

      {isBooting ? (
        <BootSequence />
      ) : (
        <>
          {/* SYSTEM INTRO */}

          {!solved && (
            <div className="mb-2 border-l border-[#d99b22]/40 pl-4 font-mono text-[9px] leading-[1.5] sm:mb-3 sm:leading-[1.6]">
              <div className="text-[#d99b22]">&gt; SYSTEM REPAIR PROTOCOL</div>

              <div className="text-[#8c8060]">
                &gt; MANUAL RECOVERY REQUIRED
              </div>

              <div className="text-[#5b5d51]">&gt; 3 MODULES OFFLINE</div>
            </div>
          )}

          {/* MODULE STATUS */}

          <div className="mb-2 grid grid-cols-3 border-y border-[#d99b22]/15 sm:mb-3">
            {MODULES.map((module, index) => (
              <div
                key={module.id}
                className={[
                  "flex items-center justify-center",
                  "border-r border-[#d99b22]/10",
                  "px-2 py-2 last:border-r-0",
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
              className={[
                "border border-[#d99b22]/20 bg-black/20",
                isMismatch ? "animate-[mismatchShake_400ms_ease-in-out]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* MODULE HEADER */}

              <div
                className={[
                  "flex items-center justify-between border-b px-3 py-1.5 sm:px-4 sm:py-2",
                  isMismatch
                    ? "border-[#d85c4c]/40 bg-[#d85c4c]/5"
                    : "border-[#d99b22]/15",
                ].join(" ")}
              >
                <span className="font-mono text-[8px] tracking-[0.18em] text-[#d99b22]">
                  MODULE 0{moduleIndex + 1}
                </span>

                <span
                  className={[
                    "font-mono text-[8px] tracking-[0.15em]",
                    isMismatch ? "text-[#d85c4c]" : "text-[#756a50]",
                  ].join(" ")}
                >
                  {isMismatch ? "MISMATCH" : "OFFLINE"}
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <h2 className="font-mono text-base font-semibold tracking-[0.08em] text-[#d8d2b0]">
                  {currentModule.title}
                </h2>

                <p className="mt-2 font-mono text-[9px] leading-relaxed text-[#777766]">
                  {currentModule.description}
                </p>

                {/* syntax */}

                {currentModule.id === "syntax" && (
                  <div className="mt-2 sm:mt-3">
                    <pre className="overflow-x-auto border border-[#d99b22]/15 border-l-2 border-l-[#d99b22]/60 bg-black/35 p-2.5 font-mono text-[10px] leading-[1.55] text-[#aeb5a4] sm:p-3">
                      {`int x = 10;
int y = 20;

if (x --> y) {
    std::cout << "Yes";
} else {
    std::cout << "No";
}`}
                    </pre>

                    <div className="mt-3 border border-[#d99b22]/10 bg-black/25 p-3 font-mono text-[8px] leading-[1.6] text-[#696b5c]">
                      <div className="text-[#756f5b]">
                        &gt; WHAT DOES THE COMPILER SEE?
                      </div>

                      <div className="mt-2 text-[#aeb5a4]">x-- &gt; y</div>
                    </div>

                    <div className="mb-1.5 mt-3 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                      &gt; SELECT OUTPUT
                    </div>

                    <Options
                      values={["Yes", "No", "10", "20"]}
                      selected={selected}
                      onSelect={handleSelectOption}
                    />

                    <ExecuteButton disabled={!selected} onClick={checkAnswer} />
                  </div>
                )}

                {/*  */}

                {currentModule.id === "array" && (
                  <div className="mt-2 sm:mt-3">
                    <pre className="overflow-x-auto border border-[#d99b22]/15 border-l-2 border-l-[#d99b22]/60 bg-black/35 p-2.5 font-mono text-[10px] leading-[1.55] text-[#aeb5a4] sm:p-3">
                      {`int arr[3] = {10, 20, 30};

std::cout << 1[arr];`}
                    </pre>

                    <div className="mt-3 border border-[#d99b22]/10 bg-black/25 p-3 font-mono text-[8px] leading-[1.6] text-[#696b5c]">
                      <div className="text-[#756f5b]">&gt; ARRAY INDEX</div>

                      <div className="mt-2 flex items-center justify-center gap-2 text-[#aeb5a4]">
                        <span>arr[1]</span>
                        <span className="text-[#d99b22]">=</span>
                        <span>1[arr]</span>
                      </div>
                    </div>

                    <div className="mb-1.5 mt-3 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                      &gt; SELECT OUTPUT
                    </div>

                    <Options
                      values={["10", "20", "30", "ERROR"]}
                      selected={selected}
                      onSelect={handleSelectOption}
                    />

                    <ExecuteButton disabled={!selected} onClick={checkAnswer} />
                  </div>
                )}

                {/* polymorph */}

                {currentModule.id === "polymorph" && (
                  <div className="mt-2 sm:mt-3">
                    <pre className="overflow-x-auto border border-[#d99b22]/15 border-l-2 border-l-[#d99b22]/60 bg-black/35 p-2.5 font-mono text-[9px] leading-[1.55] text-[#aeb5a4] sm:p-3">
                      {`class Base {
public:
    Base() { foo(); }

    virtual void foo() {
        std::cout << "Base\\n";
    }
};

class Derived : public Base {
public:
    void foo() override {
        std::cout << "Derived\\n";
    }
};

int main() {
    Derived d;
}`}
                    </pre>

                    <div className="mt-3 border border-[#d99b22]/10 bg-black/25 p-3 font-mono text-[8px] leading-[1.6] text-[#696b5c]">
                      <div className="text-[#756f5b]">
                        &gt; CONSTRUCTOR TRACE
                      </div>

                      <div className="mt-2 text-[#aeb5a4]">
                        Derived → Base constructor → foo()
                      </div>
                    </div>

                    <div className="mb-1.5 mt-3 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                      &gt; SELECT OUTPUT
                    </div>

                    <Options
                      values={["Base", "Derived", "ERROR", "Nothing"]}
                      selected={selected}
                      onSelect={handleSelectOption}
                    />

                    <ExecuteButton disabled={!selected} onClick={checkAnswer} />
                  </div>
                )}
              </div>
            </section>
          ) : (
            /* SUCCESS */

            <section className="flex min-h-48 flex-col items-center justify-center border border-[#d99b22]/20 bg-black/20 px-4 py-5 text-center sm:min-h-72 sm:px-5 sm:py-8">
              <div className="font-mono text-[8px] tracking-[0.15em] text-[#55bfc3]">
                &gt; SYSTEM RESTORED
              </div>

              <div className="mt-3 font-mono text-lg font-semibold tracking-[0.12em] text-[#78c98c] drop-shadow-[0_0_14px_rgba(120,201,140,0.25)] sm:text-xl">
                CONTROL SYSTEM ONLINE
              </div>

              <div className="mt-3 flex flex-col gap-1 text-left font-mono text-[8px] text-[#69705f] sm:mt-4 sm:gap-1.5">
                <span>MEMORY .............. OK</span>

                <span>LOGIC ............... OK</span>

                <span>OUTPUT .............. OK</span>

                <span className="text-[#55bfc3]">
                  DOOR CONTROL ........ ONLINE
                </span>
              </div>

              <div className="mt-6 font-mono text-[10px] tracking-[0.15em] text-[#78c98c] animate-[accessPulse_1.5s_ease-in-out_infinite]">
                ACCESS GRANTED
              </div>

              <div className="mt-2 font-mono text-[7px] tracking-[0.1em] text-[#4f554c]">
                WELCOME BACK.
              </div>
            </section>
          )}

          {/* SYSTEM LOG */}

          <SystemLog lines={log} solved={solved} />
        </>
      )}

      <style>{`
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
    </CyberpunkFrame>
  );
}
