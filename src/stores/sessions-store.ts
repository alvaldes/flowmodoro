import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, SessionsActions, SessionsState } from "./types";
import { STORAGE_KEYS } from "@/lib/constants";

type SessionsStore = SessionsState & SessionsActions;

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set) => ({
      sessions: [] as Session[],

      addSession: (session: Session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),

      updateSession: (timestamp: number, patch: Partial<Pick<Session, "name" | "tags">>) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.timestamp === timestamp ? { ...s, ...patch } : s
          ),
        })),

      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: STORAGE_KEYS.SESSIONS,
      partialize: (state) => ({
        sessions: state.sessions,
      }),
      skipHydration: true,
    }
  )
);
