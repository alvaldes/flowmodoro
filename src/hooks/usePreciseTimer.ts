import { useEffect, useRef, useCallback, useState } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { TIMER } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import type { Session, SessionEntry } from "@/stores/types";

export interface CurrentSessionInfo {
  startedAt: number;
  entries: SessionEntry[];
  focusSeconds: number;
  breakSeconds: number;
}

interface UsePreciseTimerOptions {
  onSessionEnd?: (focusDuration: number) => void;
  onFocusStart?: () => void;
  onBreakStart?: (focusDuration: number) => void;
}

interface UsePreciseTimerReturn {
  appState: "idle" | "focusing" | "resting" | "completed";
  time: number;
  start: () => void;
  takeBreak: () => void;
  end: () => void;
  dismissCompleted: () => void;
  nameSession: (id: string, name: string, tags: string[]) => void;
  currentSession: CurrentSessionInfo | null;
}

export function usePreciseTimer(options: UsePreciseTimerOptions = {}): UsePreciseTimerReturn {
  const { onSessionEnd, onFocusStart, onBreakStart } = options;
  const prevAppState = useRef<string | null>(null);
  const currentSessionId = useRef<string | null>(null);
  const breakTracker = useRef<{ startedAt: number; totalSeconds: number } | null>(null);
  const sessionStartedAt = useRef(0);
  const entriesRef = useRef<SessionEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<CurrentSessionInfo | null>(null);

  const syncSession = useCallback(() => {
    const state = useTimerStore.getState();
    if (state.appState === "idle") {
      setCurrentSession(null);
    } else if (state.appState === "completed") {
      // Keep last session data visible during completed state
      setCurrentSession((prev) => prev ? { ...prev, focusSeconds: 0, breakSeconds: 0 } : null);
    } else {
      // Guard: if sessionStartedAt is 0 (e.g. after end() + auto-resume), set it now
      if (sessionStartedAt.current === 0) {
        sessionStartedAt.current = Date.now();
      }

      const focusSeconds = state.appState === "focusing" ? state.time : 0;
      const breakSeconds = state.appState === "resting" && breakTracker.current
        ? breakTracker.current.totalSeconds - state.time
        : 0;
      setCurrentSession({
        startedAt: sessionStartedAt.current,
        // Historical entries in reverse order (most recent first)
        entries: [...entriesRef.current].reverse(),
        focusSeconds,
        breakSeconds,
      });
    }
  }, []);

  const appState = useTimerStore((s) => s.appState);
  const time = useTimerStore((s) => s.time);

  // ── start ──────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    const state = useTimerStore.getState();

    if (state.appState === "resting" && currentSessionId.current && breakTracker.current) {
      // Save break entry when resuming focus
      const breakTaken = Math.max(breakTracker.current.totalSeconds - state.time, 0);
      const entry: SessionEntry = {
        type: "break",
        duration: breakTaken,
        startedAt: breakTracker.current.startedAt,
      };
      useSessionsStore.getState().addEntryToSession(currentSessionId.current, entry);
      entriesRef.current.push(entry);
      breakTracker.current = null;
      // Keep currentSessionId — same session across cycles
    } else if (state.appState === "idle") {
      // First focus: create the session ONCE with empty entries
      sessionStartedAt.current = Date.now();
      const id = generateId();
      currentSessionId.current = id;
      entriesRef.current = [];
      const session: Session = {
        id,
        timestamp: Date.now(),
        entries: [],
      };
      useSessionsStore.getState().addSession(session);
    }

    useTimerStore.getState().start();
    syncSession();
    onFocusStart?.();
  }, [onFocusStart, syncSession]);

  // ── dismissCompleted ───────────────────────────────────────────────────
  const dismissCompleted = useCallback(() => useTimerStore.getState().dismissCompleted(), []);

  // ── nameSession ────────────────────────────────────────────────────────
  const nameSession = useCallback(
    (id: string, name: string, tags: string[]) => {
      useSessionsStore.getState().updateSession(id, { name, tags });
    },
    []
  );

  // ── takeBreak ──────────────────────────────────────────────────────────
  const takeBreak = useCallback(() => {
    const { time: focusTime } = useTimerStore.getState();
    const { restRatio } = useSettingsStore.getState();

    if (focusTime > 0) {
      const now = Date.now();
      const focusEntry: SessionEntry = {
        type: "focus",
        duration: focusTime,
        startedAt: now - focusTime * 1000,
      };

      if (currentSessionId.current) {
        // Add to existing session
        useSessionsStore.getState().addEntryToSession(currentSessionId.current, focusEntry);
      } else {
        // No session yet (auto-resume or edge case) — create one
        const id = generateId();
        currentSessionId.current = id;
        const session: Session = {
          id,
          timestamp: now,
          entries: [focusEntry],
        };
        useSessionsStore.getState().addSession(session);
      }
      entriesRef.current.push(focusEntry);
      onBreakStart?.(focusTime);
    }

    const restRatioVal = useSettingsStore.getState().restRatio;
    const restDuration = Math.max(
      Math.floor(focusTime * restRatioVal),
      TIMER.MIN_REST_SECONDS
    );
    breakTracker.current = { startedAt: Date.now(), totalSeconds: restDuration };
    useTimerStore.getState().takeBreak(restRatio, focusTime);
    syncSession();
  }, [onBreakStart, syncSession]);

  // ── end ────────────────────────────────────────────────────────────────
  const end = useCallback(() => {
    const state = useTimerStore.getState();
    const wasFocusing = state.appState === "focusing";
    const wasResting = state.appState === "resting";
    const focusTime = wasFocusing ? state.time : 0;
    const info = state.end(focusTime);

    if (currentSessionId.current) {
      // Session exists — save in-progress entry
      if (wasFocusing && focusTime > 0) {
        const now = Date.now();
        const entry: SessionEntry = {
          type: "focus",
          duration: focusTime,
          startedAt: now - focusTime * 1000,
        };
        useSessionsStore.getState().addEntryToSession(currentSessionId.current, entry);
        entriesRef.current.push(entry);
        onSessionEnd?.(focusTime);
      } else if (wasResting && breakTracker.current) {
        const breakTaken = Math.max(breakTracker.current.totalSeconds - state.time, 0);
        if (breakTaken > 0) {
          const entry: SessionEntry = {
            type: "break",
            duration: breakTaken,
            startedAt: breakTracker.current.startedAt,
          };
          useSessionsStore.getState().addEntryToSession(currentSessionId.current, entry);
          entriesRef.current.push(entry);
        }
      }
    } else if (info && focusTime > 0) {
      // No session yet (focused without taking a break) — create one
      const id = generateId();
      const session: Session = {
        id,
        timestamp: info.timestamp,
        entries: [{ type: "focus" as const, duration: info.duration, startedAt: info.timestamp - info.duration * 1000 }],
      };
      useSessionsStore.getState().addSession(session);
      onSessionEnd?.(focusTime);
    }

    sessionStartedAt.current = 0;
    entriesRef.current = [];
    currentSessionId.current = null;
    breakTracker.current = null;
    syncSession();
  }, [onSessionEnd, syncSession]);

  // ── Tick interval ──────────────────────────────────────────────────────
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

  // ── Auto-dismiss completed + auto-resume ──────────────────────────────
  useEffect(() => {
    if (appState !== "completed") return;

    const { autoFocusAfterBreak } = useSettingsStore.getState();
    const delay = autoFocusAfterBreak
      ? 1500
      : TIMER.COMPLETED_DISPLAY_SECONDS * 1000;

    const timeout = setTimeout(() => {
      useTimerStore.getState().dismissCompleted();

      if (autoFocusAfterBreak) {
        // Continue same session — don't create a new one
        useTimerStore.getState().start();
        onFocusStart?.();
        syncSession();
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [appState, onFocusStart, syncSession]);

  // ── Page Visibility API ────────────────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const state = useTimerStore.getState();
        if (state.appState === "focusing" || state.appState === "resting") {
          useTimerStore.setState({ hiddenAt: Date.now() });
        }
      } else {
        useTimerStore.getState().applyBackgroundDelta();
        syncSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // ── Sync current session display every second ─────────────────────────
  useEffect(() => {
    if (appState !== "focusing" && appState !== "resting") return;
    const interval = setInterval(syncSession, 1000);
    return () => clearInterval(interval);
  }, [appState, syncSession]);

  // ── Track state transitions ────────────────────────────────────────────
  useEffect(() => {
    if (prevAppState.current !== null && prevAppState.current !== appState) {
      // Break ended naturally (resting → completed): save break entry
      if (prevAppState.current === "resting" && appState === "completed") {
        if (currentSessionId.current && breakTracker.current) {
          const entry: SessionEntry = {
            type: "break",
            duration: breakTracker.current.totalSeconds,
            startedAt: breakTracker.current.startedAt,
          };
          useSessionsStore.getState().addEntryToSession(currentSessionId.current, entry);
          entriesRef.current.push(entry);
          breakTracker.current = null;
          // Keep currentSessionId — auto-resume continues the same session
        }
        syncSession();
      }
      prevAppState.current = appState;
    } else if (prevAppState.current === null) {
      prevAppState.current = appState;
    }
  }, [appState, syncSession]);

  return {
    appState,
    time,
    start,
    takeBreak,
    end,
    dismissCompleted,
    nameSession,
    currentSession,
  };
}
