import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, TouchEvent } from "react";
import "./App.css";
import { TopNav } from "./components/TopNav";
import { IntroSection } from "./components/IntroSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ContactSection } from "./components/ContactSection";
import ClickSpark from "./components/ClickSpark";
import { sectionOrder, timelineCategories } from "./data/website";
import { getInitialThemeMode, prefersReducedMotion } from "./utils/theme";
import type { SectionId, ThemeMode, TimelineCategory } from "./types/website";

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("intro");
  const [activeTimeline, setActiveTimeline] =
    useState<TimelineCategory>("education");
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    getInitialThemeMode(),
  );
  const [emailCopied, setEmailCopied] = useState(false);
  const experienceTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id as SectionId);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    const sections = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const onNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: SectionId,
  ): void => {
    event.preventDefault();

    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    setActiveSection(sectionId);
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
      sparkColor={themeMode === "dark" ? "#d3d9e1" : "#3d4a5b"}
      disabled={prefersReducedMotion()}
      ignoreSelector=".floating-nav .section-nav-item a"
    >
      <div className="site-shell">
        <TopNav
          activeSection={activeSection}
          themeMode={themeMode}
          onNavClick={onNavClick}
          onThemeToggle={() =>
            setThemeMode((previous) => (previous === "dark" ? "light" : "dark"))
          }
        />

        <main>
          <IntroSection />

          <div className="section-divider" aria-hidden="true" />

          <ExperienceSection
            activeTimeline={activeTimeline}
            themeMode={themeMode}
            onActivateTimeline={activateTimeline}
            onTimelineSwitcherKeyDown={onTimelineSwitcherKeyDown}
            onExperienceTouchStart={onExperienceTouchStart}
            onExperienceTouchEnd={onExperienceTouchEnd}
          />

          <div className="section-divider" aria-hidden="true" />

          <ContactSection emailCopied={emailCopied} onEmailCopy={onEmailCopy} />
        </main>
      </div>
    </ClickSpark>
  );
}

export default App;
