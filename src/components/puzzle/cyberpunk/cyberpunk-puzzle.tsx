import { useEffect, useState } from "react";

import { useGameStore } from "@/store/game-store";

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
    <div className="cyber-puzzle-options">
      {values.map((value) => {
        const isSelected = selected === value;

        return (
          <button
            key={value}
            type="button"
            className={
              isSelected
                ? "cyber-puzzle-option is-selected"
                : "cyber-puzzle-option"
            }
            onClick={() => onSelect(value)}
          >
            <span className="cyber-puzzle-option-prefix">
              {isSelected ? ">" : "_"}
            </span>

            <span>{labels?.[value] ?? value}</span>
          </button>
        );
      })}
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
    <div className="cyber-puzzle">
      <style>{STYLES}</style>

      {/* ─────────────────────────
          SCANLINES / GRID
      ───────────────────────── */}

      <div className="cyber-puzzle-overlay" />

      {/* ─────────────────────────
          HEADER
      ───────────────────────── */}

      <header className="cyber-puzzle-header">
        <div>
          <div className="cyber-puzzle-title">WORKSHOP CONTROL SYSTEM</div>

          <div className="cyber-puzzle-subtitle">RECOVERY INTERFACE</div>
        </div>

        <div className="cyber-puzzle-date">21/11/2026</div>
      </header>

      {/* ─────────────────────────
          SYSTEM INTRO
      ───────────────────────── */}

      {!solved && (
        <div className="cyber-puzzle-system">
          <div>&gt; SYSTEM REPAIR PROTOCOL</div>

          <div>&gt; MANUAL RECOVERY REQUIRED</div>

          <div className="cyber-puzzle-system-dim">&gt; 3 MODULES OFFLINE</div>
        </div>
      )}

      {/* ─────────────────────────
          MODULE STATUS
      ───────────────────────── */}

      <div className="cyber-puzzle-modules">
        {MODULES.map((module, index) => {
          const isComplete = index < moduleIndex || solved;

          const isActive = index === moduleIndex && !solved;

          return (
            <div
              key={module.id}
              className={[
                "cyber-puzzle-module-status",
                isActive ? "is-active" : "",
                isComplete ? "is-complete" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="cyber-puzzle-module-dot">
                {isComplete ? "●" : isActive ? "◆" : "○"}
              </span>

              <span>
                {module.id === "size" ? "OUTPUT" : module.id.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {!solved ? (
        <>
          {/* ─────────────────────────
              ACTIVE MODULE
          ───────────────────────── */}

          <section className="cyber-puzzle-card">
            <div className="cyber-puzzle-card-top">
              <span>MODULE 0{moduleIndex + 1}</span>

              <span className="cyber-puzzle-card-status">OFFLINE</span>
            </div>

            <h2>{currentModule.title}</h2>

            <p className="cyber-puzzle-description">
              {currentModule.description}
            </p>

            {/* MEMORY */}

            {currentModule.id === "memory" && (
              <>
                <pre className="cyber-puzzle-code">
                  {`int data[] = {4, 8, 15, 16, 23, 42};

int* p = data + 2;

std::cout << *(p + 1);`}
                </pre>

                <div className="cyber-puzzle-memory">
                  {[4, 8, 15, 16, 23, 42].map((value, index) => (
                    <div key={value} className="cyber-puzzle-memory-cell">
                      <strong>{value}</strong>

                      <span>data[{index}]</span>

                      {index === 2 && <b>p</b>}
                    </div>
                  ))}
                </div>

                <div className="cyber-puzzle-question">&gt; SELECT OUTPUT</div>

                <Options
                  values={["15", "16", "23", "42"]}
                  selected={selected}
                  onSelect={setSelected}
                />
              </>
            )}

            {/* LOGIC */}

            {currentModule.id === "logic" && (
              <>
                <pre className="cyber-puzzle-code">
                  {`int power = 7;
int core = 2;

std::cout << power / core * 2;`}
                </pre>

                <div className="cyber-puzzle-calculation">
                  <span>7</span>
                  <b>/</b>
                  <span>2</span>
                  <b>*</b>
                  <span>2</span>
                  <b>=</b>
                  <span className="is-unknown">?</span>
                </div>

                <div className="cyber-puzzle-question">&gt; SELECT OUTPUT</div>

                <Options
                  values={["3", "6", "7", "8"]}
                  selected={selected}
                  onSelect={setSelected}
                />
              </>
            )}

            {/* SIZE */}

            {currentModule.id === "size" && (
              <>
                <pre className="cyber-puzzle-code">
                  {`int data[8];
int* p = data;

sizeof(data)
sizeof(p)`}
                </pre>

                <div className="cyber-puzzle-size">
                  <div className="cyber-puzzle-size-block">
                    <div className="cyber-puzzle-size-title">data</div>

                    <div className="cyber-puzzle-array">
                      {Array.from({ length: 8 }, (_, index) => (
                        <span key={index}>{index}</span>
                      ))}
                    </div>

                    <small>8 ELEMENTS</small>
                  </div>

                  <div className="cyber-puzzle-size-block">
                    <div className="cyber-puzzle-size-title">p</div>

                    <div className="cyber-puzzle-pointer">
                      ────────► data[0]
                    </div>

                    <small>ADDRESS</small>
                  </div>
                </div>

                <div className="cyber-puzzle-question">
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
              </>
            )}

            <button
              type="button"
              className="cyber-puzzle-execute"
              disabled={!selected}
              onClick={checkAnswer}
            >
              <span>&gt;</span>
              EXECUTE
              <span className="cyber-puzzle-execute-cursor">_</span>
            </button>
          </section>
        </>
      ) : (
        /* ─────────────────────────
           SUCCESS
        ───────────────────────── */

        <section className="cyber-puzzle-success">
          <div className="cyber-puzzle-success-line">&gt; SYSTEM RESTORED</div>

          <div className="cyber-puzzle-success-title">
            CONTROL SYSTEM ONLINE
          </div>

          <div className="cyber-puzzle-success-grid">
            <span>MEMORY .............. OK</span>

            <span>LOGIC ............... OK</span>

            <span>OUTPUT .............. OK</span>

            <span>DOOR CONTROL ........ ONLINE</span>
          </div>

          <div className="cyber-puzzle-access">ACCESS GRANTED</div>

          <div className="cyber-puzzle-welcome">WELCOME BACK.</div>
        </section>
      )}

      {/* ─────────────────────────
          LOG
      ───────────────────────── */}

      <div className="cyber-puzzle-log">
        <div className="cyber-puzzle-log-header">SYSTEM LOG</div>

        {log.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}

        {!solved && <span className="cyber-puzzle-cursor">_</span>}
      </div>
    </div>
  );
}

const STYLES = `
.cyber-puzzle {
  position: relative;

  width: min(720px, calc(100vw - 32px));

  margin: 0 auto;

  overflow: hidden;

  box-sizing: border-box;

  background:
    linear-gradient(
      180deg,
      rgba(3, 17, 12, 0.985),
      rgba(2, 11, 8, 0.99)
    );

  border: 1px solid rgba(61, 194, 127, 0.25);

  color: #9be6bd;

  font-family:
    "JetBrains Mono",
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    monospace;

  box-shadow:
    0 18px 55px rgba(0, 0, 0, 0.55),
    inset 0 0 80px rgba(35, 190, 120, 0.025);
}

/* ─────────────────────────
   CRT EFFECT
   ───────────────────────── */

.cyber-puzzle-overlay {
  position: absolute;

  inset: 0;

  pointer-events: none;

  z-index: 20;

  opacity: 0.12;

  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(70, 255, 180, 0.035) 4px
    );
}

/* ─────────────────────────
   HEADER
   ───────────────────────── */

.cyber-puzzle-header {
  position: relative;

  z-index: 2;

  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  padding: 16px 20px 14px;

  border-bottom:
    1px solid rgba(61, 194, 127, 0.16);
}

.cyber-puzzle-title {
  color: #45e89a;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.09em;
}

.cyber-puzzle-subtitle {
  margin-top: 5px;

  color: #365b49;

  font-size: 8px;

  letter-spacing: 0.12em;
}

.cyber-puzzle-date {
  color: #315542;

  font-size: 8px;

  letter-spacing: 0.08em;
}

/* ─────────────────────────
   SYSTEM
   ───────────────────────── */

.cyber-puzzle-system {
  position: relative;

  z-index: 2;

  padding: 14px 20px 5px;

  color: #4b8064;

  font-size: 8px;

  line-height: 1.8;
}

.cyber-puzzle-system-dim {
  color: #294637;
}

/* ─────────────────────────
   MODULE STATUS
   ───────────────────────── */

.cyber-puzzle-modules {
  position: relative;

  z-index: 2;

  display: flex;

  gap: 22px;

  padding: 13px 20px;

  border-top:
    1px solid rgba(61, 194, 127, 0.08);

  border-bottom:
    1px solid rgba(61, 194, 127, 0.12);
}

.cyber-puzzle-module-status {
  display: flex;

  align-items: center;

  gap: 6px;

  color: #294938;

  font-size: 8px;

  letter-spacing: 0.08em;

  transition:
    color 180ms ease,
    text-shadow 180ms ease;
}

.cyber-puzzle-module-status.is-active {
  color: #1bd4d7;

  text-shadow:
    0 0 9px rgba(27, 212, 215, 0.3);
}

.cyber-puzzle-module-status.is-complete {
  color: #45e89a;
}

.cyber-puzzle-module-dot {
  font-size: 7px;
}

/* ─────────────────────────
   CARD
   ───────────────────────── */

.cyber-puzzle-card {
  position: relative;

  z-index: 2;

  margin: 17px 20px;

  padding: 17px;

  background:
    linear-gradient(
      180deg,
      rgba(6, 27, 19, 0.72),
      rgba(3, 18, 13, 0.82)
    );

  border:
    1px solid rgba(61, 194, 127, 0.16);

  box-shadow:
    inset 0 0 25px rgba(35, 190, 120, 0.025);
}

.cyber-puzzle-card::before {
  content: "";

  position: absolute;

  top: -1px;
  left: -1px;

  width: 70px;
  height: 1px;

  background: #18d5d8;

  box-shadow:
    0 0 8px rgba(24, 213, 216, 0.35);
}

.cyber-puzzle-card-top {
  display: flex;

  justify-content: space-between;

  color: #19d5d8;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 0.12em;
}

.cyber-puzzle-card-status {
  color: #765e43;

  animation:
    cyber-puzzle-status-blink 1.8s
    steps(1)
    infinite;
}

@keyframes cyber-puzzle-status-blink {
  0%,
  65% {
    opacity: 1;
  }

  66%,
  100% {
    opacity: 0.45;
  }
}

.cyber-puzzle-card h2 {
  margin: 8px 0 0;

  color: #a6dfb8;

  font-size: 18px;

  font-weight: 600;

  letter-spacing: 0.04em;
}

.cyber-puzzle-description {
  margin: 6px 0 0;

  color: #527765;

  font-size: 9px;

  line-height: 1.5;
}

/* ─────────────────────────
   CODE
   ───────────────────────── */

.cyber-puzzle-code {
  margin: 17px 0 0;

  padding: 13px 14px;

  background:
    rgba(0, 8, 5, 0.75);

  border:
    1px solid rgba(61, 194, 127, 0.13);

  border-left:
    2px solid rgba(24, 213, 216, 0.75);

  color: #a8d6b7;

  font-family: inherit;

  font-size: 10px;

  line-height: 1.7;

  white-space: pre-wrap;

  overflow-x: auto;
}

/* ─────────────────────────
   MEMORY
   ───────────────────────── */

.cyber-puzzle-memory {
  display: grid;

  grid-template-columns:
    repeat(6, minmax(0, 1fr));

  gap: 4px;

  margin-top: 14px;
}

.cyber-puzzle-memory-cell {
  position: relative;

  padding: 8px 3px 7px;

  text-align: center;

  background:
    rgba(6, 29, 21, 0.62);

  border:
    1px solid rgba(61, 194, 127, 0.12);
}

.cyber-puzzle-memory-cell strong {
  display: block;

  color: #8ed8a6;

  font-size: 14px;
}

.cyber-puzzle-memory-cell span {
  display: block;

  margin-top: 3px;

  color: #345845;

  font-size: 6px;
}

.cyber-puzzle-memory-cell b {
  position: absolute;

  top: -12px;
  left: 50%;

  transform: translateX(-50%);

  color: #19d5d8;

  font-size: 7px;

  font-weight: 500;
}

/* ─────────────────────────
   QUESTION
   ───────────────────────── */

.cyber-puzzle-question {
  margin-top: 17px;

  margin-bottom: 9px;

  color: #527f66;

  font-size: 8px;

  letter-spacing: 0.04em;
}

/* ─────────────────────────
   OPTIONS
   ───────────────────────── */

.cyber-puzzle-options {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 5px;
}

.cyber-puzzle-option {
  display: flex;

  align-items: center;

  gap: 9px;

  min-height: 36px;

  padding: 7px 10px;

  background:
    rgba(5, 25, 18, 0.68);

  border:
    1px solid rgba(61, 194, 127, 0.13);

  color: #6fae85;

  font-family: inherit;

  font-size: 9px;

  text-align: left;

  cursor: pointer;

  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
}

.cyber-puzzle-option:hover {
  background:
    rgba(11, 43, 30, 0.75);

  border-color:
    rgba(24, 213, 216, 0.35);

  color: #a3e1b7;
}

.cyber-puzzle-option.is-selected {
  background:
    rgba(24, 213, 216, 0.06);

  border-color:
    rgba(24, 213, 216, 0.7);

  color: #b6ffff;

  box-shadow:
    inset 0 0 15px
      rgba(24, 213, 216, 0.035);
}

.cyber-puzzle-option-prefix {
  color: #315c48;

  font-size: 8px;
}

.cyber-puzzle-option.is-selected
  .cyber-puzzle-option-prefix {
  color: #19d5d8;
}

/* ─────────────────────────
   EXECUTE
   ───────────────────────── */

.cyber-puzzle-execute {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 9px;

  width: 100%;

  min-height: 38px;

  margin-top: 9px;

  background:
    rgba(18, 58, 42, 0.7);

  border:
    1px solid rgba(67, 233, 150, 0.16);

  color: #6fae85;

  font-family: inherit;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.1em;

  cursor: pointer;

  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
}

.cyber-puzzle-execute:hover:not(:disabled) {
  background:
    rgba(24, 83, 57, 0.78);

  border-color:
    rgba(67, 233, 150, 0.4);

  color: #a9e5ba;
}

.cyber-puzzle-execute:disabled {
  cursor: not-allowed;

  opacity: 0.45;
}

.cyber-puzzle-execute > span:first-child {
  color: #19d5d8;
}

.cyber-puzzle-execute-cursor {
  color: #43e996;

  animation:
    cyber-puzzle-blink
    900ms
    steps(1)
    infinite;
}

@keyframes cyber-puzzle-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

/* ─────────────────────────
   CALCULATION
   ───────────────────────── */

.cyber-puzzle-calculation {
  display: flex;

  justify-content: center;
  align-items: center;

  gap: 11px;

  margin-top: 15px;

  padding: 12px;

  background:
    rgba(0, 8, 5, 0.55);

  border:
    1px solid rgba(61, 194, 127, 0.11);

  color: #8ed8a6;
}

.cyber-puzzle-calculation span {
  font-size: 17px;
}

.cyber-puzzle-calculation b {
  color: #19d5d8;

  font-size: 9px;

  font-weight: 400;
}

.cyber-puzzle-calculation
  .is-unknown {
  color: #19d5d8;

  text-shadow:
    0 0 8px rgba(25, 213, 216, 0.4);
}

/* ─────────────────────────
   SIZE
   ───────────────────────── */

.cyber-puzzle-size {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 5px;

  margin-top: 15px;
}

.cyber-puzzle-size-block {
  padding: 11px;

  background:
    rgba(5, 25, 18, 0.6);

  border:
    1px solid rgba(61, 194, 127, 0.12);
}

.cyber-puzzle-size-title {
  margin-bottom: 8px;

  color: #8ed5a4;

  font-size: 9px;
}

.cyber-puzzle-array {
  display: grid;

  grid-template-columns:
    repeat(8, 1fr);

  gap: 2px;
}

.cyber-puzzle-array span {
  display: flex;

  align-items: center;
  justify-content: center;

  height: 22px;

  background:
    rgba(12, 42, 30, 0.52);

  border:
    1px solid rgba(61, 194, 127, 0.1);

  color: #5d9b74;

  font-size: 6px;
}

.cyber-puzzle-size-block small {
  display: block;

  margin-top: 6px;

  color: #345644;

  font-size: 6px;
}

.cyber-puzzle-pointer {
  min-height: 22px;

  display: flex;

  align-items: center;

  color: #19d5d8;

  font-size: 7px;

  white-space: nowrap;
}

/* ─────────────────────────
   SUCCESS
   ───────────────────────── */

.cyber-puzzle-success {
  position: relative;

  z-index: 2;

  min-height: 390px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 30px 20px;

  text-align: center;
}

.cyber-puzzle-success-line {
  color: #19d5d8;

  font-size: 8px;

  letter-spacing: 0.1em;
}

.cyber-puzzle-success-title {
  margin-top: 10px;

  color: #43e996;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.08em;

  text-shadow:
    0 0 16px
      rgba(67, 233, 150, 0.25);
}

.cyber-puzzle-success-grid {
  display: flex;

  flex-direction: column;

  gap: 5px;

  margin-top: 25px;

  color: #426b55;

  font-size: 8px;

  text-align: left;
}

.cyber-puzzle-success-grid span:last-child {
  color: #19d5d8;
}

.cyber-puzzle-access {
  margin-top: 26px;

  color: #43e996;

  font-size: 9px;

  letter-spacing: 0.12em;

  animation:
    cyber-puzzle-access-pulse
    1.5s
    ease-in-out
    infinite;
}

@keyframes cyber-puzzle-access-pulse {
  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }
}

.cyber-puzzle-welcome {
  margin-top: 10px;

  color: #294938;

  font-size: 7px;

  letter-spacing: 0.08em;
}

/* ─────────────────────────
   LOG
   ───────────────────────── */

.cyber-puzzle-log {
  position: relative;

  z-index: 2;

  min-height: 72px;

  padding: 10px 20px 12px;

  background:
    rgba(0, 7, 4, 0.72);

  border-top:
    1px solid rgba(61, 194, 127, 0.13);

  color: #345846;

  font-size: 7px;

  line-height: 1.6;
}

.cyber-puzzle-log-header {
  margin-bottom: 4px;

  color: #416c58;

  font-size: 7px;

  letter-spacing: 0.1em;
}

.cyber-puzzle-log p {
  margin: 0;
}

.cyber-puzzle-cursor {
  color: #43e996;

  animation:
    cyber-puzzle-blink
    900ms
    steps(1)
    infinite;
}

/* ─────────────────────────
   RESPONSIVE
   ───────────────────────── */

@media (max-width: 600px) {
  .cyber-puzzle {
    width: calc(100vw - 20px);
  }

  .cyber-puzzle-header {
    padding: 13px 14px;
  }

  .cyber-puzzle-system {
    padding-left: 14px;
    padding-right: 14px;
  }

  .cyber-puzzle-modules {
    padding-left: 14px;
    padding-right: 14px;

    gap: 12px;
  }

  .cyber-puzzle-card {
    margin-left: 14px;
    margin-right: 14px;

    padding: 13px;
  }

  .cyber-puzzle-log {
    padding-left: 14px;
    padding-right: 14px;
  }
}

@media (max-width: 440px) {
  .cyber-puzzle-modules {
    gap: 8px;
  }

  .cyber-puzzle-module-status {
    font-size: 7px;
  }

  .cyber-puzzle-date {
    display: none;
  }

  .cyber-puzzle-memory {
    gap: 2px;
  }

  .cyber-puzzle-memory-cell strong {
    font-size: 12px;
  }

  .cyber-puzzle-size {
    grid-template-columns: 1fr;
  }
}
`;
