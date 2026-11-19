/**
 * content/types.ts: shapes for site copy kept as data.
 * A paragraph is plain text, or a list of text pieces and links.
 * Links render through React (never as raw HTML), so copy can't inject markup.
 */

export type InlineLink = { text: string; href: string };
export type Inline = string | InlineLink;
export type Paragraph = string | Inline[];
