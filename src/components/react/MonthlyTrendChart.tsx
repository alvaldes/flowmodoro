import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { cn } from "@/lib/utils";
import { useChartColors } from "@/lib/chart-colors";
import { aggregateMonthly } from "@/lib/chart-data";
import { formatDuration } from "@/lib/format";
import "@/lib/chart-setup";
import type { Session } from "@/stores/types";

interface MonthlyTrendChartProps {
  sessions: Session[];
  className?: string;
}

export default function MonthlyTrendChart({
  sessions,
  className,
}: MonthlyTrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();
  const data = aggregateMonthly(sessions);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Focus",
            data: data.map((d) => Math.round(d.seconds / 60)),
            borderColor: colors.accent,
            backgroundColor: colors.accentAlpha,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHitRadius: 10,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: colors.accent,
            borderWidth: 2,
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
            ticks: {
              color: colors.textSecondary,
              font: { size: 9 },
              maxTicksLimit: 10,
              maxRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: colors.tickBg },
            ticks: {
              color: colors.textTertiary,
              font: { size: 9 },
              callback: (val) => formatDuration(Number(val) * 60),
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
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
        aria-label={`30-day trend: ${data[data.length - 1]?.seconds ? `${formatDuration(data[data.length - 1].seconds)} today` : "no data"}`}
      />
    </div>
  );
}
