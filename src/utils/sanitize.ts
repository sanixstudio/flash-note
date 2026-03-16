import DOMPurify from "dompurify";

/**
 * Sanitizes HTML for safe insertion into the DOM (e.g. via dangerouslySetInnerHTML).
 * Removes scripts, event handlers, and other dangerous content to prevent XSS.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
      "span", "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}
