import { useCallback, useEffect, useState } from "react";

interface UseNotificationReturn {
  show: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
  permission: NotificationPermission | "unavailable";
}

export function useNotification(): UseNotificationReturn {
  const [permission, setPermission] = useState<NotificationPermission | "unavailable">(
    typeof Notification === "undefined" ? "unavailable" : Notification.permission
  );

  const isSupported = permission !== "unavailable";

  // Request permission on mount (user wanted it on app open)
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission().then((result) => {
        setPermission(result);
      });
    }
  }, []);

  const show = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported) return;
      if (Notification.permission !== "granted") return;

      try {
        new Notification(title, {
          icon: "/favicon.svg",
          ...options,
        });
      } catch {
        // Notification failed silently
      }
    },
    [isSupported]
  );

  return { show, isSupported, permission };
}
