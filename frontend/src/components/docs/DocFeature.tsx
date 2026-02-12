interface DocFeatureProps {
  icon: string;
  title: string;
  description: string;
  items?: string[];
}

export default function DocFeature({
  icon,
  title,
  description,
  items,
}: DocFeatureProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-surface-200 mb-3">
        {icon} {title}
      </h3>
      <p className="text-surface-400 mb-4">{description}</p>
      {items && (
        <ul className="space-y-2 text-surface-400 text-sm">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-brand-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
