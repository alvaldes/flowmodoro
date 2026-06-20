import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  title: string;
  text: string;
  eyeline: string;
}

const slides: Slide[] = [
  {
    title: "Flow, Not Clock",
    text: "Pomodoro cuts your focus short. Flowmodoro counts UP while you work — no alarm rips you out of deep concentration.",
    eyeline: "Focus time counts up",
  },
  {
    title: "Rest That Fits",
    text: "When you stop, rest is calculated from how long you focused. Every 5 minutes of flow earns ~1 minute of recharge — natural pauses, not forced breaks.",
    eyeline: "Rest = 20% of focus",
  },
  {
    title: "Know Your Rhythm",
    text: "Track deep work by day, week, or month. See patterns, understand your energy cycles, and optimize when you do your best thinking.",
    eyeline: "Stats that matter",
  },
];

interface OnboardingProps {
  onFinish: () => void;
}

export default function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const advance = () => {
    if (step < slides.length - 1) {
      setStep((s) => s + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Slide dots */}
      <div
        role="tablist"
        aria-label="Onboarding steps"
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === step}
            aria-label={`Step ${i + 1}`}
            style={{
              width: i === step ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === step ? "var(--accent)" : "var(--tick-bg)",
              boxShadow: i === step ? "none" : "var(--neu-pressed-xs)",
              transition: "all 0.35s var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
            }}
          />
        ))}
      </div>

      {/* Slide content — neumorphic raised card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          role="tabpanel"
          aria-label={slides[step].title}
          style={{
            background: "var(--surface)",
            borderRadius: "var(--radius-lg, 22px)",
            padding: "32px 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            boxShadow: "var(--neu-raised-md)",
            transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              marginBottom: "12px",
            }}
          >
            {slides[step].eyeline}
          </p>

          {/* Illustrations */}
          {step === 0 && (
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              style={{ margin: "0 auto 12px", display: "block" }}
            >
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth="3.5"
              />
              <path
                d="M40 10 A30 30 0 0 1 68.5 55"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M66 51 L70 55 L66 59"
                fill="var(--accent)"
              />
              <circle cx="40" cy="40" r="4" fill="var(--accent)" opacity={0.3} />
            </svg>
          )}
          {step === 1 && (
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              style={{ margin: "0 auto 12px", display: "block" }}
            >
              <circle
                cx="40"
                cy="40"
                r="28"
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth="3.5"
              />
              <path
                d="M40 12 A28 28 0 0 1 66.5 32.7"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="40"
                x2="40"
                y2="12"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="40"
                x2="66.5"
                y2="32.7"
                stroke="var(--accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text
                x="40"
                y="44"
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="13"
                fontWeight="700"
                fontFamily="-apple-system, system-ui, sans-serif"
              >
                20%
              </text>
            </svg>
          )}
          {step === 2 && (
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              style={{ margin: "0 auto 12px", display: "block" }}
            >
              <rect
                x="14"
                y="14"
                width="52"
                height="52"
                rx="6"
                stroke="currentColor"
                strokeOpacity={0.06}
                strokeWidth="2"
              />
              <path
                d="M22 48 L32 34 L40 42 L50 28 L60 36"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="22" cy="48" r="2.5" fill="currentColor" opacity={0.2} />
              <circle cx="32" cy="34" r="2.5" fill="currentColor" opacity={0.2} />
              <circle cx="40" cy="42" r="2.5" fill="currentColor" opacity={0.2} />
              <circle cx="50" cy="28" r="2.5" fill="var(--accent)" />
              <circle cx="60" cy="36" r="2.5" fill="currentColor" opacity={0.2} />
            </svg>
          )}

          <h2
            style={{
              fontSize: "26px",
              marginBottom: "8px",
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
            }}
          >
            {slides[step].title}
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "16px",
              lineHeight: "1.65",
              maxWidth: "34ch",
              margin: "0 auto",
            }}
          >
            {slides[step].text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Advance button */}
      <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
        <button
          style={{
            flex: 1,
            background: "var(--accent)",
            color: "white",
            padding: "16px 24px",
            fontWeight: 600,
            fontSize: "16px",
            letterSpacing: "0.02em",
            borderRadius: "var(--radius-md, 16px)",
            border: "none",
            cursor: "pointer",
            boxShadow: "var(--neu-accent-raised)",
            transition: "box-shadow var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), transform var(--motion-fast, 150ms) var(--ease-standard)",
          }}
          onClick={advance}
          aria-label={
            step < slides.length - 1
              ? `Next: ${slides[step + 1].title}`
              : "Start using Flowmodoro"
          }
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--neu-accent-pressed)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--neu-accent-raised)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--neu-accent-raised)";
          }}
        >
          {step < slides.length - 1 ? "Next" : "Start"}
        </button>
      </div>
    </div>
  );
}
