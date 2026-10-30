import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { navLinks } from "../data/website";
import { ThemeIcon } from "./icons";
import type { NavLink, PageId, ThemeMode } from "../types/website";
import { animateNameHover, animateNameTap, clearNameAnimation, resetNameHover } from "../utils/nameHover";

type TopNavProps = {
  activePage: PageId;
  themeMode: ThemeMode;
  onNavClick: (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => void;
  onPreparePage: (page: PageId) => void;
  onThemeToggle: () => void;
};

export function TopNav({
  activePage,
  themeMode,
  onNavClick,
  onPreparePage,
  onThemeToggle,
}: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const name = headerRef.current?.querySelector<HTMLElement>(".nav-home");
    return () => { if (name) clearNameAnimation(name); };
  }, [isMobile]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    const wideScreen = window.matchMedia("(min-width: 641px)");
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("hashchange", close);
    wideScreen.addEventListener("change", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("hashchange", close);
      wideScreen.removeEventListener("change", close);
    };
  }, [menuOpen]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    setMenuOpen(false);
    onNavClick(event, link);
  };
  const isActiveLink = (link: NavLink) => activePage === link.id;
  const NameControl = isMobile ? "button" : "a";

  return (
    <header
      ref={headerRef}
      className="floating-nav"
      aria-label="Primary"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          event.preventDefault();
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <NameControl
        href={isMobile ? undefined : "#/"}
        type={isMobile ? "button" : undefined}
        className="nav-home"
        onClick={(event) => {
          if (isMobile) {
            animateNameTap(event);
          } else {
            navigate(event as MouseEvent<HTMLAnchorElement>, { id: "home", label: "Home", href: "#/" });
          }
        }}
        aria-label={isMobile ? "Joonhyun Chang — play an animation" : "Joonhyun Chang"}
        onPointerEnter={(event) => {
          if (!isMobile && event.pointerType !== "touch") animateNameHover(event);
        }}
        onPointerLeave={(event) => {
          if (!isMobile) resetNameHover(event);
        }}
        onFocus={(event) => {
          if (!isMobile && event.currentTarget.matches(":focus-visible")) {
            animateNameHover(event);
          }
        }}
        onBlur={(event) => {
          if (!isMobile) resetNameHover(event);
        }}
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
      </NameControl>
      <button
        ref={menuButtonRef}
        type="button"
        className="mobile-menu-toggle"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={menuOpen ? "m6 6 12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      <nav id={menuId} className={menuOpen ? "is-open" : ""} aria-label="Main navigation">
        <ul>
          {navLinks.map((link) => (
            <li key={link.id} className="section-nav-item">
              <a
                href={link.href}
                onClick={(event) => navigate(event, link)}
                onPointerEnter={() => onPreparePage(link.id)}
                onFocus={() => onPreparePage(link.id)}
                className={isActiveLink(link) ? "is-active" : ""}
                aria-current={isActiveLink(link) ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="theme-toggle-slot">
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
      </span>
    </header>
  );
}
