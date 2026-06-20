export function formatTime(seconds: number): string {
  // ---------------------------------------------------------------------------
  // FUTURE: to restore h:mm:ss format for durations >=1h,
  // uncomment the block below and remove the current implementation.
  //
  // const h = Math.floor(seconds / 3600);
  // const m = Math.floor((seconds % 3600) / 60);
  // const s = seconds % 60;
  //
  // if (h > 0) {
  //   return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  // }
  // return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  // ---------------------------------------------------------------------------

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (d > 0) {
    if (h > 0) return `${d}d ${h}h`;
    return `${d}d`;
  }
  if (h > 0) {
    if (m > 0) return `${h}h ${m}m`;
    return `${h}h`;
  }
  if (m > 0) return `${m}m`;
  return "0m";
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeShort(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
