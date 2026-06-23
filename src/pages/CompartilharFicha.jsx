import { useParams, Link } from 'react-router-dom'
import { useFichas } from '../hooks/useFichas'
import './CompartilharFicha.css'

function CompartilharFicha() {
  const { id } = useParams()
  const { obterFicha } = useFichas()

  const ficha = obterFicha(id)

  if (!ficha) {
    return <div className="error">Ficha não encontrada</div>
  }

  const linkCompartilhavel = `${window.location.origin}/visualizar/${id}`

  const copiarLink = () => {
    navigator.clipboard.writeText(linkCompartilhavel)
    alert('Link copiado para a área de transferência!')
  }

  return (
    <div className="compartilhar-container">
      <Link to={`/visualizar/${id}`} className="btn btn-secondary">
        ← Voltar
      </Link>

      <div className="compartilhar-content">
        <h1>Compartilhar Ficha</h1>
        <p className="compartilhar-descricao">
          Compartilhe o link abaixo para que outros visualizem sua ficha:
        </p>

        <div className="compartilhar-box">
          <div className="ficha-info">
            <h3>{ficha.nome}</h3>
            <p>{ficha.raca} • {ficha.classe}</p>
          </div>

          <div className="link-box">
            <input
              type="text"
              value={linkCompartilhavel}
              readOnly
              className="link-input"
            />
            <button onClick={copiarLink} className="btn btn-primary">
              Copiar Link
            </button>
          </div>

          <div className="compartilhar-info">
            <p>✓ Qualquer um com este link pode visualizar sua ficha</p>
            <p>✓ A ficha é exibida em modo de visualização apenas (sem edição)</p>
            <p>✓ Você pode desativar o compartilhamento voltando aqui</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompartilharFicha
