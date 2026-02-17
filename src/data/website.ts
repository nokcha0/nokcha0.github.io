import type {
  ContactLink,
  IntroContactLink,
  SectionId,
  TimelineCategory,
  TimelineCategoryOption,
  TimelineEntry,
} from "../types/website";

export const sectionOrder: readonly SectionId[] = [
  "intro",
  "experience",
  "contact",
];

export const sectionLabels: Record<SectionId, string> = {
  intro: "About",
  experience: "Experience",
  contact: "Contact",
};

export const introContent = {
  kicker: "About",
  name: "Joonhyun Chang",
  role: "You can call me Joon.",
  summaries: [
    "Currently studying Software Engineering at McGill University.",
    "Also known as: 장준현, nokcha0",
  ],
};

export const timelineCategories: readonly TimelineCategoryOption[] = [
  { id: "education", label: "Education" },
  { id: "professional", label: "Professional Experience" },
  { id: "extracurricular", label: "Extracurricular" },
  { id: "affiliation", label: "Affiliation" },
];

export const timelines: Record<TimelineCategory, TimelineEntry[]> = {
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
          title: "Applied Machine Learning Engineering Intern",
          dates: "Incoming Summer 2026",
        },
        {
          title: "Software Engineering Intern - Core, Checkout Customizations",
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
      logoDark: "/logo/cyberengmcgill.png",
      logoLight: "/logo/cyberengmcgill_black.png",
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

export const contactLinks: readonly ContactLink[] = [
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

export const introContactLinks: readonly IntroContactLink[] = [
  {
    label: "Email",
    href: "mailto:joonhyun.chang@mail.mcgill.ca",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joonhyun-chang/",
  },
  {
    label: "GitHub",
    href: "https://github.com/nokcha0",
  },
];
