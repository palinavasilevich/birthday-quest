import { useEffect, useState } from "react";

import { useGameStore } from "@/store/game-store";

import { CyberpunkConsoleLabel, CyberpunkFrame } from "./cyberpunk-frame";

interface CyberpunkPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

type ModuleId = "memory" | "logic" | "size";

interface Module {
  id: ModuleId;
  title: string;
  description: string;
}

const MODULES: Module[] = [
  {
    id: "memory",
    title: "MEMORY MODULE",
    description: "Восстановите значение, полученное через указатель.",
  },
  {
    id: "logic",
    title: "LOGIC MODULE",
    description: "Определите результат выполнения выражения.",
  },
  {
    id: "size",
    title: "SIZE MODULE",
    description: "Определите, что знает компилятор.",
  },
];

const ANSWERS: Record<ModuleId, string> = {
  memory: "16",
  logic: "6",
  size: "array",
};

interface OptionsProps {
  values: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  labels?: Record<string, string>;
}

function Options({ values, selected, onSelect, labels }: OptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {values.map((value) => {
        const isSelected = selected === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={[
              "flex min-h-10 items-center gap-3",
              "border px-3 py-2",
              "font-mono text-left text-[10px]",
              "transition-all duration-150",
              isSelected
                ? [
                    "border-[#d99b22]",
                    "bg-[#d99b22]/10",
                    "text-[#e4a72c]",
                    "shadow-[inset_0_0_18px_rgba(217,155,34,0.04)]",
                  ].join(" ")
                : [
                    "border-[#d99b22]/15",
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
    <div className="mt-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="w-full border border-[#d99b22]/40 bg-[#d99b22]/5 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d99b22] transition-all duration-200 hover:border-[#d99b22] hover:bg-[#d99b22]/10 hover:shadow-[0_0_20px_rgba(217,155,34,0.12)] disabled:cursor-not-allowed disabled:opacity-30"
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

      <span>{module.id === "size" ? "OUTPUT" : module.id.toUpperCase()}</span>
    </div>
  );
}

function SystemLog({ lines, solved }: { lines: string[]; solved: boolean }) {
  return (
    <div className="mt-6 border-t border-[#d99b22]/15 bg-black/30 px-4 py-3">
      <div className="mb-2 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.16em]">
        <span className="text-[#465149]">SYSTEM LOG</span>

        <span className={solved ? "text-[#78c98c]" : "text-[#d99b22]/60"}>
          {solved ? "READY" : "PROCESSING"}
        </span>
      </div>

      <div className="max-h-28 overflow-y-auto font-mono text-[7px] leading-[1.6]">
        {lines.map((line, index) => {
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

        {!solved && (
          <span className="text-[#d99b22] animate-[terminalCursor_650ms_steps(1)_infinite]">
            _
          </span>
        )}
      </div>
    </div>
  );
}

export function CyberpunkPuzzle({ puzzleId, nextScene }: CyberpunkPuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [moduleIndex, setModuleIndex] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);

  const [solved, setSolved] = useState(false);

  const [log, setLog] = useState<string[]>([
    "> WORKSHOP CONTROL SYSTEM",
    "> CONTROL MODULE: OFFLINE",
    "> SYSTEM STATUS: CRITICAL",
    "> 3 MODULES REQUIRED",
    "> AWAITING INPUT...",
  ]);

  const currentModule = MODULES[moduleIndex];

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

  function checkAnswer() {
    if (!selected) {
      return;
    }

    pushLog(`> INPUT: ${selected}`);

    if (selected !== ANSWERS[currentModule.id]) {
      pushLog("> MISMATCH", "> RECOVERY ATTEMPT FAILED", "> ROLLBACK...");

      setSelected(null);

      return;
    }

    pushLog(
      `> ${currentModule.title} ............ OK`,
      `> ${currentModule.title} ............ RESTORED`,
    );

    if (moduleIndex === MODULES.length - 1) {
      pushLog(
        "> MODULE 03 ............... ONLINE",
        ">",
        "> MEMORY .................. OK",
        "> LOGIC ................... OK",
        "> OUTPUT .................. OK",
        ">",
        "> SYSTEM RESTORED",
        "> CONTROL SYSTEM .......... ONLINE",
        "> WORKSHOP ACCESS ......... GRANTED",
        "> DOOR CONTROL ............ ONLINE",
        ">",
        "> WELCOME BACK.",
      );

      completePuzzle(puzzleId);

      setSolved(true);

      return;
    }

    setModuleIndex((index) => index + 1);
    setSelected(null);
  }

  return (
    <CyberpunkFrame
      title="WORKSHOP CONTROL SYSTEM"
      status="RECOVERY INTERFACE"
      date="21/11/2026"
      className="max-w-3xl"
    >
      {/* CONSOLE LABEL */}

      <CyberpunkConsoleLabel>
        SYSTEM CONSOLE / RECOVERY PROTOCOL
      </CyberpunkConsoleLabel>

      {/* SYSTEM INTRO */}

      {!solved && (
        <div className="mb-5 border-l border-[#d99b22]/40 pl-4 font-mono text-[9px] leading-[1.8]">
          <div className="text-[#d99b22]">&gt; SYSTEM REPAIR PROTOCOL</div>

          <div className="text-[#8c8060]">&gt; MANUAL RECOVERY REQUIRED</div>

          <div className="text-[#5b5d51]">&gt; 3 MODULES OFFLINE</div>
        </div>
      )}

      {/* MODULE STATUS */}

      <div className="mb-5 grid grid-cols-3 border-y border-[#d99b22]/15">
        {MODULES.map((module, index) => (
          <div
            key={module.id}
            className={[
              "flex items-center justify-center",
              "border-r border-[#d99b22]/10",
              "px-2 py-2.5 last:border-r-0",
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
        <section className="border border-[#d99b22]/20 bg-black/20">
          {/* MODULE HEADER */}

          <div className="flex items-center justify-between border-b border-[#d99b22]/15 px-4 py-3">
            <span className="font-mono text-[8px] tracking-[0.18em] text-[#d99b22]">
              MODULE 0{moduleIndex + 1}
            </span>

            <span className="font-mono text-[8px] tracking-[0.15em] text-[#756a50]">
              OFFLINE
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <h2 className="font-mono text-base font-semibold tracking-[0.08em] text-[#d8d2b0]">
              {currentModule.title}
            </h2>

            <p className="mt-2 font-mono text-[9px] leading-relaxed text-[#777766]">
              {currentModule.description}
            </p>

            {/* MEMORY */}

            {currentModule.id === "memory" && (
              <div className="mt-4">
                <pre className="overflow-x-auto border border-[#d99b22]/15 border-l-2 border-l-[#d99b22]/60 bg-black/35 p-3.5 font-mono text-[10px] leading-[1.8] text-[#aeb5a4]">
                  {`int data[] = {4, 8, 15, 16, 23, 42};

int* p = data + 2;

std::cout << *(p + 1);`}
                </pre>

                <div className="mt-4 grid grid-cols-6 gap-1">
                  {[4, 8, 15, 16, 23, 42].map((value, index) => (
                    <div
                      key={value}
                      className="relative border border-[#d99b22]/15 bg-[#090b09] px-1 py-2 text-center"
                    >
                      <strong className="block font-mono text-sm text-[#c8b879]">
                        {value}
                      </strong>

                      <span className="mt-1 block font-mono text-[6px] text-[#55594e]">
                        data[{index}]
                      </span>

                      {index === 2 && (
                        <b className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[7px] font-normal text-[#d99b22]">
                          p
                        </b>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-2 mt-4 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                  &gt; SELECT OUTPUT
                </div>

                <Options
                  values={["15", "16", "23", "42"]}
                  selected={selected}
                  onSelect={setSelected}
                />

                <ExecuteButton disabled={!selected} onClick={checkAnswer} />
              </div>
            )}

            {/* LOGIC */}

            {currentModule.id === "logic" && (
              <div className="mt-4">
                <pre className="overflow-x-auto border border-[#d99b22]/15 border-l-2 border-l-[#d99b22]/60 bg-black/35 p-3.5 font-mono text-[10px] leading-[1.8] text-[#aeb5a4]">
                  {`int power = 7;
int core = 2;

std::cout << power / core * 2;`}
                </pre>

                <div className="mt-4 flex items-center justify-center gap-3 border border-[#d99b22]/10 bg-black/25 p-4 font-mono">
                  <span className="text-lg text-[#c8b879]">7</span>

                  <b className="text-[9px] font-normal text-[#d99b22]">/</b>

                  <span className="text-lg text-[#c8b879]">2</span>

                  <b className="text-[9px] font-normal text-[#d99b22]">*</b>

                  <span className="text-lg text-[#c8b879]">2</span>

                  <b className="text-[9px] font-normal text-[#d99b22]">=</b>

                  <span className="text-lg text-[#d99b22] drop-shadow-[0_0_8px_rgba(217,155,34,0.4)]">
                    ?
                  </span>
                </div>

                <div className="mb-2 mt-4 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                  &gt; SELECT OUTPUT
                </div>

                <Options
                  values={["3", "6", "7", "8"]}
                  selected={selected}
                  onSelect={setSelected}
                />

                <ExecuteButton disabled={!selected} onClick={checkAnswer} />
              </div>
            )}

            {/* SIZE */}

            {currentModule.id === "size" && (
              <div className="mt-4">
                <pre className="overflow-x-auto border border-[#d99b22]/15 border-l-2 border-l-[#d99b22]/60 bg-black/35 p-3.5 font-mono text-[10px] leading-[1.8] text-[#aeb5a4]">
                  {`int data[8];
int* p = data;

sizeof(data)
sizeof(p)`}
                </pre>

                <div className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {/* DATA */}

                  <div className="border border-[#d99b22]/15 bg-[#090b09] p-3">
                    <div className="mb-2 font-mono text-[9px] text-[#c8b879]">
                      data
                    </div>

                    <div className="grid grid-cols-8 gap-0.5">
                      {Array.from({ length: 8 }, (_, index) => (
                        <span
                          key={index}
                          className="flex h-6 items-center justify-center border border-[#d99b22]/10 bg-[#11120f] font-mono text-[6px] text-[#77705a]"
                        >
                          {index}
                        </span>
                      ))}
                    </div>

                    <small className="mt-2 block font-mono text-[6px] text-[#55594e]">
                      8 ELEMENTS
                    </small>
                  </div>

                  {/* POINTER */}

                  <div className="border border-[#d99b22]/15 bg-[#090b09] p-3">
                    <div className="mb-2 font-mono text-[9px] text-[#c8b879]">
                      p
                    </div>

                    <div className="flex min-h-6 items-center font-mono text-[7px] text-[#d99b22]">
                      ────────► data[0]
                    </div>

                    <small className="mt-2 block font-mono text-[6px] text-[#55594e]">
                      ADDRESS
                    </small>
                  </div>
                </div>

                <div className="mb-2 mt-4 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                  &gt; WHAT DOES THE COMPILER KNOW?
                </div>

                <Options
                  values={["array", "address", "value"]}
                  labels={{
                    array: "Размер массива",
                    address: "Только адрес",
                    value: "Значение элемента",
                  }}
                  selected={selected}
                  onSelect={setSelected}
                />

                <ExecuteButton disabled={!selected} onClick={checkAnswer} />
              </div>
            )}
          </div>
        </section>
      ) : (
        /* SUCCESS */

        <section className="flex min-h-90 flex-col items-center justify-center border border-[#d99b22]/20 bg-black/20 px-5 py-10 text-center">
          <div className="font-mono text-[8px] tracking-[0.15em] text-[#55bfc3]">
            &gt; SYSTEM RESTORED
          </div>

          <div className="mt-3 font-mono text-lg font-semibold tracking-[0.12em] text-[#78c98c] drop-shadow-[0_0_14px_rgba(120,201,140,0.25)] sm:text-xl">
            CONTROL SYSTEM ONLINE
          </div>

          <div className="mt-6 flex flex-col gap-2 text-left font-mono text-[8px] text-[#69705f]">
            <span>MEMORY .............. OK</span>

            <span>LOGIC ............... OK</span>

            <span>OUTPUT .............. OK</span>

            <span className="text-[#55bfc3]">DOOR CONTROL ........ ONLINE</span>
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
      `}</style>
    </CyberpunkFrame>
  );
}
