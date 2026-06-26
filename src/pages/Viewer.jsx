import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { aplicarCores } from '../hooks/useFicha'
import { useTema } from '../context/ThemeContext'
import VisualizacaoFicha from '../components/VisualizacaoFicha'
import vergilDark from '../assets/Vergil.png'
import vergilLight from '../assets/Vergil-White.png'
import './Viewer.css'

function TelaHabilidade({ hab, onVoltar }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onVoltar() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onVoltar])

  return (
    <div className="tela-habilidade transicao-entrada">
      <button className="btn btn-ghost hab-voltar" onClick={onVoltar} type="button">
        ← Voltar
      </button>
      <div className="hab-tela-conteudo">
        <div className="hab-tela-cabecalho">
          <div className="ornamento-topo">
            <span className="orn-linha" /><span className="orn-diamante">◈</span><span className="orn-linha" />
          </div>
          <h1 className="hab-tela-nome">{hab.nome}</h1>
          <div className="ornamento-baixo">
            <span className="orn-linha" /><span className="orn-floreio">✦</span>
            <span className="orn-linha-curta" /><span className="orn-floreio">✦</span>
            <span className="orn-linha" />
          </div>
        </div>
        {hab.imagem && (
          <div className="hab-tela-imagem-wrap">
            <img src={hab.imagem} alt={hab.nome} className="hab-tela-imagem" />
          </div>
        )}
        {hab.descricao
          ? <div className="hab-tela-descricao-container"><p className="hab-tela-descricao">{hab.descricao}</p></div>
          : <p className="hab-tela-vazia">Sem descrição.</p>
        }
        {(hab.sub || []).length > 0 && (
          <div className="hab-tela-subs">
            <div className="hab-tela-sub-titulo"><span>Sub-habilidades</span></div>
            {hab.sub.map(sub => (
              <div key={sub.id} className="hab-sub-card">
                <h3 className="hab-sub-nome">↳ {sub.nome}</h3>
                {sub.descricao && <p className="hab-sub-descricao">{sub.descricao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Viewer() {
  const { fichaId } = useParams()
  const { tema } = useTema()
  const [ficha, setFicha] = useState(null)
  const [status, setStatus] = useState('conectando')
  const [habAberta, setHabAberta] = useState(null)
  const wsRef = useRef(null)

  const vergilImg = tema === 'light' ? vergilLight : vergilDark

  const conectar = useCallback(() => {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${proto}//${location.host}/ws/ficha/${fichaId}`)
    wsRef.current = ws

    ws.onopen = () => setStatus('online')

    ws.onmessage = (e) => {
      const dados = JSON.parse(e.data)
      setFicha(dados)
      aplicarCores(dados.cores)
    }

    ws.onclose = (e) => {
      setStatus('offline')
      // Reconecta após 3s se não foi fechamento intencional
      if (e.code !== 1000 && e.code !== 4004) {
        setTimeout(conectar, 3000)
      }
    }

    ws.onerror = () => setStatus('offline')
  }, [fichaId])

  useEffect(() => {
    conectar()
    return () => {
      wsRef.current?.close(1000)
    }
  }, [conectar])

  if (habAberta) {
    return <TelaHabilidade hab={habAberta} onVoltar={() => setHabAberta(null)} />
  }

  return (
    <div className="viewer-wrapper">
      {!ficha ? (
        <div className="viewer-aguardando">
          {status === 'offline' ? 'Ficha não encontrada ou servidor indisponível.' : 'Carregando ficha...'}
        </div>
      ) : (
        <div className="ficha-layout transicao-fade">
          <aside className="ficha-imagem-panel">
            <img src={vergilImg} alt="Vergil" className="ficha-imagem" />
            <div className="ficha-imagem-vinheta" />
          </aside>
          <section className="ficha-conteudo">
            <VisualizacaoFicha ficha={ficha} onAbrirHabilidade={setHabAberta} />
          </section>
        </div>
      )}
    </div>
  )
}
