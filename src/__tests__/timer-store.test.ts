import { describe, it, expect, beforeEach } from "vitest";
import { useTimerStore } from "@/stores/timer-store";

describe("timer-store", () => {
  beforeEach(() => {
    // Reset store before each test
    useTimerStore.setState({ appState: "idle", time: 0 });
  });

  it("starts in idle state with 0 time", () => {
    const state = useTimerStore.getState();
    expect(state.appState).toBe("idle");
    expect(state.time).toBe(0);
  });

  it("start() sets appState to focusing and time to 0", () => {
    useTimerStore.getState().start();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("focusing");
    expect(state.time).toBe(0);
  });

  it("tick() increments time by 1", () => {
    useTimerStore.getState().start();
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(1);
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(2);
  });

  it("reset() returns to idle with 0 time", () => {
    useTimerStore.setState({ appState: "focusing", time: 42 });
    useTimerStore.getState().reset();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("idle");
    expect(state.time).toBe(0);
  });

  it("takeBreak() sets appState to resting with calculated time", () => {
    useTimerStore.setState({ appState: "focusing", time: 300 });
    useTimerStore.getState().takeBreak(0.2, 300);
    const state = useTimerStore.getState();
    expect(state.appState).toBe("resting");
    expect(state.time).toBe(60); // 300 * 0.2 = 60
  });

  it("takeBreak() enforces minimum 10 seconds rest", () => {
    useTimerStore.setState({ appState: "focusing", time: 30 });
    useTimerStore.getState().takeBreak(0.2, 30);
    const state = useTimerStore.getState();
    expect(state.appState).toBe("resting");
    expect(state.time).toBe(10); // Math.max(30*0.2=6, 10)
  });

  it("end() returns session and resets state", () => {
    useTimerStore.setState({ appState: "focusing", time: 300 });
    const session = useTimerStore.getState().end(300);
    const state = useTimerStore.getState();
    expect(session).not.toBeNull();
    expect(session!.duration).toBe(300);
    expect(session!.timestamp).toBeGreaterThan(0);
    expect(state.appState).toBe("idle");
    expect(state.time).toBe(0);
  });

  it("end() returns null when time is 0", () => {
    const session = useTimerStore.getState().end(0);
    expect(session).toBeNull();
  });
});
