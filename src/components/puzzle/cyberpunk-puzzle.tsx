import { useGameStore } from "@/store/game-store";
import { useEffect, useRef, useState } from "react";

interface CyberpunkPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

type LineKind = "cmd" | "err" | "warn" | "ok" | "dim" | "sys";
type Line = { text: string; kind: LineKind };

type Segment = {
  code: string[];
  answer: string;
  hint: string;
};

const SEGMENTS: Segment[] = [
  {
    code: ["int a = 7, b = 2;", "", "std::cout << a / b * 2;"],
    answer: "6",
    hint: "// целочисленное деление отбрасывает дробную часть",
  },
  {
    code: [
      "int arr[] = {4, 8, 15, 16, 23, 42};",
      "int* p = arr + 2;",
      "",
      "std::cout << *(p + 1) - *arr;",
    ],
    answer: "12",
    hint: "// p указывает на arr[2]",
  },
  {
    code: [
      "// target: x86_64, sizeof(int) == 4",
      "int data[8];",
      "int* p = data;",
      "",
      "std::cout << sizeof(data) / sizeof(*data)",
      "          << sizeof(p) / sizeof(*p);",
    ],
    answer: "82",
    hint: "// массив знает свой размер, указатель — нет",
  },
];

export default function CyberpunkPuzzle({
  puzzleId,
  nextScene,
}: CyberpunkPuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [stage, setStage] = useState(0);
  const [input, setInput] = useState("");
  const [misses, setMisses] = useState(0);
  const [solved, setSolved] = useState(false);
  const [log, setLog] = useState<Line[]>([
    { text: "> WORKSHOP CONTROL SYSTEM", kind: "sys" },
    { text: "> ACCESS CODE REQUIRED", kind: "sys" },
    { text: "$ ./keygen", kind: "cmd" },
    { text: "bash: ./keygen: COMPILER NOT FOUND", kind: "err" },
    { text: "> выполни программу сам и введи её вывод", kind: "dim" },
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  const seg = SEGMENTS[stage];
  const showHint = misses >= 2 && !solved;
  const showForce = misses >= 3 && !solved;

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [log]);

  function push(...lines: Line[]) {
    setLog((prev) => [...prev, ...lines]);
  }

  function advance(forced: boolean) {
    const last = stage === SEGMENTS.length - 1;
    push(
      { text: "stdout: " + seg.answer, kind: "dim" },
      {
        text: forced
          ? "> SEGMENT " + (stage + 1) + " BYPASSED"
          : "> SEGMENT " + (stage + 1) + " ACCEPTED",
        kind: forced ? "warn" : "ok",
      },
    );
    if (last) {
      push(
        { text: "> ACCESS GRANTED", kind: "ok" },
        { text: "> WORKSHOP SYSTEM ONLINE", kind: "ok" },
      );
      setSolved(true);
    } else {
      setStage((s) => s + 1);
      setMisses(0);
      setInput("");
    }
  }

  function submit() {
    if (solved) return;
    const value = input.trim();
    if (value === "") return;

    push({ text: "> " + value, kind: "cmd" });

    if (value === seg.answer) {
      advance(false);
      return;
    }

    const next = misses + 1;
    setMisses(next);
    setInput("");
    push({ text: "> MISMATCH", kind: "err" });
    if (next === 2) {
      push({ text: "> в исходнике найден комментарий автора", kind: "dim" });
    }
    if (next === 3) {
      push({ text: "> доступен аварийный запуск сегмента", kind: "warn" });
    }
  }

  function onSolve() {
    completePuzzle(puzzleId);

    window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);
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
        .mi01-head {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: 12px; color: var(--dim); margin-bottom: 10px;
        }
        .mi01-dots { letter-spacing: 3px; color: var(--line); }
        .mi01-dots b { color: var(--ok); font-weight: normal; }
        .mi01-code {
          background: var(--panel);
          border-left: 2px solid var(--line);
          padding: 12px 14px;
          margin: 0;
          overflow-x: auto;
          white-space: pre;
        }
        .mi01-comment { color: var(--dim); }
        .mi01-ask { margin: 14px 0 10px; color: var(--dim); }
        .mi01-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .mi01-input {
          flex: 1 1 140px; min-width: 120px;
          background: var(--panel); color: var(--fg);
          border: 1px solid var(--line); border-radius: 3px;
          padding: 10px 12px; font: inherit; min-height: 42px;
        }
        .mi01-input:focus { outline: none; border-color: var(--accent); }
        .mi01-btn {
          background: var(--ok); color: #041a0f; border: 0; border-radius: 3px;
          padding: 10px 18px; font: inherit; font-weight: 600; cursor: pointer;
          min-height: 42px;
        }
        .mi01-btn:disabled { background: var(--line); color: var(--dim); cursor: default; }
        .mi01-force {
          background: none; color: var(--warn); border: 1px solid var(--warn);
          border-radius: 3px; padding: 10px 14px; font: inherit; cursor: pointer;
          min-height: 42px;
        }
        .mi01-force:hover { background: var(--warn); color: #1a1204; }
        .mi01-btn:focus-visible, .mi01-force:focus-visible, .mi01-input:focus-visible {
          outline: 2px solid var(--accent); outline-offset: 2px;
        }
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
        @media (prefers-reduced-motion: reduce) { .mi01-cursor { animation: none; } }
      `}</style>

      <div className="mi01-head">
        <span>keygen.cpp</span>
        <span
          className="mi01-dots"
          aria-label={`Сегмент ${stage + 1} из ${SEGMENTS.length}`}
        >
          {SEGMENTS.map((_, i) =>
            i < stage || solved ? (
              <b key={i}>●</b>
            ) : (
              <span key={i}>{i === stage ? "●" : "○"}</span>
            ),
          )}
        </span>
      </div>

      <pre className="mi01-code">
        {showHint && <span className="mi01-comment">{seg.hint + "\n"}</span>}
        {seg.code.map((l, i) => (
          <span
            key={i}
            className={
              l.trimStart().startsWith("//") ? "mi01-comment" : undefined
            }
          >
            {l + "\n"}
          </span>
        ))}
      </pre>

      {!solved ? (
        <>
          <p className="mi01-ask">Что напечатает эта программа?</p>
          <div className="mi01-row">
            <input
              className="mi01-input"
              value={input}
              inputMode="numeric"
              spellCheck={false}
              autoComplete="off"
              placeholder="stdout"
              aria-label="Вывод программы"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button
              className="mi01-btn"
              onClick={submit}
              disabled={input.trim() === ""}
            >
              Ввести
            </button>
            {showForce && (
              <button className="mi01-force" onClick={() => advance(true)}>
                FORCE RUN
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="mi01-row" style={{ marginTop: 14 }}>
          <button className="mi01-btn" onClick={onSolve}>
            Войти в мастерскую
          </button>
        </div>
      )}

      <div className="mi01-log" ref={logRef} role="log" aria-live="polite">
        {log.map((l, i) => (
          <p key={i} className={"mi01-" + l.kind}>
            {l.text}
          </p>
        ))}
        {!solved && <p className="mi01-cursor">_</p>}
      </div>
    </div>
  );
}
