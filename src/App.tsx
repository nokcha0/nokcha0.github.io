import { useEffect, useRef, useState } from "react";
import "./App.css";

const sectionOrder = ["intro", "experience", "contact"] as const;

type SectionId = (typeof sectionOrder)[number];
const sectionLabels: Record<SectionId, string> = {
  intro: "About",
  experience: "Experience",
  contact: "Contact",
};

type RoleEntry = {
  title: string;
  dates?: string;
};

type TimelineEntry = {
  organization: string;
  location?: string;
  logo?: string;
  website?: string;
  roles: RoleEntry[];
};

type ContactLink = {
  label: string;
  href: string;
  value: string;
};

type ThemeMode = "dark" | "light";

const timelineCategories = [
  { id: "education", label: "Education" },
  { id: "professional", label: "Professional Experience" },
  { id: "extracurricular", label: "Extracurricular" },
  { id: "affiliation", label: "Affiliation" },
] as const;

type TimelineCategory = (typeof timelineCategories)[number]["id"];

const timelines: Record<TimelineCategory, TimelineEntry[]> = {
  education: [
    {
      organization: "McGill University",
      location: "Montreal, QC",
      logo: "/logo/McGill.svg",
      website: "https://www.mcgill.ca",
      roles: [
        {
          title: "Bachelor of Engineering, Software Engineering (Co-op)",
          dates: "Aug 2024 - Apr 2028",
        },
      ],
    },
    {
      organization: "Dawson College",
      location: "Montreal, QC",
      logo: "/logo/Dawson.jpg",
      website: "https://www.dawsoncollege.qc.ca",
      roles: [
        {
          title: "Diplôme d'études collégiales (DEC), Enriched Health Science",
          dates: "Sep 2022 - May 2024",
        },
      ],
    },
  ],
  professional: [
    {
      organization: "Shopify",
      location: "Montreal, QC",
      logo: "/logo/shopify.png",
      website: "https://www.shopify.com",
      roles: [
        {
          title: "Software Engineer Intern - Core, Checkout Customizations",
          dates: "May 2025 - Aug 2025",
        },
      ],
    },
    {
      organization: "Bureau Veritas",
      location: "Montreal, QC",
      logo: "/logo/BV.png",
      website: "https://group.bureauveritas.com/",
      roles: [
        {
          title: "Laboratory Technician",
          dates: "May 2023 - July 2023",
        },
      ],
    },
  ],
  extracurricular: [
    {
      organization: "McGill Rocket Team",
      location: "Montreal, QC",
      logo: "/logo/MRT.png",
      website: "https://mcgillrocketteam.com",
      roles: [
        {
          title: "Software Developer - Orbital CubeSat",
          dates: "Sep 2025 - Present",
        },
        {
          title: "Software Developer - Avionics",
          dates: "Sep 2024 - Aug 2025",
        },
      ],
    },
    {
      organization: "Cyber Engineering McGill",
      location: "Montreal, QC",
      logo: "/logo/cyberengmcgill.png",
      website: "https://cyberengineeringmcgill.club",
      roles: [
        {
          title: "VP Tech Lead",
          dates: "Nov 2024 - Present",
        },
        {
          title: "Co-Founder",
          dates: "Nov 2024",
        },
      ],
    },
  ],
  affiliation: [
    {
      organization: "Jewish General Hospital",
      location: "Montreal, QC",
      logo: "/logo/JGH.png",
      website: "https://www.jgh.ca",
      roles: [
        {
          title: "Volunteer for the Hospital Elder Life Program",
          dates: "June 2023 - Present",
        },
      ],
    },
  ],
};

const contactLinks: ContactLink[] = [
  {
    label: "Email",
    href: "",
    value: "joonhyun.chang@mail.mcgill.ca",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joonhyun-chang/",
    value: "linkedin.com/in/joonhyun-chang",
  },
  {
    label: "GitHub",
    href: "https://github.com/nokcha0",
    value: "github.com/nokcha0",
  },
];

const introContactLinks = [
  {
    label: "Email" as const,
    href: "mailto:joonhyun.chang@mail.mcgill.ca",
  },
  {
    label: "LinkedIn" as const,
    href: "https://www.linkedin.com/in/joonhyun-chang/",
  },
  {
    label: "GitHub" as const,
    href: "https://github.com/nokcha0",
  },
];

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem("theme-mode");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "dark";
}

function renderContactIcon(label: ContactLink["label"]) {
  if (label === "Email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4z" />
        <path d="m5 7 7 6 7-6" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9v9" />
        <path d="M6 5h.01" />
        <path d="M11 9v9" />
        <path d="M11 13a4 4 0 0 1 8 0v5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 19c-4.5 1.4-4.5-2.5-6.3-3" />
      <path d="M15 21v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.8-1.6 6.8-7.1a5.5 5.5 0 0 0-1.5-3.8 5.1 5.1 0 0 0-.1-3.8s-1.2-.4-4 1.5a13.8 13.8 0 0 0-7.2 0c-2.8-1.9-4-1.5-4-1.5a5.1 5.1 0 0 0-.1 3.8A5.5 5.5 0 0 0 2.5 7.4c0 5.5 3.5 6.7 6.8 7.1a3.4 3.4 0 0 0-1 2.6V21" />
    </svg>
  );
}

function renderExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 16 16 8" />
      <path d="M10 8h6v6" />
      <path d="M14 5h4v4" />
      <path d="M6 10v8h8" />
    </svg>
  );
}

function renderThemeIcon(themeMode: ThemeMode) {
  if (themeMode === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="m4.9 4.9 2.1 2.1" />
        <path d="m17 17 2.1 2.1" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="m4.9 19.1 2.1-2.1" />
        <path d="m17 7 2.1-2.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8" />
    </svg>
  );
}

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
    event: React.MouseEvent<HTMLAnchorElement>,
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

  const activeEntries = timelines[activeTimeline];
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
    event: React.KeyboardEvent<HTMLDivElement>,
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

  const onExperienceTouchStart = (
    event: React.TouchEvent<HTMLElement>,
  ): void => {
    const touch = event.changedTouches[0];
    experienceTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onExperienceTouchEnd = (event: React.TouchEvent<HTMLElement>): void => {
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
    <div className="site-shell">
      <header className="floating-nav" aria-label="Primary">
        <nav>
          <ul>
            {sectionOrder.map((sectionId) => (
              <li key={sectionId} className="section-nav-item">
                <a
                  href={`#${sectionId}`}
                  onClick={(event) => onNavClick(event, sectionId)}
                  className={activeSection === sectionId ? "is-active" : ""}
                  aria-current={
                    activeSection === sectionId ? "page" : undefined
                  }
                >
                  {sectionLabels[sectionId]}
                </a>
              </li>
            ))}
            <li className="theme-toggle-item">
              <button
                type="button"
                className="theme-toggle"
                onClick={() =>
                  setThemeMode((previous) =>
                    previous === "dark" ? "light" : "dark",
                  )
                }
                aria-label={
                  themeMode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                <span className="theme-toggle-icon">
                  {renderThemeIcon(themeMode)}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="intro" className="section intro">
          <p className="kicker">About</p>
          <h1>Joonhyun Chang</h1>
          <p className="role">You can call me Joon.</p>
          <p className="summary">
            Currently studying Software Engineering at McGill University.
          </p>
          <p className="summary">Also known as: 장준현, nokcha0</p>
          <div className="intro-contact-links" aria-label="Contact links">
            {introContactLinks.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.label === "Email" ? undefined : "_blank"}
                rel={contact.label === "Email" ? undefined : "noreferrer"}
                aria-label={contact.label}
              >
                {renderContactIcon(contact.label)}
              </a>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

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
                onClick={() => activateTimeline(category.id)}
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
                    {entry.logo ? (
                      <span className="entry-logo" aria-hidden="true">
                        <img
                          src={entry.logo}
                          alt={`${entry.organization} logo`}
                        />
                      </span>
                    ) : null}
                    <div>
                      <h3>{entry.organization}</h3>
                      {entry.location ? (
                        <p className="meta">{entry.location}</p>
                      ) : null}
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
                      {renderExternalLinkIcon()}
                    </a>
                  ) : null}
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
                        <p className="meta-role">{role.title}</p>
                        {role.dates ? (
                          <p className="meta-date">{role.dates}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section id="contact" className="section">
          <h2>Contact</h2>
          <p className="summary">Feel free to say hello!</p>
          <ul className="contact-list">
            {contactLinks.map((link) => (
              <li key={link.label}>
                {link.label === "Email" ? (
                  <button
                    type="button"
                    className={`contact-item ${emailCopied ? "is-copied" : ""}`}
                    onClick={() => onEmailCopy(link.value)}
                    aria-live="polite"
                  >
                    <span className="contact-main">
                      <span className="contact-icon">
                        {renderContactIcon(link.label)}
                      </span>
                      <span>{link.label}</span>
                    </span>
                    <span className="contact-value">
                      {emailCopied ? "Copied" : link.value}
                    </span>
                  </button>
                ) : (
                  <a
                    className="contact-item"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="contact-main">
                      <span className="contact-icon">
                        {renderContactIcon(link.label)}
                      </span>
                      <span>{link.label}</span>
                    </span>
                    <span className="contact-value">{link.value}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
