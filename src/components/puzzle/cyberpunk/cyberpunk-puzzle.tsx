import { useEffect, useState, type JSX } from "react";

import { useGameStore } from "@/store/game-store";

import { CyberpunkConsoleLabel, CyberpunkFrame } from "./cyberpunk-frame";
import { ActionButton } from "@/components/scene/action-button";

interface CyberpunkPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

type ModuleId = "unsigned" | "nan" | "polymorph";

interface Module {
  id: ModuleId;
  title: string;
  description: string;
}

const MODULES: Module[] = [
  {
    id: "unsigned",
    title: "UNSIGNED MODULE",
    description: "Определите результат выражения.",
  },
  {
    id: "nan",
    title: "FLOATING POINT MODULE",
    description: "Определите результат сравнения специального значения.",
  },
  {
    id: "polymorph",
    title: "POLYMORPH MODULE",
    description: "Определите, какой метод вызовет конструктор.",
  },
];

const ANSWERS: Record<ModuleId, string> = {
  unsigned: "4294967271",
  nan: "Not Equal",
  polymorph: "Base",
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

/* ─────────────────────────────────────────────
   C++ CODE BLOCK
   ───────────────────────────────────────────── */

const CPP_KEYWORDS = new Set([
  "int",
  "double",
  "float",
  "char",
  "bool",
  "void",
  "return",
  "if",
  "else",
  "for",
  "while",
  "class",
  "public",
  "private",
  "protected",
  "virtual",
  "override",
  "const",
  "unsigned",
  "auto",
  "new",
  "delete",
  "true",
  "false",
]);

const CPP_TYPES = new Set(["std", "cout", "cin", "endl"]);

function highlightCppLine(line: string) {
  const parts: JSX.Element[] = [];

  let index = 0;
  let tokenIndex = 0;

  const add = (content: string, className: string) => {
    if (!content) {
      return;
    }

    parts.push(
      <span key={`${tokenIndex}-${content}`} className={className}>
        {content}
      </span>,
    );

    tokenIndex++;
  };

  while (index < line.length) {
    /*
     * COMMENT
     */
    if (line.startsWith("//", index)) {
      add(line.slice(index), "text-[#596057]");

      break;
    }

    /*
     * PREPROCESSOR
     */
    if (line[index] === "#") {
      const match = line.slice(index).match(/^#\w+/);

      if (match) {
        add(match[0], "text-[#7fc7d4]");

        index += match[0].length;
        continue;
      }
    }

    /*
     * STRING
     */
    if (line[index] === '"') {
      let end = index + 1;

      while (end < line.length) {
        if (line[end] === '"' && line[end - 1] !== "\\") {
          end++;
          break;
        }

        end++;
      }

      add(line.slice(index, end), "text-[#9acb7b]");

      index = end;
      continue;
    }

    /*
     * CHARACTER
     */
    if (line[index] === "'") {
      let end = index + 1;

      while (end < line.length) {
        if (line[end] === "'" && line[end - 1] !== "\\") {
          end++;
          break;
        }

        end++;
      }

      add(line.slice(index, end), "text-[#9acb7b]");

      index = end;
      continue;
    }

    /*
     * HEADER
     *
     * <iostream>
     */
    if (line[index] === "<") {
      const headerMatch = line.slice(index).match(/^<[^>\n]+>/);

      if (headerMatch) {
        add(headerMatch[0], "text-[#8fbd91]");

        index += headerMatch[0].length;
        continue;
      }
    }

    /*
     * NUMBER
     */
    const numberMatch = line.slice(index).match(/^\d+(?:\.\d+)?[uUlLfF]?/);

    if (numberMatch) {
      add(numberMatch[0], "text-[#d99b22]");

      index += numberMatch[0].length;
      continue;
    }

    /*
     * IDENTIFIER / KEYWORD
     */
    const identifierMatch = line.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);

    if (identifierMatch) {
      const word = identifierMatch[0];

      if (CPP_KEYWORDS.has(word)) {
        add(word, "text-[#d98ba0]");
      } else if (CPP_TYPES.has(word)) {
        add(word, "text-[#8fbd91]");
      } else {
        add(word, "text-[#cfd4c7]");
      }

      index += word.length;
      continue;
    }

    /*
     * OPERATORS
     */
    const operatorMatch = line
      .slice(index)
      .match(/^(?:<<|>>|==|!=|<=|>=|\+\+|--|&&|\|\||->|[+\-*/%=<>!&|])/);

    if (operatorMatch) {
      add(operatorMatch[0], "text-[#d7d2b8]");

      index += operatorMatch[0].length;
      continue;
    }

    /*
     * DEFAULT CHARACTER
     */
    add(line[index], "text-[#cfd4c7]");

    index++;
  }

  return parts;
}

function CppCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      // Clipboard unavailable.
    }
  }

  const lines = code.split("\n");

  return (
    <div className="relative overflow-hidden border border-[#d99b22]/15 bg-[#050705] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
      {/* TOP BAR */}

      <div className="flex h-7 items-center justify-between border-b border-[#d99b22]/10 bg-[#080a08] px-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d85c4c]/70" />

          <span className="h-1.5 w-1.5 rounded-full bg-[#d99b22]/70" />

          <span className="h-1.5 w-1.5 rounded-full bg-[#78c98c]/70" />

          <span className="ml-2 font-mono text-[6px] uppercase tracking-[0.16em] text-[#50574c]">
            C++ SOURCE
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="
            font-mono
            text-[6px]
            uppercase
            tracking-[0.12em]
            text-[#596057]
            transition-colors
            hover:text-[#d99b22]
          "
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>

      {/* CODE */}

      <div className="overflow-x-auto px-3 py-4 sm:px-4">
        <div className="min-w-max font-mono text-[11px] leading-[1.85]">
          {lines.map((line, index) => (
            <div key={`${index}-${line}`} className="flex">
              {/* LINE NUMBER */}

              <span className="mr-4 w-5 select-none text-right text-[#343a34]">
                {index + 1}
              </span>

              {/* CODE */}

              <span className="whitespace-pre">{highlightCppLine(line)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODULE STATUS
   ───────────────────────────────────────────── */

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
        "flex items-center gap-2",
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

      <span>
        {module.id === "nan"
          ? "FLOAT"
          : module.id === "polymorph"
            ? "POLYMORPH"
            : "UNSIGNED"}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PUZZLE
   ───────────────────────────────────────────── */

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
        "> UNSIGNED ............... OK",
        "> FLOATING POINT .......... OK",
        "> POLYMORPH ............... OK",
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
        <div className="mb-6 border-l border-[#d99b22]/40 pl-4 font-mono text-[9px] leading-[1.8]">
          <div className="text-[#d99b22]">&gt; SYSTEM REPAIR PROTOCOL</div>

          <div className="text-[#8c8060]">&gt; MANUAL RECOVERY REQUIRED</div>

          <div className="text-[#5b5d51]">&gt; 3 MODULES OFFLINE</div>
        </div>
      )}

      {/* MODULE STATUS */}

      <div className="mb-6 grid grid-cols-3 border-y border-[#d99b22]/15">
        {MODULES.map((module, index) => (
          <div
            key={module.id}
            className={[
              "flex items-center justify-center",
              "border-r border-[#d99b22]/10",
              "px-2 py-3 last:border-r-0",
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

            {/* ─────────────────────────────
                MODULE 01 — UNSIGNED
               ───────────────────────────── */}

            {currentModule.id === "unsigned" && (
              <div className="mt-5">
                <CppCodeBlock
                  code={`#include <iostream>

int main() {
    std::cout << 25u - 50;
    return 0;
}`}
                />

                <div className="mt-5 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                  &gt; SELECT OUTPUT
                </div>

                <div className="mt-2">
                  <Options
                    values={["-25", "25", "4294967271", "0"]}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </div>
            )}

            {/* ─────────────────────────────
                MODULE 02 — NaN
               ───────────────────────────── */}

            {currentModule.id === "nan" && (
              <div className="mt-5">
                <CppCodeBlock
                  code={`#include <iostream>

int main() {
    double x = 0.0 / 0.0;

    if (x == x)
        std::cout << "Equal";
    else
        std::cout << "Not Equal";

    return 0;
}`}
                />

                <div className="mt-4 border border-[#d99b22]/10 bg-black/25 p-4">
                  <div className="font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                    &gt; COMPARISON RESULT
                  </div>

                  <div className="mt-3 text-center font-mono text-lg tracking-[0.12em] text-[#d99b22]">
                    x == x
                  </div>

                  <div className="mt-2 text-center font-mono text-[8px] text-[#55594e]">
                    SPECIAL FLOATING-POINT VALUE
                  </div>
                </div>

                <div className="mt-5 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                  &gt; SELECT OUTPUT
                </div>

                <div className="mt-2">
                  <Options
                    values={["Equal", "Not Equal", "0", "ERROR"]}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </div>
            )}

            {/* ─────────────────────────────
                MODULE 03 — POLYMORPH
               ───────────────────────────── */}

            {currentModule.id === "polymorph" && (
              <div className="mt-5">
                <CppCodeBlock
                  code={`#include <iostream>

class Base {
public:
    Base() {
        foo();
    }

    virtual void foo() {
        std::cout << "Base";
    }
};

class Derived : public Base {
public:
    void foo() override {
        std::cout << "Derived";
    }
};

int main() {
    Derived d;
}`}
                />

                <div className="mt-4 border border-[#d99b22]/10 bg-black/25 p-4">
                  <div className="font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                    &gt; CONSTRUCTION SEQUENCE
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-3 font-mono">
                    <span className="text-sm text-[#c8b879]">Derived</span>

                    <span className="text-[#d99b22]">→</span>

                    <span className="text-sm text-[#c8b879]">Base()</span>

                    <span className="text-[#d99b22]">→</span>

                    <span className="text-sm text-[#d99b22]">foo()</span>
                  </div>

                  <div className="mt-3 text-center font-mono text-[7px] text-[#55594e]">
                    WHICH IMPLEMENTATION RUNS?
                  </div>
                </div>

                <div className="mt-5 font-mono text-[8px] tracking-[0.08em] text-[#756f5b]">
                  &gt; SELECT OUTPUT
                </div>

                <div className="mt-2">
                  <Options
                    values={["Base", "Derived", "ERROR", "Nothing"]}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </div>
            )}

            {/* EXECUTE */}

            {/* <div className="mt-5 flex justify-center">
              <button
                type="button"
                disabled={!selected}
                onClick={checkAnswer}
                className={[
                  "border px-5 py-2",
                  "font-mono text-[8px]",
                  "tracking-[0.14em]",
                  "transition-all duration-150",
                  selected
                    ? [
                        "border-[#d99b22]/60",
                        "bg-[#d99b22]/5",
                        "text-[#d99b22]",
                        "hover:bg-[#d99b22]/10",
                        "hover:border-[#d99b22]",
                      ].join(" ")
                    : [
                        "cursor-not-allowed",
                        "border-[#d99b22]/10",
                        "bg-black/20",
                        "text-[#444a43]",
                      ].join(" "),
                ].join(" ")}
              >
                EXECUTE
              </button>
            </div> */}
            <ActionButton
              disabled={!selected}
              onClick={checkAnswer}
              text="EXECUTE"
              size="small"
              className="mt-4 mx-auto block"
            />
          </div>
        </section>
      ) : (
        /* SUCCESS */

        <section className="flex min-h-100 flex-col items-center justify-center border border-[#d99b22]/20 bg-black/20 px-5 py-12 text-center">
          <div className="font-mono text-[8px] tracking-[0.15em] text-[#55bfc3]">
            &gt; SYSTEM RESTORED
          </div>

          <div className="mt-3 font-mono text-lg font-semibold tracking-[0.12em] text-[#78c98c] drop-shadow-[0_0_14px_rgba(120,201,140,0.25)] sm:text-xl">
            CONTROL SYSTEM ONLINE
          </div>

          <div className="mt-7 flex flex-col gap-2 text-left font-mono text-[8px] text-[#69705f]">
            <span>UNSIGNED ............ OK</span>

            <span>FLOATING POINT ...... OK</span>

            <span>POLYMORPH ........... OK</span>

            <span className="text-[#55bfc3]">DOOR CONTROL ........ ONLINE</span>
          </div>

          <div className="mt-7 font-mono text-[10px] tracking-[0.15em] text-[#78c98c] animate-[accessPulse_1.5s_ease-in-out_infinite]">
            ACCESS GRANTED
          </div>

          <div className="mt-2 font-mono text-[7px] tracking-[0.1em] text-[#4f554c]">
            WELCOME BACK.
          </div>
        </section>
      )}

      {/* LOG */}

      <div className="mt-6 border-t border-[#d99b22]/15 bg-black/30 px-4 py-3">
        <div className="mb-2 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.16em]">
          <span className="text-[#465149]">SYSTEM LOG</span>

          <span className={solved ? "text-[#78c98c]" : "text-[#d99b22]/60"}>
            {solved ? "READY" : "PROCESSING"}
          </span>
        </div>

        <div className="max-h-28 overflow-y-auto font-mono text-[7px] leading-[1.6]">
          {log.map((line, index) => {
            const isError =
              line.includes("MISMATCH") || line.includes("FAILED");

            const isSuccess =
              line.includes("OK") ||
              line.includes("ONLINE") ||
              line.includes("GRANTED");

            const isSystem =
              line.includes("SYSTEM") || line.includes("WORKSHOP");

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
