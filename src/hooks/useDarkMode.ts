import { useEffect, useState } from "react";

export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem("flowmodoro-dark-mode");
    if (stored !== null) {
      setDark(stored === "true");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", dark ? "#15171f" : "#f8f9fc");
    }
    localStorage.setItem("flowmodoro-dark-mode", String(dark));
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return [dark, toggle];
}
