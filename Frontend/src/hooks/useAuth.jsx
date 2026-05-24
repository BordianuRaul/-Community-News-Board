import { createContext, useContext, useMemo, useState } from 'react'
import { apiClient } from '../api/client'

const STORAGE_KEY = 'community-news-user'

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeStoredUser = (user) => {
  if (typeof window === 'undefined') {
    return
  }

  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

const normalizeUser = (data) => ({
  userId: data.userId,
  username: data.username,
  createdAt: data.createdAt,
})

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [authBusy, setAuthBusy] = useState(false)

  const login = async (payload) => {
    setAuthBusy(true)
    try {
      const data = await apiClient.login(payload)
      const nextUser = normalizeUser(data)
      setUser(nextUser)
      writeStoredUser(nextUser)
      return data
    } finally {
      setAuthBusy(false)
    }
  }

  const register = async (payload) => {
    setAuthBusy(true)
    try {
      const data = await apiClient.register(payload)
      const nextUser = normalizeUser(data)
      setUser(nextUser)
      writeStoredUser(nextUser)
      return data
    } finally {
      setAuthBusy(false)
    }
  }

  const logout = () => {
    setUser(null)
    writeStoredUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      authBusy,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [authBusy, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
