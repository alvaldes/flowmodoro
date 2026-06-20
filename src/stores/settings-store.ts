import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsActions, SettingsState } from "./types";
import { STORAGE_KEYS, TIMER } from "@/lib/constants";

type SettingsStore = SettingsState & SettingsActions;

const getSystemDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      restRatio: TIMER.DEFAULT_REST_RATIO,
      darkMode: getSystemDarkMode(),

      setRestRatio: (ratio: number) =>
        set({
          restRatio: Math.min(
            Math.max(ratio, TIMER.MIN_REST_RATIO),
            TIMER.MAX_REST_RATIO
          ),
        }),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        restRatio: state.restRatio,
        darkMode: state.darkMode,
      }),
      skipHydration: true,
    }
  )
);
