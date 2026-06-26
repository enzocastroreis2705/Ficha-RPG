import { useAuth } from '../context/AuthContext'
import ToggleTema from './ToggleTema'
import EspadasFundo from './EspadasFundo'

export default function Layout({ children, mostrarSair = true }) {
  const { user, logout } = useAuth()

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
          {mostrarSair && user && (
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Sair
            </button>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </>
  )
}
