import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { cn } from "@/lib/utils";
import { useChartColors } from "@/lib/chart-colors";
import { computeTimeline } from "@/lib/chart-data";
import { formatDuration } from "@/lib/format";
import "@/lib/chart-setup";
import type { Session } from "@/stores/types";

interface SessionTimelineProps {
  sessions: Session[];
  limit?: number;
  className?: string;
}

export default function SessionTimeline({
  sessions,
  limit = 10,
  className,
}: SessionTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();
  const bars = computeTimeline(sessions, limit);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: bars.map((b) => b.label),
        datasets: [
          {
            label: "Break",
            data: bars.map((b) => Math.round(b.break / 60)),
            backgroundColor: colors.tickBg,
            borderRadius: 3,
            borderSkipped: false,
          },
          {
            label: "Focus",
            data: bars.map((b) => Math.round(b.focus / 60)),
            backgroundColor: colors.accent,
            borderRadius: 3,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: {
              color: colors.fg,
              font: { size: 11 },
              padding: 8,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y ?? 0;
                return `${ctx.dataset.label}: ${formatDuration(val * 60)}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              color: colors.textSecondary,
              font: { size: 9 },
              maxRotation: 0,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: colors.tickBg },
            ticks: {
              color: colors.textTertiary,
              font: { size: 9 },
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
  }, [bars, colors]);

  if (bars.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[160px] text-xs text-[var(--text-tertiary)]",
          className,
        )}
      >
        No sessions yet
      </div>
    );
  }

  return (
    <div className={cn("relative h-[160px]", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Session timeline: ${bars.length} sessions showing focus and break duration`}
      />
    </div>
  );
}
