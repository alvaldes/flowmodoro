import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "@/stores/settings-store";

describe("settings-store", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      restRatio: 0.2,
      darkMode: false,
      alarmSound: "classic-alarm",
      volume: 0.5,
      notificationsEnabled: false,
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

  it("setAlarmSound updates the alarm sound", () => {
    useSettingsStore.getState().setAlarmSound("classic-alarm");
    expect(useSettingsStore.getState().alarmSound).toBe("classic-alarm");
  });

  it("setVolume updates the volume", () => {
    useSettingsStore.getState().setVolume(0.8);
    expect(useSettingsStore.getState().volume).toBe(0.8);
  });

  it("setVolume clamps to 0-1 range", () => {
    useSettingsStore.getState().setVolume(1.5);
    expect(useSettingsStore.getState().volume).toBe(1);
    useSettingsStore.getState().setVolume(-0.5);
    expect(useSettingsStore.getState().volume).toBe(0);
  });

  it("toggleNotifications flips the value", () => {
    useSettingsStore.getState().toggleNotifications();
    expect(useSettingsStore.getState().notificationsEnabled).toBe(true);
    useSettingsStore.getState().toggleNotifications();
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
  });
});
