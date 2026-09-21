import { useEffect, useRef, useState } from "react";

/**
 * Мини-игра второй главы: терминал мастерской.
 * Соответствует puzzle: { id: "chapter2-cpp", type: "cyberpunk" }
 *
 * Подключение в рендерере головоломок:
 *   case "cyberpunk":
 *     return <CyberpunkPuzzle onSolve={() => goToScene(puzzle.nextScene)} />;
 */

type Props = {
  onSolve: () => void;
};

type LineKind = "cmd" | "err" | "warn" | "ok" | "dim" | "sys";
type Line = { text: string; kind: LineKind };

const TRAY = ["access", "system", "unlock()", "=", "==", "0", "1", ";"];

const strip = (s: string) => s.replace(/\s+/g, "");

/** Ответ терминала на собранную строку. */
function compile(raw: string): { lines: Line[]; solved: boolean } {
  const s = strip(raw);

  const denied: Line = { text: "> ACCESS DENIED", kind: "err" };
  const compiled: Line = { text: "main.cpp: сборка завершена", kind: "dim" };

  if (s === "") {
    return {
      solved: false,
      lines: [
        {
          text: "main.cpp:6:5: error: expected statement before '}' token",
          kind: "err",
        },
      ],
    };
  }

  if (s === "access=1;") {
    return {
      solved: true,
      lines: [
        compiled,
        { text: "> RUNNING", kind: "dim" },
        { text: "> ACCESS GRANTED", kind: "ok" },
        { text: "> WORKSHOP SYSTEM ONLINE", kind: "ok" },
      ],
    };
  }

  if (s === "access==1;" || s === "system==1;") {
    return {
      solved: false,
      lines: [
        {
          text: "main.cpp:6:12: warning: statement has no effect [-Wunused-value]",
          kind: "warn",
        },
        compiled,
        denied,
      ],
    };
  }

  if (s === "1=access;" || /^[01]=/.test(s)) {
    return {
      solved: false,
      lines: [
        {
          text: "main.cpp:6:7: error: lvalue required as left operand of assignment",
          kind: "err",
        },
      ],
    };
  }

  if (s === "access=0;") {
    return {
      solved: false,
      lines: [compiled, { text: "> RUNNING", kind: "dim" }, denied],
    };
  }

  if (s === "system=1;" || s === "system=0;") {
    return {
      solved: false,
      lines: [
        compiled,
        { text: "> SYSTEM STATE UNCHANGED", kind: "dim" },
        denied,
      ],
    };
  }

  if (s === "unlock();") {
    return {
      solved: false,
      lines: [
        compiled,
        { text: "> UNAUTHORIZED CALL", kind: "err" },
        { text: "> SECURITY LOG UPDATED", kind: "warn" },
        denied,
      ],
    };
  }

  if (!s.endsWith(";")) {
    return {
      solved: false,
      lines: [
        {
          text: "main.cpp:6:17: error: expected ';' before '}' token",
          kind: "err",
        },
      ],
    };
  }

  return {
    solved: false,
    lines: [
      { text: "main.cpp:6:5: error: expected primary-expression", kind: "err" },
    ],
  };
}

export default function CyberpunkPuzzle({ onSolve }: Props) {
  const [slot, setSlot] = useState<string[]>([]);
  const [log, setLog] = useState<Line[]>([
    { text: "> WORKSHOP CONTROL SYSTEM", kind: "sys" },
    { text: "> ACCESS DENIED", kind: "err" },
    { text: "> AUTHORIZATION REQUIRED", kind: "sys" },
  ]);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [manual, setManual] = useState(false);
  const [typed, setTyped] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const source = manual ? typed : slot.join(" ");
  const hint = attempts >= 3 && !solved;

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [log]);

  function run() {
    if (solved) return;
    const result = compile(source);
    setLog((prev) => [
      ...prev,
      { text: `$ g++ main.cpp -o access && ./access`, kind: "cmd" },
      ...result.lines,
    ]);
    if (result.solved) setSolved(true);
    else setAttempts((a) => a + 1);
  }

  return (
    <div className="mi01">
      <style>{`
        .mi01 {
          --bg: #070f0c;
          --panel: #0c1713;
          --line: #1d3a2e;
          --fg: #9be8b4;
          --dim: #4e7a65;
          --ok: #5cf2a0;
          --warn: #e8b04b;
          --err: #ff5d73;
          --accent: #35d6e8;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          color: var(--fg);
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 16px;
          max-width: 640px;
          margin: 0 auto;
          font-size: 14px;
          line-height: 1.55;
        }
        .mi01 pre { margin: 0; white-space: pre-wrap; }
        .mi01-code {
          background: var(--panel);
          border-left: 2px solid var(--line);
          padding: 12px 14px;
          overflow-x: auto;
        }
        .mi01-slot {
          display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
          min-height: 34px; padding: 4px 0 4px 16px;
        }
        .mi01-empty { color: var(--dim); }
        .mi01-chip {
          background: transparent; color: var(--fg);
          border: 1px solid var(--line); border-radius: 3px;
          padding: 5px 10px; font: inherit; cursor: pointer;
          min-height: 32px;
        }
        .mi01-chip:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
        .mi01-chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .mi01-chip:disabled { opacity: .4; cursor: default; }
        .mi01-placed { border-color: var(--accent); color: var(--accent); }
        .mi01-tray { display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0; }
        .mi01-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .mi01-run {
          background: var(--ok); color: #041a0f; border: 0; border-radius: 3px;
          padding: 9px 18px; font: inherit; font-weight: 600; cursor: pointer;
          min-height: 40px;
        }
        .mi01-run:disabled { background: var(--line); color: var(--dim); cursor: default; }
        .mi01-text {
          background: none; border: 0; color: var(--dim); font: inherit;
          text-decoration: underline; cursor: pointer; padding: 4px;
        }
        .mi01-text:hover { color: var(--accent); }
        .mi01-input {
          width: 100%; background: var(--panel); color: var(--fg);
          border: 1px solid var(--line); border-radius: 3px;
          padding: 9px 10px; font: inherit;
        }
        .mi01-input:focus { outline: none; border-color: var(--accent); }
        .mi01-log {
          background: var(--panel); border-top: 1px solid var(--line);
          margin-top: 14px; padding: 12px 14px; max-height: 190px; overflow-y: auto;
        }
        .mi01-log p { margin: 0 0 2px; }
        .mi01-cmd  { color: var(--accent); }
        .mi01-err  { color: var(--err); }
        .mi01-warn { color: var(--warn); }
        .mi01-ok   { color: var(--ok); }
        .mi01-dim, .mi01-sys { color: var(--dim); }
        .mi01-cursor { animation: mi01blink 1.1s step-end infinite; }
        @keyframes mi01blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .mi01-cursor { animation: none; }
        }
      `}</style>

      <pre className="mi01-code">
        {`int access = 0;
int system = 1;

if (system == 1)
{`}
        {hint && (
          <span className="mi01-dim">
            {"\n    // левый операнд получает значение правого"}
          </span>
        )}
        {"\n    "}
        <span className="mi01-slot">
          {slot.length === 0 && !manual && (
            <span className="mi01-empty">// your code</span>
          )}
          {!manual &&
            slot.map((t, i) => (
              <button
                key={`${t}-${i}`}
                className="mi01-chip mi01-placed"
                disabled={solved}
                onClick={() => setSlot((s) => s.filter((_, j) => j !== i))}
                aria-label={`Убрать ${t}`}
              >
                {t}
              </button>
            ))}
          {manual && (
            <input
              className="mi01-input"
              value={typed}
              disabled={solved}
              placeholder="// your code"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              aria-label="Строка кода"
            />
          )}
        </span>
        {`
}

if (access == 1)
{
    unlock();
}`}
      </pre>

      {!manual && (
        <div className="mi01-tray">
          {TRAY.map((t) => (
            <button
              key={t}
              className="mi01-chip"
              disabled={solved}
              onClick={() => setSlot((s) => [...s, t])}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mi01-bar">
        {!solved ? (
          <>
            <button className="mi01-run" onClick={run}>
              Компилировать
            </button>
            {!manual && slot.length > 0 && (
              <button className="mi01-text" onClick={() => setSlot([])}>
                Очистить
              </button>
            )}
            <button
              className="mi01-text"
              onClick={() => {
                setManual((m) => !m);
                setSlot([]);
                setTyped("");
              }}
            >
              {manual ? "Собрать из блоков" : "Ввести вручную"}
            </button>
          </>
        ) : (
          <button className="mi01-run" onClick={onSolve}>
            Войти в мастерскую
          </button>
        )}
      </div>

      <div className="mi01-log" ref={logRef} role="log" aria-live="polite">
        {log.map((l, i) => (
          <p key={i} className={`mi01-${l.kind}`}>
            {l.text}
          </p>
        ))}
        {!solved && <p className="mi01-cursor">_</p>}
      </div>
    </div>
  );
}
