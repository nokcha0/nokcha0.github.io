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

export function preloadSiteAssets(preloadPages: () => void) {
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
    if (cancelled) return;
    const sources = new Set(Object.values(timelines).flatMap((entries) =>
      entries.flatMap((entry) => [entry.logo, entry.logoDark, entry.logoLight]),
    ));
    const pending = [...sources].filter((src): src is string => Boolean(src)).map(loadImage);
    void Promise.all(pending);
    // A slow or failed image must not delay warming up page navigation.
    schedule(() => { if (!cancelled) preloadPages(); });
  };
  // Wait for a paint and an idle slot, not for every image on the page.
  const frameId = window.requestAnimationFrame(() => schedule(load));

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(frameId);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    window.clearTimeout(timeoutId);
  };
}

export function preloadToolIcons() {
  return Promise.all(toolGroups.flatMap((group) =>
    group.tools.map((tool) => loadImage(tool.icon)),
  ));
}
