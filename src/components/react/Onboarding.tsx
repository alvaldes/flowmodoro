import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Slide {
  title: string;
  text: string;
  eyeline: string;
}

const slides: Slide[] = [
  {
    title: "Flow, Not Clock",
    text: "Pomodoro interrupts your flow. Flowmodoro stays out of your way. No alarm rips you out of deep concentration.",
    eyeline: "Focus time counts up",
  },
  {
    title: "Breaks That Fit",
    text: "When you stop, break is calculated from how long you focused. Every 5 minutes of flow earns ~1 minute of recharge. Natural pauses, not forced breaks.",
    eyeline: "Earn your breaks",
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Boomerang: play forward → reverse on end → repeat
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let isReversing = false;

    const reverse = () => {
      isReversing = true;

      const tick = () => {
        if (!isReversing) return;

        video.currentTime = Math.max(0, video.currentTime - 0.02);

        if (video.currentTime <= 0) {
          isReversing = false;
          video.play().catch(() => {});
          return;
        }

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    const handleEnded = () => reverse();

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      isReversing = false;
      cancelAnimationFrame(rafId);
    };
  }, [step]);

  const advance = () => {
    if (step < slides.length - 1) {
      setStep((s) => s + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Slide dots */}
      <div
        role="tablist"
        aria-label="Onboarding steps"
        className="flex justify-center gap-2 mb-6"
      >
        {slides.map((_, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === step}
            aria-label={`Step ${i + 1}`}
            className="h-2 rounded-full transition-all duration-[350ms] ease-[cubic-bezier(0.2,0,0,1)]"
            style={{
              width: i === step ? "28px" : "8px",
              background: i === step ? "var(--accent)" : "var(--tick-bg)",
              boxShadow: i === step ? "none" : "var(--neu-pressed-xs)",
            }}
          />
        ))}
      </div>

      {/* Slide content — neumorphic card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          role="tabpanel"
          aria-label={slides[step].title}
          className="flex flex-col flex-1"
        >
          <Card className="flex-1 flex-col items-center justify-center text-center overflow-hidden rounded-[var(--radius-lg)] py-0">
            <div className="relative flex flex-col items-center justify-center flex-1 w-full">
              <video
                ref={videoRef}
                src={`/onboarding/slide${step + 1}.mp4`}
                muted
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none blur-sm"
              />
              <CardContent className="relative z-10 flex flex-col items-center gap-3 py-8 px-6">
                <p className="text-xs uppercase tracking-[0.08em] text-accent">
                  {slides[step].eyeline}
                </p>

                {/* Illustrations */}
                {step === 0 && (
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
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
                    <path d="M66 51 L70 55 L66 59" fill="var(--accent)" />
                    <circle
                      cx="40"
                      cy="40"
                      r="4"
                      fill="var(--accent)"
                      opacity={0.3}
                    />
                  </svg>
                )}
                {step === 1 && (
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
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
                  </svg>
                )}
                {step === 2 && (
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
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
                    <circle
                      cx="22"
                      cy="48"
                      r="2.5"
                      fill="currentColor"
                      opacity={0.2}
                    />
                    <circle
                      cx="32"
                      cy="34"
                      r="2.5"
                      fill="currentColor"
                      opacity={0.2}
                    />
                    <circle
                      cx="40"
                      cy="42"
                      r="2.5"
                      fill="currentColor"
                      opacity={0.2}
                    />
                    <circle cx="50" cy="28" r="2.5" fill="var(--accent)" />
                    <circle
                      cx="60"
                      cy="36"
                      r="2.5"
                      fill="currentColor"
                      opacity={0.2}
                    />
                  </svg>
                )}

                <h2 className="text-[26px] font-heading -tracking-[0.02em] leading-tight">
                  {slides[step].title}
                </h2>
                <p className="text-[var(--text-secondary)] text-base leading-[1.65] max-w-[34ch] text-pretty">
                  {slides[step].text}
                </p>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Advance pill — icon only, right aligned */}
      <button
        onClick={advance}
        aria-label={
          step < slides.length - 1
            ? `Next: ${slides[step + 1].title}`
            : "Start using Flowmodoro"
        }
        className="self-center mt-6 flex items-center justify-center w-12 h-12 rounded-full border-none cursor-pointer bg-[var(--accent)] text-white shadow-[var(--neu-accent-raised)] active:shadow-[var(--neu-accent-pressed)] transition-all duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
