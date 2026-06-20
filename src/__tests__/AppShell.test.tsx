import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AppShell from "@/components/react/AppShell";

// Mock hooks
vi.mock("@/hooks/usePreciseTimer", () => ({
  usePreciseTimer: () => ({
    appState: "idle",
    time: 0,
    start: vi.fn(),
    takeBreak: vi.fn(),
    end: vi.fn(),
    dismissCompleted: vi.fn(),
    nameSession: vi.fn(),
  }),
}));

vi.mock("@/hooks/useAudioAlert", () => ({
  useAudioAlert: () => ({
    play: vi.fn(),
    stop: vi.fn(),
    preview: vi.fn(),
    isPlaying: false,
  }),
}));

vi.mock("@/hooks/useNotification", () => ({
  useNotification: () => ({
    show: vi.fn(),
    isSupported: false,
    permission: "default",
  }),
}));

vi.mock("@/hooks/usePreWarmAudio", () => ({
  usePreWarmAudio: () => ({ isReady: true }),
}));

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders onboarding when hasSeenOnboarding is false", () => {
    render(<AppShell />);
    expect(screen.getByText("Flow, Not Clock")).toBeInTheDocument();
  });
});
