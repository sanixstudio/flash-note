# Flash Notes

Flash Notes is a Chrome extension for **instant note capture** with minimal friction. Capture thoughts in seconds, then organize and edit when you’re ready—right from your browser.

## Features

- **Capture-first flow** — Type in the always-visible capture bar; no “New note” click. Press **Enter** to save and keep typing the next note.
- **Rich-text editing** — Edit any note with bold, italic, lists, blockquotes, and code (TipTap editor).
- **Mark notes complete**, pin to top, or set priority (star).
- **Drag and drop** to reorder notes.
- **Search** to filter notes in real time.
- **History** — Recently deleted notes; restore or delete permanently. Deleted notes are kept for one hour.
- **Keyboard shortcut** — **Alt+Shift+N** (Option+Shift+N on Mac) to open the popup with focus in the capture field.
- **Badge** — Shows the count of incomplete notes.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sanixsutdio/flash-notes.git
   ```

2. Navigate to the project directory:

   ```bash
   cd flash-notes
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** in the top right
   - Click **Load unpacked** and select the `dist` folder

## Usage

### Capturing a note

1. Click the extension icon (or press **Alt+Shift+N** / **Option+Shift+N** on Mac).
2. The capture bar at the top is focused — type your note.
3. Press **Enter** to save; the bar clears and stays focused for the next note.
4. Or click away / close the popup — your current text is saved as one note.

No “New note” or “Save” button needed for the main flow.

### Managing notes

- **Complete** — Use “Mark as Done” (checkbox) on a note.
- **Pin** — Pin icon to keep a note at the top.
- **Priority** — Star icon to mark priority.
- **Edit** — Pencil icon to open the rich-text editor (bold, italic, lists, etc.).
- **Delete** — Trash icon; the note moves to History.
- **Reorder** — Drag the note by the top bar to reorder.

### Searching notes

- Click the search icon in the header, type to filter notes in real time.

### History (deleted notes)

- Open the **History** tab at the bottom.
- Restore a note or delete it permanently.
- Use **Clear All History** to remove all deleted notes (with confirmation).
- Notes are automatically removed from history after one hour.

### Clearing all notes

- Use the eraser icon in the action bar to clear all notes (with confirmation).

## Development

### Project structure

- `src/` — Source
  - `components/` — React components (e.g. CaptureInput, NoteItem, NoteEditor, HistoryTab)
  - `hooks/` — e.g. useNotes, useCaptureFocus
  - `types/` — TypeScript types
  - `utils/` — Sanitization, text, date helpers
- `public/` — Manifest and assets
- `dist/` — Build output (generated)

### Key components

- **App.tsx** — Layout, capture bar, notes list, tabs, shortcuts
- **CaptureInput** — Always-visible capture field (Enter/blur to save)
- **NoteItem** — Single note: view, edit (TipTap), complete, pin, delete
- **NoteEditor** — TipTap rich-text editor for editing a note
- **HistoryTab** — Deleted notes list with restore/permanent delete
- **useNotes** — Note state, storage (Chrome local), add/edit/delete/reorder

### Build

```bash
npm run build
```

Load the `dist` folder in Chrome as an unpacked extension to test.
