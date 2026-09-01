import { createContext, useContext, useState, useEffect, useCallback } from 'react'

import { authService } from '../api/auth.service'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérification automatique au chargement
  const checkAuth = useCallback(() => {
    setLoading(true)
    try {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
        setToken(savedToken)
      } else {
        setUser(null)
        setToken(null)
      }
    } catch (e) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])


  const logout = async () => {
    try {
      if (token) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout error', error)
    } finally {
      setUser(null)
      setToken(null)
      setError(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  const googleLogin = async (credential) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.loginWithGoogle(credential)
      
      setUser(data.user)
      setToken(data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.access_token)
      return data.user
    } catch (err) {
      setError('Erreur de connexion Google')
      throw err
    } finally {
      setLoading(false)
    }
  }


  const toggleFavorite = (serviceId) => {
    setUser((prev) => {
      if (!prev) return prev
      const favorites = prev.favorites || []
      const updatedFavorites = favorites.includes(serviceId)
        ? favorites.filter((id) => id !== serviceId)
        : [...favorites, serviceId]
      const updated = { ...prev, favorites: updatedFavorites }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        logout,
        googleLogin,
        checkAuth,
        toggleFavorite,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
