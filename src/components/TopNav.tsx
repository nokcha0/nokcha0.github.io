import type { MouseEvent } from "react";
import { navLinks } from "../data/website";
import { ThemeIcon } from "./icons";
import type { NavLink, PageId, ThemeMode } from "../types/website";
import { animateNameHover, resetNameHover } from "../utils/nameHover";

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
        onPointerEnter={animateNameHover}
        onPointerLeave={resetNameHover}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            animateNameHover(event);
          }
        }}
        onBlur={resetNameHover}
      >
        <span className="nav-home-label" data-name-part="">Joonhyun Chang</span>
        <span className="name-hover-graphics" aria-hidden="true">
          <span className="name-hover-greeting" data-name-part="">hello</span>
          {Array.from({ length: 10 }, (_, index) => (
            <span className="name-hover-confetti" data-confetti={index} data-name-part="" key={`confetti-${index}`} style={{ left: `${5 + index * 10}%` }} />
          ))}
          <span className="name-hover-pixels">
            {Array.from({ length: 30 }, (_, index) => (
              <span className="name-hover-pixel" data-pixel={index} data-name-part="" key={`pixel-${index}`} />
            ))}
          </span>
          <span className="name-hover-highlight" data-name-part="" />
          <span className="name-hover-scan" data-name-part="" />
          <span className="name-hover-underline" data-name-part="" />
          <span className="name-hover-sheen" data-name-part="">Joonhyun Chang</span>
          <svg className="name-hover-marker" viewBox="0 0 180 44" preserveAspectRatio="none">
            <path d="M 157 5 C 109 -3, 8 0, 4 21 C -1 43, 163 48, 175 26 C 189 4, 68 -4, 25 8" pathLength="100" data-name-part="" />
          </svg>
          <span className="name-hover-corner top-left" data-name-part="" />
          <span className="name-hover-corner top-right" data-name-part="" />
          <span className="name-hover-corner bottom-left" data-name-part="" />
          <span className="name-hover-corner bottom-right" data-name-part="" />
          <span className="name-hover-letters">
            {Array.from("Joonhyun Chang").map((letter, index) => (
              <span className="name-hover-letter" data-name-part="" key={index}>{letter}</span>
            ))}
          </span>
        </span>
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
