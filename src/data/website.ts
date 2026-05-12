import type {
  ContactLink,
  IntroContactLink,
  NavLink,
  SectionId,
  ThoughtEntry,
  TimelineCategory,
  TimelineCategoryOption,
  TimelineEntry,
  ToolGroup,
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

export const navLinks: readonly NavLink[] = [
  { id: "home", label: "Home", href: "#/" },
  { id: "tools", label: "Tools", href: "#/tools" },
  { id: "thoughts", label: "Thoughts", href: "#/thoughts" },
];

// Inline formatting supported in text fields:
// **bold**
// *italic*
// [[underlined text|tooltip text]]
// {{visitorOrdinal}}
export const introContent = {
  role: "About",
  summaries: [
    "Hello [[{{visitorOrdinal}} visitor|I just made this up. This page is static and doesn't track you.]]. My name is Joonhyun. It could be a bit tricky to pronounce, so you can call me [[Joon|Like the month June.]].",
    "My full Korean name is 장준현. Online, I like to go by **nokcha0**, which means [[green tea in Korean|nok = 녹, cha = 차. Together: 녹차.]]. The name came from a cup of green tea sitting on my desk while I was signing up for GitHub. The 0 is a tiny tribute to the fact that nokcha was already taken.",
    "I'm currently based in Montréal, studying Software Engineering at McGill University. ",
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
          title: "Software Engineering Intern - Analytics, Streaming Infra",
          dates: "May 2026 - Present",
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

export const toolGroups: readonly ToolGroup[] = [
  {
    label: "Daily",
    tools: [
      {
        name: "Zen",
        note: "Browser",
        icon: "/tool-icons/zen-browser-dark.svg",
      },
      {
        name: "Command Palette",
        note: "App Launcher",
        icon: "/tool-icons/powertoys.svg",
      },
      {
        name: "Obsidian",
        note: "Notes",
        icon: "/tool-icons/obsidian.svg",
      },
    ],
  },
  {
    label: "Dev",
    tools: [
      {
        name: "WezTerm",
        note: "Terminal",
        icon: "/tool-icons/wezterm.png",
      },
      {
        name: "VS Code",
        note: "IDE",
        icon: "/tool-icons/vscode.svg",
      },
      {
        name: "tmux",
        note: "Terminal Multiplexer",
        icon: "/tool-icons/tmux.svg",
      },
    ],
  },
  {
    label: "Systems",
    tools: [
      {
        name: "Windows 11",
        note: "Desktop",
        icon: "/tool-icons/windows-11.png",
      },
      {
        name: "NixOS (WSL)",
        note: "Linux",
        icon: "/tool-icons/nixos.svg",
      },
      {
        name: "Kali Linux (WSL)",
        note: "For CTF competitions",
        icon: "/tool-icons/kali-linux.svg",
      },
    ],
  },
];

export const thoughtEntries: readonly ThoughtEntry[] = [
  {
    title: "UDP",
    summary: "I know a UDP joke, but I don't really care if you get it",
    date: "May 2026",
  },
  {
    title: "Snacks ",
    summary: "Feels like the office snacks got nerfed compared to last year",
    date: "May 2026",
  },
  {
    title: "AtHack CTF",
    summary: "Few minutes away from first place. Should've just slept",
    date: "March 2026",
  },
  {
    title: "Birthdays",
    summary: "Were you born on your birthday? What a coincidence, me too",
    date: "Oct 2025",
  },
  {
    title: "Kaboom",
    summary: "Throw an aerosol can in the fire and watch it (at a distance)",
    date: "Jun 2025",
  },
  {
    title: "Giraffes",
    summary: "How long would it take for them to throw up",
    date: "Oct 2024",
  },
  {
    title: "Leg Workouts",
    summary: "I only know git push & git pull, never heard of git legs",
    date: "Oct 2024",
  },
  {
    title: "Alcalá de Henares",
    summary: "Hid a shopping cart somewhere with Alper",
    date: "Aug 2024",
  },
  {
    title: "Campfires",
    summary:
      "Build a man a fire, and he’ll be warm for a night. Set a man on fire, and he’ll be warm for the rest of his life",
    date: "May 2022",
  },
  {
    title: "Bass Guitar",
    summary: "Eddie Ate Dynamite, Good.",
    date: "May 2021",
  },
  {
    title: "Blood Test",
    summary: "Got a B+ on the blood test without studying",
    date: "Long time ago",
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
