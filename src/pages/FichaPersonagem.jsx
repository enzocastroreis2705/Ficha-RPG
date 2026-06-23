import { useState, useEffect } from 'react'
import { useFicha, aplicarCores } from '../hooks/useFicha'
import { useTema } from '../context/ThemeContext'
import VisualizacaoFicha from '../components/VisualizacaoFicha'
import FormularioFicha from '../components/FormularioFicha'
import vergilDark from '../assets/Vergil.png'
import vergilLight from '../assets/Vergil-White.png'
import './FichaPersonagem.css'

function TelaHabilidade({ hab, onVoltar }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onVoltar() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onVoltar])

  return (
    <div className="tela-habilidade transicao-entrada">
      <button className="btn btn-ghost hab-voltar" onClick={onVoltar} type="button">
        ← Voltar
      </button>

      <div className="hab-tela-conteudo">
        <div className="hab-tela-cabecalho">
          <div className="ornamento-topo">
            <span className="orn-linha" />
            <span className="orn-diamante">◈</span>
            <span className="orn-linha" />
          </div>
          <h1 className="hab-tela-nome">{hab.nome}</h1>
          <div className="ornamento-baixo">
            <span className="orn-linha" />
            <span className="orn-floreio">✦</span>
            <span className="orn-linha-curta" />
            <span className="orn-floreio">✦</span>
            <span className="orn-linha" />
          </div>
        </div>

        {hab.imagem && (
          <div className="hab-tela-imagem-wrap">
            <img src={hab.imagem} alt={hab.nome} className="hab-tela-imagem" />
          </div>
        )}

        {hab.descricao ? (
          <div className="hab-tela-descricao-container">
            <p className="hab-tela-descricao">{hab.descricao}</p>
          </div>
        ) : (
          <p className="hab-tela-vazia">Sem descrição.</p>
        )}

        {(hab.sub || []).length > 0 && (
          <div className="hab-tela-subs">
            <div className="hab-tela-sub-titulo">
              <span>Sub-habilidades</span>
            </div>
            {hab.sub.map(sub => (
              <div key={sub.id} className="hab-sub-card">
                <h3 className="hab-sub-nome">↳ {sub.nome}</h3>
                {sub.descricao && (
                  <p className="hab-sub-descricao">{sub.descricao}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FichaPersonagem() {
  const { ficha, carregando, salvarFicha } = useFicha()
  const { tema } = useTema()
  const [editando, setEditando] = useState(false)
  const [habAberta, setHabAberta] = useState(null)

  const vergilImg = tema === 'light' ? vergilLight : vergilDark

  if (carregando) {
    return <div className="carregando">Invocando...</div>
  }

  const handleSalvar = (dados) => {
    salvarFicha(dados)
    setEditando(false)
  }

  const handleCancelar = () => {
    aplicarCores(ficha.cores)
    setEditando(false)
  }

  if (habAberta) {
    return <TelaHabilidade hab={habAberta} onVoltar={() => setHabAberta(null)} />
  }

  if (editando) {
    return (
      <div className="ficha-edicao-container transicao-entrada">
        <button className="btn btn-ghost hab-voltar" onClick={handleCancelar} type="button">
          ← Voltar
        </button>
        <div className="edicao-topo">
          <h2 className="edicao-titulo">Editar Ficha</h2>
        </div>
        <FormularioFicha
          fichaInicial={ficha}
          onSalvar={handleSalvar}
          onCancelar={handleCancelar}
        />
      </div>
    )
  }

  return (
    <div className="ficha-layout transicao-fade">
      {/* Painel esquerdo — imagem */}
      <aside className="ficha-imagem-panel">
        <img src={vergilImg} alt="Vergil" className="ficha-imagem" />
        <div className="ficha-imagem-vinheta" />
      </aside>

      {/* Painel direito — ficha */}
      <section className="ficha-conteudo">
        <div className="ficha-conteudo-topo">
          <button className="btn btn-ghost btn-editar" onClick={() => setEditando(true)}>
            ✦ Editar
          </button>
        </div>
        <VisualizacaoFicha ficha={ficha} onAbrirHabilidade={setHabAberta} />
      </section>
    </div>
  )
}

export default FichaPersonagem
