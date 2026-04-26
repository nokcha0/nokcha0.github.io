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

// Inline formatting supported in text fields:
// **bold**
// *italic*
// [[underlined text|tooltip text]]
// {{visitorOrdinal}}
export const introContent = {
  role: "About",
  summaries: [
    "Hello [[{{visitorOrdinal}} visitor|Made-up number. This page is static and does not track you.]]. My name is Joonhyun. It could be a bit tricky to pronounce, so you can call me [[Joon|Like the month June.]].",
    "My full Korean name is 장준현. Online, I like to go by **nokcha0**, which means [[green tea in Korean|nok = 녹, cha = 차. Together: 녹차.]]. The name came from a cup of green tea sitting on my desk while I was signing up for GitHub. The 0? A tiny tribute to the fact that nokcha was already taken.",
    "I'm currently studying Software Engineering at McGill University. So far, [[it has been fun|Except that one thermodynamics class. No hate to the prof.]], which I am choosing to interpret as a good sign.",
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
          title: "Software Engineering Intern - Analytics",
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
      organization: "Innovation, Science and Economic Development Canada",
      location: "Montreal, QC",
      logo: "/logo/Flag_of_Canada.png",
      website:
        "https://apc-cap.ic.gc.ca/pls/apc_anon/query_amat_cs$callsign.QueryViewByKey?P_CALLSIGN=VA2JHC&Z_CHK=54431",
      roles: [
        {
          title: "HAM Radio Operator (Call Sign: VA2JHC)",
          dates: "May 2025 - Present",
        },
      ],
    },
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
    {
      organization: "NAUI",
      location: "Jeju, South Korea",
      logo: "/logo/NAUI.png",
      website: "https://www.naui.org/",
      roles: [
        {
          title: "Open Water Scuba Diver (#6F54927)",
          dates: "July 2022 - Present",
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
