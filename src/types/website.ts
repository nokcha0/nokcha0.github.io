export type SectionId = "intro" | "experience" | "contact";

export type ThemeMode = "dark" | "light";

export type ContactLabel = "Email" | "LinkedIn" | "GitHub";

export type RoleEntry = {
  title: string;
  dates?: string;
};

export type TimelineCategory =
  | "education"
  | "professional"
  | "extracurricular"
  | "affiliation";

export type TimelineCategoryOption = {
  id: TimelineCategory;
  label: string;
};

export type TimelineEntry = {
  organization: string;
  location?: string;
  logo?: string;
  logoDark?: string;
  logoLight?: string;
  website?: string;
  roles: RoleEntry[];
};

export type ContactLink = {
  label: ContactLabel;
  href: string;
  value: string;
};

export type IntroContactLink = {
  label: ContactLabel;
  href: string;
};
