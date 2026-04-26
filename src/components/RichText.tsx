import { Fragment } from "react";
import type { ReactNode } from "react";

type RichTextProps = {
  text: string;
};

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
        <span
          key={`${keyPrefix}-tooltip-${matchCount}`}
          className="inline-note"
          tabIndex={0}
          aria-label={`${tooltipLabel}: ${tooltipText}`}
        >
          <span className="inline-note-label">
            {renderSegments(
              tooltipLabel,
              `${keyPrefix}-tooltip-label-${matchCount}`,
            )}
          </span>
          <span className="inline-note-bubble" role="tooltip">
            {renderSegments(
              tooltipText,
              `${keyPrefix}-tooltip-text-${matchCount}`,
            )}
          </span>
        </span>,
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
