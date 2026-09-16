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
    <div className="mi01-options">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          className={
            selected === value ? "mi01-option is-selected" : "mi01-option"
          }
          onClick={() => onSelect(value)}
        >
          {labels?.[value] ?? value}
        </button>
      ))}
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
  ]);

  const currentModule = MODULES[moduleIndex];

  useEffect(() => {
    if (!solved) return;

    const timer = window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [solved, nextScene, setScene]);

  function pushLog(...lines: string[]) {
    setLog((previous) => [...previous, ...lines]);
  }

  function checkAnswer() {
    if (!selected) return;

    pushLog(`> INPUT: ${selected}`);

    if (selected !== ANSWERS[currentModule.id]) {
      pushLog("> MISMATCH", "> RECOVERY ATTEMPT FAILED");
      setSelected(null);
      return;
    }

    pushLog(`> ${currentModule.title}: OK`);

    if (moduleIndex === MODULES.length - 1) {
      pushLog(
        "> MODULE 03 ............... ONLINE",
        "> MEMORY ................ OK",
        "> LOGIC .................. OK",
        "> OUTPUT ................. OK",
        ">",
        "> COMPILATION SUCCESSFUL",
        "> ACCESS GRANTED",
        "> WORKSHOP DOOR: UNLOCKED",
      );

      completePuzzle(puzzleId);
      setSolved(true);
      return;
    }

    setModuleIndex((index) => index + 1);
    setSelected(null);
  }

  return (
    <div className="mi01">
      <style>{STYLES}</style>

      <div className="mi01-head">
        <div>
          <div className="mi01-system">WORKSHOP // SYSTEM REPAIR</div>

          <div className="mi01-status">
            {solved
              ? "SYSTEM ONLINE"
              : `RECOVERY MODE · MODULE 0${moduleIndex + 1}`}
          </div>
        </div>

        <div
          className="mi01-dots"
          aria-label={`Модуль ${moduleIndex + 1} из ${MODULES.length}`}
        >
          {MODULES.map((module, index) => (
            <span
              key={module.id}
              className={
                index < moduleIndex || solved
                  ? "is-complete"
                  : index === moduleIndex
                    ? "is-active"
                    : ""
              }
            >
              {index < moduleIndex || solved ? "●" : "○"}
            </span>
          ))}
        </div>
      </div>

      {!solved ? (
        <>
          <section className="mi01-module">
            <div className="mi01-module-number">MODULE 0{moduleIndex + 1}</div>

            <h2>{currentModule.title}</h2>

            <p>{currentModule.description}</p>
          </section>

          {currentModule.id === "memory" && (
            <>
              <pre className="mi01-code">{`int data[] = {4, 8, 15, 16, 23, 42};

int* p = data + 2;

std::cout << *(p + 1);`}</pre>

              <div className="mi01-memory">
                {[4, 8, 15, 16, 23, 42].map((value, index) => (
                  <div className="mi01-memory-cell" key={value}>
                    <strong>{value}</strong>
                    <small>data[{index}]</small>

                    {index === 2 && <b>p</b>}
                  </div>
                ))}
              </div>

              <p className="mi01-question">Какое значение будет выведено?</p>

              <Options
                values={["15", "16", "23", "42"]}
                selected={selected}
                onSelect={setSelected}
              />
            </>
          )}

          {currentModule.id === "logic" && (
            <>
              <pre className="mi01-code">{`int power = 7;
int core = 2;

std::cout << power / core * 2;`}</pre>

              <div className="mi01-calculation">
                <span>7</span>
                <b>/</b>
                <span>2</span>
                <b>*</b>
                <span>2</span>
                <b>=</b>
                <span>?</span>
              </div>

              <p className="mi01-question">Что получит система?</p>

              <Options
                values={["3", "6", "7", "8"]}
                selected={selected}
                onSelect={setSelected}
              />
            </>
          )}

          {currentModule.id === "size" && (
            <>
              <pre className="mi01-code">{`int data[8];
int* p = data;

sizeof(data)
sizeof(p)`}</pre>

              <div className="mi01-size-memory">
                <div className="mi01-memory-block">
                  <strong>data</strong>

                  <div className="mi01-array">
                    {Array.from({ length: 8 }, (_, index) => (
                      <span key={index}>{index}</span>
                    ))}
                  </div>

                  <small>8 elements</small>
                </div>

                <div className="mi01-memory-block">
                  <strong>p</strong>

                  <div className="mi01-pointer">────────► data[0]</div>

                  <small>address</small>
                </div>
              </div>

              <p className="mi01-question">
                Что знает компилятор о data, чего не знает о p?
              </p>

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
            className="mi01-btn execute"
            disabled={!selected}
            onClick={checkAnswer}
          >
            EXECUTE
          </button>
        </>
      ) : (
        <div className="mi01-success">
          <div className="mi01-success-title">SYSTEM ONLINE</div>

          <p>Контрольный модуль восстановлен.</p>

          <p className="mi01-dim-text">WORKSHOP DOOR ........ UNLOCKED</p>

          <div className="mi01-progress">Переход в мастерскую...</div>
        </div>
      )}

      <div className="mi01-log" role="log" aria-live="polite">
        {log.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}

        {!solved && <p className="mi01-cursor">_</p>}
      </div>
    </div>
  );
}

const STYLES = `
.mi01 {
  width: min(680px, calc(100vw - 40px));
  margin: 0 auto;
  box-sizing: border-box;

  background:
    linear-gradient(
      180deg,
      rgba(5, 22, 15, 0.97) 0%,
      rgba(3, 15, 11, 0.985) 100%
    );

  border: 1px solid rgba(61, 194, 127, 0.24);
  border-radius: 3px;

  color: #9be6bd;

  font-family:
    "JetBrains Mono",
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    monospace;

  box-shadow:
    0 14px 45px rgba(0, 0, 0, 0.52),
    inset 0 0 45px rgba(40, 180, 110, 0.025);

  overflow: hidden;
}


/* ─────────────────────────────
   HEADER
   ───────────────────────────── */

.mi01-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 15px 19px 13px;

  border-bottom: 1px solid rgba(61, 194, 127, 0.15);
}

.mi01-system {
  color: #43e996;

  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.08em;
}

.mi01-status {
  margin-top: 6px;

  color: #416c58;

  font-size: 9px;
  letter-spacing: 0.06em;
}

.mi01-dots {
  display: flex;
  gap: 8px;

  padding-top: 2px;

  color: #214333;

  font-size: 9px;
  line-height: 1;
}

.mi01-dots span {
  transition:
    color 150ms ease,
    text-shadow 150ms ease;
}

.mi01-dots span.is-active {
  color: #18d5d8;

  text-shadow:
    0 0 7px rgba(24, 213, 216, 0.45);
}

.mi01-dots span.is-complete {
  color: #43e996;

  text-shadow:
    0 0 6px rgba(67, 233, 150, 0.3);
}


/* ─────────────────────────────
   MODULE
   ───────────────────────────── */

.mi01-module {
  padding: 18px 19px 0;
}

.mi01-module-number {
  margin-bottom: 5px;

  color: #19cdd1;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.1em;
}

.mi01-module h2 {
  margin: 0;

  color: #a5dfb8;

  font-size: 19px;
  line-height: 1.25;
  font-weight: 600;

  letter-spacing: 0.03em;
}

.mi01-module p {
  margin: 7px 0 0;

  color: #527765;

  font-size: 10px;
  line-height: 1.5;
}


/* ─────────────────────────────
   CODE
   ───────────────────────────── */

.mi01-code {
  margin: 16px 19px 0;
  padding: 13px 15px;

  box-sizing: border-box;

  background: rgba(1, 9, 6, 0.72);

  border: 1px solid rgba(61, 194, 127, 0.15);
  border-left: 2px solid #18d5d8;
  border-radius: 2px;

  color: #c4e3cf;

  font-family: inherit;
  font-size: 11px;
  line-height: 1.65;

  white-space: pre-wrap;
  overflow-x: auto;
}


/* ─────────────────────────────
   MEMORY
   ───────────────────────────── */

.mi01-memory {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));

  gap: 5px;

  margin: 16px 19px 0;
}

.mi01-memory-cell {
  position: relative;

  min-width: 0;

  padding: 9px 4px 7px;

  text-align: center;

  background: rgba(7, 28, 21, 0.72);

  border: 1px solid rgba(61, 194, 127, 0.15);
  border-radius: 2px;
}

.mi01-memory-cell strong {
  display: block;

  color: #91dca8;

  font-size: 15px;
  line-height: 1.15;
}

.mi01-memory-cell small {
  display: block;

  margin-top: 4px;

  color: #345644;

  font-size: 7px;
}

.mi01-memory-cell b {
  position: absolute;

  top: -14px;
  left: 50%;

  transform: translateX(-50%);

  color: #19d5d8;

  font-size: 8px;
  font-weight: 500;
}


/* ─────────────────────────────
   QUESTION
   ───────────────────────────── */

.mi01-question {
  margin: 17px 19px 9px;

  color: #8ed5a4;

  font-size: 11px;
  line-height: 1.45;
  font-weight: 600;
}


/* ─────────────────────────────
   OPTIONS
   ───────────────────────────── */

.mi01-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 5px;

  margin: 0 19px;
}

.mi01-option {
  min-height: 36px;

  padding: 7px 10px;

  border: 1px solid rgba(61, 194, 127, 0.16);
  border-radius: 2px;

  background: rgba(7, 28, 21, 0.72);

  color: #8ed2a3;

  font-family: inherit;
  font-size: 10px;

  cursor: pointer;

  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease;
}

.mi01-option:hover {
  border-color: rgba(67, 233, 150, 0.34);

  background: rgba(13, 45, 32, 0.8);

  color: #b1e7c1;
}

.mi01-option.is-selected {
  border-color: #19d5d8;

  background: rgba(25, 213, 216, 0.07);

  color: #b6ffff;

  box-shadow:
    0 0 7px rgba(25, 213, 216, 0.04);
}


/* ─────────────────────────────
   EXECUTE
   ───────────────────────────── */

.mi01-btn {
  width: calc(100% - 38px);

  margin: 9px 19px 0;

  min-height: 38px;

  border: 1px solid rgba(67, 233, 150, 0.1);
  border-radius: 2px;

  background: #17392c;

  color: #507963;

  font-family: inherit;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.05em;

  cursor: pointer;
}

.mi01-btn:not(:disabled):hover {
  background: #1d4c38;
  color: #9eddb1;
}

.mi01-btn:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}


/* ─────────────────────────────
   CALCULATION
   ───────────────────────────── */

.mi01-calculation {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  margin: 16px 19px 0;
  padding: 11px;

  background: rgba(7, 28, 21, 0.58);

  border: 1px solid rgba(61, 194, 127, 0.14);
}

.mi01-calculation span {
  color: #91dca8;
  font-size: 17px;
}

.mi01-calculation b {
  color: #19d5d8;
  font-size: 11px;
  font-weight: 500;
}


/* ─────────────────────────────
   SIZE MODULE
   ───────────────────────────── */

.mi01-size-memory {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 6px;

  margin: 16px 19px 0;
}

.mi01-memory-block {
  padding: 11px;

  background: rgba(7, 28, 21, 0.62);

  border: 1px solid rgba(61, 194, 127, 0.14);
}

.mi01-memory-block > strong {
  display: block;

  margin-bottom: 8px;

  color: #8ed5a4;

  font-size: 10px;
}

.mi01-memory-block small {
  display: block;

  margin-top: 6px;

  color: #345644;

  font-size: 7px;
}

.mi01-array {
  display: grid;
  grid-template-columns: repeat(8, 1fr);

  gap: 2px;
}

.mi01-array span {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 23px;

  border: 1px solid rgba(61, 194, 127, 0.12);

  background: rgba(12, 42, 30, 0.52);

  color: #6db388;

  font-size: 7px;
}

.mi01-pointer {
  min-height: 23px;

  display: flex;
  align-items: center;

  color: #19d5d8;

  font-size: 8px;

  white-space: nowrap;
}


/* ─────────────────────────────
   LOG
   ───────────────────────────── */

.mi01-log {
  margin-top: 14px;

  padding: 9px 19px 11px;

  min-height: 48px;

  background: rgba(0, 7, 4, 0.5);

  border-top: 1px solid rgba(61, 194, 127, 0.12);

  color: #345846;

  font-size: 8px;
  line-height: 1.55;
}

.mi01-log p {
  margin: 0;
}

.mi01-cursor {
  display: inline-block;

  color: #43e996;

  animation: mi01-blink 900ms steps(1) infinite;
}

@keyframes mi01-blink {
  0%, 49% {
    opacity: 1;
  }

  50%, 100% {
    opacity: 0;
  }
}


/* ─────────────────────────────
   SUCCESS
   ───────────────────────────── */

.mi01-success {
  min-height: 360px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  padding: 30px 20px;
}

.mi01-success-title {
  color: #43e996;

  font-size: 21px;
  font-weight: 700;

  letter-spacing: 0.08em;

  text-shadow:
    0 0 16px rgba(67, 233, 150, 0.25);
}

.mi01-success p {
  margin: 9px 0 0;

  color: #527765;

  font-size: 10px;
}

.mi01-success .mi01-dim-text {
  margin-top: 18px;

  color: #345644;

  font-size: 9px;
}

.mi01-progress {
  margin-top: 23px;

  color: #19d5d8;

  font-size: 9px;

  animation: mi01-pulse 1.4s ease-in-out infinite;
}

@keyframes mi01-pulse {
  0%, 100% {
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }
}


/* ─────────────────────────────
   RESPONSIVE
   ───────────────────────────── */

@media (max-width: 700px) {
  .mi01 {
    width: calc(100vw - 24px);
  }
}

@media (max-width: 520px) {
  .mi01 {
    width: calc(100vw - 14px);
  }

  .mi01-head {
    padding: 13px 14px 12px;
  }

  .mi01-system {
    font-size: 11px;
  }

  .mi01-module {
    padding: 16px 14px 0;
  }

  .mi01-code,
  .mi01-memory,
  .mi01-question,
  .mi01-options,
  .mi01-size-memory,
  .mi01-calculation {
    margin-left: 14px;
    margin-right: 14px;
  }

  .mi01-btn {
    width: calc(100% - 28px);
    margin-left: 14px;
    margin-right: 14px;
  }

  .mi01-log {
    padding-left: 14px;
    padding-right: 14px;
  }

  .mi01-module h2 {
    font-size: 17px;
  }

  .mi01-code {
    font-size: 10px;
  }
}

@media (max-width: 400px) {
  .mi01-size-memory {
    grid-template-columns: 1fr;
  }

  .mi01-calculation {
    gap: 8px;
  }
}
`;
