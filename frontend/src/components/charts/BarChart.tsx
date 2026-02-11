"use client";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
}

export default function BarChart({
  data,
  maxValue,
  height = 200,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = max > 0 ? (item.value / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-surface-300 font-bold">
              {item.value.toLocaleString()}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-500 hover:brightness-125"
              style={{
                height: `${barHeight}%`,
                minHeight: item.value > 0 ? "4px" : "0",
                background:
                  item.color ||
                  "linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)",
                animationDelay: `${i * 0.05}s`,
              }}
            />
            <span className="text-[10px] font-mono text-surface-300 truncate max-w-full">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
