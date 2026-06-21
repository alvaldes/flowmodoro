import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AlarmSoundId, SettingsActions, SettingsState } from "./types";
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
      focusAlarmSound: "notification-bell" as AlarmSoundId,
      breakAlarmSound: "uplifting-bells" as AlarmSoundId,
      endAlarmSound: "achievement-bell" as AlarmSoundId,
      volume: 0.5,
      notificationsEnabled: false,
      autoFocusAfterBreak: true,

      setRestRatio: (ratio: number) =>
        set({
          restRatio: Math.min(Math.max(ratio, TIMER.MIN_REST_RATIO), TIMER.MAX_REST_RATIO),
        }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setFocusAlarmSound: (sound: AlarmSoundId) => set({ focusAlarmSound: sound }),
      setBreakAlarmSound: (sound: AlarmSoundId) => set({ breakAlarmSound: sound }),
      setEndAlarmSound: (sound: AlarmSoundId) => set({ endAlarmSound: sound }),

      setVolume: (volume: number) =>
        set({ volume: Math.min(Math.max(volume, 0), 1) }),

      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      toggleAutoFocus: () =>
        set((state) => ({ autoFocusAfterBreak: !state.autoFocusAfterBreak })),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        restRatio: state.restRatio,
        darkMode: state.darkMode,
        focusAlarmSound: state.focusAlarmSound,
        breakAlarmSound: state.breakAlarmSound,
        endAlarmSound: state.endAlarmSound,
        volume: state.volume,
        notificationsEnabled: state.notificationsEnabled,
        autoFocusAfterBreak: state.autoFocusAfterBreak,
      }),
      skipHydration: true,
    }
  )
);
