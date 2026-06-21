import { useMemo } from "react";
import { formatTime } from "@/lib/format";
import type { AppState } from "@/stores/types";

interface AnalogDialProps {
  time: number;
  state: AppState;
  reducedMotion: boolean;
  initialRestTime: number;
}

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = 148;
const TICK_COUNT = 60;

export default function AnalogDial({ time, state, reducedMotion, initialRestTime }: AnalogDialProps) {
  // ---------------------------------------------------------------------------
  // FUTURE: to restore alternate ring/tick behavior for durations >=1h
  // (e.g. tick per hour and ring per minute), uncomment the block below
  // and remove the simplified version.
  //
  // const ringProgress = state === "resting"
  //   ? 0
  //   : time < 3600
  //     ? (time % 60) / 60       // < 1h: ring wraps every minute
  //     : (time % 3600) / 3600;  // >= 1h: ring wraps every hour
  //
  // const ticksFilled = state === "resting"
  //   ? 0
  //   : time < 3600
  //     ? Math.floor((time % 3600) / 60)  // < 1h: one tick per minute
  //     : Math.floor(time / 3600);         // >= 1h: one tick per hour
  // ---------------------------------------------------------------------------
  const ringProgress = (time % 60) / 60;

  const ticksFilled = Math.floor((time % 3600) / 60);

  const ticks = useMemo(() => {
    const arr: { x1: number; y1: number; x2: number; y2: number; filled: boolean }[] = [];
    for (let i = 0; i < TICK_COUNT; i++) {
      const angle = (i / TICK_COUNT) * 360 - 90;
      const rad = (angle * Math.PI) / 180;
      const filled = i < ticksFilled;
      const x1 = CX + (OUTER_R - 18) * Math.cos(rad);
      const y1 = CY + (OUTER_R - 18) * Math.sin(rad);
      const x2 = CX + (OUTER_R - 8) * Math.cos(rad);
      const y2 = CY + (OUTER_R - 8) * Math.sin(rad);
      arr.push({ x1, y1, x2, y2, filled });
    }
    return arr;
  }, [ticksFilled]);

  const circumference = 2 * Math.PI * (OUTER_R - 26);

  const isResting = state === "resting";

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        borderRadius: "50%",
        background: "var(--surface)",
        boxShadow: isResting
          ? "var(--neu-raised-lg)"
          : "var(--neu-pressed-lg)",
        transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
      }}
    >
      {/* Tick marks ring */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          width: SIZE,
          height: SIZE,
          display: "block",
          position: "absolute",
          inset: 0,
        }}
        role="img"
        aria-label={`Timer showing ${formatTime(time)}`}
      >
        <g>
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.filled ? "var(--accent)" : "var(--tick-bg)"}
              strokeWidth={2.5}
              strokeLinecap="round"
              style={{
                transition: reducedMotion ? "none" : "stroke 0.4s ease",
              }}
            />
          ))}
        </g>
      </svg>

      {/* Ring background & progress — separate layer */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          width: SIZE,
          height: SIZE,
          display: "block",
          position: "absolute",
          inset: 0,
        }}
      >
        {state !== "idle" && (
          <>
            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R - 26}
              fill="none"
              stroke="var(--ring-bg)"
              strokeWidth={5}
            />
            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R - 26}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ringProgress)}
              transform={`rotate(-90 ${CX} ${CY})`}
              style={{
                transition: reducedMotion ? "none" : "stroke-dashoffset 1s linear",
              }}
            />
          </>
        )}
      </svg>

      {/* Time display layer */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          width: SIZE,
          height: SIZE,
          display: "block",
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >

        {/* Unit labels */}
        {state !== "idle" && (
          <g
            fill="var(--text-tertiary)"
            style={{
              fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
          >
            {/*
              FUTURE: to restore HR/MIN labels for >=1h, replace the block below with:
              {time < 3600 ? (
                <>
                  <text x={CX - 30} y={CY - 40} textAnchor="middle">MIN</text>
                  <text x={CX + 30} y={CY - 40} textAnchor="middle">SEC</text>
                </>
              ) : (
                <>
                  <text x={CX - 48} y={CY - 40} textAnchor="middle">HR</text>
                  <text x={CX + 35} y={CY - 40} textAnchor="middle">MIN</text>
                </>
              )}
            */}
            <text x={CX - 30} y={CY - 40} textAnchor="middle">MIN</text>
            <text x={CX + 30} y={CY - 40} textAnchor="middle">SEC</text>
          </g>
        )}

        {/* Time display — primary */}
        <text
          x={CX}
          y={CY - 12}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--fg)"
          style={{
            fontFamily: "var(--font-display, -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif)",
            fontSize: "54px",
            fontWeight: 220,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.03em",
          }}
        >
          {formatTime(time)}
        </text>

        {/* State label — secondary */}
        <text
          x={CX}
          y={CY + 38}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--text-secondary)"
          style={{
            fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif)",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          {state === "idle" ? "Ready" : state === "focusing" ? "Focus" : "Break"}
        </text>
      </svg>
    </div>
  );
}
