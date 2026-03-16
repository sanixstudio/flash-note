import React, { useRef, useCallback, useLayoutEffect } from "react";

const CAPTURE_PLACEHOLDER = "Capture a thought…";
const MIN_HEIGHT_PX = 44;
const MAX_HEIGHT_PX = 120;

/** Resizes the textarea to fit content between MIN_HEIGHT_PX and MAX_HEIGHT_PX. */
function resizeTextarea(el: HTMLTextAreaElement): void {
  el.style.height = "auto";
  const height = Math.min(MAX_HEIGHT_PX, Math.max(MIN_HEIGHT_PX, el.scrollHeight));
  el.style.height = `${height}px`;
}

export interface CaptureInputProps {
  /** Called when the user commits content (Enter or blur with content). */
  onCapture: (content: string) => void;
  /** Ref for the textarea so parent can focus it (e.g. on popup open or shortcut). */
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

/**
 * Always-visible, minimal capture field for flash note-taking.
 * - Enter: save note, clear field, keep focus for next note.
 * - Blur: save current content if non-empty, then clear.
 * - Escape: clear field (or leave empty).
 */
const CaptureInput: React.FC<CaptureInputProps> = ({
  onCapture,
  inputRef: externalRef,
}) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = externalRef ?? localRef;

  const resizeIfMounted = useCallback(() => {
    if (ref.current) resizeTextarea(ref.current);
  }, [ref]);

  useLayoutEffect(() => {
    resizeIfMounted();
  }, [resizeIfMounted]);

  const commitAndClear = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const value = el.value.trim();
    if (value) {
      onCapture(value);
      el.value = "";
      resizeTextarea(el);
    }
  }, [onCapture, ref]);

  const handleInput = useCallback(() => {
    resizeIfMounted();
  }, [resizeIfMounted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (ref.current) ref.current.value = "";
        ref.current?.blur();
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commitAndClear();
      }
    },
    [commitAndClear, ref]
  );

  const handleBlur = useCallback(() => {
    commitAndClear();
  }, [commitAndClear]);

  return (
    <textarea
      ref={ref as React.RefObject<HTMLTextAreaElement>}
      className="capture-input w-full min-h-[44px] max-h-[120px] py-2.5 px-3 rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] placeholder-gray-500 resize-none border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm overflow-y-auto"
      placeholder={CAPTURE_PLACEHOLDER}
      rows={1}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onInput={handleInput}
      aria-label="Capture a note"
    />
  );
};

export default CaptureInput;
