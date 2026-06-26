import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Bem-vindo ao Tecboard</h1>
          <p className="hero-subtitle">
            Explore nossos serviços e descubra como podemos ajudar você
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Começar Agora
            </Link>
            <button className="btn btn-secondary">
              Saiba Mais
            </button>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      <section className="features-section">
        <h2>Por Que Escolher?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Rápido</h3>
            <p>Experiência otimizada e carregamento instantâneo</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguro</h3>
            <p>Seus dados protegidos com os melhores padrões</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Inovador</h3>
            <p>Tecnologia de ponta para melhor experiência</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home