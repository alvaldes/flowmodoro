export type AppState = "idle" | "focusing" | "resting";

export interface Session {
  duration: number;
  timestamp: number;
}

export interface TimerState {
  appState: AppState;
  time: number;
}

export interface TimerActions {
  start: () => void;
  tick: () => void;
  reset: () => void;
  takeBreak: (restRatio: number, focusTime: number) => void;
  end: (focusTime: number) => Session | null;
}

export interface SettingsState {
  restRatio: number;
  darkMode: boolean;
}

export interface SettingsActions {
  setRestRatio: (ratio: number) => void;
  toggleDarkMode: () => void;
}

export interface SessionsState {
  sessions: Session[];
}

export interface SessionsActions {
  addSession: (session: Session) => void;
  clearSessions: () => void;
}
