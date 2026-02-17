import type { ContactLabel, ThemeMode } from "../types/website";

type ContactIconProps = {
  label: ContactLabel;
};

type ThemeIconProps = {
  mode: ThemeMode;
};

export function ContactIcon({ label }: ContactIconProps) {
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

export function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 16 16 8" />
      <path d="M10 8h6v6" />
      <path d="M14 5h4v4" />
      <path d="M6 10v8h8" />
    </svg>
  );
}

export function ThemeIcon({ mode }: ThemeIconProps) {
  if (mode === "dark") {
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
