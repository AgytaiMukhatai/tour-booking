const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export const api = {
  // Fetch metadata (categories, locations, price ranges, durations)
  async getMetadata() {
    const response = await fetch(`${API_BASE_URL}/api/meta`);
    return handleResponse(response);
  },

  // Fetch all tours with optional filters
  async getTours(filters = {}) {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    if (filters.location && filters.location !== 'All') {
      params.append('location', filters.location);
    }
    if (filters.priceRange && filters.priceRange !== 'All Prices') {
      // Extract min and max from the price range
      const priceRangeMap = {
        'Under $2000': { min: 0, max: 2000 },
        '$2000 - $3000': { min: 2000, max: 3000 },
        '$3000 - $4000': { min: 3000, max: 4000 },
        'Over $4000': { min: 4000, max: 100000 }
      };
      const range = priceRangeMap[filters.priceRange];
      if (range) {
        params.append('minPrice', range.min);
        params.append('maxPrice', range.max);
      }
    }
    if (filters.duration && filters.duration !== 'All Durations') {
      const durationMap = {
        '5-7 days': { min: 5, max: 7 },
        '8-10 days': { min: 8, max: 10 },
        '11-14 days': { min: 11, max: 14 }
      };
      const range = durationMap[filters.duration];
      if (range) {
        params.append('minDuration', range.min);
        params.append('maxDuration', range.max);
      }
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/api/tours?${queryString}` : `${API_BASE_URL}/api/tours`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  // Fetch a single tour by ID
  async getTourById(id) {
    const response = await fetch(`${API_BASE_URL}/api/tours/${id}`);
    return handleResponse(response);
  },

  // Create a new booking
  async createBooking(bookingData) {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  // Fetch all bookings
  async getBookings() {
    const response = await fetch(`${API_BASE_URL}/api/bookings`);
    return handleResponse(response);
  },

  // AI Chat
  async sendChatMessage(message, sessionId) {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: sessionId || 'default',
      }),
    });
    return handleResponse(response);
  },
};
