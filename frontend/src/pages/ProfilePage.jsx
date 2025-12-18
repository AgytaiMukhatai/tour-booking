import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tours } from '../data/tours'
import RatingModal from '../components/RatingModal'

function ProfilePage() {
  const { user, cancelBooking } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  if (!user) {
    return null
  }

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId)
    }
  }

  const handleRateTour = (tourId) => {
    const tour = tours.find(t => t.id === tourId)
    if (tour) {
      setSelectedTour(tour)
      setShowRatingModal(true)
    }
  }

  const getUserBookings = () => {
    return (user.bookings || []).map(booking => {
      const tour = tours.find(t => t.id === booking.tourId)
      return { ...booking, tour }
    })
  }

  const getUserRatings = () => {
    if (!user.ratings) return []

    return Object.entries(user.ratings).map(([tourId, ratingData]) => {
      const tour = tours.find(t => t.id === parseInt(tourId))
      return {
        tourId: parseInt(tourId),
        tour,
        ...ratingData
      }
    })
  }

  const userBookings = getUserBookings()
  const userRatings = getUserRatings()
  const activeBookings = userBookings.filter(b => b.status === 'confirmed')
  const cancelledBookings = userBookings.filter(b => b.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-primary-100">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-primary-100">{user.email}</p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                My Bookings ({activeBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`${
                  activeTab === 'ratings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                My Ratings ({userRatings.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm`}
              >
                Booking History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {activeBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking your next adventure!</p>
                    <div className="mt-6">
                      <Link
                        to="/tours"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Browse Tours
                      </Link>
                    </div>
                  </div>
                ) : (
                  activeBookings.map(booking => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4 flex-1">
                          <img
                            src={booking.tour?.image}
                            alt={booking.tour?.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.tour?.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {booking.tour?.location}
                            </p>
                            <div className="mt-2 space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Date:</span>{' '}
                                {new Date(booking.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <p>
                                <span className="font-medium">Guests:</span> {booking.guests}
                              </p>
                              <p>
                                <span className="font-medium">Total:</span> ${booking.totalPrice}
                              </p>
                              <p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {booking.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Link
                            to={`/tours/${booking.tourId}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View Tour
                          </Link>
                          <button
                            onClick={() => handleRateTour(booking.tourId)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Rate Tour
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="space-y-4">
                {userRatings.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No ratings yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Share your experience by rating the tours you've taken!</p>
                  </div>
                ) : (
                  userRatings.map(rating => (
                    <div key={rating.tourId} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={rating.tour?.image}
                          alt={rating.tour?.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{rating.tour?.title}</h3>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < rating.rating ? 'text-yellow-400' : 'text-gray-300'
                                } fill-current`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {new Date(rating.date).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.review && (
                            <p className="mt-2 text-sm text-gray-700">{rating.review}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {userBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No booking history</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tour
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guests
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booked On
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userBookings.map(booking => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded object-cover"
                                    src={booking.tour?.image}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.tour?.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(booking.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.guests}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${booking.totalPrice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRatingModal && selectedTour && (
        <RatingModal
          tour={selectedTour}
          onClose={() => {
            setShowRatingModal(false)
            setSelectedTour(null)
          }}
        />
      )}
    </div>
  )
}

export default ProfilePage
