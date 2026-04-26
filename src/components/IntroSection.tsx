import { useState } from "react";
import { introContactLinks, introContent } from "../data/website";
import { ContactIcon } from "./icons";
import { RichText } from "./RichText";

function getRandomVisitorNumber() {
  return Math.floor(Math.random() * 201) + 100;
}

function formatOrdinal(value: number) {
  const remainder = value % 100;

  if (remainder >= 11 && remainder <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

export function IntroSection() {
  const introName =
    "name" in introContent && typeof introContent.name === "string"
      ? introContent.name
      : null;
  const [visitorOrdinal] = useState(() =>
    formatOrdinal(getRandomVisitorNumber()),
  );

  const resolveIntroText = (text: string) =>
    text.replace(/\{\{visitorOrdinal\}\}/g, visitorOrdinal);

  return (
    <section id="intro" className="section intro">
      <h1>
        <RichText text={introContent.role} />
      </h1>
      <div className="intro-body">
        {introName ? (
          <p className="intro-name">
            <RichText text={introName} />
          </p>
        ) : null}
        {introContent.summaries.map((summary) => (
          <p key={summary} className="summary">
            <RichText text={resolveIntroText(summary)} />
          </p>
        ))}
        <div className="intro-contact-links" aria-label="Contact links">
          {introContactLinks.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.label === "Email" ? undefined : "_blank"}
              rel={contact.label === "Email" ? undefined : "noreferrer"}
              aria-label={contact.label}
            >
              <ContactIcon label={contact.label} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
