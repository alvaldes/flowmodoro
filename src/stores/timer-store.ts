import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, TimerActions, TimerState } from "./types";
import { STORAGE_KEYS, TIMER } from "@/lib/constants";

type TimerStore = TimerState & TimerActions;

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      appState: "idle" as AppState,
      time: 0,
      lastTickTimestamp: Date.now(),
      hiddenAt: 0,
      initialRestTime: 0,

      start: () => set({
        appState: "focusing",
        time: 0,
        lastTickTimestamp: Date.now(),
        hiddenAt: 0,
        initialRestTime: 0,
      }),

      tick: () => {
        const state = get();
        if (state.appState !== "focusing") return;
        const now = Date.now();
        const delta = Math.floor((now - state.lastTickTimestamp) / 1000);
        if (delta > 0) {
          set({
            time: state.time + delta,
            lastTickTimestamp: now,
          });
        }
      },

      applyBackgroundDelta: () => {
        const state = get();
        if (state.appState === "idle" || state.appState === "completed") return;
        const now = Date.now();
        const elapsed = Math.floor((now - state.hiddenAt) / 1000);
        if (elapsed <= 0) return;

        if (state.appState === "focusing") {
          set({
            time: state.time + elapsed,
            lastTickTimestamp: now,
            hiddenAt: 0,
          });
        } else if (state.appState === "resting") {
          const newTime = Math.max(state.time - elapsed, 0);
          if (newTime <= 0) {
            set({
              appState: "completed",
              time: 0,
              lastTickTimestamp: now,
              hiddenAt: 0,
              initialRestTime: 0,
            });
          } else {
            set({
              time: newTime,
              lastTickTimestamp: now,
              hiddenAt: 0,
            });
          }
        }
      },

      reset: () => set({
        appState: "idle",
        time: 0,
        lastTickTimestamp: Date.now(),
        hiddenAt: 0,
        initialRestTime: 0,
      }),

      completeRest: () => set({
        appState: "completed",
        time: 0,
        lastTickTimestamp: Date.now(),
        hiddenAt: 0,
        initialRestTime: 0,
      }),

      dismissCompleted: () => set({
        appState: "idle",
        time: 0,
        lastTickTimestamp: Date.now(),
        hiddenAt: 0,
        initialRestTime: 0,
      }),

      takeBreak: (restRatio: number, focusTime: number) => {
        const calculatedRest = Math.max(
          Math.floor(focusTime * restRatio),
          TIMER.MIN_REST_SECONDS
        );
        set({
          appState: "resting",
          time: calculatedRest,
          lastTickTimestamp: Date.now(),
          hiddenAt: 0,
          initialRestTime: calculatedRest,
        });
      },

      end: (focusTime: number) => {
        const session = focusTime > 0
          ? { duration: focusTime, timestamp: Date.now() }
          : null;
        set({
          appState: "idle",
          time: 0,
          lastTickTimestamp: Date.now(),
          hiddenAt: 0,
          initialRestTime: 0,
        });
        return session;
      },
    }),
    {
      name: STORAGE_KEYS.TIMER,
      partialize: (state) => ({
        appState: state.appState,
        time: state.time,
      }),
      skipHydration: true,
    }
  )
);
