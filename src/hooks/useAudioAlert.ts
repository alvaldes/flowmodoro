import { useCallback, useRef, useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { ALARM_SOUNDS } from "@/lib/constants";
import type { AlarmSoundId } from "@/stores/types";

interface UseAudioAlertReturn {
  playFocus: () => void;
  playBreak: () => void;
  playEnd: () => void;
  stop: () => void;
  preview: (soundId: AlarmSoundId) => void;
  isPlaying: boolean;
}

function createAndPlayAudio(soundId: AlarmSoundId, audioRef: React.MutableRefObject<HTMLAudioElement | null>, setIsPlaying: (v: boolean) => void) {
  if (soundId === "none") return;

  const sound = ALARM_SOUNDS.find((s) => s.id === soundId);
  const url = sound?.file ?? ALARM_SOUNDS[0].file;

  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  const audio = new Audio(url);
  audio.volume = useSettingsStore.getState().volume;
  audioRef.current = audio;
  audio.play().catch(() => {});
  setIsPlaying(true);
  audio.addEventListener("ended", () => {
    setIsPlaying(false);
  }, { once: true });
}

export function useAudioAlert(): UseAudioAlertReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const volume = useSettingsStore((s) => s.volume);

  // Sync volume on existing audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playFocus = useCallback(() => {
    if (document.hidden) return;
    const soundId = useSettingsStore.getState().focusAlarmSound;
    createAndPlayAudio(soundId, audioRef, setIsPlaying);
  }, []);

  const playBreak = useCallback(() => {
    if (document.hidden) return;
    const soundId = useSettingsStore.getState().breakAlarmSound;
    createAndPlayAudio(soundId, audioRef, setIsPlaying);
  }, []);

  const playEnd = useCallback(() => {
    if (document.hidden) return;
    const soundId = useSettingsStore.getState().endAlarmSound;
    createAndPlayAudio(soundId, audioRef, setIsPlaying);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const preview = useCallback((soundId: AlarmSoundId) => {
    createAndPlayAudio(soundId, audioRef, setIsPlaying);
  }, []);

  return { playFocus, playBreak, playEnd, stop, preview, isPlaying };
}
