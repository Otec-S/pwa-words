# Copilot Instructions for pwa-words

## Project Overview
- **pwa-words** is a React + TypeScript Progressive Web App (PWA) for a word-based game (Крокодил).
- Built with Vite and uses `vite-plugin-pwa` for service worker and manifest integration.
- Main UI logic is in `src/App.tsx`, with reusable components in `src/components/`.
- Game data (cards, groups, words) is in `src/data/cards.json` and types in `src/types/`.

## Key Architecture & Patterns
- **Component Structure:**
  - Main entry: `src/main.tsx` (registers service worker, renders `App`)
  - `App.tsx` manages card navigation, animation, and state.
  - Components: `Card`, `Navigation`, `Timer`, `WordGroup` (see `src/components/`)
- **Data Flow:**
  - Card data loaded from JSON, passed as props to components.
  - State managed via React hooks (`useState`, custom hooks for swipe/keyboard).
- **Custom Hooks:**
  - `useSwipe` and `useKeyboard` in `src/hooks/` handle navigation via gestures and keyboard.
- **Animations:**
  - Card transitions use CSS classes (e.g., `slide-in-right`, `slide-out-left`).
- **PWA Features:**
  - Service worker auto-registers via `virtual:pwa-register`.
  - Manifest and icons configured in `vite.config.ts` and `public/icons/`.

## Developer Workflows
- **Start Dev Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview Build:** `npm run preview`
- **Lint:** `npm run lint`
- **No built-in tests** (as of Dec 2025).

## Conventions & Tips
- **TypeScript:** All logic and components are typed; see `src/types/` for shared types.
- **Card/Word Structure:**
  - Each card: `{ id, groups: [{ words: string[], points: 3|5|7 }] }`
- **Navigation:**
  - Use swipe (mobile) or arrow keys (desktop) to move between cards.
- **Adding Cards:**
  - Update `src/data/cards.json` (keep structure consistent).
- **PWA Updates:**
  - Service worker auto-updates; test offline mode after build.

## Key Files
- `src/App.tsx`, `src/components/`, `src/hooks/`, `src/data/cards.json`, `vite.config.ts`

---
For more details, see code comments and file structure. If unclear, ask for clarification or check the latest conventions in this file.
