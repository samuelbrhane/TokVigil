import { SectionTag } from "@/components/ui";

interface PageHeaderProps {
  tag?: string;
  title: string;
  highlight?: string;
  description?: string;
}

export default function PageHeader({ tag, title, highlight, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-16">
      {tag && <SectionTag>{tag}</SectionTag>}
      <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight text-surface-100 font-mono">
        {title}
        {highlight && (
          <>
            <br />
            <span className="text-brand-500">{highlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-surface-500 max-w-lg mx-auto">{description}</p>
      )}
    </div>
  );
}
