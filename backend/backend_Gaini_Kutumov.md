# Backend work log

- Created `backend/` structure with `src/data` for backend implementation.
- Added `backend/package.json` with Express dependency and start scripts.
- Added backend tour seed data in `backend/src/data/tours.js` based on the frontend mock data.
- Implemented Express API server with tours, metadata, and booking endpoints in `backend/src/server.js`.
- Documented backend usage and endpoints in `backend/README.md`.
- Reviewed frontend data and booking form fields to mirror tour and booking schemas.
- Removed unnecessary inline eslint comments from `backend/src/server.js`.
- Added SQLite dependency `better-sqlite3` in `backend/package.json`.
- Created SQLite initialization in `backend/src/db.js` with users and bookings tables.
- Switched booking storage to SQLite and added user upsert logic in `backend/src/server.js`.
- Noted SQLite database auto-creation in `backend/README.md`.
