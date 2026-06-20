import type { AppView } from "@/lib/constants";

interface NavItemType {
  id: AppView;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  view: AppView;
  onViewChange: (view: AppView) => void;
}

const items: NavItemType[] = [
  {
    id: "timer",
    label: "Timer",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "stats",
    label: "Stats",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="8" y1="12" x2="8" y2="17" />
        <line x1="12" y1="9" x2="12" y2="17" />
        <line x1="16" y1="7" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-selected={active}
      role="tab"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "8px 0",
        background: "transparent",
        color: active ? "var(--accent)" : "var(--muted)",
        font: "inherit",
        fontSize: "11px",
        fontWeight: active ? 600 : 400,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        border: "none",
        borderRadius: 0,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: "color var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
        minHeight: "44px",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function BottomNav({ view, onViewChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        padding: "4px 8px",
        paddingBottom: "max(4px, env(safe-area-inset-bottom, 4px))",
        display: "flex",
        zIndex: 100,
        transition: "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))",
      }}
      role="tablist"
      aria-label="Main navigation"
    >
      {items.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={view === item.id}
          onClick={() => onViewChange(item.id)}
        />
      ))}
    </nav>
  );
}
