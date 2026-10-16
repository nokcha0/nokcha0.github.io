type Confetti = ((options: Record<string, unknown>) => void | Promise<unknown>) & {
  init?: () => Promise<void>;
};

declare global {
  interface Window {
    confetti?: Confetti;
  }
}

let pending: Promise<Confetti> | null = null;

async function prepareConfetti(): Promise<Confetti> {
  const confetti = window.confetti;
  if (!confetti) throw new Error("Confetti is unavailable");
  // Register the particle plugins before the first celebration needs them.
  await confetti.init?.();
  return confetti;
}

export function loadConfetti(): Promise<Confetti> {
  if (pending) return pending;
  if (window.confetti) {
    pending = prepareConfetti().catch((error: unknown) => {
      pending = null;
      throw error;
    });
    return pending;
  }

  pending = new Promise<Confetti>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${import.meta.env.BASE_URL}vendor/tsparticles.confetti.bundle.min.js`;
    script.async = true;
    const fail = () => {
      script.remove();
      pending = null;
      reject(new Error("Could not load confetti"));
    };
    script.onload = () => void prepareConfetti().then(resolve, fail);
    script.onerror = fail;
    document.head.append(script);
  });
  return pending;
}
