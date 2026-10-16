import type { SyntheticEvent } from "react";
import { prefersReducedMotion } from "./theme";

const effects = ["sheen", "underline-center", "corners", "wave", "highlight-scan", "greeting", "confetti", "marker", "pixels"] as const;
type NameEffect = (typeof effects)[number];
type EffectCycle = { remaining: NameEffect[]; last?: NameEffect };
const cycles = new WeakMap<HTMLAnchorElement, EffectCycle>();
const runs = new WeakMap<HTMLAnchorElement, object>();
const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

function nextEffect(link: HTMLAnchorElement): NameEffect {
  const cycle: EffectCycle = cycles.get(link) ?? { remaining: [] };
  if (cycle.remaining.length === 0) {
    cycle.remaining = [...effects];
    for (let index = cycle.remaining.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [cycle.remaining[index], cycle.remaining[other]] = [cycle.remaining[other], cycle.remaining[index]];
    }
    const end = cycle.remaining.length - 1;
    if (cycle.remaining[end] === cycle.last) {
      const other = Math.floor(Math.random() * end);
      [cycle.remaining[end], cycle.remaining[other]] = [cycle.remaining[other], cycle.remaining[end]];
    }
  }
  const effect = cycle.remaining.pop()!;
  cycle.last = effect;
  cycles.set(link, cycle);
  return effect;
}

function getNameParts(link: HTMLAnchorElement) {
  return link.querySelectorAll("[data-name-part]");
}

export function clearNameAnimation(link: HTMLAnchorElement) {
  runs.set(link, {});
  getNameParts(link).forEach((part) => {
    part.getAnimations().forEach((animation) => animation.cancel());
  });
  delete link.dataset.hoverActive;
  delete link.dataset.nameLetterMode;
}

export function playNameAnimation(link: HTMLAnchorElement, selected: NameEffect) {
  clearNameAnimation(link);
  const reducedMotion = prefersReducedMotion();
  const effect = reducedMotion ? "underline-center" : selected;
  link.dataset.hoverActive = "true";
  link.dataset.hoverEffect = selected;

  const animate = (selector: string, frames: Keyframe[], duration = 480, delay = 0) =>
    link.querySelector(selector)?.animate(frames, {
      duration: reducedMotion ? 0 : duration,
      delay: reducedMotion ? 0 : delay,
      easing,
      fill: "both",
    });
  const underline = (origin = "left", delay = 0) => animate(".name-hover-underline", [
    { transform: "scaleX(0)", transformOrigin: origin },
    { transform: "scaleX(1)", transformOrigin: origin },
  ], 480, delay);
  const highlight = () => animate(".name-hover-highlight", [
    { transform: "scaleX(0)", transformOrigin: "left" },
    { transform: "scaleX(1)", transformOrigin: "left" },
  ]);
  const sheen = () => animate(".name-hover-sheen", [
    { clipPath: "inset(0 100% 0 -30%)" },
    { clipPath: "inset(0 -30% 0 100%)" },
  ], 700);
  switch (effect) {
    case "underline-center": underline("center"); break;
    case "sheen": sheen(); break;
    case "corners":
      ["top-left", "bottom-right", "top-right", "bottom-left"].forEach((corner, index) => {
        animate(`.name-hover-corner.${corner}`, [
          { transform: "scale(0) rotate(-45deg)" },
          { transform: "scale(1.15) rotate(0deg)", offset: 0.7 },
          { transform: "scale(1) rotate(0deg)" },
        ], 360, index * 55);
      });
      break;
    case "highlight-scan":
      highlight();
      animate(".name-hover-scan", [
        { left: "-3px", transform: "scaleY(0)", offset: 0 },
        { left: "-3px", transform: "scaleY(1)", offset: 0.05 },
        { left: "calc(100% + 3px)", transform: "scaleY(1)", offset: 1 },
      ]);
      break;
    case "greeting":
      animate(".name-hover-greeting", [
        { transform: "translate(-4px, -50%) scale(0)" },
        { transform: "translate(0, -50%) scale(1.06)", offset: 0.8 },
        { transform: "translate(0, -50%) scale(1)" },
      ], 420);
      break;
    case "confetti":
      link.querySelectorAll<HTMLElement>(".name-hover-confetti").forEach((_, index) => {
        const x = (index % 2 ? 1 : -1) * (6 + (index % 3) * 5);
        // Keep the lower burst clear of the navigation row on mobile.
        const y = index % 2 ? 8 + (index % 3) * 1.5 : -(19 + (index % 3) * 4);
        animate(`[data-confetti="${index}"]`, [
          { transform: "translate(0, 0) scale(0) rotate(0deg)" },
          { transform: `translate(${x}px, ${y * 1.18}px) scale(1.25) rotate(${index * 37}deg)`, offset: 0.65 },
          { transform: `translate(${x}px, ${y}px) scale(1) rotate(${index * 47}deg)` },
        ], 620, index * 24);
      });
      break;
    case "marker":
      animate(".name-hover-marker path", [
        { strokeDashoffset: "100" },
        { strokeDashoffset: "0" },
      ], 760);
      break;
    case "pixels":
      link.querySelectorAll(".name-hover-pixel").forEach((_, index) => {
        animate(`[data-pixel="${index}"]`, [
          { transform: "scale(0)", offset: 0 },
          { transform: "scale(1)", offset: 0.28 },
          { transform: "scale(1)", offset: 0.65 },
          { transform: "scale(0)", offset: 1 },
        ], 480, (index % 10) * 45 + Math.floor(index / 10) * 65);
      });
      break;
    case "wave":
      link.dataset.nameLetterMode = "true";
      link.querySelectorAll(".name-hover-letter").forEach((letter, index) => {
        letter.animate([
          { transform: "none", color: "var(--text)" },
          { transform: "translateY(-3px)", color: "var(--accent)", offset: 0.4 },
          { transform: "translateY(0.5px)", color: "var(--accent)", offset: 0.75 },
          { transform: "none", color: "var(--accent)" },
        ], { duration: 420, delay: index * 24, easing, fill: "both" });
      });
      break;
  }
  return Array.from(getNameParts(link)).flatMap((part) => part.getAnimations());
}

export function reverseNameAnimation(link: HTMLAnchorElement) {
  if (link.dataset.hoverActive !== "true") return;
  delete link.dataset.hoverActive;
  const reducedMotion = prefersReducedMotion();
  const run = runs.get(link);
  const animations = Array.from(getNameParts(link)).flatMap((part) => part.getAnimations());
  const retract = link.dataset.hoverEffect === "pixels" || link.dataset.hoverEffect === "wave";

  if (!retract || reducedMotion) {
    let remaining = animations.length;
    const finish = (animation: Animation) => {
      animation.cancel();
      remaining -= 1;
      if (remaining === 0 && runs.get(link) === run && link.dataset.hoverActive !== "true") {
        delete link.dataset.nameLetterMode;
      }
    };
    if (remaining === 0) delete link.dataset.nameLetterMode;
    animations.forEach((animation) => {
      if (reducedMotion || animation.effect?.getTiming().duration === 0) {
        finish(animation);
      } else {
        animation.onfinish = () => finish(animation);
        animation.reverse();
      }
    });
    return animations.filter((animation) => animation.playState !== "idle");
  }

  const exits: Animation[] = [];
  animations.forEach((animation) => {
    const part = (animation.effect as KeyframeEffect).target;
    if (!part) {
      animation.cancel();
      return;
    }
    const style = getComputedStyle(part);
    const from: Keyframe = { transform: style.transform };
    const to: Keyframe = {};
    const pixel = part.matches(".name-hover-pixel");
    if (pixel) {
      // Cleared or not-yet-shown tiles must stay hidden on exit.
      const matrix = new DOMMatrixReadOnly(style.transform);
      if (Math.abs(matrix.a) < 0.001 && Math.abs(matrix.d) < 0.001) {
        animation.cancel();
        return;
      }
      to.transform = "scale(0)";
    } else {
      // Settle letters directly rather than repeating the wave in reverse.
      to.transform = "none";
      from.color = "var(--accent)";
      to.color = "var(--text)";
    }
    animation.cancel();
    const exit = part.animate([from, to], { duration: pixel ? 160 : 220, easing, fill: "both" });
    exits.push(exit);
    exit.onfinish = () => {
      exit.cancel();
      if (runs.get(link) === run && exits.every((item) => item.playState === "idle")) {
        delete link.dataset.nameLetterMode;
      }
    };
  });
  if (!exits.length) delete link.dataset.nameLetterMode;
  return exits;
}

export function animateNameHover(event: SyntheticEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  if (link.dataset.hoverActive === "true") return;
  playNameAnimation(link, prefersReducedMotion() ? "underline-center" : nextEffect(link));
}

export function resetNameHover(event: SyntheticEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  if (link.matches(":hover, :focus-visible")) return;
  reverseNameAnimation(link);
}
