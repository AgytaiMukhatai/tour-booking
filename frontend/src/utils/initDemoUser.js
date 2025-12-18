export const initDemoUser = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  if (!users.find(u => u.email === 'demo@example.com')) {
    const demoUser = {
      id: 'demo-user',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
      bookings: [],
      ratings: {}
    }

    users.push(demoUser)
    localStorage.setItem('users', JSON.stringify(users))
  }
}
