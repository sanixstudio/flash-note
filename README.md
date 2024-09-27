# Flash Notes

Flash Notes is a simple and efficient Chrome extension for quick note-taking and task management. It allows users to create, manage, and organize notes with ease, right from their browser.

## Features

- Create and manage notes quickly
- Mark notes as complete or priority
- Drag and drop to reorder notes
- Search functionality
- History tab for recently deleted notes
- Keyboard shortcut for quick note creation
- Badge counter for incomplete notes

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
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` folder from the project directory

## Usage

### Creating a Note

- Click the extension icon to open the popup
- Use the "+" button or press Alt+Shift+N (Option+Shift+N on Mac) to create a new note
- Type your note and click "Save" or press Enter

### Managing Notes

- Click a note to mark it as complete/incomplete
- Use the star icon to toggle priority
- Use the trash icon to delete a note
- Drag and drop notes to reorder them

### Searching Notes

- Click the search icon in the header to open the search bar
- Type to filter notes in real-time

### Viewing Deleted Notes

- Click the "History" tab at the bottom to view recently deleted notes
- Deleted notes are kept for one hour before being permanently removed

### Clearing Notes

- Use the eraser icon to clear all notes (with confirmation)
- In the History tab, use the "Clear" button to remove all deleted notes

## Development

### Project Structure

- `src/`: Source files
  - `components/`: React components
  - `hooks/`: Custom React hooks
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions
- `public/`: Public assets and manifest file
- `dist/`: Built files (generated after build)

### Key Components

- `App.tsx`: Main application component
- `NoteItem.tsx`: Individual note component
- `HistoryTab.tsx`: Deleted notes history component
- `useNotes.ts`: Custom hook for note management logic

### Building for Production
