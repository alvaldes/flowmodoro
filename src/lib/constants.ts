export const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export type AlarmSoundId = "gentle-chime" | "soft-bell" | "digital-beep" | "nature" | "classic-alarm";

export interface AlarmSound {
  id: AlarmSoundId;
  label: string;
  file: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
  { id: "gentle-chime", label: "Gentle Chime", file: "/sounds/gentle-chime.mp3" },
  { id: "soft-bell", label: "Soft Bell", file: "/sounds/soft-bell.mp3" },
  { id: "digital-beep", label: "Digital Beep", file: "/sounds/digital-beep.mp3" },
  { id: "nature", label: "Nature", file: "/sounds/nature.mp3" },
  { id: "classic-alarm", label: "Classic Alarm", file: "/sounds/classic-alarm.mp3" },
];

export const TIMER = {
  DEFAULT_REST_RATIO: 0.2,
  MIN_REST_RATIO: 0.08,
  MAX_REST_RATIO: 0.5,
  MIN_REST_SECONDS: 10,
  COMPLETED_DISPLAY_SECONDS: 5,
} as const;

export const STORAGE_KEYS = {
  TIMER: "flowmodoro-timer",
  SETTINGS: "flowmodoro-settings",
  SESSIONS: "flowmodoro-sessions",
} as const;

export const VIEWS = {
  TIMER: "timer",
  STATS: "stats",
  SETTINGS: "settings",
} as const;

export type AppView = (typeof VIEWS)[keyof typeof VIEWS];
