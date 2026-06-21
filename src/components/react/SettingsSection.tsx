import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { ALARM_SOUNDS } from "@/lib/constants";
import type { AlarmSoundId } from "@/stores/types";
import { Switch } from "@/components/ui/switch";

export default function SettingsSection() {
  const {
    restRatio,
    darkMode,
    alarmSound,
    volume,
    notificationsEnabled,
    autoFocusAfterBreak,
    setRestRatio,
    toggleDarkMode,
    setAlarmSound,
    setVolume,
    toggleNotifications,
    toggleAutoFocus,
  } = useSettingsStore();
  const sessionCount = useSessionsStore((s) => s.sessions.length);
  const { preview } = useAudioAlert();

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Rest Ratio */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        Rest Ratio
      </h3>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg, 22px)",
          padding: "20px",
          marginBottom: "28px",
          boxShadow: "var(--neu-raised-md)",
          transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            Focus
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            Rest
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              minWidth: "50px",
              textAlign: "center",
              color: "var(--fg)",
            }}
          >
            {Math.round(1 / restRatio)} min
          </span>
          <input
            type="range"
            min="0.08"
            max="0.5"
            step="0.01"
            value={restRatio}
            onChange={(e) => setRestRatio(parseFloat(e.target.value))}
            aria-label="Rest ratio: one minute rest per how many minutes of focus"
            style={{
              width: "100%",
              background: "var(--tick-bg)",
              boxShadow: "inset 0 1px 3px var(--neu-dark)",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              minWidth: "50px",
              textAlign: "center",
              color: "var(--fg)",
            }}
          >
            {Math.round(restRatio * 100)}%
          </span>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-tertiary)",
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          {Math.round(1 / restRatio)} min focus &rarr;{" "}
          {Math.round(restRatio * (1 / restRatio) * 60)}s rest
        </p>
      </div>

      {/* Appearance */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        Appearance
      </h3>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg, 22px)",
          padding: "20px",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "var(--neu-raised-md)",
          transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}>Dark Mode</div>
          <div
            style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}
          >
            Switch to dark theme
          </div>
        </div>
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} aria-label="Toggle dark mode" />
      </div>

      {/* Alarm Sound */}
      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em", color: "var(--fg)" }}>
        Alarm
      </h3>

      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg, 22px)",
        padding: "20px",
        marginBottom: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "var(--neu-raised-md)",
        transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}>Sound</div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
              Alarm when session ends
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <select
              value={alarmSound}
              onChange={(e) => setAlarmSound(e.target.value as AlarmSoundId)}
              aria-label="Alarm sound"
              style={{
                background: "var(--surface)",
                border: "none",
                borderRadius: "var(--radius-sm, 10px)",
                padding: "8px 12px",
                fontSize: "13px",
                color: "var(--fg)",
                cursor: "pointer",
                boxShadow: "var(--neu-pressed-xs)",
              }}
            >
              {ALARM_SOUNDS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={() => preview(alarmSound)}
              aria-label="Preview alarm sound"
              style={{
                background: "var(--accent-dim)",
                color: "var(--accent)",
                border: "none",
                borderRadius: "var(--radius-sm, 10px)",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                minHeight: "auto",
                boxShadow: "var(--neu-raised-xs)",
              }}
            >
              Preview
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Alarm volume"
            style={{
              width: "60%",
              background: "var(--tick-bg)",
              boxShadow: "inset 0 1px 3px var(--neu-dark)",
            }}
          />
          <span style={{ fontSize: "13px", fontWeight: 500, minWidth: "32px", textAlign: "right", color: "var(--fg)" }}>
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Behavior */}
      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em", color: "var(--fg)" }}>
        Behavior
      </h3>

      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg, 22px)",
        padding: "20px",
        marginBottom: "28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "var(--neu-raised-md)",
        transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard)",
      }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}>Auto-Focus After Break</div>
          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
            Automatically start a new flow session when break ends
          </div>
        </div>
        <Switch checked={autoFocusAfterBreak} onCheckedChange={toggleAutoFocus} aria-label="Toggle auto-focus after break" />
      </div>

      {/* Notifications */}
      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em", color: "var(--fg)" }}>
        Notifications
      </h3>

      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg, 22px)",
        padding: "20px",
        marginBottom: "28px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "var(--neu-raised-md)",
        transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard)",
      }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}>Browser Notifications</div>
          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
            Show notifications when focus ends
          </div>
        </div>
        <Switch checked={notificationsEnabled} onCheckedChange={toggleNotifications} aria-label="Toggle browser notifications" />
      </div>

      {/* Session count */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg, 22px)",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "var(--neu-raised-md)",
          transition: "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}>Sessions</div>
          <div
            style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}
          >
            All data stored locally
          </div>
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {sessionCount} total
        </div>
      </div>
    </div>
  );
}
