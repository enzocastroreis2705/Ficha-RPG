import { Link } from 'react-router-dom'
import { useFichas } from '../hooks/useFichas'
import './Dashboard.css'

function Dashboard() {
  const { fichas, carregando, deletarFicha } = useFichas()

  if (carregando) return <div className="loading">Carregando...</div>

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Minhas Fichas de RPG</h1>
        <Link to="/criar" className="btn btn-primary">
          + Nova Ficha
        </Link>
      </div>

      {fichas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <h2>Nenhuma ficha criada ainda</h2>
          <p>Comece criando sua primeira ficha de personagem</p>
          <Link to="/criar" className="btn btn-primary">
            Criar Primeira Ficha
          </Link>
        </div>
      ) : (
        <div className="fichas-grid">
          {fichas.map(ficha => (
            <div key={ficha.id} className="ficha-card">
              <div className="ficha-card-header">
                <h3>{ficha.nome}</h3>
                <span className="ficha-classe">{ficha.classe}</span>
              </div>

              <div className="ficha-card-info">
                <p><strong>Raça:</strong> {ficha.raca}</p>
                <p><strong>Nível:</strong> {ficha.nivel}</p>
                <p className="ficha-data">Criada em {ficha.dataCriacao}</p>
              </div>

              <div className="ficha-card-actions">
                <Link to={`/ficha/${ficha.id}`} className="btn btn-secondary">
                  Editar
                </Link>
                <Link to={`/visualizar/${ficha.id}`} className="btn btn-secondary">
                  Visualizar
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm(`Deletar "${ficha.nome}"?`)) {
                      deletarFicha(ficha.id)
                    }
                  }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
