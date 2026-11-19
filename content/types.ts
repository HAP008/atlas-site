/**
 * content/types.ts: shapes for site copy kept as data.
 * A paragraph is plain text, or a list of text pieces and links.
 * Links render through React (never as raw HTML), so copy can't inject markup.
 */

export type InlineLink = { text: string; href: string };
export type Inline = string | InlineLink;
export type Paragraph = string | Inline[];

/** A block in a legal page: a paragraph, a bullet list, or labelled fields (used for TBC details). */
export type LegalBlock = Paragraph | { list: Paragraph[] } | { fields: { label: string; value: Paragraph }[] };

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  updated: string;
  summary: Paragraph[];
  sections: { id: string; heading: string; blocks: LegalBlock[] }[];
};
