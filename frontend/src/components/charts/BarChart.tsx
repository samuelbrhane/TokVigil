"use client";

import { useState } from "react";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  ySteps?: number;
}

function formatValue(val: number): string {
  if (val >= 10000) return `${(val / 1000).toFixed(0)}K`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
}

export default function BarChart({
  data,
  maxValue,
  height = 200,
  ySteps = 5,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rawMax = maxValue || Math.max(...data.map((d) => d.value));
  const rawMin = Math.min(...data.map((d) => d.value));

  // Add padding: 10% above max, floor at 0 or 80% of min
  const chartMax = Math.ceil(rawMax * 1.1);
  const chartMin = rawMin > 0 ? Math.floor(rawMin * 0.8) : 0;
  const range = chartMax - chartMin;

  // Generate Y axis labels
  const yLabels: number[] = [];
  const step = range / ySteps;
  for (let i = 0; i <= ySteps; i++) {
    yLabels.push(Math.round(chartMin + step * i));
  }
  yLabels.reverse();

  return (
    <div className="flex" style={{ height }}>
      {/* Y axis */}
      <div
        className="flex flex-col justify-between pr-3 shrink-0"
        style={{ height }}
      >
        {yLabels.map((label, i) => (
          <span
            key={i}
            className="text-[10px] font-mono text-surface-400 leading-none"
          >
            {formatValue(label)}
          </span>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Bars + grid lines */}
        <div className="relative flex-1">
          {/* Horizontal grid lines */}
          {yLabels.map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-surface-800/30"
              style={{ top: `${(i / ySteps) * 100}%` }}
            />
          ))}

          {/* Bars */}
          <div className="relative flex items-end gap-1 h-full px-1">
            {data.map((item, i) => {
              const barPct =
                range > 0
                  ? Math.max(((item.value - chartMin) / range) * 100, 2)
                  : 50;

              return (
                <div
                  key={i}
                  className="flex-1 h-full flex items-end relative"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {hoveredIndex === i && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-md bg-surface-800 border border-surface-700/60 shadow-lg whitespace-nowrap">
                      <span className="text-[11px] font-mono text-white font-bold">
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      hoveredIndex === i
                        ? "brightness-125"
                        : hoveredIndex !== null
                          ? "opacity-50"
                          : ""
                    }`}
                    style={{
                      height: `${barPct}%`,
                      background:
                        item.color ||
                        "linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X axis labels */}
        <div className="flex gap-1 mt-2 px-1 shrink-0">
          {data.map((item, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className={`text-[9px] font-mono truncate block ${
                  hoveredIndex === i
                    ? "text-white font-bold"
                    : "text-surface-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
