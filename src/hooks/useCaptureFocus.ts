import { useEffect, RefObject } from "react";

/**
 * Focuses the capture input when the popup opens so the user can type immediately.
 * Uses a short delay so the popup is painted before focus (Chrome extension popup behavior).
 */
export function useCaptureFocus(
  inputRef: RefObject<HTMLTextAreaElement | null>
): void {
  useEffect(() => {
    if (!inputRef.current) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [inputRef]);
}
