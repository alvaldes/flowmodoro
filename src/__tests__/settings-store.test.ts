import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "@/stores/settings-store";

describe("settings-store", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      restRatio: 0.2,
      darkMode: false,
    });
  });

  it("has default restRatio of 0.2", () => {
    expect(useSettingsStore.getState().restRatio).toBe(0.2);
  });

  it("setRestRatio updates the ratio", () => {
    useSettingsStore.getState().setRestRatio(0.3);
    expect(useSettingsStore.getState().restRatio).toBe(0.3);
  });

  it("setRestRatio clamps to min 0.08", () => {
    useSettingsStore.getState().setRestRatio(0.01);
    expect(useSettingsStore.getState().restRatio).toBe(0.08);
  });

  it("setRestRatio clamps to max 0.5", () => {
    useSettingsStore.getState().setRestRatio(0.8);
    expect(useSettingsStore.getState().restRatio).toBe(0.5);
  });

  it("toggleDarkMode flips the value", () => {
    useSettingsStore.getState().toggleDarkMode();
    expect(useSettingsStore.getState().darkMode).toBe(true);
    useSettingsStore.getState().toggleDarkMode();
    expect(useSettingsStore.getState().darkMode).toBe(false);
  });
});
