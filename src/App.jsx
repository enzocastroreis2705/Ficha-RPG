import { Routes, Route } from 'react-router-dom'
import FichaPersonagem from './pages/FichaPersonagem'
import ToggleTema from './components/ToggleTema'
import EspadasFundo from './components/EspadasFundo'
import './App.css'

function App() {
  return (
    <>
      <EspadasFundo />
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-yamato">⚔</span>
          <span className="logo-titulo">FICHA DE PERSONAGEM</span>
        </div>
        <div className="navbar-acoes">
          <ToggleTema />
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<FichaPersonagem />} />
        </Routes>
      </main>
    </>
  )
}

export default App
