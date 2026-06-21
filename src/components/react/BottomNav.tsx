import { Clock, BarChart3, Settings, type LucideIcon } from "lucide-react";
import type { AppView } from "@/lib/constants";

interface NavItemType {
  id: AppView;
  label: string;
  Icon: LucideIcon;
}

interface BottomNavProps {
  view: AppView;
  onViewChange: (view: AppView) => void;
}

const items: NavItemType[] = [
  { id: "stats", label: "Stats", Icon: BarChart3 },
  { id: "timer", label: "Timer", Icon: Clock },
  { id: "settings", label: "Settings", Icon: Settings },
];

function NavItem({
  Icon,
  label,
  active,
  onClick,
}: {
  Icon: LucideIcon;
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
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 0",
        background: active ? "var(--surface)" : "transparent",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        font: "inherit",
        border: "none",
        borderRadius: "var(--radius-md, 16px)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        minHeight: "44px",
        boxShadow: "none",
        transition: "color var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), box-shadow var(--motion-fast, 150ms) var(--ease-standard), background var(--motion-fast, 150ms) var(--ease-standard)",
      }}
    >
      <Icon size={22} strokeWidth={active ? 3 : 2} />
    </button>
  );
}

export default function BottomNav({ view, onViewChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 48px)",
        maxWidth: "432px",
        background: "var(--nav-bg)",
        borderRadius: "9999px",
        padding: "4px 6px",
        paddingBottom: "max(4px, env(safe-area-inset-bottom, 4px))",
        display: "flex",
        zIndex: 100,
        boxShadow: "var(--neu-raised-xl)",
        transition: "background var(--motion-base, 250ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)), box-shadow var(--motion-base, 250ms) var(--ease-standard)",
      }}
      role="tablist"
      aria-label="Main navigation"
    >
      {items.map((item) => (
        <NavItem
          key={item.id}
          Icon={item.Icon}
          label={item.label}
          active={view === item.id}
          onClick={() => onViewChange(item.id)}
        />
      ))}
    </nav>
  );
}
