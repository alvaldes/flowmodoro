import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSettingsStore } from "@/stores/settings-store";
import { useTimerStore } from "@/stores/timer-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { usePreciseTimer } from "@/hooks/usePreciseTimer";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { useNotification } from "@/hooks/useNotification";
import { usePreWarmAudio } from "@/hooks/usePreWarmAudio";
import { formatDuration } from "@/lib/format";
import type { AppView } from "@/lib/constants";
import Onboarding from "./Onboarding";
import TimerSection from "./TimerSection";
import StatsSection from "./StatsSection";
import SettingsSection from "./SettingsSection";
import BottomNav from "./BottomNav";

const viewTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: [0.2, 0, 0, 1] as const },
};

export default function AppShell() {
  const [view, setView] = useState<AppView>("timer");
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);

  // Pre-warm audio on first user interaction
  usePreWarmAudio();

  // Audio alert
  const { playFocus, playBreak, playEnd } = useAudioAlert();

  // Browser notification
  const { show: showNotification } = useNotification();

  // Handle session completion side effects
  const handleSessionEnd = useCallback(
    (focusDuration: number) => {
      playEnd();
      if (notificationsEnabled) {
        showNotification("Flow Session Complete!", {
          body: `You focused for ${formatDuration(focusDuration)}`,
        });
      }
    },
    [playEnd, showNotification, notificationsEnabled],
  );

  const handleFocusStart = useCallback(() => {
    playFocus();
  }, [playFocus]);

  const handleBreakStart = useCallback(
    (focusDuration: number) => {
      playBreak();
      if (notificationsEnabled) {
        showNotification("Break Time!", {
          body: `You focused for ${formatDuration(focusDuration)}`,
        });
      }
    },
    [playBreak, showNotification, notificationsEnabled],
  );

  // Timer engine
  const timer = usePreciseTimer({
    onSessionEnd: handleSessionEnd,
    onFocusStart: handleFocusStart,
    onBreakStart: handleBreakStart,
  });
  const initialRestTime = useTimerStore((s) => s.initialRestTime);

  // Sync dark mode to DOM
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", darkMode);
    html.classList.toggle("light", !darkMode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", darkMode ? "#15171f" : "#f8f9fc");
    }
  }, [darkMode]);

  // Hydrate persisted stores
  useEffect(() => {
    useTimerStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
    useSessionsStore.persist.rehydrate();
  }, []);

  // Restore onboarding state
  useEffect(() => {
    const seen = localStorage.getItem("flowmodoro-onboarding");
    if (seen === "true") {
      setHasSeenOnboarding(true);
    }
  }, []);

  const finishOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem("flowmodoro-onboarding", "true");
  };

  // --- Onboarding ---
  if (!hasSeenOnboarding) {
    return (
      <div
        className="app-container"
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "0 24px",
          paddingBottom: "88px",
          paddingTop: "24px",
        }}
      >
        <header style={{ padding: "20px 0", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/favicon.svg" alt="" style={{ width: 28, height: 28 }} />
            Flowmodoro
          </h1>
        </header>
        <Onboarding onFinish={finishOnboarding} />
      </div>
    );
  }

  // --- Main App ---
  return (
    <div
      className="app-container"
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: "0 24px",
        paddingBottom: "88px",
        paddingTop: "0",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          marginBottom: "8px",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={() => setView("timer")}
        >
          <img src="/favicon.svg" alt="" style={{ width: 24, height: 24 }} />
          Flowmodoro
        </h1>
      </header>

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {view === "timer" && (
            <motion.div key="timer" {...viewTransition}>
              <TimerSection
                appState={timer.appState}
                time={timer.time}
                initialRestTime={initialRestTime}
                currentSession={timer.currentSession}
                onStart={timer.start}
                onBreak={timer.takeBreak}
                onEnd={timer.end}
              />
            </motion.div>
          )}
          {view === "stats" && (
            <motion.div key="stats" {...viewTransition}>
              <StatsSection />
            </motion.div>
          )}
          {view === "settings" && (
            <motion.div key="settings" {...viewTransition}>
              <SettingsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav view={view} onViewChange={setView} />
    </div>
  );
}
