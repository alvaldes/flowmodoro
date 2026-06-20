import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { TIMER } from "@/lib/constants";
import type { Session } from "@/stores/types";

interface UsePreciseTimerOptions {
  onSessionEnd?: (session: Session) => void;
}

interface UsePreciseTimerReturn {
  appState: "idle" | "focusing" | "resting" | "completed";
  time: number;
  start: () => void;
  takeBreak: () => void;
  end: () => void;
  dismissCompleted: () => void;
  nameSession: (timestamp: number, name: string, tags: string[]) => void;
}

export function usePreciseTimer(options: UsePreciseTimerOptions = {}): UsePreciseTimerReturn {
  const { onSessionEnd } = options;
  const prevAppState = useRef<string | null>(null);

  const appState = useTimerStore((s) => s.appState);
  const time = useTimerStore((s) => s.time);

  const start = useCallback(() => useTimerStore.getState().start(), []);
  const dismissCompleted = useCallback(() => useTimerStore.getState().dismissCompleted(), []);

  const nameSession = useCallback(
    (timestamp: number, name: string, tags: string[]) => {
      useSessionsStore.getState().updateSession(timestamp, { name, tags });
    },
    []
  );

  const takeBreak = useCallback(() => {
    const { time: focusTime } = useTimerStore.getState();
    const { restRatio } = useSettingsStore.getState();
    if (focusTime > 0) {
      const session: Session = { duration: focusTime, timestamp: Date.now() };
      useSessionsStore.getState().addSession(session);
      onSessionEnd?.(session);
    }
    useTimerStore.getState().takeBreak(restRatio, focusTime);
  }, [onSessionEnd]);

  const end = useCallback(() => {
    const { time: focusTime } = useTimerStore.getState();
    const session = useTimerStore.getState().end(focusTime);
    if (session) {
      useSessionsStore.getState().addSession(session);
      onSessionEnd?.(session);
    }
  }, [onSessionEnd]);

  // Tick interval: count up during focusing, count down during resting
  useEffect(() => {
    if (appState !== "focusing" && appState !== "resting") return;

    const interval = setInterval(() => {
      const state = useTimerStore.getState();
      if (state.appState === "focusing") {
        state.tick();
      } else if (state.appState === "resting") {
        const current = state.time;
        if (current <= 1) {
          state.completeRest();
        } else {
          useTimerStore.setState({ time: current - 1 });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [appState]);

  // Auto-dismiss completed after timeout
  useEffect(() => {
    if (appState !== "completed") return;

    const timeout = setTimeout(() => {
      useTimerStore.getState().dismissCompleted();
    }, TIMER.COMPLETED_DISPLAY_SECONDS * 1000);

    return () => clearTimeout(timeout);
  }, [appState]);

  // Page Visibility API (background precision)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const state = useTimerStore.getState();
        if (state.appState === "focusing" || state.appState === "resting") {
          useTimerStore.setState({ hiddenAt: Date.now() });
        }
      } else {
        useTimerStore.getState().applyBackgroundDelta();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Track state transitions for side effects
  useEffect(() => {
    if (prevAppState.current !== null && prevAppState.current !== appState) {
      prevAppState.current = appState;
    } else if (prevAppState.current === null) {
      prevAppState.current = appState;
    }
  }, [appState]);

  return {
    appState,
    time,
    start,
    takeBreak,
    end,
    dismissCompleted,
    nameSession,
  };
}
