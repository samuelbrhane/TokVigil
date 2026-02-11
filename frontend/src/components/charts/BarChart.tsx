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
  const min = Math.min(...data.map((d) => d.value));
  // Scale from 20% minimum so small values are still visible
  const floor = min * 0.8;

  return (
    <div className="flex flex-col" style={{ height }}>
      {/* Bar area */}
      <div className="flex items-end gap-2 flex-1 min-h-0">
        {data.map((item, i) => {
          const scaled =
            max > floor ? ((item.value - floor) / (max - floor)) * 100 : 50;
          const barPct = Math.max(scaled, 5); // minimum 5% so bar is always visible

          return (
            <div key={i} className="flex-1 flex flex-col items-center h-full">
              {/* Value label */}
              <span className="text-[10px] font-mono text-surface-300 font-bold mb-1 shrink-0">
                {item.value.toLocaleString()}
              </span>
              {/* Bar container — takes remaining space */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-500 hover:brightness-125"
                  style={{
                    height: `${barPct}%`,
                    background:
                      item.color ||
                      "linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Labels row */}
      <div className="flex gap-2 mt-2 shrink-0">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] font-mono text-surface-300 truncate block">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
