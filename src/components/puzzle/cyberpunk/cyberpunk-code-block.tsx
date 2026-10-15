import { useState } from "react";

interface CppCodeBlockProps {
  code: string;
  showCopy?: boolean;
}

const KEYWORDS = new Set([
  "int", "double", "float", "char", "bool", "void", "return", "if", "else",
  "for", "while", "class", "struct", "public", "private", "protected", "virtual",
  "override", "const", "unsigned", "signed", "short", "long", "auto", "new",
  "delete", "true", "false", "include", "using", "namespace",
]);

const TYPES = new Set(["std", "cout", "cin", "endl", "iostream", "printf"]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface HighlightedLine {
  html: string;
  continuesComment: boolean;
}

function highlightCppLine(line: string, forceComment = false): HighlightedLine {
  if (forceComment) {
    return {
      html: `<span style="color:#4e7a65">${escapeHtml(line)}</span>`,
      continuesComment: line.endsWith("\\"),
    };
  }

  const tokens: string[] = [];
  let i = 0;
  let continuesComment = false;

  while (i < line.length) {
    if (line.startsWith("//", i)) {
      const comment = line.slice(i);
      tokens.push(`<span style="color:#4e7a65">${escapeHtml(comment)}</span>`);
      continuesComment = comment.endsWith("\\");
      break;
    }

    if (line[i] === "#") {
      const match = line.slice(i).match(/^#\w+/);
      if (match) {
        tokens.push(`<span style="color:#7fc7d4">${escapeHtml(match[0])}</span>`);
        i += match[0].length;
        continue;
      }
    }

    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let end = i + 1;
      while (end < line.length) {
        if (line[end] === quote && line[end - 1] !== "\\") {
          end++;
          break;
        }
        end++;
      }
      tokens.push(`<span style="color:#9acb7b">${escapeHtml(line.slice(i, end))}</span>`);
      i = end;
      continue;
    }

    const numberMatch = line.slice(i).match(/^(?:\d+(?:\.\d+)?(?:[uUlLfF]{1,2})?)/);
    if (numberMatch) {
      tokens.push(`<span style="color:#35d6e8">${escapeHtml(numberMatch[0])}</span>`);
      i += numberMatch[0].length;
      continue;
    }

    const identifierMatch = line.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (identifierMatch) {
      const word = identifierMatch[0];
      const color = KEYWORDS.has(word)
        ? "#7fc7d4"
        : TYPES.has(word)
          ? "#8fbd91"
          : "#9be8b4";
      tokens.push(`<span style="color:${color}">${escapeHtml(word)}</span>`);
      i += word.length;
      continue;
    }

    const operatorMatch = line.slice(i).match(/^(?:<<|>>|==|!=|<=|>=|\+\+|--|&&|\|\||->|[+\-*/%=<>!&|^~])/);
    if (operatorMatch) {
      tokens.push(`<span style="color:#c6f4d3">${escapeHtml(operatorMatch[0])}</span>`);
      i += operatorMatch[0].length;
      continue;
    }

    tokens.push(escapeHtml(line[i]));
    i++;
  }

  return { html: tokens.join(""), continuesComment };
}

function highlightCpp(code: string): string {
  let commentContinues = false;
  return code
    .split("\n")
    .map((line) => {
      const highlighted = highlightCppLine(line, commentContinues);
      commentContinues = highlighted.continuesComment;
      return highlighted.html;
    })
    .join("\n");
}

export function CppCodeBlock({ code, showCopy = true }: CppCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  return (
    <div className="relative overflow-hidden border border-[#35d6e8]/15 bg-[#070f0c] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex h-6 items-center justify-between border-b border-[#35d6e8]/10 bg-[#0c1713] px-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5d73]/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#35d6e8]/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#5cf2a0]/70" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#4e7a65]">
            C++ SOURCE
          </span>
        </div>
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#4e7a65] transition-colors hover:text-[#35d6e8]"
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto px-3 py-2 sm:px-3 sm:py-2">
        <pre
          className="m-0 min-w-max font-mono text-[12px] leading-[1.45] tracking-[0.01em] sm:text-[13px]"
          dangerouslySetInnerHTML={{ __html: highlightCpp(code) }}
        />
      </div>
    </div>
  );
}
