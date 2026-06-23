import './VisualizacaoFicha.css'

const ATRIBUTOS = [
  { key: 'forca',        label: 'Força',        abrev: 'FOR' },
  { key: 'resistencia',  label: 'Resistência',  abrev: 'RES' },
  { key: 'concentracao', label: 'Concentração', abrev: 'CON' },
  { key: 'agilidade',    label: 'Agilidade',    abrev: 'AGI' },
  { key: 'eficiencia',   label: 'Eficiência',   abrev: 'EFI' },
  { key: 'reserva',      label: 'Reserva',      abrev: 'RSV' },
]

function formatarValor(n) {
  const num = Number(n) || 0
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace('.', ',')}B`
  if (num >= 1_000_000)     return `${(num / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (num >= 1_000)         return `${(num / 1_000).toFixed(0)}K`
  return num.toLocaleString('pt-BR')
}

function VisualizacaoFicha({ ficha }) {
  const semDados = !ficha.nome

  return (
    <div className="visualizacao-ficha">

      {semDados ? (
        <p className="ficha-vazia-msg">Nenhuma ficha configurada. Clique em Editar para começar.</p>
      ) : (
        <>
          {/* ── Cabeçalho gótico ── */}
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

            <div className="ficha-tags">
              {ficha.raca   && <span className="tag">{ficha.raca}</span>}
              {ficha.classe && <span className="tag">{ficha.classe}</span>}
              {ficha.nivel  && <span className="tag tag-nivel">Nível {ficha.nivel}</span>}
            </div>
          </div>

          {/* ── Atributos ── */}
          <div className="secao-titulo">
            <span className="secao-orn">✦</span>
            <span>Atributos</span>
            <span className="secao-orn">✦</span>
          </div>

          <div className="atributos-grid">
            {ATRIBUTOS.map(({ key, label, abrev }) => (
              <div key={key} className="atributo-card">
                <span className="atrib-abrev">{abrev}</span>
                <span className="atrib-valor">
                  {formatarValor(ficha.atributos?.[key] ?? 0)}
                </span>
                <span className="atrib-label">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Anotações ── */}
          {ficha.anotacoes && (
            <>
              <div className="secao-titulo">
                <span className="secao-orn">✦</span>
                <span>Anotações</span>
                <span className="secao-orn">✦</span>
              </div>
              <div className="ficha-anotacoes">
                <p>{ficha.anotacoes}</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default VisualizacaoFicha
