import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTimerStore } from "@/stores/timer-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";
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

  const { appState, tick, reset } = useTimerStore();
  const darkMode = useSettingsStore((s) => s.darkMode);

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

  // Timer interval: count up during focusing, count down during resting
  useEffect(() => {
    if (appState === "idle") return;

    const interval = setInterval(() => {
      if (appState === "focusing") {
        tick();
      } else if (appState === "resting") {
        const current = useTimerStore.getState().time;
        if (current <= 0) {
          reset();
        } else {
          useTimerStore.setState({ time: current - 1 });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [appState, tick, reset]);

  // Hydrate persisted stores (skipHydration requires manual rehydration)
  useEffect(() => {
    useTimerStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
    useSessionsStore.persist.rehydrate();
  }, []);

  // Restore onboarding state from localStorage
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
          <h1 style={{ fontSize: "26px" }}>Flowmodoro</h1>
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
          }}
          onClick={() => setView("timer")}
        >
          Flow
        </h1>
      </header>

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {view === "timer" && (
            <motion.div key="timer" {...viewTransition}>
              <TimerSection />
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
