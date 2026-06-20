/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTimerStore } from "@/stores/timer-store";

describe("timer-store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useTimerStore.setState({
      appState: "idle",
      time: 0,
      lastTickTimestamp: Date.now(),
      hiddenAt: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("tick() calculates delta based on elapsed time", () => {
    useTimerStore.getState().start();
    vi.advanceTimersByTime(3000);
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(3);
  });

  it("tick() accumulates across multiple calls", () => {
    useTimerStore.getState().start();
    vi.advanceTimersByTime(2000);
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(2);
    vi.advanceTimersByTime(4000);
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(6);
  });

  it("tick() does nothing when not focusing", () => {
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(0);
  });

  it("reset() returns to idle with 0 time", () => {
    useTimerStore.setState({ appState: "focusing", time: 42, lastTickTimestamp: Date.now() - 42000 });
    useTimerStore.getState().reset();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("idle");
    expect(state.time).toBe(0);
  });

  it("takeBreak() sets appState to resting with calculated time", () => {
    useTimerStore.setState({ appState: "focusing", time: 300, lastTickTimestamp: Date.now() });
    useTimerStore.getState().takeBreak(0.2, 300);
    const state = useTimerStore.getState();
    expect(state.appState).toBe("resting");
    expect(state.time).toBe(60); // 300 * 0.2 = 60
  });

  it("takeBreak() enforces minimum 10 seconds rest", () => {
    useTimerStore.setState({ appState: "focusing", time: 30, lastTickTimestamp: Date.now() });
    useTimerStore.getState().takeBreak(0.2, 30);
    const state = useTimerStore.getState();
    expect(state.appState).toBe("resting");
    expect(state.time).toBe(10); // Math.max(30*0.2=6, 10)
  });

  it("end() returns session and resets state", () => {
    useTimerStore.setState({ appState: "focusing", time: 300, lastTickTimestamp: Date.now() });
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

  it("completeRest transitions to completed state", () => {
    useTimerStore.getState().completeRest();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("completed");
    expect(state.time).toBe(0);
  });

  it("dismissCompleted returns to idle", () => {
    useTimerStore.getState().completeRest();
    useTimerStore.getState().dismissCompleted();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("idle");
    expect(state.time).toBe(0);
  });

  it("applyBackgroundDelta adds elapsed time during focusing", () => {
    useTimerStore.getState().start();
    vi.advanceTimersByTime(10000);
    useTimerStore.getState().tick();
    expect(useTimerStore.getState().time).toBe(10);
    // Simulate being hidden for 5 seconds
    useTimerStore.setState({ hiddenAt: Date.now() });
    vi.advanceTimersByTime(5000);
    useTimerStore.getState().applyBackgroundDelta();
    expect(useTimerStore.getState().time).toBe(15);
  });

  it("applyBackgroundDelta does nothing when idle", () => {
    useTimerStore.getState().applyBackgroundDelta();
    expect(useTimerStore.getState().time).toBe(0);
  });

  it("applyBackgroundDelta completes rest when timer runs out", () => {
    useTimerStore.setState({ appState: "resting", time: 10, hiddenAt: Date.now() - 15000 });
    useTimerStore.getState().applyBackgroundDelta();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("completed");
    expect(state.time).toBe(0);
  });

  it("applyBackgroundDelta reduces rest time without completing", () => {
    useTimerStore.setState({ appState: "resting", time: 30, hiddenAt: Date.now() - 10000 });
    useTimerStore.getState().applyBackgroundDelta();
    const state = useTimerStore.getState();
    expect(state.appState).toBe("resting");
    expect(state.time).toBe(20);
  });
});
