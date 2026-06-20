export const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export const TIMER = {
  DEFAULT_REST_RATIO: 0.2,
  MIN_REST_RATIO: 0.08,
  MAX_REST_RATIO: 0.5,
  MIN_REST_SECONDS: 10,
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
export type AppState = "idle" | "focusing" | "resting";
