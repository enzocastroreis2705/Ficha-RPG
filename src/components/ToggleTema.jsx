import { useTema } from '../context/ThemeContext'
import './ToggleTema.css'

function ToggleTema() {
  const { tema, alternarTema } = useTema()

  return (
    <button
      className="toggle-tema"
      onClick={alternarTema}
      title={tema === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      aria-label="Alternar tema"
    >
      {tema === 'dark' ? '☀' : '☽'}
    </button>
  )
}

export default ToggleTema
