import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import FichaPersonagem from './pages/FichaPersonagem'
import Login from './pages/Login'
import Register from './pages/Register'
import Entrada from './pages/Entrada'
import './App.css'

function RotaProtegida({ children }) {
  const { user, carregando } = useAuth()
  if (carregando) return <div className="carregando">Invocando...</div>
  return user ? children : <Navigate to="/login" replace />
}

function RotaPublica({ children }) {
  const { user, carregando } = useAuth()
  if (carregando) return <div className="carregando">Invocando...</div>
  return user ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <Routes>
      {/* Auth — sem navbar */}
      <Route path="/login"    element={<RotaPublica><Login /></RotaPublica>} />
      <Route path="/registro" element={<RotaPublica><Register /></RotaPublica>} />

      {/* Viewer com tela de entrada — gerencia seu próprio layout */}
      <Route path="/ver/:fichaId" element={<Entrada />} />

      {/* Editor — protegido */}
      <Route path="/" element={
        <RotaProtegida>
          <Layout>
            <FichaPersonagem />
          </Layout>
        </RotaProtegida>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
