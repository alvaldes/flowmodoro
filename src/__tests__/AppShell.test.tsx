import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppShell from "@/components/react/AppShell";

describe("AppShell", () => {
  it("renders onboarding when hasSeenOnboarding is false", () => {
    render(<AppShell />);
    // Should show onboarding title
    expect(screen.getByText("Flow, Not Clock")).toBeInTheDocument();
  });
});
