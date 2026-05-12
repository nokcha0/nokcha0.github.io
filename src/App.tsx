import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, TouchEvent } from "react";
import "./App.css";
import { TopNav } from "./components/TopNav";
import { IntroSection } from "./components/IntroSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ToolsSection } from "./components/ToolsSection";
import { ThoughtsSection } from "./components/ThoughtsSection";
import { ContactSection } from "./components/ContactSection";
import { GameSection } from "./components/GameSection";
import ClickSpark from "./components/ClickSpark";
import { timelineCategories } from "./data/website";
import { getInitialThemeMode, prefersReducedMotion } from "./utils/theme";
import type {
  NavLink,
  PageId,
  SectionId,
  ThemeMode,
  TimelineCategory,
} from "./types/website";

type RouteState = {
  page: PageId;
  section: SectionId | null;
};

function getRouteFromHash(): RouteState {
  const hash = window.location.hash.replace(/^#/, "");

  if (hash === "/tools") {
    return { page: "tools", section: null };
  }

  if (hash === "/thoughts") {
    return { page: "thoughts", section: null };
  }

  if (hash === "contact") {
    return { page: "home", section: "contact" };
  }

  return { page: "home", section: "intro" };
}

function App() {
  const initialRoute = getRouteFromHash();
  const [activePage, setActivePage] = useState<PageId>(initialRoute.page);
  const [targetSection, setTargetSection] = useState<SectionId | null>(
    initialRoute.section,
  );
  const [activeTimeline, setActiveTimeline] =
    useState<TimelineCategory>("education");
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    getInitialThemeMode(),
  );
  const [emailCopied, setEmailCopied] = useState(false);
  const experienceTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  console.log("What are you doing here, go back");

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = getRouteFromHash();
      setActivePage(nextRoute.page);
      setTargetSection(nextRoute.section);
    };

    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    if (activePage !== "home") {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return;
    }

    if (!targetSection) return;

    const frameId = window.requestAnimationFrame(() => {
      const section = document.getElementById(targetSection);
      if (!section) return;

      section.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activePage, targetSection]);

  const onNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    link: NavLink,
  ): void => {
    event.preventDefault();

    if (window.location.hash === link.href) {
      const nextRoute = getRouteFromHash();
      setActivePage(nextRoute.page);
      setTargetSection(nextRoute.section);
      return;
    }

    window.location.hash = link.href;
  };

  useEffect(() => {
    if (!emailCopied) return;

    const timeoutId = window.setTimeout(() => setEmailCopied(false), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [emailCopied]);

  const onEmailCopy = async (email: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setEmailCopied(true);
    }
  };

  const timelineIds: TimelineCategory[] = timelineCategories.map(
    (category) => category.id,
  );
  const activeTimelineIndex = timelineIds.indexOf(activeTimeline);

  const activateTimeline = (nextTimeline: TimelineCategory): void => {
    if (nextTimeline === activeTimeline) return;
    setActiveTimeline(nextTimeline);
  };

  const setTimelineByIndex = (index: number): void => {
    const normalizedIndex =
      (index + timelineIds.length) % Math.max(timelineIds.length, 1);
    const nextTimeline = timelineIds[normalizedIndex];
    if (nextTimeline) {
      activateTimeline(nextTimeline);
    }
  };

  const shiftTimeline = (direction: -1 | 1): void => {
    setTimelineByIndex(activeTimelineIndex + direction);
  };

  const onTimelineSwitcherKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ): void => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      shiftTimeline(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      shiftTimeline(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setTimelineByIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setTimelineByIndex(timelineIds.length - 1);
    }
  };

  const onExperienceTouchStart = (event: TouchEvent<HTMLElement>): void => {
    const touch = event.changedTouches[0];
    experienceTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onExperienceTouchEnd = (event: TouchEvent<HTMLElement>): void => {
    const start = experienceTouchStartRef.current;
    experienceTouchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    shiftTimeline(deltaX < 0 ? 1 : -1);
  };

  return (
    <ClickSpark
      sparkColor={themeMode === "dark" ? "#cecdc3" : "#24837b"}
      disabled={false}
      ignoreSelector=".floating-nav .section-nav-item a, .floating-nav .theme-toggle, .puzzle-board, .puzzle-button"
    >
      <div
        className={`site-shell ${activePage === "tools" ? "site-shell-wide" : ""}`}
      >
        <TopNav
          activePage={activePage}
          themeMode={themeMode}
          onNavClick={onNavClick}
          onThemeToggle={() =>
            setThemeMode((previous) => (previous === "dark" ? "light" : "dark"))
          }
        />

        <main>
          {activePage === "home" ? (
            <>
              <IntroSection />

              <ExperienceSection
                activeTimeline={activeTimeline}
                themeMode={themeMode}
                onActivateTimeline={activateTimeline}
                onTimelineSwitcherKeyDown={onTimelineSwitcherKeyDown}
                onExperienceTouchStart={onExperienceTouchStart}
                onExperienceTouchEnd={onExperienceTouchEnd}
              />

              <ContactSection
                emailCopied={emailCopied}
                onEmailCopy={onEmailCopy}
              />

              <GameSection />
            </>
          ) : null}

          {activePage === "tools" ? <ToolsSection /> : null}

          {activePage === "thoughts" ? <ThoughtsSection /> : null}
        </main>
      </div>
    </ClickSpark>
  );
}

export default App;
