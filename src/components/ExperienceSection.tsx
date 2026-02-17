import type { KeyboardEvent, TouchEvent } from "react";
import { timelineCategories, timelines } from "../data/website";
import { ExternalLinkIcon } from "./icons";
import type { ThemeMode, TimelineCategory } from "../types/website";

type ExperienceSectionProps = {
  activeTimeline: TimelineCategory;
  themeMode: ThemeMode;
  onActivateTimeline: (timeline: TimelineCategory) => void;
  onTimelineSwitcherKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onExperienceTouchStart: (event: TouchEvent<HTMLElement>) => void;
  onExperienceTouchEnd: (event: TouchEvent<HTMLElement>) => void;
};

export function ExperienceSection({
  activeTimeline,
  themeMode,
  onActivateTimeline,
  onTimelineSwitcherKeyDown,
  onExperienceTouchStart,
  onExperienceTouchEnd,
}: ExperienceSectionProps) {
  const activeEntries = timelines[activeTimeline];

  return (
    <section
      id="experience"
      className="section"
      onTouchStart={onExperienceTouchStart}
      onTouchEnd={onExperienceTouchEnd}
    >
      <h2>Experience</h2>
      <div
        className="timeline-switcher"
        role="tablist"
        aria-label="Timeline categories"
        onKeyDown={onTimelineSwitcherKeyDown}
      >
        {timelineCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeTimeline === category.id}
            className={activeTimeline === category.id ? "is-active" : ""}
            onClick={() => onActivateTimeline(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="experience-list">
        {activeEntries.map((entry) => (
          <article key={`${activeTimeline}-${entry.organization}`}>
            <header>
              <div className="entry-head-main">
                {entry.logo || entry.logoDark || entry.logoLight ? (
                  <span className="entry-logo" aria-hidden="true">
                    <img
                      src={
                        themeMode === "light"
                          ? (entry.logoLight ?? entry.logoDark ?? entry.logo)
                          : (entry.logoDark ?? entry.logoLight ?? entry.logo)
                      }
                      alt={`${entry.organization} logo`}
                    />
                  </span>
                ) : null}
                <div>
                  <h3>{entry.organization}</h3>
                  {entry.location ? <p className="meta">{entry.location}</p> : null}
                </div>
              </div>
              {entry.website ? (
                <a
                  className="entry-site"
                  href={entry.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${entry.organization} website`}
                >
                  <ExternalLinkIcon />
                </a>
              ) : null}
            </header>
            {entry.roles.length > 0 ? (
              <div className={`role-list ${entry.roles.length > 1 ? "is-multi" : ""}`}>
                {entry.roles.map((role) => (
                  <div className="role-item" key={`${role.title}-${role.dates ?? "no-date"}`}>
                    <p className="meta-role">{role.title}</p>
                    {role.dates ? <p className="meta-date">{role.dates}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
