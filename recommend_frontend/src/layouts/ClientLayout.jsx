import { Outlet } from 'react-router-dom'
import ClientHeader from '../components/ClientHeader.jsx'
import Footer from '../components/Footer.jsx'
import { useState, useEffect } from 'react'
import api from '../api/api'

function ClientLayout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/users/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          window.location.href = '/'
        })
    } else {
      window.location.href = '/'
    }
  }, [])

  if (!user) return <div className="min-h-screen bg-white"></div>

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <ClientHeader user={user} />
      <main className="flex-1 mt-[73px]">
        <Outlet context={{ user }} />
      </main>
      <Footer />
    </div>
  )
}

export default ClientLayout
