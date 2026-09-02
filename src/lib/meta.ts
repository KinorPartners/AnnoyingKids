import type { Product } from '@/types';
import type { Article } from '@/lib/blog';

/**
 * Printify descriptions arrive with a flattened size table glued to the front
 * ("SMLXL2XL3XL Width, in 18.25 20.25 ... Size tolerance, in 1.50 ...") and a
 * "Product features / Care instructions" bullet dump glued to the back. Slicing
 * the raw string produced meta descriptions made entirely of measurements, so
 * strip both ends before building the snippet.
 */
const SIZE_TABLE_CELL = /[A-Za-z][A-Za-z ()/-]*,\s*in(?:\s+\d+(?:\.\d+)?)+\s*/g;
const SIZE_TABLE_HEADER = /^(?:\s*\d+(?:\.\d+)?\s*"?\s*(?:×|x)?\s*)+/;
const TRAILING_SECTIONS = /\s*(?:Product features|Care instructions|Size guide|Shipping)\b[\s\S]*$/i;

/** Bing flags descriptions that are too short to give a page context. */
const MIN_LENGTH = 120;
const MAX_LENGTH = 158;

/** Trim to MAX_LENGTH on a word boundary, adding an ellipsis when cut. */
function clamp(text: string): string {
  if (text.length <= MAX_LENGTH) return text;
  const cut = text.slice(0, MAX_LENGTH + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const trimmed = (lastSpace > MIN_LENGTH ? cut.slice(0, lastSpace) : cut.slice(0, MAX_LENGTH))
    .replace(/[\s,;:.\-–—]+$/, '');
  return `${trimmed}…`;
}

/** Longest description we can build without a product-specific summary. */
function productFallback(product: Product): string {
  return `${product.title} from AnnoyingKids — bold, loud print-on-demand merch for kids 6-16, made fresh when you order. Shipped worldwide with 30-day returns.`;
}

export function productSummary(product: Product): string {
  let text = (product.description ?? '').replace(/<[^>]*>/g, ' ');

  // Drop everything up to and including the last size-table cell.
  const re = new RegExp(SIZE_TABLE_CELL.source, 'g');
  let lastCellEnd = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    lastCellEnd = match.index + match[0].length;
  }
  // Only trust the table strip when it sits at the very start of the copy.
  if (lastCellEnd > 0 && lastCellEnd < 400) text = text.slice(lastCellEnd);

  // Drop the size header that precedes the cells (e.g. `2" × 2"3" × 3"`).
  text = text.replace(SIZE_TABLE_HEADER, '');

  return text.replace(TRAILING_SECTIONS, '').replace(/\s+/g, ' ').trim();
}

/** Build a 120-158 character meta description for a product detail page. */
export function productMetaDescription(product: Product): string {
  const summary = productSummary(product);
  return clamp(summary.length < MIN_LENGTH ? productFallback(product) : summary);
}

/** Strip the light markdown used in article bodies down to plain prose. */
function toPlainProse(content: string): string {
  return content
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // [label](/href) -> label
    .replace(/\*\*/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Article excerpts double as blog-card copy, so several are shorter than a good
 * meta description. Top short ones up with the article's opening sentences
 * rather than a boilerplate suffix, which would repeat across pages.
 */
export function articleMetaDescription(article: Article): string {
  let text = article.excerpt.trim();
  if (text.length >= MIN_LENGTH) return clamp(text);

  const sentences = toPlainProse(article.content).match(/[^.!?]+[.!?]+/g) ?? [];
  for (const sentence of sentences) {
    text = `${text} ${sentence.trim()}`.trim();
    if (text.length >= MIN_LENGTH) break;
  }
  return clamp(text);
}
