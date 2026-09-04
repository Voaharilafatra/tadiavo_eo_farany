import { Outlet } from 'react-router-dom'
import ProviderHeader from '../components/ProviderHead.jsx'
import Footer from '../components/Footer.jsx'
import { useState, useEffect } from 'react'
import api from '../api/api'

function ProviderLayout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/users/me')
        .then(res => {
          // Normalement on vérifierait si res.data.role === 'prestataire'
          setUser(res.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
          window.location.href = '/'
        })
    } else {
      window.location.href = '/'
    }
  }, [])

  if (!user) return <div className="min-h-screen bg-white"></div>

  // On réutilise le ClientHeader pour avoir la même apparence (logo, profil, recherche)
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <ProviderHeader user={{...user, role: 'prestataire'}} />
      <main className="flex-1 mt-[73px]">
        <Outlet context={{ user }} />
      </main>
      <Footer />
    </div>
  )
}

export default ProviderLayout