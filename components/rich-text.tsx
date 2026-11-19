/**
 * RichText: renders a content Paragraph (text plus typed links) without dangerouslySetInnerHTML.
 * Internal links use next/link (base path added automatically); mailto and external links use <a>.
 */

import Link from "next/link";
import { Fragment } from "react";
import type { Inline, Paragraph } from "@/content/types";
import { cn } from "@/lib/utils";

const linkClass = "underline decoration-primary/40 underline-offset-4 hover:decoration-primary";

function InlinePiece({ piece }: { piece: Inline }) {
  if (typeof piece === "string") return <>{piece}</>;
  if (piece.href.startsWith("/")) {
    return (
      <Link href={piece.href} className={linkClass}>
        {piece.text}
      </Link>
    );
  }
  const external = /^https?:/.test(piece.href);
  return (
    <a
      href={piece.href}
      className={cn(linkClass, "break-words")}
      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
    >
      {piece.text}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export function RichText({ value }: { value: Paragraph }) {
  const pieces = typeof value === "string" ? [value] : value;
  return (
    <>
      {pieces.map((piece, i) => (
        <Fragment key={i}>
          <InlinePiece piece={piece} />
        </Fragment>
      ))}
    </>
  );
}
