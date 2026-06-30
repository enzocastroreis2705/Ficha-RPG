import { valorComBuff, calcularReikiTotal } from '../utils/atributos'
import './VisualizacaoFicha.css'

const CATEGORIAS = [
  {
    key: 'fisico',
    label: 'Físico',
    orn: '⚔',
    atributos: [
      { key: 'forca',       label: 'Força' },
      { key: 'resistencia', label: 'Resistência' },
    ]
  },
  {
    key: 'inteligencia',
    label: 'Inteligência',
    orn: '◈',
    atributos: [
      { key: 'concentracao', label: 'Concentração' },
      { key: 'eficiencia',   label: 'Eficiência' },
    ]
  },
  {
    key: 'bencao',
    label: 'Bênção',
    orn: '✦',
    atributos: [
      { key: 'agilidade', label: 'Agilidade' },
      { key: 'reserva',   label: 'Reserva' },
    ]
  },
]

function formatarNumero(n) {
  return (Number(n) || 0).toLocaleString('pt-BR')
}

function DivisorGotico({ texto }) {
  return (
    <div className="secao-titulo">
      <span className="secao-orn">✦</span>
      <span>{texto}</span>
      <span className="secao-orn">✦</span>
    </div>
  )
}

function VisualizacaoFicha({ ficha, onAbrirHabilidade }) {
  const semDados = !ficha.nome
  const habilidades = ficha.habilidades || []

  return (
    <div className="visualizacao-ficha">
      {semDados ? (
        <p className="ficha-vazia-msg">
          Nenhuma ficha configurada. Clique em Editar para começar.
        </p>
      ) : (
        <>
          {/* ── Cabeçalho ── */}
          <div className="ficha-cabecalho">
            <div className="ornamento-topo">
              <span className="orn-linha" />
              <span className="orn-diamante">◈</span>
              <span className="orn-linha" />
            </div>

            <h1 className="ficha-nome">{ficha.nome}</h1>

            {ficha.titulo && (
              <p className="ficha-titulo">❝ {ficha.titulo} ❞</p>
            )}

            <div className="ornamento-baixo">
              <span className="orn-linha" />
              <span className="orn-floreio">✦</span>
              <span className="orn-linha-curta" />
              <span className="orn-floreio">✦</span>
              <span className="orn-linha" />
            </div>

            <div className="reiki-container">
              <span className="reiki-label">Reiki</span>
              <span className="reiki-valor">
                {formatarNumero(calcularReikiTotal(ficha.atributos))}
              </span>
            </div>
          </div>

          {/* ── Atributos ── */}
          <DivisorGotico texto="Atributos" />

          <div className="atributos-categorias">
            {CATEGORIAS.map(cat => (
              <div key={cat.key} className="atrib-categoria">
                <div className="atrib-categoria-header">
                  <span className="atrib-cat-orn">{cat.orn}</span>
                  <span className="atrib-cat-label">{cat.label}</span>
                </div>
                <div className="atrib-cards-grid">
                  {cat.atributos.map(({ key, label }) => {
                    const base = ficha.atributos?.[key] ?? 0
                    const buff = ficha.atributos?.buffs?.[key] ?? 0
                    const final = valorComBuff(base, buff)
                    return (
                      <div key={key} className="atrib-card">
                        <span className="atrib-card-nome">{label}</span>
                        <div className="atrib-card-divisor" />
                        <span className="atrib-card-valor">
                          {formatarNumero(final)}
                        </span>
                        {buff !== 0 && (
                          <span className="atrib-card-buff">
                            {formatarNumero(base)} {buff > 0 ? '+' : ''}{buff}%
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Anotações ── */}
          {ficha.anotacoes && (
            <>
              <DivisorGotico texto="Anotações" />
              <div className="ficha-anotacoes">
                <p>{ficha.anotacoes}</p>
              </div>
            </>
          )}

          {/* ── Habilidades ── */}
          {habilidades.length > 0 && (
            <>
              <DivisorGotico texto="Habilidades" />
              <div className="habilidades-lista">
                {habilidades.map((hab) => (
                  <button
                    key={hab.id}
                    className="habilidade-card"
                    onClick={() => onAbrirHabilidade(hab)}
                    type="button"
                  >
                    <div className="habilidade-header">
                      <span className="habilidade-orn">◈</span>
                      <h3 className="habilidade-nome">{hab.nome}</h3>
                      {(hab.sub || []).length > 0 && (
                        <span className="habilidade-sub-count">
                          {hab.sub.length}
                        </span>
                      )}
                      <span className="habilidade-orn habilidade-orn-expandir">›</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default VisualizacaoFicha
