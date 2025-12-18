# Tour Booking Website

A modern, responsive tour booking website built with React, Vite, and Tailwind CSS.

## Features

- **Tour Listings**: Browse through a curated selection of 10 amazing tours worldwide
- **Advanced Filters**: Filter tours by category, location, price range, duration, and search by keywords
- **Tour Details**: View comprehensive information about each tour including highlights, what's included, available dates, and more
- **Booking System**: Complete booking form with guest information, date selection, and booking confirmation
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth transitions and hover effects

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Mock Data**: Pre-populated with 10 diverse tour options

## Tours Categories

- Adventure (hiking, trekking, extreme activities)
- Cultural (temples, traditions, local experiences)
- Wildlife (safaris, nature viewing)
- Beach & Culture (island hopping, coastal experiences)
- Nature & Cruise (fjords, scenic tours)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5174
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
tour-booking_room-7/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Footer.jsx          # Site footer
│   │   ├── TourCard.jsx        # Tour card component
│   │   └── FilterSection.jsx  # Filter controls
│   ├── pages/
│   │   ├── ToursPage.jsx       # Main tours listing page
│   │   ├── TourDetailPage.jsx  # Individual tour details
│   │   └── BookingPage.jsx     # Booking form and confirmation
│   ├── data/
│   │   └── tours.js            # Mock tour data
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Available Routes

- `/` or `/tours` - Main tours listing page with filters
- `/tours/:id` - Individual tour detail page
- `/booking/:tourId` - Booking form for a specific tour

## Features in Detail

### Filtering System
- **Category Filter**: Adventure, Cultural, Wildlife, Beach & Culture, Nature & Cruise
- **Location Filter**: Filter by country/destination
- **Price Range Filter**: Under $2000, $2000-$3000, $3000-$4000, Over $4000
- **Duration Filter**: 5-7 days, 8-10 days, 11-14 days
- **Search**: Real-time search by tour name, description, or location
- **Clear Filters**: Quick reset button to clear all filters

### Tour Details
Each tour includes:
- High-quality images
- Comprehensive descriptions
- Duration, group size, difficulty level
- Star ratings and review counts
- Tour highlights and inclusions
- Multiple available dates
- Pricing information

### Booking System
- User information form (name, email, phone)
- Date selection from available dates
- Guest count selection (respects max group size)
- Special requests field
- Booking summary with price calculation
- Confirmation page with booking details

## Customization

### Adding New Tours

Edit `src/data/tours.js` to add new tours with the following structure:

```javascript
{
  id: 11,
  title: "Your Tour Name",
  description: "Short description",
  fullDescription: "Detailed description",
  image: "image-url",
  price: 2999,
  duration: 8,
  location: "Country",
  category: "Adventure",
  maxGroupSize: 12,
  rating: 4.8,
  reviews: 100,
  difficulty: "Moderate",
  highlights: ["Highlight 1", "Highlight 2"],
  included: ["Included item 1", "Included item 2"],
  dates: ["2025-06-15", "2025-07-20"]
}
```

### Styling

The project uses Tailwind CSS. To customize:
- Modify `tailwind.config.js` for theme customization
- Edit color schemes in the `theme.extend.colors` section
- Add custom CSS in `src/index.css`

## Future Enhancements

Potential features to add:
- Backend API integration
- User authentication and profiles
- Payment processing integration
- Reviews and ratings system
- Wishlist/favorites functionality
- Email notifications
- Admin panel for tour management
- Image gallery for tours
- Interactive maps
- Social media sharing

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue in the repository.
