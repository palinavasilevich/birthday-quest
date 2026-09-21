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

  /*
   * Терминал стоит снаружи, в переулке. Про MI-01 здесь знать
   * ещё нельзя: коробку он увидит только внутри мастерской.
   */
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
  --bg: #070f0c;
  --panel: #0c1713;
  --line: #1d3a2e;
  --fg: #9be8b4;
  --dim: #4e7a65;
  --ok: #5cf2a0;
  --accent: #35d6e8;
  --err: #ff5d73;

  width: min(100%, 720px);
  margin: 0 auto;
  padding: 18px;
  color: var(--fg);
  background:
    radial-gradient(
      circle at 50% 0%,
      #10251b 0%,
      var(--bg) 55%
    );
  border: 1px solid var(--line);
  border-radius: 5px;
  box-shadow: 0 20px 70px rgba(0, 0, 0, .45);
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;
  font-size: 14px;
  line-height: 1.55;
}

.mi01-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.mi01-system {
  color: var(--ok);
  letter-spacing: .08em;
  font-weight: 700;
}

.mi01-status {
  margin-top: 3px;
  color: var(--dim);
  font-size: 11px;
  letter-spacing: .06em;
}

.mi01-dots {
  display: flex;
  gap: 8px;
  color: var(--line);
}

.mi01-dots .is-active {
  color: var(--accent);
}

.mi01-dots .is-complete {
  color: var(--ok);
}

.mi01-module {
  padding: 18px 0 12px;
}

.mi01-module-number {
  color: var(--accent);
  font-size: 11px;
  letter-spacing: .12em;
}

.mi01-module h2 {
  margin: 4px 0;
  font-size: 20px;
}

.mi01-module p {
  margin: 0;
  color: var(--dim);
}

.mi01-code {
  margin: 10px 0;
  padding: 15px;
  overflow-x: auto;
  background: var(--panel);
  border: 1px solid var(--line);
  border-left: 2px solid var(--accent);
  color: #c6f4d3;
}

.mi01-memory,
.mi01-size-memory {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding: 14px 0;
}

/*
 * Маркер p висит над ячейкой (top: -18px), а overflow-x: auto
 * делает скроллящимся и вертикальное переполнение — без запаса
 * сверху подпись обрезается.
 */
.mi01-memory {
  padding-top: 26px;
}

.mi01-memory-cell {
  position: relative;
  min-width: 72px;
  padding: 9px 6px;
  text-align: center;
  background: var(--panel);
  border: 1px solid var(--line);
}

.mi01-memory-cell strong {
  display: block;
  font-size: 18px;
}

.mi01-memory-cell small,
.mi01-memory-block small {
  display: block;
  color: var(--dim);
  font-size: 9px;
}

.mi01-memory-cell b {
  position: absolute;
  left: 50%;
  top: -18px;
  transform: translateX(-50%);
  color: var(--accent);
  font-size: 11px;
  font-weight: 400;
}

.mi01-question {
  margin: 16px 0 10px;
}

.mi01-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.mi01-option {
  min-height: 44px;
  padding: 9px 12px;
  color: var(--fg);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 3px;
  font: inherit;
  cursor: pointer;
}

.mi01-option:hover {
  border-color: var(--accent);
}

.mi01-option.is-selected {
  color: #041a0f;
  background: var(--ok);
  border-color: var(--ok);
}

.mi01-btn {
  min-height: 44px;
  padding: 10px 20px;
  color: #041a0f;
  background: var(--ok);
  border: 0;
  border-radius: 3px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.mi01-btn:hover {
  filter: brightness(1.08);
}

.mi01-btn:disabled {
  color: var(--dim);
  background: var(--line);
  cursor: default;
}

.execute {
  width: 100%;
}

.mi01-calculation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin: 26px 0;
  font-size: 28px;
}

.mi01-calculation b {
  color: var(--accent);
}

.mi01-memory-block {
  flex: 1 1 240px;
  padding: 14px;
  background: var(--panel);
  border: 1px solid var(--line);
}

.mi01-array {
  display: flex;
  margin: 12px 0 7px;
}

.mi01-array span {
  width: 35px;
  padding: 7px 0;
  text-align: center;
  border: 1px solid var(--line);
  border-right: 0;
}

.mi01-array span:last-child {
  border-right: 1px solid var(--line);
}

.mi01-pointer {
  margin: 14px 0 7px;
  color: var(--accent);
}

.mi01-success {
  padding: 80px 0;
  text-align: center;
}

.mi01-success-title {
  margin-bottom: 12px;
  color: var(--ok);
  font-size: 28px;
  letter-spacing: .08em;
}

.mi01-dim-text {
  color: var(--dim);
}

.mi01-progress {
  margin-top: 28px;
  color: var(--accent);
  animation: mi01-pulse 1.5s ease-in-out infinite;
}

.mi01-log {
  max-height: 180px;
  overflow-y: auto;
  margin-top: 18px;
  padding: 12px 14px;
  background: #050b08;
  border-top: 1px solid var(--line);
  color: var(--dim);
  font-size: 12px;
}

.mi01-log p {
  margin: 0 0 2px;
}

.mi01-cursor {
  color: var(--ok);
  animation: mi01-blink 1s step-end infinite;
}

@keyframes mi01-blink {
  50% { opacity: 0; }
}

@keyframes mi01-pulse {
  50% { opacity: .45; }
}

@media (prefers-reduced-motion: reduce) {
  .mi01-cursor,
  .mi01-progress {
    animation: none;
  }
}

@media (max-width: 520px) {
  .mi01 {
    padding: 12px;
  }

  .mi01-head {
    flex-direction: column;
  }

  .mi01-options {
    grid-template-columns: 1fr;
  }

  .mi01-calculation {
    gap: 8px;
    font-size: 22px;
  }
}
`;
