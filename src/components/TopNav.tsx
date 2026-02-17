import type { MouseEvent } from "react";
import { sectionLabels, sectionOrder } from "../data/website";
import { ThemeIcon } from "./icons";
import type { SectionId, ThemeMode } from "../types/website";

type TopNavProps = {
  activeSection: SectionId;
  themeMode: ThemeMode;
  onNavClick: (event: MouseEvent<HTMLAnchorElement>, sectionId: SectionId) => void;
  onThemeToggle: () => void;
};

export function TopNav({
  activeSection,
  themeMode,
  onNavClick,
  onThemeToggle,
}: TopNavProps) {
  return (
    <header className="floating-nav" aria-label="Primary">
      <nav>
        <ul>
          {sectionOrder.map((sectionId) => (
            <li key={sectionId} className="section-nav-item">
              <a
                href={`#${sectionId}`}
                onClick={(event) => onNavClick(event, sectionId)}
                className={activeSection === sectionId ? "is-active" : ""}
                aria-current={activeSection === sectionId ? "page" : undefined}
              >
                {sectionLabels[sectionId]}
              </a>
            </li>
          ))}
          <li className="theme-toggle-item">
            <button
              type="button"
              className="theme-toggle"
              onClick={onThemeToggle}
              aria-label={
                themeMode === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              <span className="theme-toggle-icon">
                <ThemeIcon mode={themeMode} />
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
