# Flowmodoro — Intelligent Focus Timer

[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5-7B61FF?logo=react&logoColor=white)](https://zustand-demo.pmnd.rs)
[![PWA](https://img.shields.io/badge/PWA-✓-5A0FC8?logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://vercel.com)

**Flowmodoro** reimagines focus timing. Instead of rigid Pomodoro intervals that tear you out of deep concentration, it counts **up** while you work and calculates a **smart break** when you decide to stop.

> Flow over clock. Rest that fits.

---

## The Concept

### 🧠 Flow > Pomodoro

Traditional Pomodoro forces you to stop every 25 minutes — right when you're hitting a stride. Flowmodoro flips the model:

- **Count-up focus timer** — no alarms, no interruptions. You decide when a session ends.
- **Adaptive rest ratio** — break time scales with focus time. Default is ~20%, so 25 minutes of flow earns you 5 minutes of rest. Adjustable from 8% to 50%.
- **Natural rhythm** — work until your attention wanes, recharge proportionally, repeat.

### 🎯 Designed for deep work

Flowmodoro doesn't manage your time. It *follows* your attention — making it ideal for creative work, coding, writing, research, or any task where context matters more than the clock.

---

## Features

### ⏱️ Timer

| State | Behavior |
|-------|----------|
| **Idle** | Ready to start. Shows last session duration if available. |
| **Focusing** | Counts up from zero. No limits, no interruptions. |
| **Resting** | Counts down from calculated break time. Auto-completes when it hits zero. |
| **Completed** | Name your session, add tags, then dismiss. Auto-dismisses after 5 seconds. |

### 🎨 Neumorphic Design System

Custom-built neumorphic UI with raised and pressed shadow variants across all components:

- **Light mode** — soft oklch-based palette with subtle light/dark shadows
- **Dark mode** — inverts surfaces while preserving the neumorphic feel
- **System preference detection** — respects `prefers-color-scheme` on first visit
- **Reduced motion** — respects `prefers-reduced-motion`, disables transitions

### 📊 Statistics

- **Summary cards** — total focus time, session count, today's total
- **Weekly bar chart** — 7-day focus breakdown, current day highlighted
- **Session history** — reverse-chronological list with names and tags
- **All data local** — no server, no accounts, no tracking

### 🔊 Audio Alerts

Nine hand-picked alarm sounds:

Achievement Bell · Bell Notification · Casino Reward · Classic Alarm · Digital Alarm · Happy Bells · Notification Bell · Uplifting Bells · Urgent Tone

Preview any sound in settings, adjust volume, or disable entirely.

### 🔔 Browser Notifications

Optional desktop notifications when a focus session ends. Shows duration and session name.

### 📱 Progressive Web App

Fully installable on desktop and mobile. Works offline. Background timer syncs via the Page Visibility API — accurate even when you switch tabs or lock your phone.

### 🎓 Onboarding

Three-slide interactive introduction that explains the Flowmodoro concept before the first use. Shown once, persisted to localStorage.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | [Astro 6](https://astro.build) | Static site generation, asset optimization |
| **UI** | [React 19](https://react.dev) | Interactive components |
| **Language** | [TypeScript 6](https://www.typescriptlang.org) | Strict type safety |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + CSS custom properties | Utility-first + neumorphic design tokens |
| **State** | [Zustand 5](https://zustand-demo.pmnd.rs) with `persist` middleware | Lightweight global state, localStorage hydration |
| **Animations** | [Framer Motion](https://www.framer.com/motion) | View transitions, onboarding slides |
| **Icons** | Lucide (inline SVGs) via BottomNav | Navigation and decorative icons |
| **UI Primitives** | [Base UI](https://base-ui.com) + [shadcn/ui](https://ui.shadcn.com) | Accessible Switch, Button, Card, Dialog, Badge |
| **PWA** | [@vite-pwa/astro](https://vite-pwa-org.netlify.app/frameworks/astro) | Service worker, manifest, offline support |
| **Font** | [Geist Variable](https://vercel.com/font) | System font stack with variable weight |
| **Testing** | [Vitest](https://vitest.dev) + Testing Library | Unit and component tests |
| **Package** | [Bun](https://bun.sh) | Fast package manager and runtime |
| **Deploy** | [Vercel](https://vercel.com) | Static hosting with edge network |

### Architecture Decisions

- **No backend** — every piece of data lives in localStorage. Three Zustand stores handle timer state, settings, and sessions. No accounts, no sync, no latency.
- **Single-page SPA** — despite being Astro, the app runs as a React SPA on a single route (`/`). The Astro shell handles the PWA manifest, SEO meta, and theme-flash prevention script.
- **CSS-driven theming** — dark mode is toggled by adding/removing a `.dark` class on `<html>`. All colors are defined as CSS custom properties on `:root` and `.dark`, making theme switching instant without JS layout recalc.
- **Hook-based timer engine** — `usePreciseTimer` encapsulates the full timer lifecycle: tick interval, break calculation, session persistence, audio alerts, notifications, and background page detection.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/flowmodoro.git
cd flowmodoro

# Install dependencies (Bun required)
bun install

# Start development server
bun dev

# Build for production
bun build

# Preview production build
bun preview

# Run tests
bun test
```

> **Requirements**: Node.js ≥ 22.12, Bun 1.x+

---

## Project Structure

```
src/
├── components/
│   ├── react/
│   │   ├── AnalogDial.tsx       # SVG circular timer with tick marks and progress ring
│   │   ├── AppShell.tsx         # Root component: hydration, routing, onboarding
│   │   ├── BottomNav.tsx        # Fixed bottom tab navigation (Timer / Stats / Settings)
│   │   ├── Onboarding.tsx       # 3-slide interactive introduction
│   │   ├── SettingsSection.tsx  # Rest ratio, dark mode, alarm, notifications
│   │   ├── StatsSection.tsx     # Summary cards, weekly chart, session history
│   │   └── TimerSection.tsx     # Timer display, action buttons, session naming
│   └── ui/                     # shadcn/ui primitives (Button, Card, Switch, etc.)
├── hooks/
│   ├── useAudioAlert.ts        # Audio playback with pre-warm support
│   ├── useDarkMode.ts          # Dark mode toggle with localStorage persistence
│   ├── useNotification.ts      # Browser Notification API wrapper
│   ├── usePreciseTimer.ts      # Timer engine: tick, break, sessions, background sync
│   ├── usePreWarmAudio.ts      # Unlock AudioContext on first user interaction
│   └── useReducedMotion.ts     # prefers-reduced-motion media query
├── layouts/
│   └── BaseLayout.astro        # HTML shell, SEO meta, theme-flash prevention
├── lib/
│   ├── constants.ts            # Alarm sounds list, timer constants, storage keys, views
│   ├── format.ts               # Time formatting utilities (MM:SS, duration, dates)
│   ├── storage.ts              # Safe localStorage accessor
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
├── pages/
│   └── index.astro             # Single entry point
├── stores/
│   ├── settings-store.ts       # Zustand: restRatio, darkMode, alarmSound, volume, notifications
│   ├── sessions-store.ts       # Zustand: session array with CRUD operations
│   ├── timer-store.ts          # Zustand: appState, time, tick/break/reset actions
│   └── types.ts                # Shared TypeScript types
└── styles/
    └── global.css              # Neumorphic design tokens, Tailwind config, base styles
```

---

## Configuration

### Rest Ratio

The proportion of break time to focus time. Adjustable in settings from **8% to 50%**.

| Ratio | 10 min focus → | 25 min focus → | 60 min focus → |
|-------|----------------|----------------|----------------|
| 8%    | 48s rest       | 2m rest        | 4m 48s rest    |
| 20% (default) | 2m rest | 5m rest | 12m rest |
| 50%   | 5m rest        | 12m 30s rest   | 30m rest       |

Minimum rest is clamped to 10 seconds regardless of ratio.

### Alarm Sounds

Nine WAV files included in `public/sounds/`. Select and preview from the settings panel. Volume adjusts independently of the system volume.

---

## Design System

Flowmodoro uses a **custom neumorphic design system** built entirely with CSS custom properties. Key tokens:

```css
/* Surfaces — raised components look convex, pressed look concave */
--neu-raised-md: 5px 5px 12px var(--neu-dark), -5px -5px 12px var(--neu-light);
--neu-pressed-md: inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light);

/* Accent buttons — blue-tinted raised shadow for primary actions */
--neu-accent-raised: 3px 3px 8px var(--neu-accent-dark), -3px -3px 8px oklch(80% 0.15 255 / 0.3);
```

All CSS is in `src/styles/global.css` — single source of truth for both light and dark themes.

---

## Commands

| Command | Action |
|---------|--------|
| `bun dev` | Start dev server at `localhost:4321` |
| `bun build` | Build to `./dist/` |
| `bun preview` | Preview production build |
| `bun test` | Run Vitest once |
| `bun test:watch` | Run Vitest in watch mode |
| `bun astro check` | Type-check the project |
| `bun astro -- --help` | Astro CLI help |

---

## Roadmap

Ideas for future iterations:

- [ ] Session filtering by date range (today, week, month, custom)
- [ ] Export sessions as CSV/JSON
- [ ] Custom alarm sounds upload
- [ ] Focus goal tracking (daily/weekly targets)
- [ ] Keyboard shortcuts (Space to start/stop, etc.)
- [ ] i18n support

---

## License

MIT
