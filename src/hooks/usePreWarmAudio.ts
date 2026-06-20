import { useEffect, useRef, useState } from "react";

interface UsePreWarmAudioReturn {
  isReady: boolean;
}

export function usePreWarmAudio(): UsePreWarmAudioReturn {
  const [isReady, setIsReady] = useState(false);
  const warmedRef = useRef(false);

  useEffect(() => {
    if (warmedRef.current) return;

    const handler = () => {
      if (warmedRef.current) return;
      warmedRef.current = true;

      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        ctx.resume();
        // Create a silent buffer to unlock audio
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      } catch {
        // AudioContext not available — proceed without pre-warm
      }

      setIsReady(true);
    };

    // Use pointerdown for the broadest compatibility
    document.addEventListener("pointerdown", handler, { once: true });

    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  }, []);

  return { isReady };
}
