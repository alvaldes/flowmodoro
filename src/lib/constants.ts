export const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export type AlarmSoundId =
  | "achievement-bell"
  | "bell-notification"
  | "casino-reward"
  | "classic-alarm"
  | "digital-alarm"
  | "happy-bells"
  | "notification-bell"
  | "uplifting-bells"
  | "urgent-tone";

export interface AlarmSound {
  id: AlarmSoundId;
  label: string;
  file: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
  { id: "achievement-bell",   label: "Achievement Bell",   file: "/sounds/mixkit-achievement-bell.wav" },
  { id: "bell-notification",  label: "Bell Notification",  file: "/sounds/mixkit-bell-notification.wav" },
  { id: "casino-reward",      label: "Casino Reward",      file: "/sounds/mixkit-casino-bells-reward.wav" },
  { id: "classic-alarm",      label: "Classic Alarm",      file: "/sounds/mixkit-classic-alarm.wav" },
  { id: "digital-alarm",      label: "Digital Alarm",      file: "/sounds/mixkit-digital-clock-digital-alarm-buzzer.wav" },
  { id: "happy-bells",        label: "Happy Bells",        file: "/sounds/mixkit-happy-bells-notification.wav" },
  { id: "notification-bell",  label: "Notification Bell",  file: "/sounds/mixkit-notification-bell.wav" },
  { id: "uplifting-bells",    label: "Uplifting Bells",    file: "/sounds/mixkit-uplifting-bells-notification.wav" },
  { id: "urgent-tone",        label: "Urgent Tone",        file: "/sounds/mixkit-urgent-simple-tone-loop.wav" },
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
