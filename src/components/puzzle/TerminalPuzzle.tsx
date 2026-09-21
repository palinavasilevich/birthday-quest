import { useEffect, useRef, useState } from "react";

import { useGameStore } from "@/store/game-store";

interface TerminalPuzzleProps {
  puzzleId: string;
  nextScene: string;
}

type LineKind = "cmd" | "out" | "err" | "ok" | "dim";

interface Line {
  text: string;
  kind: LineKind;
}

/*
 * Маленькая файловая система мастерской.
 *
 * Задача: заметить, что у unlock.sh нет права на исполнение,
 * выдать chmod +x и запустить. Всё остальное — обстановка.
 */
const FILES: Record<string, string> = {
  "README.txt": "смена окончена. свет не выключал — пусть горит.",

  "notes.txt": [
    "MI-01 собран и упакован.",
    "сборка простая, инструкция на дне коробки.",
    "",
    "если кто-то дойдёт сюда сам — значит, дошёл правильно.",
  ].join("\n"),

  "unlock.sh": ["#!/bin/sh", "# открывает дверь мастерской", "open_door --now"].join(
    "\n",
  ),
};

const NESTED: Record<string, string> = {
  "parts.list": ["латунные пластины  x14", "шестерни  x6", "винты  x22"].join("\n"),

  "todo.txt": ["шесть ног — ок", "надкрылья — ок", "медвесыч — почти"].join("\n"),
};

/** После скольких команд показать аварийный выход. */
const MERCY_AFTER = 12;

export function TerminalPuzzle({ puzzleId, nextScene }: TerminalPuzzleProps) {
  const setScene = useGameStore((state) => state.setScene);

  const completePuzzle = useGameStore((state) => state.completePuzzle);

  const [cwd, setCwd] = useState<"/workshop" | "/workshop/mi-01">("/workshop");
  const [executable, setExecutable] = useState(false);
  const [commandCount, setCommandCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [value, setValue] = useState("");

  const [lines, setLines] = useState<Line[]>([
    { text: "WORKSHOP CONTROL SYSTEM", kind: "dim" },
    { text: "ACCESS DENIED — дверь заперта изнутри", kind: "err" },
    { text: "", kind: "dim" },
    { text: "доступна оболочка. help — список команд", kind: "dim" },
  ]);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  const inRoot = cwd === "/workshop";

  const finish = () => {
    setIsSolved(true);
    completePuzzle(puzzleId);

    window.setTimeout(() => {
      setScene(nextScene);
    }, 1800);
  };

  const listing = (): Line[] => {
    if (!inRoot) {
      return Object.keys(NESTED).map((name) => ({
        text: `-rw-r--r--  ${name}`,
        kind: "out" as const,
      }));
    }

    return [
      { text: "-rw-r--r--  README.txt", kind: "out" },
      { text: "-rw-r--r--  notes.txt", kind: "out" },
      {
        text: `${executable ? "-rwxr-xr-x" : "-rw-r--r--"}  unlock.sh`,
        kind: executable ? "ok" : "out",
      },
      { text: "drwxr-xr-x  mi-01/", kind: "out" },
    ];
  };

  const run = (raw: string): Line[] => {
    const input = raw.trim();

    if (input === "") {
      return [];
    }

    const [command, ...args] = input.split(/\s+/);

    if (command === "help") {
      return [
        { text: "ls            список файлов", kind: "dim" },
        { text: "cat <файл>    показать содержимое", kind: "dim" },
        { text: "cd <каталог>  перейти (cd .. — назад)", kind: "dim" },
        { text: "chmod +x <файл>  дать право на исполнение", kind: "dim" },
        { text: "./<файл>      запустить", kind: "dim" },
      ];
    }

    if (command === "pwd") {
      return [{ text: cwd, kind: "out" }];
    }

    if (command === "clear") {
      setLines([]);
      return [];
    }

    if (command === "ls") {
      return listing();
    }

    if (command === "cd") {
      const target = args[0];

      if (!target || target === "~" || target === "/workshop") {
        setCwd("/workshop");
        return [];
      }

      if (target === "..") {
        setCwd("/workshop");
        return [];
      }

      if (inRoot && (target === "mi-01" || target === "mi-01/")) {
        setCwd("/workshop/mi-01");
        return [];
      }

      return [{ text: `cd: нет такого каталога: ${target}`, kind: "err" }];
    }

    if (command === "cat") {
      const name = args[0];

      if (!name) {
        return [{ text: "cat: не указан файл", kind: "err" }];
      }

      const source = inRoot ? FILES : NESTED;
      const body = source[name.replace(/^\.\//, "")];

      if (body === undefined) {
        return [{ text: `cat: ${name}: нет такого файла`, kind: "err" }];
      }

      return body.split("\n").map((text) => ({ text, kind: "out" as const }));
    }

    if (command === "chmod") {
      const flag = args[0];
      const name = args[1]?.replace(/^\.\//, "");

      if (flag !== "+x" && flag !== "u+x" && flag !== "755") {
        return [{ text: `chmod: не понимаю режим: ${flag ?? ""}`, kind: "err" }];
      }

      if (!inRoot || name !== "unlock.sh") {
        return [
          { text: `chmod: ${name ?? ""}: нет такого файла`, kind: "err" },
        ];
      }

      setExecutable(true);

      return [{ text: "права изменены: -rwxr-xr-x  unlock.sh", kind: "ok" }];
    }

    if (command === "./unlock.sh" || command === "./unlock") {
      if (!inRoot) {
        return [{ text: "нет такого файла в этом каталоге", kind: "err" }];
      }

      if (!executable) {
        return [
          { text: "sh: ./unlock.sh: Permission denied", kind: "err" },
          { text: "файл не помечен как исполняемый", kind: "dim" },
        ];
      }

      window.setTimeout(finish, 900);

      return [
        { text: "> UNLOCKING", kind: "ok" },
        { text: "> ACCESS GRANTED", kind: "ok" },
        { text: "> WORKSHOP SYSTEM ONLINE", kind: "ok" },
      ];
    }

    if (command.startsWith("./")) {
      return [{ text: `sh: ${command}: нет такого файла`, kind: "err" }];
    }

    return [{ text: `${command}: команда не найдена`, kind: "err" }];
  };

  const submit = () => {
    if (isSolved) {
      return;
    }

    const raw = value;

    setValue("");
    setCommandCount((count) => count + 1);

    const output = run(raw);

    setLines((list) => [
      ...list,
      { text: `${cwd} $ ${raw}`, kind: "cmd" },
      ...output,
    ]);
  };

  const showMercy = commandCount >= MERCY_AFTER && !isSolved;

  return (
    <div
      className="mt-10 flex w-full max-w-2xl flex-col items-center"
      onClick={() => inputRef.current?.focus()}
    >
      <p className="mb-3 min-h-8 text-center font-story text-xl italic text-white/70">
        {isSolved ? "> ACCESS GRANTED" : "Дверь заперта. Но система отвечает."}
      </p>

      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-[#35d6e8]/60">
        Оболочка мастерской
      </p>

      {/* Output */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        className="
          h-72 w-full overflow-y-auto border border-white/10
          bg-black/60 px-4 py-3
          font-mono text-sm leading-relaxed
        "
      >
        {lines.map((line, index) => (
          <p
            key={index}
            className={
              line.kind === "cmd"
                ? "text-[#35d6e8]"
                : line.kind === "err"
                  ? "text-red-400"
                  : line.kind === "ok"
                    ? "text-[#5cf2a0]"
                    : line.kind === "dim"
                      ? "text-white/35"
                      : "text-white/80"
            }
          >
            {line.text || "\u00a0"}
          </p>
        ))}
      </div>

      {/* Input */}
      {!isSolved && (
        <div className="mt-3 flex w-full items-center gap-2 border border-white/10 bg-black/60 px-4 py-2">
          <span className="font-mono text-sm text-[#35d6e8]">$</span>

          <input
            ref={inputRef}
            value={value}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Команда"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            className="
              w-full bg-transparent font-mono text-sm text-white/90
              outline-none placeholder:text-white/25
            "
            placeholder="ls"
          />

          <button
            type="button"
            onClick={submit}
            className="
              shrink-0 cursor-pointer text-xs uppercase tracking-[0.2em]
              text-[#35d6e8]/70 transition-colors hover:text-[#35d6e8]
            "
          >
            ввод
          </button>
        </div>
      )}

      {/* Быстрые команды — набирать с телефона неудобно */}
      {!isSolved && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["ls", "cat notes.txt", "cd mi-01", "cd ..", "help"].map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => {
                setValue(hint);
                inputRef.current?.focus();
              }}
              className="
                border border-white/15 px-3 py-1.5
                font-mono text-xs text-white/50
                transition-colors hover:border-[#35d6e8]/50 hover:text-[#35d6e8]
              "
            >
              {hint}
            </button>
          ))}
        </div>
      )}

      {showMercy && (
        <button
          type="button"
          onClick={finish}
          className="
            mt-8 cursor-pointer text-xs uppercase tracking-[0.2em]
            text-white/40 transition-colors hover:text-[#ff9b00]
          "
        >
          Аварийная разблокировка
        </button>
      )}
    </div>
  );
}
