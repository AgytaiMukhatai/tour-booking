import { useState, useMemo } from 'react'
import TourCard from '../components/TourCard'
import FilterSection from '../components/FilterSection'
import { tours, priceRanges, durations } from '../data/tours'

function ToursPage() {
  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    priceRange: 'All Prices',
    duration: 'All Durations',
    search: ''
  })

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      if (filters.category !== 'All' && tour.category !== filters.category) {
        return false
      }

      if (filters.location !== 'All' && tour.location !== filters.location) {
        return false
      }

      if (filters.priceRange !== 'All Prices') {
        const range = priceRanges.find(r => r.label === filters.priceRange)
        if (range && (tour.price < range.min || tour.price > range.max)) {
          return false
        }
      }

      if (filters.duration !== 'All Durations') {
        const durRange = durations.find(d => d.label === filters.duration)
        if (durRange && (tour.duration < durRange.min || tour.duration > durRange.max)) {
          return false
        }
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          tour.title.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower) ||
          tour.location.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [filters])

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Tours</h1>
          <p className="text-xl text-primary-100">
            Explore the world with our handpicked selection of unforgettable experiences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FilterSection filters={filters} setFilters={setFilters} />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredTours.length} {filteredTours.length === 1 ? 'Tour' : 'Tours'} Found
          </h2>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Duration: Short to Long</option>
            <option>Rating: Highest</option>
          </select>
        </div>

        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tours found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToursPage
