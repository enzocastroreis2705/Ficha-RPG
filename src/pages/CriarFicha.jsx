import { useNavigate } from 'react-router-dom'
import { useFichas } from '../hooks/useFichas'
import FormularioFicha from '../components/FormularioFicha'
import './CriarFicha.css'

function CriarFicha() {
  const navigate = useNavigate()
  const { criarFicha } = useFichas()

  const handleSubmit = (dados) => {
    criarFicha(dados)
    navigate('/')
  }

  return (
    <div className="criar-ficha-container">
      <h1>Criar Nova Ficha</h1>
      <FormularioFicha onSubmit={handleSubmit} />
    </div>
  )
}

export default CriarFicha
