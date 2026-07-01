import { useState } from 'react'
import {
  valorComBuff, calcularReikiTotal,
  calcularAmplificacao, CHAVES_ATRIBUTOS, LABELS_ATRIBUTOS,
} from '../utils/atributos'
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

function fmt(n) {
  return (Number(n) || 0).toLocaleString('pt-BR')
}

function fmtD(n, casas = 2) {
  return (Number(n) || 0).toLocaleString('pt-BR', { maximumFractionDigits: casas })
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

const STORAGE_KEY = 'rpg_amplificacoes'

function loadAmplificacoes() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    return data.map(a => ({
      ...a,
      atributos: a.atributos ?? (a.atributo ? [a.atributo] : ['forca']),
    }))
  } catch { return [] }
}

function VisualizacaoFicha({ ficha, onAbrirHabilidade }) {
  const semDados = !ficha.nome
  const habilidades = ficha.habilidades || []
  const atributos = ficha.atributos || {}

  const [amplificacoes, setAmplificacoes] = useState(loadAmplificacoes)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [inputReserva, setInputReserva] = useState('')
  const [inputAtributos, setInputAtributos] = useState(['forca'])

  const salvar = (lista) => {
    setAmplificacoes(lista)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  }

  const reservaComBuff = valorComBuff(
    atributos.reserva ?? 0,
    atributos.buffs?.reserva ?? 0
  )

  const refino = Number(atributos.refino) || 0

  const toggleAtributo = (k) =>
    setInputAtributos(prev =>
      prev.includes(k) ? prev.filter(a => a !== k) : [...prev, k]
    )

  const abrirModal = (amp = null) => {
    if (amp) {
      setEditandoId(amp.id)
      setInputReserva(String(amp.reservaAplicada))
      setInputAtributos(amp.atributos ?? ['forca'])
    } else {
      setEditandoId(null)
      setInputReserva('')
      setInputAtributos(['forca'])
    }
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setEditandoId(null)
  }

  const confirmar = () => {
    const entrada = {
      id: editandoId ?? Date.now(),
      reservaAplicada: Number(inputReserva) || 0,
      atributos: inputAtributos,
    }
    salvar(editandoId
      ? amplificacoes.map(a => a.id === editandoId ? entrada : a)
      : [...amplificacoes, entrada]
    )
    fecharModal()
  }

  // X/Y/Z são iguais para todos os atributos; calcula com o primeiro selecionado
  const previewBase = calcularAmplificacao(
    Number(inputReserva) || 0,
    inputAtributos[0] ?? 'forca',
    atributos
  )
  const mostrarPreview = inputReserva !== '' && inputAtributos.length > 0

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
                {fmt(calcularReikiTotal(ficha.atributos))}
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
                    const base = atributos[key] ?? 0
                    const buff = atributos.buffs?.[key] ?? 0
                    const final = valorComBuff(base, buff)
                    return (
                      <div key={key} className="atrib-card">
                        <span className="atrib-card-nome">{label}</span>
                        <div className="atrib-card-divisor" />
                        <span className="atrib-card-valor">{fmt(final)}</span>
                        {buff !== 0 && (
                          <span className="atrib-card-buff">
                            {fmt(base)} {buff > 0 ? '+' : ''}{buff}%
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Refino + Amplificação ── */}
          <div className="refino-ampli-row">
            <div className="refino-display">
              <span className="refino-display-label">Refino</span>
              <span className="refino-display-valor">{refino}</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-ampli"
              onClick={() => abrirModal()}
            >
              ✦ Amplificação
            </button>
          </div>

          {/* ── Janelas de Amplificação ── */}
          {amplificacoes.length > 0 && (
            <div className="ampli-lista">
              {amplificacoes.map(amp => {
                const base = calcularAmplificacao(amp.reservaAplicada, amp.atributos[0] ?? 'forca', atributos)
                return (
                  <div key={amp.id} className="ampli-card">
                    <div className="ampli-card-topo">
                      <span className="ampli-card-titulo">⬡ Amplificação</span>
                      <div className="ampli-card-acoes">
                        <button
                          type="button"
                          className="ampli-btn-acao"
                          onClick={() => abrirModal(amp)}
                          title="Editar"
                        >✎</button>
                        <button
                          type="button"
                          className="ampli-btn-acao"
                          onClick={() => salvar(amplificacoes.filter(a => a.id !== amp.id))}
                          title="Fechar"
                        >✕</button>
                      </div>
                    </div>
                    {base ? (
                      <>
                        <div className="ampli-atribs-lista">
                          {amp.atributos.map(k => {
                            const c = calcularAmplificacao(amp.reservaAplicada, k, atributos)
                            return c ? (
                              <div key={k} className="ampli-atrib-linha">
                                <span className="ampli-atrib-nome">{LABELS_ATRIBUTOS[k]}</span>
                                <span className="ampli-atrib-valor">{fmtD(c.resultado)}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                        <span className="ampli-detalhe">
                          Reserva usada: {fmt(amp.reservaAplicada)} · +{base.Z.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <span className="ampli-detalhe">Refino inválido (≥ 100)</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Modal de Amplificação ── */}
          {modalAberto && (
            <div className="ampli-overlay" onClick={fecharModal}>
              <div className="ampli-modal" onClick={e => e.stopPropagation()}>
                <h3 className="ampli-modal-titulo">✦ Amplificação</h3>

                <div className="ampli-form-group">
                  <label>
                    Reserva a aplicar
                    <span className="ampli-hint">máx {fmtD(reservaComBuff, 0)}</span>
                  </label>
                  <input
                    type="number"
                    value={inputReserva}
                    onChange={e => setInputReserva(e.target.value)}
                    min={0}
                    max={reservaComBuff}
                    placeholder="0"
                    autoFocus
                  />
                </div>

                <div className="ampli-form-group">
                  <label>Atributos a amplificar</label>
                  <div className="ampli-checks">
                    {CHAVES_ATRIBUTOS.filter(k => k !== 'eficiencia' && k !== 'reserva').map(k => {
                      const final = valorComBuff(atributos[k] ?? 0, atributos.buffs?.[k] ?? 0)
                      const checked = inputAtributos.includes(k)
                      return (
                        <label key={k} className={`ampli-check-item${checked ? ' ampli-check-ativo' : ''}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAtributo(k)}
                          />
                          <span className="ampli-check-label">{LABELS_ATRIBUTOS[k]}</span>
                          <span className="ampli-check-val">{fmtD(final, 0)}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {mostrarPreview && previewBase && (
                  <div className="ampli-preview">
                    <div className="ampli-preview-row">
                      <span>X — Reserva × Eficiência%</span>
                      <span>{fmtD(previewBase.X)}</span>
                    </div>
                    <div className="ampli-preview-row">
                      <span>Y — X ÷ {100 - refino}%</span>
                      <span>{fmtD(previewBase.Y)}</span>
                    </div>
                    <div className="ampli-preview-row ampli-z-row">
                      <span>Z — Y × 25</span>
                      <span>+{previewBase.Z.toFixed(2)}%</span>
                    </div>
                    {inputAtributos.map(k => {
                      const c = calcularAmplificacao(Number(inputReserva) || 0, k, atributos)
                      return c ? (
                        <div key={k} className="ampli-preview-resultado">
                          <span>{LABELS_ATRIBUTOS[k]}</span>
                          <span>{fmtD(c.resultado)}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                )}

                {mostrarPreview && !previewBase && (
                  <p className="ampli-erro">Refino ≥ 100 — cálculo impossível.</p>
                )}

                <div className="ampli-modal-acoes">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={confirmar}
                    disabled={previewBase === null || inputAtributos.length === 0}
                  >
                    {editandoId ? 'Atualizar' : 'Amplificar'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={fecharModal}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

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
                        <span className="habilidade-sub-count">{hab.sub.length}</span>
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
