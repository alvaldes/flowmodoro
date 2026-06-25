import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { cn } from "@/lib/utils";
import { useChartColors } from "@/lib/chart-colors";
import { computeScatter } from "@/lib/chart-data";
import { formatDuration } from "@/lib/format";
import "@/lib/chart-setup";
import type { Session } from "@/stores/types";

interface ProductivityHeatmapProps {
  sessions: Session[];
  className?: string;
}

export default function ProductivityHeatmap({
  sessions,
  className,
}: ProductivityHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();
  const points = computeScatter(sessions);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Focus sessions",
            data: points,
            backgroundColor: colors.accentAlpha,
            borderColor: colors.accent,
            borderWidth: 1,
            pointRadius: (ctx) => {
              const raw = ctx.raw as { r?: number };
              return raw.r ?? 5;
            },
            pointHoverRadius: (ctx) => {
              const raw = ctx.raw as { r?: number };
              return (raw.r ?? 5) + 3;
            },
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
              title: () => "",
              label: (ctx) => {
                const raw = ctx.raw as { x: number; y: number };
                const hour = Math.floor(raw.x);
                const min = Math.round((raw.x - hour) * 60);
                const period = hour >= 12 ? "PM" : "AM";
                const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                return `${h12}:${min.toString().padStart(2, "0")} ${period} — ${formatDuration(raw.y * 60)} focus`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min: -0.5,
            max: 23.5,
            grid: { color: colors.tickBg },
            ticks: {
              color: colors.textSecondary,
              font: { size: 9 },
              stepSize: 3,
              callback: (val) => {
                const h = Math.round(Number(val));
                const period = h >= 12 ? "PM" : "AM";
                const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                return `${h12}${period}`;
              },
            },
            title: {
              display: true,
              text: "Hour of Day",
              color: colors.textSecondary,
              font: { size: 10 },
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
            title: {
              display: true,
              text: "Duration",
              color: colors.textSecondary,
              font: { size: 10 },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [points, colors]);

  if (points.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[180px] text-xs text-[var(--text-tertiary)]",
          className,
        )}
      >
        Not enough data yet
      </div>
    );
  }

  return (
    <div className={cn("relative h-[180px]", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Productivity scatter: ${points.length} focus sessions plotted by hour and duration`}
      />
    </div>
  );
}
