import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";

type RichTextProps = {
  text: string;
};

type InlineNoteProps = {
  label: string;
  tooltip: string;
  keyPrefix: string;
};

function InlineNote({ label, tooltip, keyPrefix }: InlineNoteProps) {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const bubbleRef = useRef<HTMLSpanElement | null>(null);
  const tooltipId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);

  const isVisible = isPinnedOpen || ((isHovered || hasFocusWithin) && !isSuppressed);

  useLayoutEffect(() => {
    if (!isVisible) return;

    const keepBubbleOnScreen = () => {
      const bubble = bubbleRef.current;
      if (!bubble) return;

      bubble.style.removeProperty("--note-shift");
      if (!window.matchMedia("(max-width: 640px)").matches) return;

      const bounds = bubble.getBoundingClientRect();
      const gutter = 16;
      const shift = Math.max(
        gutter - bounds.left,
        Math.min(0, window.innerWidth - gutter - bounds.right),
      );
      bubble.style.setProperty("--note-shift", `${shift}px`);
    };

    keepBubbleOnScreen();
    window.addEventListener("resize", keepBubbleOnScreen);
    return () => window.removeEventListener("resize", keepBubbleOnScreen);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const dismiss = () => {
      setIsPinnedOpen(false);
      setIsHovered(false);
      setHasFocusWithin(false);
      setIsSuppressed(true);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        dismiss();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    // Touch scrolling cancels the tap and should also dismiss its popup.
    document.addEventListener("pointercancel", dismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointercancel", dismiss);
    };
  }, [isVisible]);

  const toggleTooltip = (event?: ReactMouseEvent<HTMLSpanElement>) => {
    if (isPinnedOpen) {
      setIsPinnedOpen(false);
      setIsHovered(false);
      setHasFocusWithin(false);
      setIsSuppressed(true);
      event?.currentTarget.blur();
      return;
    }

    setIsPinnedOpen(true);
    setIsSuppressed(false);
  };

  const onBlurCapture = (event: FocusEvent<HTMLSpanElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setHasFocusWithin(false);
    setIsSuppressed(false);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTooltip();
      return;
    }

    if (event.key !== "Escape") return;

    event.preventDefault();
    setIsPinnedOpen(false);
    setIsSuppressed(true);
  };

  return (
    <span
      ref={wrapperRef}
      className={`inline-note ${isVisible ? "is-visible" : ""} ${
        isPinnedOpen ? "is-open" : ""
      }`}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setIsHovered(true);
        setIsSuppressed(false);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        setIsHovered(false);
        setIsSuppressed(false);
      }}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={onBlurCapture}
    >
      <span
        className="inline-note-trigger"
        role="button"
        tabIndex={0}
        onClick={toggleTooltip}
        onKeyDown={onTriggerKeyDown}
        aria-describedby={tooltipId}
        aria-expanded={isPinnedOpen}
      >
        <span className="inline-note-label">
          {renderSegments(label, `${keyPrefix}-label`)}
        </span>
      </span>
      <span ref={bubbleRef} id={tooltipId} className="inline-note-bubble" role="tooltip">
        {renderSegments(tooltip, `${keyPrefix}-text`)}
      </span>
    </span>
  );
}

function renderSegments(text: string, keyPrefix: string): ReactNode[] {
  const tokenPattern = /\[\[(.+?)\|(.+?)\]\]|\*\*(.+?)\*\*|\*(.+?)\*/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchCount = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const [token, tooltipLabel, tooltipText, boldText, italicText] = match;
    const startIndex = match.index ?? 0;

    if (startIndex > lastIndex) {
      nodes.push(
        <Fragment key={`${keyPrefix}-text-${matchCount}`}>
          {text.slice(lastIndex, startIndex)}
        </Fragment>,
      );
    }

    if (tooltipLabel !== undefined && tooltipText !== undefined) {
      nodes.push(
        <InlineNote
          key={`${keyPrefix}-tooltip-${matchCount}`}
          label={tooltipLabel}
          tooltip={tooltipText}
          keyPrefix={`${keyPrefix}-tooltip-${matchCount}`}
        />,
      );
    } else if (boldText !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-bold-${matchCount}`}>
          {renderSegments(boldText, `${keyPrefix}-bold-text-${matchCount}`)}
        </strong>,
      );
    } else if (italicText !== undefined) {
      nodes.push(
        <em key={`${keyPrefix}-italic-${matchCount}`}>
          {renderSegments(italicText, `${keyPrefix}-italic-text-${matchCount}`)}
        </em>,
      );
    }

    lastIndex = startIndex + token.length;
    matchCount += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <Fragment key={`${keyPrefix}-tail`}>
        {text.slice(lastIndex)}
      </Fragment>,
    );
  }

  return nodes;
}

export function RichText({ text }: RichTextProps) {
  return <>{renderSegments(text, "rich")}</>;
}
