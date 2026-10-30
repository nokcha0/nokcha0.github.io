import { Suspense, useEffect, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import "./App.css";
import { TopNav } from "./components/TopNav";
import { IntroSection } from "./components/IntroSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ContactSection } from "./components/ContactSection";
import { GameSection } from "./components/GameSection";
import ClickSpark from "./components/ClickSpark";
import { timelineCategories } from "./data/website";
import { getInitialThemeMode, prefersReducedMotion } from "./utils/theme";
import { preloadSiteAssets, preloadToolIcons } from "./utils/backgroundAssets";
import { createBackgroundPage } from "./utils/backgroundPage";
import type {
  NavLink,
  PageId,
  SectionId,
  ThemeMode,
  TimelineCategory,
} from "./types/website";

const { Page: ToolsSection, preload: loadToolsSection } = createBackgroundPage(
  () => import("./components/ToolsSection").then((module) => ({ default: module.ToolsSection })),
);
const { Page: ThoughtsSection, preload: loadThoughtsSection } = createBackgroundPage(
  () => import("./components/ThoughtsSection").then((module) => ({ default: module.ThoughtsSection })),
);

function preparePage(page: PageId) {
  if (page === "tools") {
    void loadToolsSection().then(preloadToolIcons).catch(() => {});
  } else if (page === "thoughts") {
    void loadThoughtsSection().catch(() => {});
  }
}

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

  return { page: "home", section: null };
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
  console.log("What are you doing here, go back");

  useEffect(() => preloadSiteAssets(() => {
    preparePage("tools");
    preparePage("thoughts");
  }), []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    try {
      window.localStorage.setItem("theme-mode", themeMode);
    } catch {
      // Theme switching does not depend on persistence being available.
    }
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
    if (activePage !== "home" || !targetSection) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return;
    }

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
      if (!nextRoute.section) {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
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

  const onTimelineSwitcherKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ): void => {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = activeTimelineIndex + 1; break;
      case "ArrowLeft": nextIndex = activeTimelineIndex - 1; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = timelineIds.length - 1; break;
      default: return;
    }
    event.preventDefault();
    const normalizedIndex = (nextIndex + timelineIds.length) % timelineIds.length;
    setTimelineByIndex(normalizedIndex);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[normalizedIndex]?.focus();
  };

  return (
    <ClickSpark
      sparkColor={themeMode === "dark" ? "#cecdc3" : "#24837b"}
      disabled={false}
      ignoreSelector=".floating-nav .section-nav-item a, .floating-nav .theme-toggle, .mobile-menu-toggle, .experience-category-heading, .puzzle-button"
    >
      <div className="site-shell">
        <TopNav
          activePage={activePage}
          themeMode={themeMode}
          onNavClick={onNavClick}
          onPreparePage={preparePage}
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
              />

              <ContactSection
                emailCopied={emailCopied}
                onEmailCopy={onEmailCopy}
              />

              <GameSection />
            </>
          ) : null}

          <Suspense fallback={<section className="section" role="status">Loading…</section>}>
            {activePage === "tools" ? <ToolsSection /> : null}
            {activePage === "thoughts" ? <ThoughtsSection /> : null}
          </Suspense>
        </main>
      </div>
    </ClickSpark>
  );
}

export default App;
