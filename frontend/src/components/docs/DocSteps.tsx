interface DocStepsProps {
  steps: string[];
}

export default function DocSteps({ steps }: DocStepsProps) {
  return (
    <ol className="space-y-3 text-surface-400 mb-6">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-brand-500 font-mono">{i + 1}.</span>
          <span dangerouslySetInnerHTML={{ __html: step }} />
        </li>
      ))}
    </ol>
  );
}
