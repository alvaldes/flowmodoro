import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, SessionEntry, SessionsActions, SessionsState } from "./types";
import { STORAGE_KEYS } from "@/lib/constants";
import { generateId } from "@/lib/utils";

type SessionsStore = SessionsState & SessionsActions;

function migrateOldSession(old: Record<string, unknown>): Session {
  return {
    id: (old.id as string) || generateId(),
    timestamp: old.timestamp as number,
    entries: (old.entries as SessionEntry[]) || [
      { type: "focus", duration: old.duration as number, startedAt: (old.timestamp as number) - (old.duration as number) * 1000 },
    ],
    ...(old.name ? { name: old.name as string } : {}),
    ...(old.tags ? { tags: old.tags as string[] } : {}),
  };
}

/** Remove entries where startedAt is negative (corrupt data from hiddenAt bug). */
function cleanCorruptEntries(session: Session): Session {
  return {
    ...session,
    entries: session.entries.filter((e) => e.startedAt >= 0),
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

      clearSessions: () => {
        useSessionsStore.persist.clearStorage();
        set({ sessions: [] });
      },
    }),
    {
      name: STORAGE_KEYS.SESSIONS,
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as { sessions?: unknown[] };
        let sessions = (state.sessions ?? []).map((s) =>
          migrateOldSession(s as Record<string, unknown>)
        );

        // Version 2: remove entries with negative startedAt (corrupt data)
        if ((version ?? 0) < 2) {
          sessions = sessions.map(cleanCorruptEntries);
        }

        return { sessions };
      },
      partialize: (state) => ({
        sessions: state.sessions,
      }),
      skipHydration: true,
    }
  )
);
