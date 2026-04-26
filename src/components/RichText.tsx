import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";

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
  const tooltipId = useId();
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);

  const isVisible = isPinnedOpen || ((isHovered || hasFocusWithin) && !isSuppressed);

  useEffect(() => {
    if (!isPinnedOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsPinnedOpen(false);
        setIsSuppressed(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isPinnedOpen]);

  const toggleTooltip = () => {
    if (isPinnedOpen) {
      setIsPinnedOpen(false);
      setIsSuppressed(true);
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

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsSuppressed(false);
      }}
      onFocusCapture={() => setHasFocusWithin(true)}
      onBlurCapture={onBlurCapture}
    >
      <button
        type="button"
        className="inline-note-trigger"
        onClick={toggleTooltip}
        onKeyDown={onTriggerKeyDown}
        aria-describedby={tooltipId}
        aria-expanded={isPinnedOpen}
      >
        <span className="inline-note-label">
          {renderSegments(label, `${keyPrefix}-label`)}
        </span>
      </button>
      <span id={tooltipId} className="inline-note-bubble" role="tooltip">
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
