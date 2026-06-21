import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, SessionEntry, SessionsActions, SessionsState } from "./types";
import { STORAGE_KEYS } from "@/lib/constants";

type SessionsStore = SessionsState & SessionsActions;

function migrateOldSession(old: Record<string, unknown>): Session {
  return {
    id: (old.id as string) || crypto.randomUUID(),
    timestamp: old.timestamp as number,
    entries: (old.entries as SessionEntry[]) || [
      { type: "focus", duration: old.duration as number, startedAt: (old.timestamp as number) - (old.duration as number) * 1000 },
    ],
    ...(old.name ? { name: old.name as string } : {}),
    ...(old.tags ? { tags: old.tags as string[] } : {}),
  };
}

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set) => ({
      sessions: [] as Session[],

      addSession: (session: Session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),

      addEntryToSession: (sessionId: string, entry: SessionEntry) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, entries: [...s.entries, entry] }
              : s
          ),
        })),

      updateSession: (id: string, patch: Partial<Pick<Session, "name" | "tags">>) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...patch } : s
          ),
        })),

      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: STORAGE_KEYS.SESSIONS,
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { sessions?: unknown[] };
        const sessions = (state.sessions ?? []).map((s) =>
          migrateOldSession(s as Record<string, unknown>)
        );
        return { sessions };
      },
      partialize: (state) => ({
        sessions: state.sessions,
      }),
      skipHydration: true,
    }
  )
);
