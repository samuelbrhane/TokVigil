interface DocHeaderProps {
  icon: string;
  title: string;
  description: string;
}

export default function DocHeader({
  icon,
  title,
  description,
}: DocHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight">
          {title}
        </h1>
      </div>
      <p className="text-lg text-surface-400 max-w-2xl">{description}</p>
    </div>
  );
}
