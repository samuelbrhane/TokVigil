"use client";

interface TOCItem {
  id: string;
  title: string;
}

interface DocTableOfContentsProps {
  items: TOCItem[];
}

export default function DocTableOfContents({ items }: DocTableOfContentsProps) {
  return (
    <div className="mb-12 p-6 bg-surface-900/50 border border-surface-800 rounded-lg">
      <h3 className="font-mono font-semibold text-surface-100 mb-4">
        On this page
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-surface-400 hover:text-brand-400 transition-colors"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
