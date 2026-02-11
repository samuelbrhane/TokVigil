import { type ClassValue, clsx } from "clsx";

// Simple cn utility without tailwind-merge dependency
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function highlightCode(code: string): string {
  return code
    .replace(
      /(from |import |try:|except |as |if |return |def |class |const |let |await |async )/g,
      '<span class="text-brand-500">$1</span>'
    )
    .replace(/(#[^\n]*)/g, '<span class="text-surface-500">$1</span>')
    .replace(
      /(\/\/[^\n]*)/g,
      '<span class="text-surface-500">$1</span>'
    )
    .replace(/(".*?")/g, '<span class="text-lime-400">$1</span>')
    .replace(/('.*?')/g, '<span class="text-lime-400">$1</span>')
    .replace(/(\{|\}|\[|\])/g, '<span class="text-surface-300">$1</span>');
}
