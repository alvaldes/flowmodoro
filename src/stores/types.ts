export type AppState = "idle" | "focusing" | "resting" | "completed";

export type AlarmSoundId =
  | "none"
  | "achievement-bell"
  | "bell-notification"
  | "casino-reward"
  | "classic-alarm"
  | "digital-alarm"
  | "happy-bells"
  | "notification-bell"
  | "uplifting-bells"
  | "urgent-tone";

export interface SessionEntry {
  type: "focus" | "break";
  duration: number;
  startedAt: number;
}

export interface Session {
  id: string;
  timestamp: number;
  entries: SessionEntry[];
  name?: string;
  tags?: string[];
}

export type SessionNotification = { focusDuration: number; timestamp: number };

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
  end: (focusTime: number) => { duration: number; timestamp: number } | null;
}

export interface SettingsState {
  restRatio: number;
  darkMode: boolean;
  focusAlarmSound: AlarmSoundId;
  breakAlarmSound: AlarmSoundId;
  endAlarmSound: AlarmSoundId;
  volume: number;
  notificationsEnabled: boolean;
  autoFocusAfterBreak: boolean;
}

export interface SettingsActions {
  setRestRatio: (ratio: number) => void;
  toggleDarkMode: () => void;
  setFocusAlarmSound: (sound: AlarmSoundId) => void;
  setBreakAlarmSound: (sound: AlarmSoundId) => void;
  setEndAlarmSound: (sound: AlarmSoundId) => void;
  setVolume: (volume: number) => void;
  toggleNotifications: () => void;
  toggleAutoFocus: () => void;
}

export interface SessionsState {
  sessions: Session[];
}

export interface SessionsActions {
  addSession: (session: Session) => void;
  addEntryToSession: (sessionId: string, entry: SessionEntry) => void;
  updateSession: (id: string, patch: Partial<Pick<Session, "name" | "tags">>) => void;
  clearSessions: () => void;
}
