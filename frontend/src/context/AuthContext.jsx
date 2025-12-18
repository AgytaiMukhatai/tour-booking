import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      const { password, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' }
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      bookings: [],
      ratings: {}
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    const { password, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addBooking = (booking) => {
    if (!user) return

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)

    if (userIndex !== -1) {
      const bookingWithId = {
        ...booking,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      }

      users[userIndex].bookings = users[userIndex].bookings || []
      users[userIndex].bookings.push(bookingWithId)
      localStorage.setItem('users', JSON.stringify(users))

      const updatedUser = { ...user, bookings: users[userIndex].bookings }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return bookingWithId
    }
  }

  const cancelBooking = (bookingId) => {
    if (!user) return

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)

    if (userIndex !== -1) {
      users[userIndex].bookings = users[userIndex].bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
      localStorage.setItem('users', JSON.stringify(users))

      const updatedUser = { ...user, bookings: users[userIndex].bookings }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const addRating = (tourId, rating, review) => {
    if (!user) return

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)

    if (userIndex !== -1) {
      users[userIndex].ratings = users[userIndex].ratings || {}
      users[userIndex].ratings[tourId] = {
        rating,
        review,
        date: new Date().toISOString()
      }
      localStorage.setItem('users', JSON.stringify(users))

      const updatedUser = { ...user, ratings: users[userIndex].ratings }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    addBooking,
    cancelBooking,
    addRating,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
