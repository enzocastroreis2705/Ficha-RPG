import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import FichaPersonagem from './pages/FichaPersonagem'
import Login from './pages/Login'
import Register from './pages/Register'
import Entrada from './pages/Entrada'
import './App.css'
import './styles/auth.css'

function RaizRedirect() {
  const { user, carregando } = useAuth()
  const navigate = useNavigate()
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (carregando || user) return
    fetch('/api/fichas/public')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(fichas => {
        if (fichas.length > 0) {
          navigate(`/ver/${fichas[0].id}`, { replace: true })
        }
      })
      .catch(() => setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.'))
  }, [carregando, user, navigate])

  if (carregando) return <div className="carregando">Invocando...</div>
  if (user) return <Layout><FichaPersonagem /></Layout>
  if (erro) return <div className="carregando">{erro}</div>
  return <div className="carregando">Carregando ficha...</div>
}

function RotaPublica({ children }) {
  const { user, carregando } = useAuth()
  if (carregando) return <div className="carregando">Invocando...</div>
  return user ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <Routes>
      <Route path="/login"       element={<RotaPublica><Login /></RotaPublica>} />
      <Route path="/registro"    element={<RotaPublica><Register /></RotaPublica>} />
      <Route path="/ver/:fichaId" element={<Entrada />} />
      <Route path="/"            element={<RaizRedirect />} />
      <Route path="*"            element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
