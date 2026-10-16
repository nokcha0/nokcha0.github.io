import { timelines, toolGroups } from "../data/website";

const images = new Map<string, { image: HTMLImageElement; ready: Promise<void> }>();

function loadImage(src: string): Promise<void> {
  const cached = images.get(src);
  if (cached) return cached.ready;

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = "low";
  const ready = new Promise<void>((resolve) => {
    image.onload = () => void image.decode().catch(() => {}).then(resolve);
    image.onerror = () => {
      images.delete(src);
      resolve();
    };
  });
  images.set(src, { image, ready });
  image.src = src;
  return ready;
}

export function preloadExperienceLogos(onLoaded: () => void) {
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: number | undefined;

  const schedule = (task: () => void) => {
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(task, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(task, 200);
    }
  };

  const load = () => {
    const sources = new Set(Object.values(timelines).flatMap((entries) =>
      entries.flatMap((entry) => [entry.logo, entry.logoDark, entry.logoLight]),
    ));
    const pending = [...sources].filter((src): src is string => Boolean(src)).map(loadImage);
    void Promise.all(pending).then(() => {
      if (!cancelled) schedule(onLoaded);
    });
  };
  const start = () => schedule(load);

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", start);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    window.clearTimeout(timeoutId);
  };
}

export function preloadToolIcons() {
  return Promise.all(toolGroups.flatMap((group) =>
    group.tools.map((tool) => loadImage(tool.icon)),
  ));
}
