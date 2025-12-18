// Mock данные о турах (в реальном проекте это будет из БД)
const mockTours = [
  {
    id: 1,
    title: "Adventure in the Alps",
    description: "Experience the breathtaking beauty of the Swiss Alps",
    country: "Switzerland",
    price: 2500,
    duration: 7,
    category: "Adventure",
    available: true
  },
  {
    id: 2,
    title: "Cultural Journey in Japan",
    description: "Discover ancient temples and modern cities",
    country: "Japan",
    price: 3200,
    duration: 10,
    category: "Cultural",
    available: true
  },
  {
    id: 3,
    title: "Safari in Kenya",
    description: "Wildlife adventure in the heart of Africa",
    country: "Kenya",
    price: 2800,
    duration: 8,
    category: "Wildlife",
    available: true
  },
  {
    id: 4,
    title: "Beach Paradise in Maldives",
    description: "Relax on pristine beaches and crystal clear waters",
    country: "Maldives",
    price: 3500,
    duration: 7,
    category: "Beach",
    available: true
  },
  {
    id: 5,
    title: "Northern Lights in Norway",
    description: "Witness the magical aurora borealis",
    country: "Norway",
    price: 2900,
    duration: 6,
    category: "Nature",
    available: true
  }
];

/**
 * Get Tours Handler
 * GET /api/tours
 * Query params: country?, category?, priceMin?, priceMax?
 */
export async function getToursHandler(req, res) {
  try {
    const { country, category, priceMin, priceMax } = req.query;

    let filteredTours = [...mockTours];

    // Фильтрация
    if (country) {
      filteredTours = filteredTours.filter(tour => 
        tour.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (category) {
      filteredTours = filteredTours.filter(tour => 
        tour.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (priceMin) {
      filteredTours = filteredTours.filter(tour => tour.price >= Number(priceMin));
    }

    if (priceMax) {
      filteredTours = filteredTours.filter(tour => tour.price <= Number(priceMax));
    }

    res.json({
      success: true,
      tours: filteredTours,
      total: filteredTours.length
    });

  } catch (error) {
    console.error('Get Tours Error:', error);
    res.status(500).json({
      error: 'Failed to fetch tours',
      message: error.message
    });
  }
}

/**
 * Get tours data (for AI agent)
 */
export async function getToursData() {
  return mockTours;
}

