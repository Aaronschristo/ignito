/**
 * context/AuthContext.jsx
 * Provides: { user, registrations, login, logout, openAuth, closeAuth, showAuth, authMode }
 * Handles token persistence in localStorage.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiLogin,
  apiRegisterUser,
  apiGetRegistrations,
  apiRegisterEvent,
  apiUnregisterEvent,
  apiRegisterCompetition,
  apiUnregisterCompetition,
} from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [registrations, setRegistrations] = useState({ events: [], competitions: [] })
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('ignito_token')
    const storedUser = localStorage.getItem('ignito_user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      apiGetRegistrations()
        .then(setRegistrations)
        .catch(() => {
          // Token expired or invalid — clear session
          localStorage.removeItem('ignito_token')
          localStorage.removeItem('ignito_user')
          setUser(null)
        })
    }
  }, [])

  const openAuth = useCallback((mode = 'login') => {
    setAuthMode(mode)
    setShowAuth(true)
  }, [])

  const closeAuth = useCallback(() => setShowAuth(false), [])

  const login = useCallback(async (credentials) => {
    const { token, user: u } = await apiLogin(credentials)
    localStorage.setItem('ignito_token', token)
    localStorage.setItem('ignito_user', JSON.stringify(u))
    setUser(u)
    const regs = await apiGetRegistrations()
    setRegistrations(regs)
    setShowAuth(false)
  }, [])

  const register = useCallback(async (data) => {
    const { token, user: u } = await apiRegisterUser(data)
    localStorage.setItem('ignito_token', token)
    localStorage.setItem('ignito_user', JSON.stringify(u))
    setUser(u)
    setRegistrations({ events: [], competitions: [] })
    setShowAuth(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ignito_token')
    localStorage.removeItem('ignito_user')
    setUser(null)
    setRegistrations({ events: [], competitions: [] })
  }, [])

  const toggleEventRegistration = useCallback(async (id) => {
    if (!user) { openAuth('login'); return }
    const isRegistered = registrations.events.includes(id)
    const { registrations: updated } = isRegistered
      ? await apiUnregisterEvent(id)
      : await apiRegisterEvent(id)
    setRegistrations(updated)
  }, [user, registrations, openAuth])

  const toggleCompetitionRegistration = useCallback(async (id) => {
    if (!user) { openAuth('login'); return }
    const isRegistered = registrations.competitions.includes(id)
    const { registrations: updated } = isRegistered
      ? await apiUnregisterCompetition(id)
      : await apiRegisterCompetition(id)
    setRegistrations(updated)
  }, [user, registrations, openAuth])

  return (
    <AuthContext.Provider value={{
      user,
      registrations,
      showAuth,
      authMode,
      openAuth,
      closeAuth,
      login,
      register,
      logout,
      toggleEventRegistration,
      toggleCompetitionRegistration,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
