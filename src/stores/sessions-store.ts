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
