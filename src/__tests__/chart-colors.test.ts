import { describe, it, expect } from "vitest";
import { getChartColors } from "@/lib/chart-colors";

describe("getChartColors", () => {
  it("returns all required color fields with string values", () => {
    const colors = getChartColors();

    expect(typeof colors.accent).toBe("string");
    expect(typeof colors.accentDim).toBe("string");
    expect(typeof colors.fg).toBe("string");
    expect(typeof colors.textSecondary).toBe("string");
    expect(typeof colors.textTertiary).toBe("string");
    expect(typeof colors.tickBg).toBe("string");
    expect(typeof colors.surface).toBe("string");
    expect(typeof colors.accentAlpha).toBe("string");
  });

  it("accentAlpha is derived from accent with opacity", () => {
    const colors = getChartColors();
    expect(colors.accentAlpha).toContain(colors.accent.replace(")", ""));
    expect(colors.accentAlpha).toContain("/");
  });

  it("returns non-empty values for all fields", () => {
    const colors = getChartColors();
    expect(colors.accent).toBeTruthy();
    expect(colors.accentDim).toBeTruthy();
    expect(colors.fg).toBeTruthy();
    expect(colors.textSecondary).toBeTruthy();
    expect(colors.textTertiary).toBeTruthy();
    expect(colors.tickBg).toBeTruthy();
    expect(colors.surface).toBeTruthy();
    expect(colors.accentAlpha).toBeTruthy();
  });
});
