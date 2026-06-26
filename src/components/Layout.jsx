import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ToggleTema from './ToggleTema'
import EspadasFundo from './EspadasFundo'

export default function Layout({ children, mostrarSair = true }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <EspadasFundo />
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-yamato">⚔</span>
          <span className="logo-titulo">Ficha de Personagem</span>
        </div>
        <div className="navbar-acoes">
          <ToggleTema />
          {user ? (
            mostrarSair && (
              <button className="btn btn-ghost btn-sm" onClick={logout}>Sair</button>
            )
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </>
  )
}
