import type { SyntheticEvent } from "react";
import { prefersReducedMotion } from "./theme";

const effects = ["sheen", "underline-center", "corners", "wave", "highlight-scan", "greeting", "confetti", "marker", "pixels"] as const;
type NameEffect = (typeof effects)[number];
type EffectCycle = { remaining: NameEffect[]; last?: NameEffect };
type AnimationRun = { phase: "entering" | "active" | "exiting"; hovered: boolean };
const cycles = new WeakMap<HTMLElement, EffectCycle>();
const runs = new WeakMap<HTMLElement, AnimationRun>();
const tapTimers = new WeakMap<HTMLElement, number>();
const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

function nextEffect(link: HTMLElement): NameEffect {
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

function getNameParts(link: HTMLElement) {
  return link.querySelectorAll("[data-name-part]");
}

export function clearNameAnimation(link: HTMLElement) {
  window.clearTimeout(tapTimers.get(link));
  tapTimers.delete(link);
  runs.delete(link);
  getNameParts(link).forEach((part) => {
    part.getAnimations().forEach((animation) => animation.cancel());
  });
  delete link.dataset.hoverActive;
  delete link.dataset.nameLetterMode;
}

function completeNameExit(link: HTMLElement, run: AnimationRun) {
  if (runs.get(link) !== run) return;
  delete link.dataset.nameLetterMode;
  runs.delete(link);
  if (run.hovered && link.isConnected) {
    playNameAnimation(link, prefersReducedMotion() ? "underline-center" : nextEffect(link));
  }
}

export function playNameAnimation(link: HTMLElement, selected: NameEffect) {
  clearNameAnimation(link);
  const reducedMotion = prefersReducedMotion();
  const effect = reducedMotion ? "underline-center" : selected;
  const run: AnimationRun = { phase: reducedMotion ? "active" : "entering", hovered: true };
  runs.set(link, run);
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
    case "highlight-scan": {
      highlight();
      // Measure once; every animation frame can then use transforms only.
      const scanDistance = link.getBoundingClientRect().width + 6;
      animate(".name-hover-scan", [
        { transform: "translateX(0) scaleY(0)", offset: 0 },
        { transform: "translateX(0) scaleY(1)", offset: 0.05 },
        { transform: `translateX(${scanDistance}px) scaleY(1)`, offset: 1 },
      ]);
      break;
    }
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
        { strokeDashoffset: "100", opacity: 1 },
        { strokeDashoffset: "0", opacity: 1 },
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
  const animations = Array.from(getNameParts(link)).flatMap((part) => part.getAnimations());
  // Include staggered parts so leaving early never cuts off the opening sequence.
  void Promise.all(animations.map((animation) => animation.finished)).then(() => {
    if (runs.get(link) !== run) return;
    run.phase = "active";
    if (!run.hovered) reverseNameAnimation(link);
  }, () => {
    // Clearing or replacing a run cancels its animations and their promises.
  });
  return animations;
}

export function reverseNameAnimation(link: HTMLElement) {
  const run = runs.get(link);
  if (!run) return;
  run.hovered = false;
  if (run.phase !== "active") return;
  run.phase = "exiting";
  delete link.dataset.hoverActive;
  const reducedMotion = prefersReducedMotion();
  // The pixel wave already clears its tiles during the opening sequence.
  const skipExit = reducedMotion || link.dataset.hoverEffect === "pixels";
  const animations = Array.from(getNameParts(link)).flatMap((part) => part.getAnimations());
  const exits: Animation[] = [];
  animations.forEach((animation) => {
    if (skipExit || animation.effect?.getTiming().duration === 0) {
      animation.cancel();
      return;
    }
    // Reverse the entire sequence, including staggered letters, rather than
    // replacing it with a shortened exit.
    animation.reverse();
    exits.push(animation);
  });
  if (!exits.length) {
    completeNameExit(link, run);
    return exits;
  }
  // Keep the run alive until every part finishes, independently of hover state.
  void Promise.all(exits.map((animation) => animation.finished)).then(() => {
    if (runs.get(link) !== run) return;
    exits.forEach((animation) => animation.cancel());
    completeNameExit(link, run);
  }, () => {
    // Explicit clearing invalidates the run and cancels its pending completion.
  });
  return exits;
}

export function animateNameHover(event: SyntheticEvent<HTMLElement>) {
  const link = event.currentTarget;
  const run = runs.get(link);
  if (run) {
    // Re-entry records intent without replacing an opening or closing animation.
    run.hovered = true;
    return;
  }
  playNameAnimation(link, prefersReducedMotion() ? "underline-center" : nextEffect(link));
}

export function animateNameTap(event: SyntheticEvent<HTMLElement>) {
  const link = event.currentTarget;
  playNameAnimation(link, nextEffect(link));
  if (prefersReducedMotion()) {
    // Keep a static underline visible long enough to acknowledge the tap.
    tapTimers.set(link, window.setTimeout(() => {
      tapTimers.delete(link);
      reverseNameAnimation(link);
    }, 650));
    return;
  }
  // A tap plays the full entrance and exit without waiting for a hover to end.
  reverseNameAnimation(link);
}

export function resetNameHover(event: SyntheticEvent<HTMLElement>) {
  const link = event.currentTarget;
  if (link.matches(":hover, :focus-visible")) return;
  reverseNameAnimation(link);
}
