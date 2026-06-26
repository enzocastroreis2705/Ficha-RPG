import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('rpg_token')
    if (!token) { setCarregando(false); return }

    api.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('rpg_token'))
      .finally(() => setCarregando(false))
  }, [])

  async function login(email, password) {
    const data = await api.login({ email, password })
    localStorage.setItem('rpg_token', data.access_token)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password })
    localStorage.setItem('rpg_token', data.access_token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('rpg_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, carregando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
