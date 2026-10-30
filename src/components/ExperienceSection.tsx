import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { timelineCategories, timelines } from "../data/website";
import { ExternalLinkIcon } from "./icons";
import { RichText } from "./RichText";
import { prefersReducedMotion } from "../utils/theme";
import type { ThemeMode, TimelineCategory } from "../types/website";

type ExperienceSectionProps = {
  activeTimeline: TimelineCategory;
  themeMode: ThemeMode;
  onActivateTimeline: (timeline: TimelineCategory) => void;
  onTimelineSwitcherKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export function ExperienceSection({
  activeTimeline,
  themeMode,
  onActivateTimeline,
  onTimelineSwitcherKeyDown,
}: ExperienceSectionProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const previousListHeightRef = useRef<number | null>(null);
  const [animatedHeight, setAnimatedHeight] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const switcher = switcherRef.current;
    if (!switcher) return;

    const revealSelectedTab = () => {
      const tab = switcher.querySelector<HTMLButtonElement>('[aria-selected="true"]');
      if (!tab || switcher.scrollWidth <= switcher.clientWidth) return;

      const tabBounds = tab.getBoundingClientRect();
      const switcherBounds = switcher.getBoundingClientRect();
      switcher.scrollTo({
        left: switcher.scrollLeft + tabBounds.left - switcherBounds.left
          - (switcher.clientWidth - tabBounds.width) / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    };

    revealSelectedTab();
    window.addEventListener("resize", revealSelectedTab);
    return () => window.removeEventListener("resize", revealSelectedTab);
  }, [activeTimeline, isMobile]);

  useLayoutEffect(() => {
    if (isMobile) return;
    const listElement = listRef.current;
    if (!listElement) return;

    const nextHeight = Math.ceil(listElement.getBoundingClientRect().height);
    const previousHeight = previousListHeightRef.current;

    if (
      previousHeight === null ||
      nextHeight <= 0 ||
      previousHeight === nextHeight
    ) {
      return;
    }

    setAnimatedHeight(previousHeight);

    let frameId = 0;
    let timeoutId = 0;

    frameId = window.requestAnimationFrame(() => {
      setAnimatedHeight(nextHeight);
      timeoutId = window.setTimeout(() => {
        setAnimatedHeight(null);
      }, 190);
    });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      if (timeoutId !== 0) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activeTimeline, isMobile]);

  useLayoutEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;
    previousListHeightRef.current = Math.ceil(listElement.getBoundingClientRect().height);
  });

  return (
    <section id="experience" className="section">
      <h2>Experience</h2>
      {!isMobile && (
        <TimelineSwitcher
          activeTimeline={activeTimeline}
          onActivateTimeline={onActivateTimeline}
          onKeyDown={onTimelineSwitcherKeyDown}
          switcherRef={switcherRef}
        />
      )}
      <div
        className="experience-list-shell"
        id="timeline-panel"
        role={isMobile ? undefined : "tabpanel"}
        aria-labelledby={isMobile ? undefined : `timeline-tab-${activeTimeline}`}
        tabIndex={isMobile ? -1 : 0}
        style={!isMobile && animatedHeight !== null ? { height: `${animatedHeight}px` } : undefined}
      >
        {isMobile ? (
          <ExperienceCategoryCarousel
            activeTimeline={activeTimeline}
            themeMode={themeMode}
            onActivateTimeline={onActivateTimeline}
          />
        ) : (
          <ExperienceList activeTimeline={activeTimeline} themeMode={themeMode} listRef={listRef} />
        )}
      </div>
    </section>
  );
}

function TimelineSwitcher({
  activeTimeline,
  onActivateTimeline,
  onKeyDown,
  switcherRef,
}: {
  activeTimeline: TimelineCategory;
  onActivateTimeline: (timeline: TimelineCategory) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  switcherRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={switcherRef}
      className="timeline-switcher"
      role="tablist"
      aria-label="Timeline categories"
      onKeyDown={onKeyDown}
    >
      {timelineCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          id={`timeline-tab-${category.id}`}
          aria-label={category.label}
          aria-controls="timeline-panel"
          aria-selected={activeTimeline === category.id}
          tabIndex={activeTimeline === category.id ? 0 : -1}
          className={activeTimeline === category.id ? "is-active" : ""}
          onClick={() => onActivateTimeline(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

function ExperienceList({
  activeTimeline,
  themeMode,
  listRef,
}: {
  activeTimeline: TimelineCategory;
  themeMode: ThemeMode;
  listRef?: RefObject<HTMLDivElement | null>;
}) {
  const activeEntries = timelines[activeTimeline];
  const getLogoSource = (logoDark?: string, logoLight?: string, logo?: string) => {
    if (themeMode === "light") {
      return logoLight ?? logoDark ?? logo;
    }

    return logoDark ?? logoLight ?? logo;
  };


  return (
    <div ref={listRef} className="experience-list">
      {activeEntries.map((entry) => (
        <article key={entry.organization}>
          <header>
            <div className="entry-head-main">
              {entry.logo || entry.logoDark || entry.logoLight ? (
                <span className="entry-logo" aria-hidden="true">
                  <img
                    src={getLogoSource(
                      entry.logoDark,
                      entry.logoLight,
                      entry.logo,
                    )}
                    alt={`${entry.organization} logo`}
                    decoding="async"
                    loading="eager"
                    fetchPriority={activeTimeline === "education" ? "high" : "auto"}
                  />
                </span>
              ) : null}
              <div>
                <h3>
                  {entry.website ? (
                    <a
                      className="entry-title-link"
                      href={entry.website}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${entry.organization} website`}
                    >
                      <RichText text={entry.organization} />
                      <span className="entry-link-icon" aria-hidden="true">
                        <ExternalLinkIcon />
                      </span>
                    </a>
                  ) : (
                    <RichText text={entry.organization} />
                  )}
                </h3>
                {entry.location ? (
                  <p className="meta">
                    <RichText text={entry.location} />
                  </p>
                ) : null}
              </div>
            </div>
          </header>
          {entry.roles.length > 0 ? (
            <div
              className={`role-list ${entry.roles.length > 1 ? "is-multi" : ""}`}
            >
              {entry.roles.map((role) => (
                <div
                  className="role-item"
                  key={`${role.title}-${role.dates ?? "no-date"}`}
                >
                  <p className="meta-role">
                    <RichText text={role.title} />
                  </p>
                  {role.dates ? (
                    <p className="meta-date">
                      <RichText text={role.dates} />
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

type CategoryDrag = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocityX: number;
  originIndex: number;
  settleIndex: number;
  originOffset: number;
  horizontal: boolean;
};

function ExperienceCategoryCarousel({
  activeTimeline,
  themeMode,
  onActivateTimeline,
}: {
  activeTimeline: TimelineCategory;
  themeMode: ThemeMode;
  onActivateTimeline: (timeline: TimelineCategory) => void;
}) {
  const activeIndex = timelineCategories.findIndex((category) => category.id === activeTimeline);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const surfacesRef = useRef<(HTMLDivElement | null)[]>([]);
  const targetIndexRef = useRef(activeIndex);
  const dragRef = useRef<CategoryDrag | null>(null);
  const dragFrameRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const suppressClickRef = useRef(false);
  const initializedRef = useRef(false);
  const navigateRef = useRef<(index: number) => void>(() => {});
  const [pageHeight, setPageHeight] = useState<number>();
  const pageHeightRef = useRef<number | undefined>(undefined);

  const cancelDragFrame = () => {
    window.cancelAnimationFrame(dragFrameRef.current);
    dragFrameRef.current = 0;
  };

  const renderOffset = useCallback((offset: number) => {
    const track = trackRef.current;
    const rail = railRef.current;
    const width = track?.clientWidth ?? 0;
    if (!track || !rail || !width) return;
    const reducedMotion = prefersReducedMotion();
    const position = -offset / width;
    rail.style.transform = `translate3d(${offset}px, 0, 0)`;
    surfacesRef.current.forEach((surface, index) => {
      if (!surface) return;
      const progress = Math.max(-1, Math.min(index - position, 1));
      const depth = reducedMotion ? 0 : Math.abs(progress);
      // Keep the reading position flat and sharp; depth is only for transitions.
      surface.style.transform = `perspective(1100px) translate3d(0, ${depth * 6}px, ${-depth * 100}px) rotateY(${reducedMotion ? 0 : progress * -14}deg) rotateZ(${reducedMotion ? 0 : progress * 0.6}deg) scale(${1 - depth * 0.035})`;
      surface.style.opacity = `${1 - depth * 0.65}`;
      surface.style.setProperty("--experience-shade", `${depth * 0.16}`);
    });
  }, []);

  const positionPage = useCallback((index: number, animate: boolean) => {
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;
    delete track.dataset.dragging;
    delete rail.dataset.dragging;
    if (pageHeightRef.current !== undefined) track.style.height = `${pageHeightRef.current}px`;
    rail.dataset.animated = animate && !prefersReducedMotion() ? "true" : "false";
    renderOffset(-index * track.clientWidth);
  }, [renderOffset]);

  const measurePage = (index: number) => {
    const page = pagesRef.current[index];
    if (page) {
      const height = Math.ceil(page.getBoundingClientRect().height);
      pageHeightRef.current = height;
      setPageHeight(height);
    }
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    const page = pagesRef.current[activeIndex];
    if (!track || !page) return;
    cancelDragFrame();
    dragRef.current = null;
    targetIndexRef.current = activeIndex;
    positionPage(activeIndex, initializedRef.current);
    initializedRef.current = true;

    const measure = () => {
      // Do not move the content below the carousel while a finger is dragging it.
      if (!dragRef.current?.horizontal) measurePage(activeIndex);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    let width = track.clientWidth;
    const onResize = () => {
      if (width === track.clientWidth) return;
      width = track.clientWidth;
      cancelDragFrame();
      dragRef.current = null;
      positionPage(activeIndex, false);
      measure();
    };
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [activeIndex, positionPage]);

  const goToCategory = (index: number) => {
    const target = Math.max(0, Math.min(index, timelineCategories.length - 1));
    cancelDragFrame();
    dragRef.current = null;
    targetIndexRef.current = target;
    if (timelineCategories[target].id === activeTimeline) {
      positionPage(target, true);
      measurePage(target);
    } else {
      onActivateTimeline(timelineCategories[target].id);
    }
  };

  useLayoutEffect(() => {
    navigateRef.current = goToCategory;
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let idleTimer: number | undefined;
    let distance = 0;
    let committed = false;
    let origin = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return;
      if (event.cancelable) event.preventDefault();
      if (idleTimer === undefined) {
        distance = 0;
        committed = false;
        origin = targetIndexRef.current;
      }
      const delta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
      distance += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1);
      if (!committed && Math.abs(distance) >= 24) {
        committed = true;
        navigateRef.current(origin + Math.sign(distance));
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => { idleTimer = undefined; }, 200);
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      track.removeEventListener("wheel", onWheel);
      window.clearTimeout(idleTimer);
      cancelDragFrame();
    };
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    suppressClickRef.current = false;
    if (!event.isPrimary) {
      const previous = dragRef.current;
      dragRef.current = null;
      if (previous?.horizontal) goToCategory(previous.settleIndex);
      return;
    }
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocityX: 0,
      originIndex: targetIndexRef.current,
      settleIndex: targetIndexRef.current,
      originOffset: 0,
      horizontal: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    const rail = railRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !track || !rail) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!drag.horizontal) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        dragRef.current = null;
        return;
      }
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
      // Freeze an interrupted transition at its visible position, without jumping to its target.
      const transform = getComputedStyle(rail).transform;
      const visibleHeight = track.getBoundingClientRect().height;
      drag.originOffset = transform === "none" ? 0 : new DOMMatrixReadOnly(transform).m41;
      drag.originIndex = Math.max(0, Math.min(
        Math.round(-drag.originOffset / track.clientWidth), timelineCategories.length - 1,
      ));
      drag.horizontal = true;
      track.dataset.dragging = "true";
      track.style.height = `${visibleHeight}px`;
      rail.dataset.dragging = "true";
      rail.dataset.animated = "false";
      renderOffset(drag.originOffset);
      track.setPointerCapture(event.pointerId);
      if (track.contains(document.activeElement)) track.focus({ preventScroll: true });
      suppressClickRef.current = true;
    }
    event.preventDefault();
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) drag.velocityX = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    const min = -Math.min(timelineCategories.length - 1, drag.originIndex + 1) * track.clientWidth;
    const max = -Math.max(0, drag.originIndex - 1) * track.clientWidth;
    dragOffsetRef.current = Math.max(min, Math.min(drag.originOffset + deltaX, max));
    if (!dragFrameRef.current) {
      dragFrameRef.current = window.requestAnimationFrame(() => {
        dragFrameRef.current = 0;
        renderOffset(dragOffsetRef.current);
      });
    }
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    const rail = railRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.horizontal || !track || !rail) return;
    cancelDragFrame();
    renderOffset(dragOffsetRef.current);
    // Flush the last finger position once so the settling transition starts from it.
    rail.getBoundingClientRect();
    const delta = event.clientX - drag.startX;
    const threshold = Math.max(40, Math.min(track.clientWidth * 0.18, 80));
    const quickFlick = Math.abs(delta) > 24 && event.timeStamp - drag.lastTime < 100
      && Math.abs(drag.velocityX) > 0.45 && Math.sign(drag.velocityX) === Math.sign(delta);
    const advance = !cancelled && (Math.abs(delta) >= threshold || quickFlick);
    const target = drag.settleIndex + (advance ? (delta < 0 ? 1 : -1) : 0);
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    goToCategory(target);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    suppressClickRef.current = false;
    if (event.target !== event.currentTarget) return;
    let index: number;
    switch (event.key) {
      case "ArrowRight": index = targetIndexRef.current + 1; break;
      case "ArrowLeft": index = targetIndexRef.current - 1; break;
      case "Home": index = 0; break;
      case "End": index = timelineCategories.length - 1; break;
      default: return;
    }
    event.preventDefault();
    goToCategory(index);
  };

  return (
    <>
      <div className="experience-carousel-controls">
        <div className="experience-category-heading">
          <button
            type="button"
            className="experience-category-arrow"
            aria-label="Previous experience category"
            aria-controls="experience-carousel"
            disabled={activeIndex === 0}
            onClick={() => goToCategory(activeIndex - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <h3 className="experience-category-current" id="experience-category-title">
            {timelineCategories[activeIndex].label}
          </h3>
          <button
            type="button"
            className="experience-category-arrow"
            aria-label="Next experience category"
            aria-controls="experience-carousel"
            disabled={activeIndex === timelineCategories.length - 1}
            onClick={() => goToCategory(activeIndex + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>
        </div>
        <div className="experience-carousel-navigation">
          <div className="experience-carousel-pagination" role="group" aria-label="Choose an experience category">
            {timelineCategories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                aria-label={`${category.label}, ${index + 1} of ${timelineCategories.length}`}
                aria-pressed={activeTimeline === category.id}
                aria-controls="experience-carousel"
                onClick={() => goToCategory(index)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={trackRef}
        id="experience-carousel"
        className="experience-category-track"
        role="group"
        aria-roledescription="carousel"
        aria-labelledby="experience-category-title"
        tabIndex={0}
        style={pageHeight !== undefined ? { height: pageHeight } : undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => finishPointer(event, false)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onLostPointerCapture={(event) => {
          if (event.target === event.currentTarget) finishPointer(event, true);
        }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickRef.current = false;
        }}
      >
        <div
          ref={railRef}
          className="experience-category-rail"
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === "transform") {
              delete event.currentTarget.dataset.animated;
            }
          }}
        >
        {timelineCategories.map((category, index) => (
          <div
            key={category.id}
            ref={(page) => { pagesRef.current[index] = page; }}
            className="experience-category-page"
            data-category={category.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${category.label}, ${index + 1} of ${timelineCategories.length}`}
            aria-hidden={category.id !== activeTimeline}
            inert={category.id !== activeTimeline}
          >
            <div
              ref={(surface) => { surfacesRef.current[index] = surface; }}
              className="experience-category-surface"
            >
              <div
                id={`timeline-panel-${category.id}`}
                role="group"
                aria-label={category.label}
              >
                <ExperienceList activeTimeline={category.id} themeMode={themeMode} />
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
      <span className="experience-carousel-announcement" role="status" aria-atomic="true">
        {timelineCategories[activeIndex].label}, {activeIndex + 1} of {timelineCategories.length}
      </span>
    </>
  );
}
