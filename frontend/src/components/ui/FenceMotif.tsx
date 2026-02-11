import { cn } from "@/lib/utils";

export default function FenceMotif({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full animate-fence-pulse"
          style={{
            height: `${20 + Math.sin(i * 0.9) * 10}px`,
            opacity: 0.3 + (i % 3) * 0.2,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
