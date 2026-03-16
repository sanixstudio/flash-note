import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
  "span", "div",
];
const ALLOWED_ATTR = ["href", "target", "rel"];

/**
 * Sanitizes HTML for safe insertion into the DOM (e.g. via dangerouslySetInnerHTML).
 * Removes scripts, event handlers, and other dangerous content to prevent XSS.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/**
 * Returns HTML suitable for TipTap initial content.
 * - If content looks like HTML (contains a tag), sanitizes and returns it.
 * - Otherwise treats as plain text: escapes and wraps in <p>.
 */
export function noteContentToEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "<p></p>";
  if (trimmed.startsWith("<") && trimmed.includes(">")) {
    return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS, ALLOWED_ATTR }) || "<p></p>";
  }
  const escaped = DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [] });
  return `<p>${escaped}</p>`;
}
