import { useCallback, useRef, useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { ALARM_SOUNDS } from "@/lib/constants";
import type { AlarmSoundId } from "@/stores/types";

interface UseAudioAlertReturn {
  play: () => void;
  stop: () => void;
  preview: (soundId: AlarmSoundId) => void;
  isPlaying: boolean;
}

export function useAudioAlert(): UseAudioAlertReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSoundRef = useRef<AlarmSoundId>("gentle-chime");
  const isPlayingRef = useRef(false);

  const { alarmSound, volume } = useSettingsStore();

  // Update current sound when settings change
  useEffect(() => {
    currentSoundRef.current = alarmSound;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [alarmSound, volume]);

  const getSoundUrl = useCallback((soundId: AlarmSoundId): string => {
    const sound = ALARM_SOUNDS.find((s) => s.id === soundId);
    return sound?.file ?? ALARM_SOUNDS[0].file;
  }, []);

  const play = useCallback(() => {
    // Don't play sound if tab is hidden (user can't hear it)
    if (document.hidden) return;

    const soundId = currentSoundRef.current;
    const url = getSoundUrl(soundId);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.volume = useSettingsStore.getState().volume;
    audioRef.current = audio;

    audio.play().catch(() => {
      // Autoplay blocked — will be handled by pre-warm
    });

    isPlayingRef.current = true;
    audio.addEventListener("ended", () => {
      isPlayingRef.current = false;
    }, { once: true });
  }, [getSoundUrl]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, []);

  const preview = useCallback((soundId: AlarmSoundId) => {
    const url = getSoundUrl(soundId);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(url);
    audio.volume = useSettingsStore.getState().volume;
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, [getSoundUrl]);

  return { play, stop, preview, isPlaying: isPlayingRef.current };
}
