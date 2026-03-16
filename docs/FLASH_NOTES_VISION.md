# Flash Notes — Product Vision & UX Strategy

A product vision for transforming Flash Notes into a **true flash-capture note-taking app**: instant idea capture with minimal friction, following industry-standard design and pragmatic engineering.

---

## 1. How Users Actually Use Quick-Capture Note Apps

### Observed behavior

- **Capture is reactive, not planned.** Users open the app when a thought appears (during a call, while browsing, mid-task). The trigger is “I need to write this down *now*.”
- **Notes are short and raw.** Most quick captures are 1–3 lines: URLs, one-liners, reminders, half-formed ideas. Heavy formatting is rare at capture time.
- **Friction kills usage.** Every extra click, modal, or “Save” step increases drop-off. Successful apps minimize steps from *open* → *type* → *done*.
- **Organization is deferred.** Users don’t want to pick a folder or tag during capture. They expect to “dump” and optionally sort later.
- **Availability matters.** The app must feel *always there* (extension icon, shortcut) and open **fast** so the thought isn’t lost.

### What makes quick-capture apps successful

| Principle | Keep / Drafts / Apple Notes |
|-----------|-----------------------------|
| **Capture surface first** | Input is visible immediately; no “New note” click to start. |
| **Type to save** | Enter or blur saves; no explicit “Save” for simple text. |
| **Progressive disclosure** | Simple by default; extras (checklists, images) appear when needed. |
| **Fast open** | Extension popup or app opens in &lt;300ms; no splash or heavy UI. |
| **Persist without asking** | Notes auto-save; no “Save as” or location picker at capture. |

---

## 2. Core Product Philosophy: Capture First, Organize Later

**One-sentence philosophy:**  
*“Get the thought out of the user’s head and into the app in the fewest steps; structure and organization can wait.”*

- **Capture first:** The primary action is *writing*, not configuring. The UI should make the first action “type here” — no mode switch, no “Add note” gate.
- **Organize later:** Pinning, completion, tags, and history are secondary. They stay available but never block or complicate the initial capture.
- **Chrome extension as strength:** Always one click (or shortcut) away; ideal for “capture in context” without leaving the current tab.

Implications for Flash Notes:

- The **default view** should show a single, always-visible capture field at the top.
- **Saving** should be implicit (Enter or blur), with optional explicit “Done” for power users.
- **Lists and formatting** can exist but must not be required for a basic text note.

---

## 3. Ideal UX Flow for Instant Note Capture

### Target flow (v1)

1. **Open** — User clicks extension icon or uses shortcut (e.g. Alt+Shift+N).
2. **Capture** — Popup opens with **focus already in the capture field** (no click). User types.
3. **Done** — User presses **Enter** (or Cmd/Ctrl+Enter) → note is saved and appears in the list; input clears and stays focused for the next note. *Or* user blurs/closes popup → current text is saved as one note if non-empty.
4. **Optional** — User can scroll to see list, tap a note to complete/pin/delete, or search. No obligation.

### Flow comparison

| Step | Current (higher friction) | Target (flash capture) |
|------|---------------------------|-------------------------|
| 1 | Click extension | Click extension or shortcut |
| 2 | Click “+” / New note | *(none)* — capture field already visible |
| 3 | Type in MD editor | Type in single-line or short text field |
| 4 | Click Save or Cancel | Enter to save and continue; blur = save and close |
| 5 | — | New note ready in &lt;1 second |

### Interaction details

- **Single-line capture by default:** One input, placeholder e.g. “Capture a thought…” — like Keep’s “Take a note…”. Multi-line only when user adds line breaks or a “Expand” control.
- **Enter = save and continue:** Saves current text as a note, clears field, keeps focus so the next note can be typed immediately.
- **Blur/close = save and exit:** If there’s content, save as one note; then close or show list. No “Cancel” for the common case.
- **Keyboard-first:** Shortcut opens popup with focus in capture field; Escape can clear or close depending on content.

---

## 4. Minimal but Powerful Feature Set for v1

Prioritize for **speed and clarity**; defer “nice-to-haves” to v1.1+.

### In scope (v1)

| Feature | Rationale |
|--------|------------|
| **Always-visible capture field** | No “New note” click; instant capture. |
| **Enter to save, blur to save** | No Save/Cancel for default path. |
| **Plain list of notes (newest first)** | Matches “dump now, sort later.” |
| **Tap to complete** (checkbox/toggle) | Lightweight task use without turning every note into a task app. |
| **Pin to top** | One level of “important” without folders. |
| **Delete (with soft delete / History)** | Undo safety; keep current 1-hour trash. |
| **Search** | Essential once note count grows; keep current behavior. |
| **Keyboard shortcut** | Alt+Shift+N (or configurable) to open with focus in capture. |
| **Badge (incomplete count)** | Already implemented; keep. |
| **Reorder (drag)** | Optional; can be v1.1 if you want to ship faster. |

### Deferred to v1.1+

- Rich text / markdown in **editor** (keep storing content; simplify capture to plain or minimal markdown).
- Tags or categories.
- Individual “permanently delete” from History (you already plan this).
- “Clear all” refinements (position, spacing).

### Out of scope for v1

- Auth / sync (your v2.0).
- Images or file attachments.
- Sharing or export (can come later).

---

## 5. Clean UI/UX Principles (Distraction-Free)

### Layout and hierarchy

- **One primary action:** The capture input is the visual and interaction focus (top, prominent, no competing primary button).
- **Progressive disclosure:** Search, History, Clear all, and note actions (complete, pin, delete) are available but don’t dominate. Consider icon-only or compact controls.
- **Consistent spacing and alignment:** Fix “Clear All” / “New Note” positions and spacing (as in your notes) so the top bar feels intentional.

### Visual design

- **Calm, minimal chrome:** Neutral background (e.g. current dark theme), clear typography, limited color (e.g. accent for primary action or links only).
- **No unnecessary borders or cards for the capture field:** A single, clean input area; note cards can stay for the list.
- **Feedback over modals:** Prefer toasts or inline hints for “Saved” or “Deleted” instead of blocking dialogs except for destructive “Clear all.”

### Interaction

- **No double confirmation for normal save:** Save on Enter or blur; no “Are you sure?” for saving.
- **Confirmation only for destructive actions:** e.g. “Clear all notes” and “Clear all history.”
- **Click-outside:** For the capture field, blur = save (and optionally collapse to single line). No “Cancel” for the default path.

### Copy and affordances

- Placeholder: e.g. “Capture a thought…” or “Note something…”
- Buttons: Short, action-oriented (“Clear all”, “History”), not generic (“Submit”).
- Empty state: One line, e.g. “Your quick captures will appear here.”

---

## 6. Pragmatic Frontend Architecture

### Goals

- **Performance:** Popup opens and is interactive quickly; minimal JS and layout work on load.
- **Scalability:** Structure so future features (sync, tags) don’t require big rewrites.
- **Maintainability:** Clear boundaries between data, UI, and extension glue.

### Recommended structure

```
src/
├── core/                    # Domain & data
│   ├── notes/               # Note domain
│   │   ├── types.ts
│   │   ├── storage.ts       # Chrome storage / localStorage abstraction
│   │   └── useNotes.ts      # (existing) or move here
│   └── extension/           # Badge, shortcut, optional offscreen if needed
├── components/
│   ├── capture/             # Capture-first UI
│   │   ├── CaptureInput.tsx # Single always-on input (new)
│   │   └── ...
│   ├── notes/               # Note list & items
│   │   ├── NoteItem.tsx
│   │   └── NoteList.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── TabBar.tsx
│   └── ui/                  # Primitives (existing)
├── hooks/
│   ├── useNotes.ts
│   ├── useCaptureFocus.ts   # Focus capture input on popup open
│   └── useKeyboardShortcuts.ts
├── App.tsx
└── main.tsx
```

### Key technical choices

1. **Capture input**
   - **New component:** e.g. `CaptureInput`: single-line by default, expands on focus or newline; no MD editor at capture. Use a `<textarea>` or contenteditable with minimal styling; store plain text or simple markdown. Keep MDEditor only for **editing** an existing note if you want rich text there.
2. **Focus on open**
   - On popup load (or when popup gains focus), focus the capture field so the user can type immediately. Use `useEffect` + `ref` or a small `useCaptureFocus` hook; respect Chrome’s focus behavior in extension popups.
3. **State**
   - Keep `useNotes` as the single source of truth for notes and persistence. Have `CaptureInput` call `addNote` on Enter or on blur (if content non-empty). Avoid duplicating note state.
4. **Performance**
   - Lazy-load or code-split the History tab and heavy components (e.g. MD editor for edit) so the initial view only loads capture + list. Ensure the popup doesn’t run heavy work before first paint.
5. **Extension specifics**
   - Popup size: keep 350×600 or similar; ensure the capture area is above the fold. Use `chrome.storage.local` (and optional sync later) behind a small `storage` abstraction so you can swap or add sync in v2 without touching UI.

### Data flow (simplified)

- **Capture:** `CaptureInput` → `addNote(content)` from `useNotes` → persist via existing `saveNotes`; then clear input and refocus.
- **List:** `notes` from `useNotes` → `NoteList` → `NoteItem`; actions (complete, pin, delete) call existing `useNotes` methods.
- **Search / History:** Unchanged in flow; only ensure they don’t steal focus from capture when hidden.

---

## 7. Summary: Clarity, Simplicity, Speed, Usability

| Dimension | Direction |
|-----------|-----------|
| **Clarity** | One clear purpose: “Capture a thought.” Secondary actions (complete, pin, delete, search) are visible but secondary. |
| **Simplicity** | One main input; Enter/blur to save; no modes or Save/Cancel for the default path. |
| **Speed** | Capture field visible and focused on open; minimal steps and minimal UI before first keystroke. |
| **Usability** | Keyboard-first (shortcut, Enter, Escape); consistent placement of buttons; predictable behavior (blur = save). |

This positions Flash Notes as a **flash-capture** tool first (like Keep, Drafts, Apple Notes quick capture), with a path to keep and refine your existing list, search, and history without blocking the core “capture in seconds” experience.
