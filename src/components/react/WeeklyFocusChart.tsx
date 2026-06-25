import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { cn } from "@/lib/utils";
import { useChartColors } from "@/lib/chart-colors";
import { aggregateWeekly } from "@/lib/chart-data";
import { formatDuration } from "@/lib/format";
import "@/lib/chart-setup"; // side-effect: registers Chart.js components
import type { Session } from "@/stores/types";

interface WeeklyFocusChartProps {
  sessions: Session[];
  className?: string;
}

export default function WeeklyFocusChart({
  sessions,
  className,
}: WeeklyFocusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();
  const data = aggregateWeekly(sessions);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Focus",
            data: data.map((d) => Math.round(d.seconds / 60)),
            backgroundColor: data.map((d) =>
              d.isToday ? colors.accent : colors.accentDim,
            ),
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y ?? 0;
                return `${formatDuration(val * 60)} focus`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.textSecondary, font: { size: 10 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: colors.tickBg },
            ticks: {
              color: colors.textTertiary,
              font: { size: 10 },
              callback: (val) => formatDuration(Number(val) * 60),
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, colors]);

  return (
    <div className={cn("relative h-[140px]", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Weekly focus: ${data.map((d) => `${d.label} ${formatDuration(d.seconds)}`).join(", ")}`}
      />
    </div>
  );
}
