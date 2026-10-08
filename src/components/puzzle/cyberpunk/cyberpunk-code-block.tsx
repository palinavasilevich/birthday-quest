import { useState } from "react";

interface CppCodeBlockProps {
  code: string;
  showCopy?: boolean;
}

const KEYWORDS = new Set([
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

const TYPES = new Set([
  "std",
  "cout",
  "cin",
  "endl",
  "iostream",
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightCppLine(line: string) {
  const tokens: string[] = [];

  let i = 0;

  while (i < line.length) {
    /*
     * COMMENTS
     */
    if (line.startsWith("//", i)) {
      tokens.push(
        `<span style="color:#596057">${escapeHtml(line.slice(i))}</span>`,
      );
      break;
    }

    /*
     * PREPROCESSOR
     */
    if (line[i] === "#") {
      const match = line.slice(i).match(/^#\w+/);

      if (match) {
        tokens.push(
          `<span style="color:#7fc7d4">${escapeHtml(match[0])}</span>`,
        );

        i += match[0].length;
        continue;
      }
    }

    /*
     * STRING
     */
    if (line[i] === '"') {
      let end = i + 1;

      while (end < line.length) {
        if (line[end] === '"' && line[end - 1] !== "\\") {
          end++;
          break;
        }

        end++;
      }

      tokens.push(
        `<span style="color:#9acb7b">${escapeHtml(
          line.slice(i, end),
        )}</span>`,
      );

      i = end;
      continue;
    }

    /*
     * CHARACTER
     */
    if (line[i] === "'") {
      let end = i + 1;

      while (end < line.length) {
        if (line[end] === "'" && line[end - 1] !== "\\") {
          end++;
          break;
        }

        end++;
      }

      tokens.push(
        `<span style="color:#9acb7b">${escapeHtml(
          line.slice(i, end),
        )}</span>`,
      );

      i = end;
      continue;
    }

    /*
     * NUMBER
     */
    const numberMatch = line.slice(i).match(
      /^(?:\d+(?:\.\d+)?[uUlLfF]?)/,
    );

    if (numberMatch) {
      tokens.push(
        `<span style="color:#d99b22">${escapeHtml(
          numberMatch[0],
        )}</span>`,
      );

      i += numberMatch[0].length;
      continue;
    }

    /*
     * IDENTIFIERS
     */
    const identifierMatch = line.slice(i).match(
      /^[A-Za-z_][A-Za-z0-9_]*/,
    );

    if (identifierMatch) {
      const word = identifierMatch[0];

      if (KEYWORDS.has(word)) {
        tokens.push(
          `<span style="color:#d98ba0">${word}</span>`,
        );
      } else if (TYPES.has(word)) {
        tokens.push(
          `<span style="color:#8fbd91">${word}</span>`,
        );
      } else {
        tokens.push(
          `<span style="color:#cfd4c7">${word}</span>`,
        );
      }

      i += word.length;
      continue;
    }

    /*
     * OPERATORS
     */
    const operatorMatch = line.slice(i).match(
      /^(?:<<|>>|==|!=|<=|>=|\+\+|--|&&|\|\||->|[+\-*/%=<>!&|])/,
    );

    if (operatorMatch) {
      tokens.push(
        `<span style="color:#d7d2b8">${escapeHtml(
          operatorMatch[0],
        )}</span>`,
      );

      i += operatorMatch[0].length;
      continue;
    }

    /*
     * DEFAULT CHARACTER
     */
    tokens.push(escapeHtml(line[i]));
    i++;
  }

  return tokens.join("");
}

function highlightCpp(code: string) {
  return code
    .split("\n")
    .map((line) => highlightCppLine(line))
    .join("\n");
}

export function CppCodeBlock({
  code,
  showCopy = true,
}: CppCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

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

        {showCopy && (
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
        )}
      </div>

      {/* CODE */}

      <div className="overflow-x-auto px-4 py-4 sm:px-5">
        <pre
          className="
            m-0
            min-w-max
            font-mono
            text-[11px]
            leading-[1.85]
            tracking-[0.01em]
          "
          dangerouslySetInnerHTML={{
            __html: highlightCpp(code),
          }}
        />
      </div>
    </div>
  );
}