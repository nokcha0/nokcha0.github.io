import { introContactLinks, introContent } from "../data/website";
import { ContactIcon } from "./icons";

export function IntroSection() {
  return (
    <section id="intro" className="section intro">
      <p className="kicker">{introContent.kicker}</p>
      <h1>{introContent.name}</h1>
      <p className="role">{introContent.role}</p>
      {introContent.summaries.map((summary) => (
        <p key={summary} className="summary">
          {summary}
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
    </section>
  );
}
