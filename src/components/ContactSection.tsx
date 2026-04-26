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
      <div className="contact-table-shell">
        <table className="contact-table">
          <tbody>
            {contactLinks.map((link) => (
              <tr key={link.label}>
                <th scope="row" className="contact-label-cell">
                  <span className="contact-main">
                    <span className="contact-icon">
                      <ContactIcon label={link.label} />
                    </span>
                    <span>{link.label}</span>
                  </span>
                </th>
                <td className="contact-value-cell">
                  {link.label === "Email" ? (
                    <button
                      type="button"
                      className={`contact-action ${emailCopied ? "is-copied" : ""}`}
                      onClick={() => onEmailCopy(link.value)}
                      aria-live="polite"
                    >
                      <span className="contact-value">{link.value}</span>
                      <span className="contact-status">
                        {emailCopied ? "Copied" : "Copy"}
                      </span>
                    </button>
                  ) : (
                    <a
                      className="contact-action"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="contact-value">{link.value}</span>
                      <span className="contact-status">Open</span>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
