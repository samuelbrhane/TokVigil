"use client";

import { CodeBlock } from "@/components/ui";

interface DocSectionProps {
  id: string;
  title: string;
  description?: string;
  code?: string;
  language?: "python" | "typescript" | "bash" | "json";
  children?: React.ReactNode;
}

export default function DocSection({
  id,
  title,
  description,
  code,
  language = "python",
  children,
}: DocSectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
        {title}
      </h2>
      {description && <p className="text-surface-400 mb-6">{description}</p>}
      {children}
      {code && <CodeBlock code={code} language={language} />}
    </section>
  );
}
