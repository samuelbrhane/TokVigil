import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function highlightCode(code: string): string {
  const tokens: { start: number; end: number; style: string }[] = [];

  // Find all strings (double and single quoted)
  const stringRegex = /(["'])(?:(?!\1).)*\1/g;
  let match;
  while ((match = stringRegex.exec(code)) !== null) {
    tokens.push({
      start: match.index,
      end: match.index + match[0].length,
      style: "color:#a3e635",
    });
  }

  // Find comments (# and //)
  const commentRegex = /(#|\/\/)[^\n]*/g;
  while ((match = commentRegex.exec(code)) !== null) {
    // Skip if inside a string
    const inString = tokens.some(
      (t) => match!.index >= t.start && match!.index < t.end,
    );
    if (!inString) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        style: "color:#71717a",
      });
    }
  }

  // Find keywords
  const keywordRegex =
    /\b(from|import|try|except|as|if|else|elif|return|def|class|const|let|await|async|for|in|lambda|new|throw|catch|instanceof|print|not|and|or|None|True|False|null|undefined|true|false)\b/g;
  while ((match = keywordRegex.exec(code)) !== null) {
    const inExisting = tokens.some(
      (t) => match!.index >= t.start && match!.index < t.end,
    );
    if (!inExisting) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        style: "color:#06b6d4",
      });
    }
  }

  // Find f-strings prefix
  const fstringRegex = /\bf(?=["'])/g;
  while ((match = fstringRegex.exec(code)) !== null) {
    const inExisting = tokens.some(
      (t) => match!.index >= t.start && match!.index < t.end,
    );
    if (!inExisting) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        style: "color:#a3e635",
      });
    }
  }

  // Sort tokens by start position
  tokens.sort((a, b) => a.start - b.start);

  // Build output
  let result = "";
  let cursor = 0;

  for (const token of tokens) {
    if (token.start < cursor) continue; // skip overlapping
    // Add plain text before this token
    result += escapeHtml(code.slice(cursor, token.start));
    // Add styled token
    result += `<span style="${token.style}">${escapeHtml(code.slice(token.start, token.end))}</span>`;
    cursor = token.end;
  }

  // Add remaining text
  result += escapeHtml(code.slice(cursor));

  return result;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
