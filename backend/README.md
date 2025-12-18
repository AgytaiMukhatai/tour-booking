# Tour Booking Backend

Simple Express backend for the Tour Booking frontend.

## Requirements
- Node.js 18+

## Setup
```bash
npm install
```

## Run
```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Database
SQLite database file `data.sqlite` is created automatically in the `backend/` folder.

## Endpoints
- `GET /health`
- `GET /api/meta`
- `GET /api/tours`
- `GET /api/tours/:id`
- `POST /api/bookings`
- `GET /api/bookings`

## Filtering Tours
`GET /api/tours` supports query params:
- `category`
- `location`
- `minPrice`
- `maxPrice`
- `minDuration`
- `maxDuration`
- `search`

Example:
`/api/tours?category=Adventure&minPrice=2000&maxPrice=4000`
