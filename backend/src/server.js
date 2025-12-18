import express from "express";
import { tours, categories, locations, priceRanges, durations } from "./data/tours.js";
import db from "./db.js";

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 5000;

const selectUserByEmail = db.prepare("SELECT * FROM users WHERE email = ?");
const insertUser = db.prepare(
  "INSERT INTO users (first_name, last_name, email, phone, created_at) VALUES (?, ?, ?, ?, ?)"
);
const updateUser = db.prepare(
  "UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?"
);
const insertBooking = db.prepare(
  `INSERT INTO bookings
    (user_id, tour_id, tour_title, date, guests, special_requests, total_price, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
const selectBookings = db.prepare(
  `SELECT
    b.id,
    b.tour_id AS tourId,
    b.tour_title AS tourTitle,
    b.date,
    b.guests,
    b.special_requests AS specialRequests,
    b.total_price AS totalPrice,
    b.created_at AS createdAt,
    u.id AS userId,
    u.first_name AS firstName,
    u.last_name AS lastName,
    u.email,
    u.phone
  FROM bookings b
  JOIN users u ON u.id = b.user_id
  ORDER BY b.created_at DESC`
);

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/meta", (req, res) => {
  res.json({
    categories,
    locations,
    priceRanges,
    durations
  });
});

app.get("/api/tours", (req, res) => {
  const {
    category,
    location,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    search
  } = req.query;

  const filtered = tours.filter((tour) => {
    if (category && category !== "All" && tour.category !== category) {
      return false;
    }

    if (location && location !== "All" && tour.location !== location) {
      return false;
    }

    if (minPrice && tour.price < Number(minPrice)) {
      return false;
    }

    if (maxPrice && tour.price > Number(maxPrice)) {
      return false;
    }

    if (minDuration && tour.duration < Number(minDuration)) {
      return false;
    }

    if (maxDuration && tour.duration > Number(maxDuration)) {
      return false;
    }

    if (search) {
      const term = String(search).toLowerCase();
      const matchesTitle = tour.title.toLowerCase().includes(term);
      const matchesDescription = tour.description.toLowerCase().includes(term);
      const matchesLocation = tour.location.toLowerCase().includes(term);
      if (!matchesTitle && !matchesDescription && !matchesLocation) {
        return false;
      }
    }

    return true;
  });

  res.json(filtered);
});

app.get("/api/tours/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return res.status(404).json({ message: "Tour not found." });
  }

  return res.json(tour);
});

app.post("/api/bookings", (req, res) => {
  const {
    tourId,
    firstName,
    lastName,
    email,
    phone,
    date,
    guests,
    specialRequests
  } = req.body || {};

  const id = Number.parseInt(tourId, 10);
  const tour = tours.find((item) => item.id === id);

  if (!tour) {
    return res.status(400).json({ message: "Invalid tour." });
  }

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "First name and last name are required." });
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return res.status(400).json({ message: "Valid email is required." });
  }

  if (!phone) {
    return res.status(400).json({ message: "Phone is required." });
  }

  if (!date || !tour.dates.includes(date)) {
    return res.status(400).json({ message: "Select a valid tour date." });
  }

  const guestCount = Number.parseInt(guests, 10);
  if (Number.isNaN(guestCount) || guestCount < 1) {
    return res.status(400).json({ message: "Guests must be at least 1." });
  }

  if (guestCount > tour.maxGroupSize) {
    return res.status(400).json({
      message: `Maximum guests for this tour is ${tour.maxGroupSize}.`
    });
  }

  const createdAt = new Date().toISOString();

  const upsert = db.transaction(() => {
    const existingUser = selectUserByEmail.get(normalizedEmail);
    let userId;

    if (existingUser) {
      userId = existingUser.id;
      updateUser.run(firstName, lastName, phone, userId);
    } else {
      const result = insertUser.run(firstName, lastName, normalizedEmail, phone, createdAt);
      userId = result.lastInsertRowid;
    }

    const bookingResult = insertBooking.run(
      userId,
      tour.id,
      tour.title,
      date,
      guestCount,
      specialRequests || "",
      tour.price * guestCount,
      createdAt
    );

    return {
      id: bookingResult.lastInsertRowid,
      userId,
      tourId: tour.id,
      tourTitle: tour.title,
      date,
      guests: guestCount,
      specialRequests: specialRequests || "",
      totalPrice: tour.price * guestCount,
      createdAt,
      user: {
        id: userId,
        firstName,
        lastName,
        email: normalizedEmail,
        phone
      }
    };
  });

  const booking = upsert();

  return res.status(201).json({ message: "Booking confirmed.", booking });
});

app.get("/api/bookings", (req, res) => {
  res.json(selectBookings.all());
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
