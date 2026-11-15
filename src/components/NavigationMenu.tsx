import type { ReactNode } from "react";
import type { HomePanel } from "../types/game";

interface NavigationMenuProps {
  onOpen: (panel: HomePanel) => void;
}

const MENU_ITEMS: { panel: HomePanel; label: string; icon: ReactNode }[] = [
  {
    panel: "learn",
    label: "Apprendre",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 6.5C10.2 5.2 7.6 4.5 4 4.5v14c3.6 0 6.2.7 8 2 1.8-1.3 4.4-2 8-2v-14c-3.6 0-6.2.7-8 2Z" />
        <path d="M12 6.5v14M7 8.5c1.2.1 2.2.35 3 .7m7-1.4c-1.2.1-2.2.35-3 .7M7 12c1.2.1 2.2.35 3 .7m7-1.4c-1.2.1-2.2.35-3 .7" />
      </svg>
    ),
  },
  {
    panel: "options",
    label: "Options",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Z" />
        <path d="m19.4 13.5 1.1.8-1.4 2.5-1.3-.5a7.8 7.8 0 0 1-1.4.8l-.2 1.4h-2.9l-.3-1.4a7.7 7.7 0 0 1-1.5-.8l-1.3.5-1.4-2.5 1.1-.9a7.4 7.4 0 0 1 0-1.7l-1.1-.8 1.4-2.5 1.3.5a7.8 7.8 0 0 1 1.4-.8l.2-1.4h2.9l.3 1.4a7.7 7.7 0 0 1 1.5.8l1.3-.5 1.4 2.5-1.1.9c.1.6.1 1.2 0 1.7Z" />
      </svg>
    ),
  },
  {
    panel: "ranking",
    label: "Classement",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 4h8v5.2a4 4 0 0 1-8 0V4ZM8 6H4v2.2a4 4 0 0 0 4 4m8-6h4v2.2a4 4 0 0 1-4 4M12 13.2V18m-4 3h8m-7-3h6" />
        <path d="m12 5 .7 1.4 1.5.2-1.1 1.1.3 1.5L12 8.5l-1.4.7.3-1.5-1.1-1.1 1.5-.2L12 5Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function NavigationMenu({ onOpen }: NavigationMenuProps) {
  return (
    <nav className="bottom-navigation" aria-label="Autres activités">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.panel}
          className="nav-button"
          type="button"
          aria-haspopup="dialog"
          onClick={() => onOpen(item.panel)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}