import type { MouseEvent } from "react";
import { navLinks } from "../data/website";
import { ThemeIcon } from "./icons";
import type { NavLink, PageId, ThemeMode } from "../types/website";

type TopNavProps = {
  activePage: PageId;
  themeMode: ThemeMode;
  onNavClick: (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => void;
  onThemeToggle: () => void;
};

export function TopNav({
  activePage,
  themeMode,
  onNavClick,
  onThemeToggle,
}: TopNavProps) {
  const isActiveLink = (link: NavLink) => activePage === link.id;

  return (
    <header className="floating-nav" aria-label="Primary">
      <a
        href="#/"
        className="nav-home"
        onClick={(event) =>
          onNavClick(event, { id: "home", label: "Home", href: "#/" })
        }
        aria-label="Joonhyun Chang"
      >
        Joonhyun Chang
      </a>
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.id} className="section-nav-item">
              <a
                href={link.href}
                onClick={(event) => onNavClick(event, link)}
                className={isActiveLink(link) ? "is-active" : ""}
                aria-current={isActiveLink(link) ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="theme-toggle-item nav-control-item">
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
