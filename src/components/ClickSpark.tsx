import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

type Easing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

type Spark = {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  startTime: number;
};

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: Easing;
  extraScale?: number;
  disabled?: boolean;
  ignoreSelector?: string;
  children?: ReactNode;
};

function easeProgress(t: number, easing: Easing) {
  switch (easing) {
    case "linear": return t;
    case "ease-in": return t * t;
    case "ease-in-out": return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default: return t * (2 - t);
  }
}

function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 15,
  sparkRadius = 40,
  sparkCount = 7,
  duration = 300,
  easing = "ease-out",
  extraScale = 1,
  disabled = false,
  ignoreSelector,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emitRef = useRef<((clientX: number, clientY: number) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx || disabled) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let sparks: Spark[] = [];
    let frameId = 0;
    let left = 0;
    let top = 0;

    const reset = () => {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      sparks = [];
      // Release the backing store when there is nothing to draw.
      canvas.width = 0;
      canvas.height = 0;
    };

    const draw = (timestamp: number) => {
      frameId = 0;
      sparks = sparks.filter((spark) => timestamp - spark.startTime < duration);
      if (sparks.length === 0) {
        reset();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const spark of sparks) {
        const progress = Math.max(0, (timestamp - spark.startTime) / duration);
        const eased = easeProgress(progress, easing);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);
        const x = spark.x - left;
        const y = spark.y - top;
        ctx.moveTo(x + distance * spark.directionX, y + distance * spark.directionY);
        ctx.lineTo(
          x + (distance + lineLength) * spark.directionX,
          y + (distance + lineLength) * spark.directionY,
        );
      }
      ctx.stroke();
      frameId = window.requestAnimationFrame(draw);
    };

    emitRef.current = (clientX, clientY) => {
      if (motion.matches || document.hidden || duration <= 0 || sparkCount <= 0) return;
      const bounds = parent.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;
      const now = performance.now();
      sparks = sparks.filter((spark) => now - spark.startTime < duration);
      for (let index = 0; index < sparkCount; index += 1) {
        const angle = (2 * Math.PI * index) / sparkCount;
        sparks.push({ x, y, directionX: Math.cos(angle), directionY: Math.sin(angle), startTime: now });
      }

      // Fit the canvas to the active bursts, rather than to the entire page.
      const extent = Math.ceil(Math.abs(sparkRadius * extraScale) + sparkSize + 2);
      left = Math.max(0, Math.floor(Math.min(...sparks.map((spark) => spark.x)) - extent));
      top = Math.max(0, Math.floor(Math.min(...sparks.map((spark) => spark.y)) - extent));
      const right = Math.min(bounds.width, Math.ceil(Math.max(...sparks.map((spark) => spark.x)) + extent));
      const bottom = Math.min(bounds.height, Math.ceil(Math.max(...sparks.map((spark) => spark.y)) + extent));
      const width = Math.max(1, right - left);
      const height = Math.max(1, bottom - top);
      canvas.style.left = `${left}px`;
      canvas.style.top = `${top}px`;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      if (frameId === 0) frameId = window.requestAnimationFrame(draw);
    };

    const onVisibilityChange = () => { if (document.hidden) reset(); };
    window.addEventListener("resize", reset);
    document.addEventListener("visibilitychange", onVisibilityChange);
    motion.addEventListener("change", reset);
    return () => {
      reset();
      emitRef.current = null;
      window.removeEventListener("resize", reset);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motion.removeEventListener("change", reset);
    };
  }, [disabled, duration, easing, extraScale, sparkColor, sparkCount, sparkRadius, sparkSize]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (ignoreSelector && event.target instanceof Element && event.target.closest(ignoreSelector)) return;
    emitRef.current?.(event.clientX, event.clientY);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        width={0}
        height={0}
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 20 }}
      />
      {children}
    </div>
  );
}

export default ClickSpark;
