# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all application code.
- `src/components/` holds reusable UI pieces (e.g., `Header.jsx`, `TourCard.jsx`).
- `src/pages/` contains route-level screens (`ToursPage.jsx`, `TourDetailPage.jsx`, `BookingPage.jsx`).
- `src/data/` stores mock data, currently `tours.js`.
- `src/index.css` includes Tailwind directives and global styles.
- Root config files include `vite.config.js`, `tailwind.config.js`, and `postcss.config.js`.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server (defaults to http://localhost:5174).
- `npm run build` produces a production build in `dist/`.
- `npm run preview` serves the production build locally.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in JS/JSX, keep JSX props on separate lines when they get long.
- Components: PascalCase filenames and component names (e.g., `TourDetailPage.jsx`).
- Hooks: follow React hook rules; name custom hooks `useSomething`.
- Styling: Tailwind utility classes in JSX; keep custom CSS minimal and scoped in `src/index.css`.

## Testing Guidelines
- No automated test setup is included yet.
- If you add tests, note the framework in `package.json` and add a `npm test` script.
- Prefer co-locating tests next to components (e.g., `TourCard.test.jsx`).

## Commit & Pull Request Guidelines
- Git history is minimal; no strict convention is established.
- Use short, imperative commit messages (e.g., "Add booking validation").
- PRs should include a concise description, linked issue (if any), and UI screenshots for visible changes.

## Configuration & Data Updates
- Update tour data in `src/data/tours.js` using the existing object shape.
- Tailwind theme changes go in `tailwind.config.js`; global overrides in `src/index.css`.
