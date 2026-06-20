import { useEffect, useRef, useState } from "react";

export function useReducedMotion(): boolean {
  const mq = useRef<MediaQueryList | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    mq.current = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.current.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.current.addEventListener("change", handler);
    return () => mq.current?.removeEventListener("change", handler);
  }, []);

  return reduced;
}
