import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { aiChatHandler } from './api/ai/chat.js';
import { getToursHandler } from './api/tours.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/tours', getToursHandler);
app.post('/api/ai/chat', aiChatHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tour Booking API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 AI Chat endpoint: http://localhost:${PORT}/api/ai/chat`);
});

