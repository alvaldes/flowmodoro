import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Chart color tokens — read once from CSS custom properties
// ---------------------------------------------------------------------------

const FALLBACKS = {
  accent: "oklch(60% 0.22 255)",
  "accent-dim": "oklch(60% 0.22 255 / 0.14)",
  fg: "oklch(18% 0.012 260)",
  "text-secondary": "oklch(48% 0.008 260)",
  "text-tertiary": "oklch(66% 0.005 260)",
  "tick-bg": "oklch(72% 0.006 260)",
  surface: "oklch(87% 0.005 260)",
} as const;

const CSS_VAR_NAMES = [
  "accent",
  "accent-dim",
  "fg",
  "text-secondary",
  "text-tertiary",
  "tick-bg",
  "surface",
] as const;

type CssVarName = (typeof CSS_VAR_NAMES)[number];

export interface ChartColors {
  accent: string;
  accentDim: string;
  fg: string;
  textSecondary: string;
  textTertiary: string;
  tickBg: string;
  surface: string;
  /** Semantic alias — accent with ~0.6 opacity for dataset fills */
  accentAlpha: string;
}

function readCssColor(name: CssVarName): string {
  if (typeof document === "undefined") return FALLBACKS[name];
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
  return value || FALLBACKS[name];
}

function toAccentAlpha(accent: string, alpha = 0.4): string {
  // oklch(L C H) → oklch(L C H / A)
  if (accent.startsWith("oklch(") && !accent.includes("/")) {
    return accent.replace("oklch(", `oklch(`).replace(")", ` / ${alpha})`);
  }
  return accent;
}

export function getChartColors(): ChartColors {
  const accent = readCssColor("accent");
  return {
    accent,
    accentDim: readCssColor("accent-dim"),
    fg: readCssColor("fg"),
    textSecondary: readCssColor("text-secondary"),
    textTertiary: readCssColor("text-tertiary"),
    tickBg: readCssColor("tick-bg"),
    surface: readCssColor("surface"),
    accentAlpha: toAccentAlpha(accent),
  };
}

// ---------------------------------------------------------------------------
// Reactive hook — updates when <html> class changes (dark mode toggle)
// ---------------------------------------------------------------------------

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(getChartColors);

  useEffect(() => {
    // Re-read colors whenever .dark/.light class changes on <html>
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setColors(getChartColors());
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
