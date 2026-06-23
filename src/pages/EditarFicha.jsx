import { useParams, useNavigate } from 'react-router-dom'
import { useFichas } from '../hooks/useFichas'
import FormularioFicha from '../components/FormularioFicha'
import './EditarFicha.css'

function EditarFicha() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { obterFicha, atualizarFicha } = useFichas()

  const ficha = obterFicha(id)

  if (!ficha) {
    return <div className="error">Ficha não encontrada</div>
  }

  const handleSubmit = (dados) => {
    atualizarFicha(id, dados)
    navigate(`/visualizar/${id}`)
  }

  return (
    <div className="editar-ficha-container">
      <h1>Editar Ficha: {ficha.nome}</h1>
      <FormularioFicha onSubmit={handleSubmit} fichaInicial={ficha} />
    </div>
  )
}

export default EditarFicha
