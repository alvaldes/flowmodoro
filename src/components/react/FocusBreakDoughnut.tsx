import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { cn } from "@/lib/utils";
import { useChartColors } from "@/lib/chart-colors";
import { computeRatio } from "@/lib/chart-data";
import "@/lib/chart-setup";
import type { Session } from "@/stores/types";
import type { RatioPeriod } from "@/lib/chart-data";

interface FocusBreakDoughnutProps {
  sessions: Session[];
  period?: RatioPeriod;
  className?: string;
}

export default function FocusBreakDoughnut({
  sessions,
  period = "all",
  className,
}: FocusBreakDoughnutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useChartColors();
  const ratio = computeRatio(sessions, period);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Focus", "Break"],
        datasets: [
          {
            data: [Math.round(ratio.focus / 60), Math.round(ratio.break / 60)],
            backgroundColor: [colors.accent, colors.tickBg],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "80%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                return `${ctx.label}: ${val} min`;
              },
            },
          },
        },
      },
      plugins: [
        {
          id: "centerText",
          beforeDraw: (chart) => {
            const { width, height, ctx } = chart;
            ctx.save();
            const text = `${ratio.focusPercent}%`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `600 ${Math.min(width, height) * 0.2}px -apple-system, sans-serif`;
            ctx.fillStyle = colors.fg;
            ctx.fillText(text, width / 2, height / 2);
            ctx.restore();
          },
        },
      ],
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [ratio, colors]);

  return (
    <div className={cn("relative h-[200px]", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Focus vs Break: ${ratio.focusPercent}% focus (${Math.round(ratio.focus / 60)} min focus, ${Math.round(ratio.break / 60)} min break)`}
      />
    </div>
  );
}
