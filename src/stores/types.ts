export type AppState = "idle" | "focusing" | "resting" | "completed";

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

export interface Session {
  duration: number;
  timestamp: number;
  name?: string;
  tags?: string[];
}

export interface TimerState {
  appState: AppState;
  time: number;
  lastTickTimestamp: number;
  hiddenAt: number;
}

export interface TimerActions {
  start: () => void;
  tick: () => void;
  applyBackgroundDelta: () => void;
  reset: () => void;
  completeRest: () => void;
  dismissCompleted: () => void;
  takeBreak: (restRatio: number, focusTime: number) => void;
  end: (focusTime: number) => Session | null;
}

export interface SettingsState {
  restRatio: number;
  darkMode: boolean;
  alarmSound: AlarmSoundId;
  volume: number;
  notificationsEnabled: boolean;
}

export interface SettingsActions {
  setRestRatio: (ratio: number) => void;
  toggleDarkMode: () => void;
  setAlarmSound: (sound: AlarmSoundId) => void;
  setVolume: (volume: number) => void;
  toggleNotifications: () => void;
}

export interface SessionsState {
  sessions: Session[];
}

export interface SessionsActions {
  addSession: (session: Session) => void;
  updateSession: (timestamp: number, patch: Partial<Pick<Session, "name" | "tags">>) => void;
  clearSessions: () => void;
}
