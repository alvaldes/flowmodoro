import { describe, it, expect, beforeEach } from "vitest";
import { useSessionsStore } from "@/stores/sessions-store";

describe("sessions-store", () => {
  beforeEach(() => {
    useSessionsStore.setState({ sessions: [] });
  });

  it("starts with empty sessions", () => {
    expect(useSessionsStore.getState().sessions).toEqual([]);
  });

  it("addSession appends a session", () => {
    const session = { duration: 300, timestamp: Date.now() };
    useSessionsStore.getState().addSession(session);
    expect(useSessionsStore.getState().sessions).toHaveLength(1);
    expect(useSessionsStore.getState().sessions[0]).toEqual(session);
  });

  it("addSession appends multiple sessions in order", () => {
    const s1 = { duration: 100, timestamp: 1 };
    const s2 = { duration: 200, timestamp: 2 };
    useSessionsStore.getState().addSession(s1);
    useSessionsStore.getState().addSession(s2);
    expect(useSessionsStore.getState().sessions).toHaveLength(2);
    expect(useSessionsStore.getState().sessions[0]).toEqual(s1);
    expect(useSessionsStore.getState().sessions[1]).toEqual(s2);
  });

  it("clearSessions removes all sessions", () => {
    useSessionsStore.getState().addSession({ duration: 300, timestamp: Date.now() });
    useSessionsStore.getState().addSession({ duration: 600, timestamp: Date.now() });
    expect(useSessionsStore.getState().sessions).toHaveLength(2);
    useSessionsStore.getState().clearSessions();
    expect(useSessionsStore.getState().sessions).toHaveLength(0);
  });
});
