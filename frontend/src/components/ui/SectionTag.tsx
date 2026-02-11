export default function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase text-brand-400 border border-brand-500/20 bg-brand-500/5">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
      {children}
    </span>
  );
}
