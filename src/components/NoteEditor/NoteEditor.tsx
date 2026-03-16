import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { noteContentToEditorHtml } from "@/utils/sanitize";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaListUl,
  FaListOl,
  FaQuoteRight,
} from "react-icons/fa";

export interface NoteEditorProps {
  /** Initial content (HTML or plain text); will be normalized for the editor. */
  initialContent: string;
  onSave: (html: string) => void;
  onCancel: () => void;
}

/**
 * Rich-text note editor built on TipTap (ProseMirror).
 * Uses StarterKit: paragraphs, bold, italic, strike, code, lists, blockquote, headings.
 * Output is HTML for storage and display.
 */
const NoteEditor: React.FC<NoteEditorProps> = ({
  initialContent,
  onSave,
  onCancel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: noteContentToEditorHtml(initialContent),
    editable: true,
    editorProps: {
      attributes: {
        class:
          "note-editor-prose min-h-[100px] max-h-[280px] overflow-y-auto py-2 px-2 text-[var(--text-color)] text-sm focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !containerRef.current) return;
    const el = containerRef.current.querySelector(".tiptap") ?? containerRef.current;
    (el as HTMLElement)?.focus();
  }, [editor]);

  const handleSave = () => {
    if (!editor) return;
    const html = editor.getHTML();
    onSave(html.trim() === "<p></p>" ? "" : html);
  };

  if (!editor) return null;

  return (
    <div ref={containerRef} className="note-editor">
      <style>
        {`
          .note-editor .tiptap p { margin: 0.25em 0; }
          .note-editor .tiptap p:first-child { margin-top: 0; }
          .note-editor .tiptap ul, .note-editor .tiptap ol { margin: 0.25em 0; padding-left: 1.25rem; }
          .note-editor .tiptap blockquote { border-left: 3px solid var(--border-color); margin: 0.25em 0; padding-left: 0.75rem; color: #9ca3af; }
          .note-editor .tiptap code { background: rgba(255,255,255,0.1); padding: 0.1em 0.3em; border-radius: 0.2em; font-size: 0.9em; }
          .note-editor .tiptap pre { background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 0.25rem; overflow-x: auto; margin: 0.25em 0; }
          .note-editor-toolbar button { padding: 4px 6px; border-radius: 0.2rem; color: #9ca3af; }
          .note-editor-toolbar button:hover { background: rgba(255,255,255,0.1); color: #e5e7eb; }
          .note-editor-toolbar button.is-active { background: rgba(255,255,255,0.15); color: #fff; }
        `}
      </style>
      <div className="note-editor-toolbar flex flex-wrap items-center gap-0.5 mb-1 pb-1 border-b border-[var(--border-color)]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold"
          aria-label="Bold"
        >
          <FaBold size={12} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic"
          aria-label="Italic"
        >
          <FaItalic size={12} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          title="Strikethrough"
          aria-label="Strikethrough"
        >
          <FaStrikethrough size={12} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
          title="Inline code"
          aria-label="Code"
        >
          <FaCode size={12} />
        </button>
        <span className="w-px h-4 bg-[var(--border-color)] mx-0.5" aria-hidden />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          title="Bullet list"
          aria-label="Bullet list"
        >
          <FaListUl size={12} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          title="Numbered list"
          aria-label="Ordered list"
        >
          <FaListOl size={12} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          title="Quote"
          aria-label="Blockquote"
        >
          <FaQuoteRight size={12} />
        </button>
      </div>
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-[var(--border-color)]">
        <button
          type="button"
          className="px-2 py-1 text-xs rounded text-gray-300 hover:text-gray-100 hover:bg-white/10"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-500"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
