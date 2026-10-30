import { useState } from "react";
import type { SyntheticEvent } from "react";
import { introContactLinks, introContent } from "../data/website";
import { ContactIcon } from "./icons";
import { RichText } from "./RichText";

const borderEffects = [
  { name: "clockwise", dashes: ["100", "100"], start: 100 },
  { name: "counterclockwise", dashes: ["100", "100"], start: -100 },
  { name: "split", dashes: ["0 50", "50 0"], start: 0 },
];

function animateContactBorder(event: SyntheticEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  if (link.dataset.borderActive === "true") return;
  const border = link.querySelector(".contact-border rect");
  if (!border) return;

  const choices = borderEffects.filter(
    (effect) => effect.name !== link.dataset.borderEffect,
  );
  const effect = choices[Math.floor(Math.random() * choices.length)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  border.getAnimations().forEach((animation) => animation.cancel());
  link.dataset.borderActive = "true";
  link.dataset.borderEffect = effect.name;
  link.style.setProperty("--border-rotation", Math.random() < 0.5 ? "0deg" : "180deg");
  border.animate(
    [
      { strokeDasharray: effect.dashes[0], strokeDashoffset: `${effect.start}`, opacity: 1 },
      { strokeDasharray: effect.dashes[1], strokeDashoffset: "0", opacity: 1 },
    ],
    {
      duration: reducedMotion ? 0 : 480,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both",
    },
  );
}

function resetContactBorder(event: SyntheticEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  if (link.matches(":hover, :focus-visible")) return;
  delete link.dataset.borderActive;
  link.querySelector(".contact-border rect")?.getAnimations().forEach((animation) => {
    if (animation.effect?.getTiming().duration === 0) {
      animation.cancel();
      return;
    }
    animation.onfinish = () => animation.cancel();
    animation.reverse();
  });
}

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
              onPointerEnter={animateContactBorder}
              onPointerLeave={resetContactBorder}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) {
                  animateContactBorder(event);
                }
              }}
              onBlur={resetContactBorder}
            >
              <svg
                className="contact-border"
                aria-hidden="true"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="31"
                  height="31"
                  rx="6.5"
                  pathLength="100"
                />
              </svg>
              <ContactIcon label={contact.label} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
