import { describe, it, expect } from "vitest";
import { formatTime, formatDuration } from "@/lib/format";

describe("formatTime", () => {
  it("formats 0 as 00:00", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds correctly", () => {
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(59)).toBe("00:59");
  });

  it("formats minutes correctly", () => {
    expect(formatTime(60)).toBe("01:00");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(3599)).toBe("59:59");
  });

  it("formats hours as mm:ss (always shows seconds)", () => {
    expect(formatTime(3600)).toBe("60:00");
    expect(formatTime(3661)).toBe("61:01");
    expect(formatTime(7384)).toBe("123:04");
  });

  it("pads single digit minutes and seconds", () => {
    expect(formatTime(61)).toBe("01:01");
    expect(formatTime(601)).toBe("10:01");
  });
});

describe("formatDuration", () => {
  it("formats 0 as 0m", () => {
    expect(formatDuration(0)).toBe("0m");
  });

  it("formats seconds to minutes", () => {
    expect(formatDuration(60)).toBe("1m");
    expect(formatDuration(600)).toBe("10m");
  });

  it("omits zero minutes when showing hours", () => {
    expect(formatDuration(3600)).toBe("1h");
    expect(formatDuration(7200)).toBe("2h");
  });

  it("shows hours and minutes when both present", () => {
    expect(formatDuration(3660)).toBe("1h 1m");
    expect(formatDuration(7260)).toBe("2h 1m");
  });

  it("shows days instead of 24h+", () => {
    expect(formatDuration(86400)).toBe("1d");
    expect(formatDuration(90000)).toBe("1d 1h");
    expect(formatDuration(172800)).toBe("2d");
  });

  it("rounds down minutes", () => {
    expect(formatDuration(90)).toBe("1m");
    expect(formatDuration(119)).toBe("1m");
  });
});
