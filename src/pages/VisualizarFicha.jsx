import { useParams, Link } from 'react-router-dom'
import { useFichas } from '../hooks/useFichas'
import './VisualizarFicha.css'

function VisualizarFicha() {
  const { id } = useParams()
  const { obterFicha } = useFichas()

  const ficha = obterFicha(id)

  if (!ficha) {
    return <div className="error">Ficha não encontrada</div>
  }

  return (
    <div className="visualizar-ficha-container">
      <div className="visualizar-actions">
        <Link to="/" className="btn btn-secondary">
          ← Voltar
        </Link>
        <Link to={`/ficha/${id}`} className="btn btn-primary">
          Editar
        </Link>
        <Link to={`/compartilhar/${id}`} className="btn btn-secondary">
          Compartilhar
        </Link>
      </div>

      <div className="ficha-view">
        <div className="ficha-header">
          <div>
            <h1>{ficha.nome}</h1>
            <p className="ficha-subtitulo">
              {ficha.raca} • {ficha.classe} • Nível {ficha.nivel}
            </p>
          </div>
          <div className="ficha-meta">
            <small>Criada em {ficha.dataCriacao}</small>
          </div>
        </div>

        {ficha.atributos && (
          <div className="atributos-section">
            <h2>Atributos</h2>
            <div className="atributos-grid">
              <div className="atributo-box">
                <span className="atributo-nome">Força</span>
                <span className="atributo-valor">{ficha.atributos.forca}</span>
              </div>
              <div className="atributo-box">
                <span className="atributo-nome">Destreza</span>
                <span className="atributo-valor">{ficha.atributos.destreza}</span>
              </div>
              <div className="atributo-box">
                <span className="atributo-nome">Constituição</span>
                <span className="atributo-valor">{ficha.atributos.constituicao}</span>
              </div>
              <div className="atributo-box">
                <span className="atributo-nome">Inteligência</span>
                <span className="atributo-valor">{ficha.atributos.inteligencia}</span>
              </div>
              <div className="atributo-box">
                <span className="atributo-nome">Sabedoria</span>
                <span className="atributo-valor">{ficha.atributos.sabedoria}</span>
              </div>
              <div className="atributo-box">
                <span className="atributo-nome">Carisma</span>
                <span className="atributo-valor">{ficha.atributos.carisma}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisualizarFicha
