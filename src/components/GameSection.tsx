import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { RichText } from "./RichText";

type GridDot = {
  id: string;
  visible: boolean;
  x: number;
  y: number;
};

type LineSegment = {
  startId: string;
  endId: string;
};

type DragState = {
  startDotId: string;
  pointerX: number;
  pointerY: number;
};

declare global {
  interface Window {
    confetti?: (options: Record<string, unknown>) => void;
  }
}

const BOARD_SIZE = 360;
const GRID_STEP = 70;
const BOARD_OFFSET = 40;
const DOT_RADIUS = 6;
const VISIBLE_SNAP_RADIUS = 28;
const HIDDEN_SNAP_RADIUS = 11;
const CARRY_DOT_SNAP_RADIUS = 20;
const COVERAGE_TOLERANCE = 8;
const MAX_SEGMENTS = 4;

const ALL_DOTS: GridDot[] = [];

for (let y = -1; y <= 3; y += 1) {
  for (let x = -1; x <= 3; x += 1) {
    ALL_DOTS.push({
      id: `${x},${y}`,
      visible: x >= 0 && x <= 2 && y >= 0 && y <= 2,
      x: BOARD_OFFSET + (x + 1) * GRID_STEP,
      y: BOARD_OFFSET + (y + 1) * GRID_STEP,
    });
  }
}

const VISIBLE_DOTS = ALL_DOTS.filter((dot) => dot.visible);
const DOTS_BY_ID = new Map(ALL_DOTS.map((dot) => [dot.id, dot]));

const SOLUTION_PATH = ["0,0", "2,2", "2,-1", "-1,2", "1,2"];
const SOLUTION_SEGMENTS = SOLUTION_PATH.slice(1).map((endId, index) => ({
  startId: SOLUTION_PATH[index],
  endId,
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function distanceSquared(ax: number, ay: number, bx: number, by: number) {
  return (ax - bx) ** 2 + (ay - by) ** 2;
}

function getDot(dotId: string) {
  return DOTS_BY_ID.get(dotId) ?? null;
}

function findNearestDot(
  x: number,
  y: number,
  dots: GridDot[],
  getSnapRadius: (dot: GridDot) => number = (dot) =>
    dot.visible ? VISIBLE_SNAP_RADIUS : HIDDEN_SNAP_RADIUS,
) {
  let closestDot: GridDot | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const dot of dots) {
    const nextDistance = distanceSquared(x, y, dot.x, dot.y);
    const snapRadius = getSnapRadius(dot);

    if (nextDistance <= snapRadius ** 2 && nextDistance <= closestDistance) {
      closestDot = dot;
      closestDistance = nextDistance;
    }
  }

  return closestDot;
}

function distanceToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const lengthSquared = distanceSquared(ax, ay, bx, by);

  if (lengthSquared === 0) {
    return Math.sqrt(distanceSquared(px, py, ax, ay));
  }

  const t = clamp(
    ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / lengthSquared,
    0,
    1,
  );
  const projectedX = ax + t * (bx - ax);
  const projectedY = ay + t * (by - ay);

  return Math.sqrt(distanceSquared(px, py, projectedX, projectedY));
}

function getCoveredDotIds(segments: LineSegment[]) {
  const coveredIds = new Set<string>();

  for (const segment of segments) {
    const startDot = getDot(segment.startId);
    const endDot = getDot(segment.endId);
    if (!startDot || !endDot) continue;

    for (const dot of VISIBLE_DOTS) {
      const distance = distanceToSegment(
        dot.x,
        dot.y,
        startDot.x,
        startDot.y,
        endDot.x,
        endDot.y,
      );

      if (distance <= COVERAGE_TOLERANCE) {
        coveredIds.add(dot.id);
      }
    }
  }

  return coveredIds;
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function GameSection() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const crossedDotIdsRef = useRef<Set<string>>(new Set());
  const [segments, setSegments] = useState<LineSegment[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [jellyTokens, setJellyTokens] = useState<Record<string, number>>({});
  const [solutionStep, setSolutionStep] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);

  const coveredDotIds = getCoveredDotIds(segments);
  const isSolved =
    segments.length === MAX_SEGMENTS &&
    coveredDotIds.size === VISIBLE_DOTS.length;
  const renderedSegments = solutionVisible ? SOLUTION_SEGMENTS : segments;
  const linesUsed = solutionVisible ? MAX_SEGMENTS : segments.length;
  const canDraw = !solutionVisible && segments.length < MAX_SEGMENTS;

  useEffect(() => {
    if (!isSolved) return;

    const confetti = window.confetti;
    if (typeof confetti !== "function") return;

    const duration = 7 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 24,
      spread: 300,
      ticks: 45,
      zIndex: 0,
    };

    const intervalId = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        window.clearInterval(intervalId);
        return;
      }

      const particleCount = 18 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      );
    }, 350);

    return () => window.clearInterval(intervalId);
  }, [isSolved]);

  const getLocalPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return { x: 0, y: 0 };
    }

    const bounds = svgElement.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * BOARD_SIZE,
      y: ((event.clientY - bounds.top) / bounds.height) * BOARD_SIZE,
    };
  };

  const bumpDots = (dotIds: string[]) => {
    if (dotIds.length === 0) return;

    setJellyTokens((previous) => {
      const nextTokens = { ...previous };

      for (const dotId of dotIds) {
        nextTokens[dotId] = (nextTokens[dotId] ?? 0) + 1;
      }

      return nextTokens;
    });
  };

  const getTouchedVisibleDotIds = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    excludedDotId?: string,
  ) =>
    VISIBLE_DOTS.filter((dot) => {
      if (dot.id === excludedDotId) return false;

      return (
        distanceToSegment(dot.x, dot.y, startX, startY, endX, endY) <=
        COVERAGE_TOLERANCE
      );
    }).map((dot) => dot.id);

  const resetGame = () => {
    setSegments([]);
    setDragState(null);
    setJellyTokens({});
    setSolutionStep(0);
    setSolutionVisible(false);
    crossedDotIdsRef.current = new Set();
  };

  const openSolutionFlow = () => {
    if (solutionVisible) return;
    setSolutionStep(1);
  };

  const cancelSolutionFlow = () => {
    setSolutionStep(0);
  };

  const advanceSolutionFlow = () => {
    if (solutionStep < 3) {
      setSolutionStep((previous) => previous + 1);
      return;
    }

    setSolutionStep(0);
    setSolutionVisible(true);
    setDragState(null);
    crossedDotIdsRef.current = new Set();
  };

  const onBoardPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!canDraw) return;

    const point = getLocalPoint(event);
    const allowedStarts =
      segments.length === 0
        ? VISIBLE_DOTS
        : [getDot(segments[segments.length - 1].endId)].filter(
            (dot): dot is GridDot => dot !== null,
          );
    const startDot = findNearestDot(point.x, point.y, allowedStarts, (dot) =>
      dot.visible ? VISIBLE_SNAP_RADIUS : CARRY_DOT_SNAP_RADIUS,
    );

    if (!startDot) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    crossedDotIdsRef.current = new Set([startDot.id]);
    setDragState({
      startDotId: startDot.id,
      pointerX: point.x,
      pointerY: point.y,
    });
  };

  const onBoardPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragState) return;

    const point = getLocalPoint(event);
    const startDot = getDot(dragState.startDotId);
    const targetDot = findNearestDot(point.x, point.y, ALL_DOTS);
    const endX = targetDot ? targetDot.x : point.x;
    const endY = targetDot ? targetDot.y : point.y;

    if (startDot) {
      const touchedDotIds = getTouchedVisibleDotIds(
        startDot.x,
        startDot.y,
        endX,
        endY,
        startDot.id,
      );
      const previousCrossedIds = crossedDotIdsRef.current;
      const nextCrossedIds = new Set<string>([startDot.id, ...touchedDotIds]);
      const newDotIds = touchedDotIds.filter(
        (dotId) => !previousCrossedIds.has(dotId),
      );

      if (newDotIds.length > 0) {
        bumpDots(newDotIds);
      }

      crossedDotIdsRef.current = nextCrossedIds;
    }

    setDragState((previous) =>
      previous
        ? {
            ...previous,
            pointerX: point.x,
            pointerY: point.y,
          }
        : null,
    );
  };

  const finishDrag = (
    event: ReactPointerEvent<SVGSVGElement>,
    shouldCommit: boolean,
  ) => {
    if (!dragState) return;

    const point = getLocalPoint(event);
    const startDot = getDot(dragState.startDotId);
    const endDot = shouldCommit
      ? findNearestDot(point.x, point.y, ALL_DOTS)
      : null;

    if (
      startDot &&
      endDot &&
      startDot.id !== endDot.id &&
      segments.length < MAX_SEGMENTS
    ) {
      const committedDotIds = getTouchedVisibleDotIds(
        startDot.x,
        startDot.y,
        endDot.x,
        endDot.y,
        startDot.id,
      );
      const newDotIds = committedDotIds.filter(
        (dotId) => !crossedDotIdsRef.current.has(dotId),
      );

      if (newDotIds.length > 0) {
        bumpDots(newDotIds);
      }

      setSegments((previous) => [
        ...previous,
        {
          startId: startDot.id,
          endId: endDot.id,
        },
      ]);
    }

    crossedDotIdsRef.current = new Set();
    setDragState(null);
  };

  const previewStartDot = dragState ? getDot(dragState.startDotId) : null;
  const previewEndDot =
    dragState !== null
      ? findNearestDot(dragState.pointerX, dragState.pointerY, ALL_DOTS)
      : null;
  const carryDot =
    !solutionVisible && dragState === null && segments.length > 0
      ? getDot(segments[segments.length - 1].endId)
      : null;

  return (
    <section className="section puzzle-section" aria-labelledby="puzzle-title">
      <h2 id="puzzle-title">Thanks for coming. A small game for you:</h2>
      <p className="puzzle-summary">
        <RichText text="Can you cover all 9 dots with four [[consecutive|without lifting the pen.]] straight lines?" />
      </p>

      <div className="puzzle-toolbar">
        <p className="puzzle-count" aria-live="polite">
          {linesUsed} / {MAX_SEGMENTS}
        </p>
        <div className="puzzle-actions">
          <button type="button" className="puzzle-button" onClick={resetGame}>
            Reset
          </button>
          <button
            type="button"
            className="puzzle-button"
            onClick={openSolutionFlow}
            disabled={solutionVisible}
          >
            See solution
          </button>
        </div>
      </div>

      {solutionStep > 0 ? (
        <div className="puzzle-confirmation" role="dialog" aria-modal="false">
          <p className="puzzle-confirmation-text">
            {solutionStep === 1
              ? "Are you sure?"
              : solutionStep === 2
                ? "Really sure? Hint: Think outside the box!"
                : "Last chance."}
          </p>
          <div className="puzzle-confirmation-actions">
            <button
              type="button"
              className="puzzle-button"
              onClick={cancelSolutionFlow}
            >
              Cancel
            </button>
            <button
              type="button"
              className="puzzle-button"
              onClick={advanceSolutionFlow}
            >
              {solutionStep === 3 ? "Show solution" : "Continue"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="puzzle-board-shell">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
          className="puzzle-board"
          onPointerDown={onBoardPointerDown}
          onPointerMove={onBoardPointerMove}
          onPointerUp={(event) => finishDrag(event, true)}
          onPointerCancel={(event) => finishDrag(event, false)}
          onPointerLeave={(event) => finishDrag(event, false)}
          role="img"
          aria-label="Nine dots puzzle board"
        >
          {renderedSegments.map((segment) => {
            const startDot = getDot(segment.startId);
            const endDot = getDot(segment.endId);
            if (!startDot || !endDot) return null;

            return (
              <line
                key={`${segment.startId}-${segment.endId}`}
                className={`puzzle-segment ${
                  solutionVisible ? "is-solution" : ""
                }`}
                x1={startDot.x}
                y1={startDot.y}
                x2={endDot.x}
                y2={endDot.y}
              />
            );
          })}

          {dragState && previewStartDot ? (
            <line
              className="puzzle-preview"
              x1={previewStartDot.x}
              y1={previewStartDot.y}
              x2={previewEndDot ? previewEndDot.x : dragState.pointerX}
              y2={previewEndDot ? previewEndDot.y : dragState.pointerY}
            />
          ) : null}

          {carryDot ? (
            <circle
              cx={carryDot.x}
              cy={carryDot.y}
              r={DOT_RADIUS + 7}
              className="puzzle-carry-dot"
            />
          ) : null}
          {VISIBLE_DOTS.map((dot) => (
            <g
              key={`${dot.id}-${jellyTokens[dot.id] ?? 0}`}
              className={`puzzle-dot-shell ${
                jellyTokens[dot.id] ? "is-jelly" : ""
              }`}
            >
              <circle
                cx={dot.x}
                cy={dot.y}
                r={DOT_RADIUS}
                className="puzzle-dot"
              />
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
