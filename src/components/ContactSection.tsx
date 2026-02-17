import { contactLinks } from "../data/website";
import { ContactIcon } from "./icons";

type ContactSectionProps = {
  emailCopied: boolean;
  onEmailCopy: (email: string) => void;
};

export function ContactSection({ emailCopied, onEmailCopy }: ContactSectionProps) {
  return (
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
                    <ContactIcon label={link.label} />
                  </span>
                  <span>{link.label}</span>
                </span>
                <span className="contact-value">{emailCopied ? "Copied" : link.value}</span>
              </button>
            ) : (
              <a className="contact-item" href={link.href} target="_blank" rel="noreferrer">
                <span className="contact-main">
                  <span className="contact-icon">
                    <ContactIcon label={link.label} />
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
  );
}
