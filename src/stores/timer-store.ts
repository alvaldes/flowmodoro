import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, TimerActions, TimerState } from "./types";
import { STORAGE_KEYS, TIMER } from "@/lib/constants";

type TimerStore = TimerState & TimerActions;

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      appState: "idle" as AppState,
      time: 0,

      start: () => set({ appState: "focusing", time: 0 }),

      tick: () => set((state) => ({ time: state.time + 1 })),

      reset: () => set({ appState: "idle", time: 0 }),

      takeBreak: (restRatio: number, focusTime: number) => {
        const calculatedRest = Math.max(
          Math.floor(focusTime * restRatio),
          TIMER.MIN_REST_SECONDS
        );
        set({ appState: "resting", time: calculatedRest });
      },

      end: (focusTime: number) => {
        const session =
          focusTime > 0
            ? { duration: focusTime, timestamp: Date.now() }
            : null;
        set({ appState: "idle", time: 0 });
        return session;
      },
    }),
    {
      name: STORAGE_KEYS.TIMER,
      partialize: (state) => ({
        appState: state.appState,
        time: state.time,
      }),
      skipHydration: true, // SSR safety
    }
  )
);
