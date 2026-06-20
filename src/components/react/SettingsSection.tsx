import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";

export default function SettingsSection() {
  const { restRatio, darkMode, setRestRatio, toggleDarkMode } =
    useSettingsStore();
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
