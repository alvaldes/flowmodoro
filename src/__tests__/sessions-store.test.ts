import { describe, it, expect, beforeEach } from "vitest";
import { useSessionsStore } from "@/stores/sessions-store";
import type { Session, SessionEntry } from "@/stores/types";

function createSession(id: string, focusSec: number, timestamp: number, breakSec?: number): Session {
  const focusEntry: SessionEntry = { type: "focus", duration: focusSec, startedAt: timestamp - focusSec * 1000 };
  const entries: SessionEntry[] = [focusEntry];
  if (breakSec !== undefined) {
    entries.push({ type: "break", duration: breakSec, startedAt: timestamp + 1000 });
  }
  return { id, timestamp, entries };
}

describe("sessions-store", () => {
  beforeEach(() => {
    useSessionsStore.setState({ sessions: [] });
  });

  it("starts with empty sessions", () => {
    expect(useSessionsStore.getState().sessions).toEqual([]);
  });

  it("addSession appends a session", () => {
    const session = createSession("a", 300, 1000);
    useSessionsStore.getState().addSession(session);
    expect(useSessionsStore.getState().sessions).toHaveLength(1);
    expect(useSessionsStore.getState().sessions[0]).toEqual(session);
  });

  it("addSession appends multiple sessions in order", () => {
    const s1 = createSession("a", 100, 1);
    const s2 = createSession("b", 200, 2);
    useSessionsStore.getState().addSession(s1);
    useSessionsStore.getState().addSession(s2);
    expect(useSessionsStore.getState().sessions).toHaveLength(2);
    expect(useSessionsStore.getState().sessions[0]).toEqual(s1);
    expect(useSessionsStore.getState().sessions[1]).toEqual(s2);
  });

  it("clearSessions removes all sessions", () => {
    useSessionsStore.getState().addSession(createSession("a", 300, 1000));
    useSessionsStore.getState().addSession(createSession("b", 600, 2000));
    expect(useSessionsStore.getState().sessions).toHaveLength(2);
    useSessionsStore.getState().clearSessions();
    expect(useSessionsStore.getState().sessions).toHaveLength(0);
  });

  it("updateSession patches name and tags on existing session", () => {
    useSessionsStore.getState().addSession(createSession("s1", 300, 1000));
    useSessionsStore.getState().updateSession("s1", { name: "Deep Work", tags: ["coding", "focus"] });
    const updated = useSessionsStore.getState().sessions[0];
    expect(updated.name).toBe("Deep Work");
    expect(updated.tags).toEqual(["coding", "focus"]);
    expect(updated.entries[0].duration).toBe(300); // unchanged
  });

  it("updateSession does nothing for unknown id", () => {
    useSessionsStore.getState().addSession(createSession("s1", 300, 1000));
    useSessionsStore.getState().updateSession("unknown", { name: "Ghost" });
    expect(useSessionsStore.getState().sessions[0].name).toBeUndefined();
  });

  it("addEntryToSession appends an entry to a session", () => {
    useSessionsStore.getState().addSession(createSession("s1", 300, 1000));
    useSessionsStore.getState().addEntryToSession("s1", { type: "break", duration: 60, startedAt: 2000 });
    const updated = useSessionsStore.getState().sessions[0];
    expect(updated.entries).toHaveLength(2);
    expect(updated.entries[1].type).toBe("break");
    expect(updated.entries[1].duration).toBe(60);
  });
});
