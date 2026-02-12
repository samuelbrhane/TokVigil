interface DocNoteProps {
  type?: "info" | "tip" | "warning";
  children: React.ReactNode;
}

const STYLES = {
  info: {
    border: "border-brand-500/30",
    bg: "bg-brand-500/5",
    icon: "ℹ",
    iconColor: "text-brand-400",
  },
  tip: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    icon: "💡",
    iconColor: "text-emerald-400",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    icon: "⚠",
    iconColor: "text-amber-400",
  },
};

export default function DocNote({ type = "info", children }: DocNoteProps) {
  const style = STYLES[type];
  return (
    <div className={`my-4 p-4 rounded-lg border ${style.border} ${style.bg}`}>
      <div className="flex gap-3">
        <span className={`${style.iconColor} text-sm mt-0.5`}>
          {style.icon}
        </span>
        <div className="text-sm text-surface-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
