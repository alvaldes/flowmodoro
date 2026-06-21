import { useSettingsStore } from "@/stores/settings-store";
import { useSessionsStore } from "@/stores/sessions-store";
import { useTimerStore } from "@/stores/timer-store";
import { useAudioAlert } from "@/hooks/useAudioAlert";
import { ALARM_SOUNDS } from "@/lib/constants";
import type { AlarmSoundId } from "@/stores/types";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Play, Square, Trash2 } from "lucide-react";
import { PillButton } from "@/components/react/TimerSection";
import { useState, useEffect } from "react";

interface SoundRowProps {
  label: string;
  description: string;
  soundId: string;
  value: AlarmSoundId;
  onChange: (sound: AlarmSoundId) => void;
  previewingId: string | null;
  isPlaying: boolean;
  onPreview: (id: string, soundId: AlarmSoundId) => void;
  onStop: () => void;
}

function SoundRow({
  label,
  description,
  soundId,
  value,
  onChange,
  previewingId,
  isPlaying,
  onPreview,
  onStop,
}: SoundRowProps) {
  const isThisPlaying = previewingId === soundId && isPlaying;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}>
          {label}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-tertiary)",
            marginTop: "2px",
          }}
        >
          {description}
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as AlarmSoundId)}
          aria-label={label}
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
          <option value="none">None</option>
          {ALARM_SOUNDS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <PillButton
          active={isThisPlaying}
          icon={
            isThisPlaying ? (
              <Square size={16} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" />
            )
          }
          onClick={isThisPlaying ? onStop : () => onPreview(soundId, value)}
          ariaLabel={
            isThisPlaying ? `Stop ${label} preview` : `Preview ${label} sound`
          }
          size={34}
          style={{ background: "none", boxShadow: "none" }}
        />
      </div>
    </div>
  );
}

export default function SettingsSection() {
  const {
    restRatio,
    darkMode,
    focusAlarmSound,
    breakAlarmSound,
    endAlarmSound,
    volume,
    notificationsEnabled,
    autoFocusAfterBreak,
    setRestRatio,
    toggleDarkMode,
    setFocusAlarmSound,
    setBreakAlarmSound,
    setEndAlarmSound,
    setVolume,
    toggleNotifications,
    toggleAutoFocus,
  } = useSettingsStore();
  const sessionCount = useSessionsStore((s) => s.sessions.length);
  const { preview, stop, isPlaying } = useAudioAlert();
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  // Reset previewingId when audio stops naturally
  useEffect(() => {
    if (!isPlaying) {
      setPreviewingId(null);
    }
  }, [isPlaying]);

  const handlePreview = (id: string, soundId: AlarmSoundId) => {
    setPreviewingId(id);
    preview(soundId);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const clearAllData = () => {
    useSessionsStore.getState().clearSessions();
    useSettingsStore.getState().resetToDefaults();
    useTimerStore.getState().resetToDefaults();
    localStorage.removeItem("flowmodoro-onboarding");
    setIsDeleteDialogOpen(false);
  };

  const handleStop = () => {
    stop();
    setPreviewingId(null);
  };

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Break Ratio */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        Break Ratio
      </h3>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg, 22px)",
          padding: "20px",
          marginBottom: "28px",
          boxShadow: "var(--neu-raised-md)",
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
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
            Break
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
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div
            style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}
          >
            Dark Mode
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              marginTop: "2px",
            }}
          >
            Switch to dark theme
          </div>
        </div>
        <Switch
          checked={darkMode}
          onCheckedChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        />
      </div>

      {/* Alarm Sounds */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        Alarm
      </h3>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg, 22px)",
          padding: "20px",
          marginBottom: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "var(--neu-raised-md)",
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard)",
        }}
      >
        {/* Focus Start */}
        <SoundRow
          label="Focus Start"
          description="When focus begins or resumes"
          soundId="focus"
          value={focusAlarmSound}
          onChange={setFocusAlarmSound}
          previewingId={previewingId}
          isPlaying={isPlaying}
          onPreview={handlePreview}
          onStop={handleStop}
        />

        {/* Break Start */}
        <SoundRow
          label="Break Start"
          description="When break begins"
          soundId="break"
          value={breakAlarmSound}
          onChange={setBreakAlarmSound}
          previewingId={previewingId}
          isPlaying={isPlaying}
          onPreview={handlePreview}
          onStop={handleStop}
        />

        {/* Session Complete */}
        <SoundRow
          label="Session Complete"
          description="When session ends"
          soundId="end"
          value={endAlarmSound}
          onChange={setEndAlarmSound}
          previewingId={previewingId}
          isPlaying={isPlaying}
          onPreview={handlePreview}
          onStop={handleStop}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            Volume
          </span>
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
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              minWidth: "32px",
              textAlign: "right",
              color: "var(--fg)",
            }}
          >
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Behavior */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        Behavior
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
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard)",
        }}
      >
        <div>
          <div
            style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}
          >
            Auto-Focus After Break
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              marginTop: "2px",
            }}
          >
            Automatically start a new flow session when break ends
          </div>
        </div>
        <Switch
          checked={autoFocusAfterBreak}
          onCheckedChange={toggleAutoFocus}
          aria-label="Toggle auto-focus after break"
        />
      </div>

      {/* Notifications */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "-0.01em",
          color: "var(--fg)",
        }}
      >
        Notifications
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
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard)",
        }}
      >
        <div>
          <div
            style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}
          >
            Browser Notifications
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              marginTop: "2px",
            }}
          >
            Show notifications when focus ends
          </div>
        </div>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={toggleNotifications}
          aria-label="Toggle browser notifications"
        />
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
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div
            style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}
          >
            Sessions
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              marginTop: "2px",
            }}
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

      {/* Danger Zone */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "16px",
          marginTop: "28px",
          letterSpacing: "-0.01em",
          color: "var(--destructive)",
        }}
      >
        Danger Zone
      </h3>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg, 22px)",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "var(--neu-raised-md)",
          border: "1px solid color-mix(in oklch, var(--destructive) 20%, transparent)",
          transition:
            "box-shadow var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        }}
      >
        <div>
          <div
            style={{ fontWeight: 500, fontSize: "15px", color: "var(--fg)" }}
          >
            Clear All Data
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              marginTop: "2px",
            }}
          >
            Permanently delete all sessions, timer state, and settings
          </div>
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0 text-destructive border-destructive/40 hover:bg-destructive/10"
              >
                <Trash2 size={15} />
                Delete
              </Button>
            }
          />
          <DialogContent role="alertdialog">
            <DialogHeader>
              <DialogTitle>Delete all data?</DialogTitle>
              <DialogDescription>
                This will permanently delete all your sessions, timer progress,
                and reset every setting to its default. This action{" "}
                <strong>cannot be undone</strong>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={<Button variant="outline">Cancel</Button>}
              />
              <Button
                variant="default"
                className="gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={clearAllData}
              >
                <Trash2 size={15} />
                Delete Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
