import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { ALARM_SOUNDS } from "@/lib/constants";
import type { AlarmSoundId } from "@/stores/types";

export default function SettingsSection() {
  const {
    restRatio,
    darkMode,
    alarmSound,
    volume,
    notificationsEnabled,
    setRestRatio,
    toggleDarkMode,
    setAlarmSound,
    setVolume,
    toggleNotifications,
  } = useSettingsStore();
  const sessionCount = useSessionsStore((s) => s.sessions.length);

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Rest Ratio */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
        }}
      >
        Rest Ratio
      </h3>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "20px",
          marginBottom: "24px",
          transition:
            "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
            Focus
          </span>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
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
              WebkitAppearance: "none",
              appearance: "none",
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              background: "var(--border)",
              outline: "none",
              transition:
                "background var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              minWidth: "50px",
              textAlign: "center",
            }}
          >
            {Math.round(restRatio * 100)}%
          </span>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted)",
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
        }}
      >
        Appearance
      </h3>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition:
            "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px" }}>Dark Mode</div>
          <div
            style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}
          >
            Switch to dark theme
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          role="switch"
          aria-checked={darkMode}
          aria-label="Toggle dark mode"
          style={{
            width: "48px",
            height: "28px",
            borderRadius: "14px",
            background: darkMode ? "var(--accent)" : "var(--border)",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition:
              "background var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
            padding: 0,
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "white",
              position: "absolute",
              top: "3px",
              left: darkMode ? "23px" : "3px",
              transition:
                "left var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}
          />
        </button>
      </div>

      {/* Alarm Sound */}
      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em" }}>
        Alarm
      </h3>

      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg, 16px)", padding: "20px",
        marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px",
        transition: "background var(--motion-base, 250ms) var(--ease-standard)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: "15px" }}>Sound</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
              Alarm when session ends
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <select
              value={alarmSound}
              onChange={(e) => setAlarmSound(e.target.value as AlarmSoundId)}
              aria-label="Alarm sound"
              style={{
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm, 8px)", padding: "8px 12px",
                fontSize: "13px", color: "var(--fg)", cursor: "pointer",
              }}
            >
              {ALARM_SOUNDS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const audio = new Audio(ALARM_SOUNDS.find(s => s.id === alarmSound)?.file ?? ALARM_SOUNDS[0].file);
                audio.volume = volume;
                audio.play().catch(() => {});
              }}
              aria-label="Preview alarm sound"
              style={{
                background: "var(--accent-dim)", color: "var(--accent)",
                border: "none", borderRadius: "var(--radius-sm, 8px)",
                padding: "8px 12px", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              Preview
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Alarm volume"
            style={{ width: "60%" }}
          />
          <span style={{ fontSize: "13px", fontWeight: 500, minWidth: "32px", textAlign: "right" }}>
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Notifications */}
      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em" }}>
        Notifications
      </h3>

      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg, 16px)", padding: "20px",
        marginBottom: "24px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        transition: "background var(--motion-base, 250ms) var(--ease-standard)"
      }}>
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px" }}>Browser Notifications</div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
            Show notifications when focus ends
          </div>
        </div>
        <button
          onClick={toggleNotifications}
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="Toggle browser notifications"
          style={{
            width: "48px", height: "28px", borderRadius: "14px",
            background: notificationsEnabled ? "var(--accent)" : "var(--border)",
            border: "none", cursor: "pointer", position: "relative",
            transition: "background var(--motion-fast, 150ms) var(--ease-standard)",
            padding: 0,
          }}
        >
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: "white", position: "absolute", top: "3px",
            left: notificationsEnabled ? "23px" : "3px",
            transition: "left var(--motion-fast, 150ms) var(--ease-standard)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }} />
        </button>
      </div>

      {/* Session count */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg, 16px)",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition:
            "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: "15px" }}>Sessions</div>
          <div
            style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}
          >
            All data stored locally
          </div>
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--muted)",
            fontWeight: 500,
          }}
        >
          {sessionCount} total
        </div>
      </div>
    </div>
  );
}
