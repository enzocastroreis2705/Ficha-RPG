import { useState } from 'react'
import { useFicha } from '../hooks/useFicha'
import VisualizacaoFicha from '../components/VisualizacaoFicha'
import FormularioFicha from '../components/FormularioFicha'
import vergilImg from '../assets/Vergil.png'
import './FichaPersonagem.css'

function FichaPersonagem() {
  const { ficha, carregando, salvarFicha } = useFicha()
  const [editando, setEditando] = useState(false)

  if (carregando) {
    return <div className="carregando">Invocando...</div>
  }

  const handleSalvar = (dados) => {
    salvarFicha(dados)
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="ficha-edicao-container">
        <div className="edicao-topo">
          <h2 className="edicao-titulo">Editar Ficha</h2>
        </div>
        <FormularioFicha
          fichaInicial={ficha}
          onSalvar={handleSalvar}
          onCancelar={() => setEditando(false)}
        />
      </div>
    )
  }

  return (
    <div className="ficha-layout">
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
        <VisualizacaoFicha ficha={ficha} />
      </section>
    </div>
  )
}

export default FichaPersonagem
