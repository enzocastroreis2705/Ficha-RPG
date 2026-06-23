import { useState, useEffect } from 'react'
import { aplicarCores } from '../hooks/useFicha'
import './FormularioFicha.css'

const CORES_CONFIG = [
  { key: 'bg',          label: 'Fundo',           cssVar: '--bg' },
  { key: 'accentLight', label: 'Destaque',         cssVar: '--accent-light' },
  { key: 'bgCard',      label: 'Cards',            cssVar: '--bg-card' },
  { key: 'border',      label: 'Bordas',           cssVar: '--border' },
  { key: 'text',        label: 'Texto',            cssVar: '--text' },
  { key: 'textMuted',   label: 'Texto Secundário', cssVar: '--text-muted' },
]

function getCorAtual(cssVar) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
}

const ATRIBUTOS = [
  { key: 'forca',        label: 'Força' },
  { key: 'resistencia',  label: 'Resistência' },
  { key: 'concentracao', label: 'Concentração' },
  { key: 'agilidade',    label: 'Agilidade' },
  { key: 'eficiencia',   label: 'Eficiência' },
  { key: 'reserva',      label: 'Reserva' },
]

function FormularioFicha({ fichaInicial, onSalvar, onCancelar }) {
  const [ficha, setFicha] = useState({
    nome: '',
    titulo: '',
    atributos: {
      forca: 1000000, resistencia: 1000000, concentracao: 1000000,
      agilidade: 1000000, eficiencia: 1000000, reserva: 1000000,
    },
    anotacoes: '',
    habilidades: [],
    cores: {},
    ...fichaInicial
  })

  useEffect(() => {
    aplicarCores(ficha.cores)
  }, [ficha.cores])

  const set = (campo, valor) =>
    setFicha(prev => ({ ...prev, [campo]: valor }))

  const setAtrib = (atrib, valor) => {
    const num = parseInt(valor.replace(/\D/g, '')) || 0
    setFicha(prev => ({
      ...prev,
      atributos: { ...prev.atributos, [atrib]: num }
    }))
  }

  const reikiTotal = Object.values(ficha.atributos)
    .reduce((s, v) => s + (Number(v) || 0), 0)
    .toLocaleString('pt-BR')

  const setCor = (key, valor) =>
    setFicha(prev => ({ ...prev, cores: { ...(prev.cores || {}), [key]: valor } }))

  const temCoresCustom = Object.values(ficha.cores || {}).some(v => v)

  /* ── Habilidades ── */
  const adicionarHabilidade = () => {
    const nova = { id: Date.now().toString(), nome: '', descricao: '', sub: [] }
    set('habilidades', [...(ficha.habilidades || []), nova])
  }

  const atualizarHabilidade = (id, campo, valor) => {
    set('habilidades', ficha.habilidades.map(h =>
      h.id === id ? { ...h, [campo]: valor } : h
    ))
  }

  const removerHabilidade = (id) => {
    set('habilidades', ficha.habilidades.filter(h => h.id !== id))
  }

  /* ── Sub-habilidades ── */
  const adicionarSub = (habId) => {
    const nova = { id: Date.now().toString(), nome: '', descricao: '' }
    set('habilidades', ficha.habilidades.map(h =>
      h.id === habId ? { ...h, sub: [...(h.sub || []), nova] } : h
    ))
  }

  const atualizarSub = (habId, subId, campo, valor) => {
    set('habilidades', ficha.habilidades.map(h =>
      h.id === habId
        ? { ...h, sub: (h.sub || []).map(s => s.id === subId ? { ...s, [campo]: valor } : s) }
        : h
    ))
  }

  const removerSub = (habId, subId) => {
    set('habilidades', ficha.habilidades.map(h =>
      h.id === habId
        ? { ...h, sub: (h.sub || []).filter(s => s.id !== subId) }
        : h
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ficha.nome.trim()) return
    onSalvar(ficha)
  }

  return (
    <form className="formulario-ficha" onSubmit={handleSubmit}>

      {/* ── Identidade ── */}
      <div className="form-section">
        <h3 className="form-section-titulo">Identidade</h3>

        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            value={ficha.nome}
            onChange={e => set('nome', e.target.value)}
            placeholder="Nome do personagem"
            required
          />
        </div>

        <div className="form-group">
          <label>Título / Epíteto</label>
          <input
            type="text"
            value={ficha.titulo}
            onChange={e => set('titulo', e.target.value)}
            placeholder="Ex: O Eterno"
          />
        </div>
      </div>

      {/* ── Atributos ── */}
      <div className="form-section">
        <h3 className="form-section-titulo">Atributos</h3>
        <div className="atributos-form-lista">
          {ATRIBUTOS.map(({ key, label }) => (
            <div key={key} className="atrib-form-linha">
              <label>{label}</label>
              <input
                type="text"
                inputMode="numeric"
                value={(ficha.atributos[key] || 0).toLocaleString('pt-BR')}
                onChange={e => setAtrib(key, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="reiki-form-display">
          <span className="reiki-form-label">Reiki Total</span>
          <span className="reiki-form-valor">{reikiTotal}</span>
        </div>
      </div>

      {/* ── Anotações ── */}
      <div className="form-section">
        <h3 className="form-section-titulo">Anotações</h3>
        <div className="form-group">
          <textarea
            value={ficha.anotacoes}
            onChange={e => set('anotacoes', e.target.value)}
            placeholder="Histórico, equipamentos..."
            rows={4}
          />
        </div>
      </div>

      {/* ── Habilidades ── */}
      <div className="form-section">
        <div className="form-section-header">
          <h3 className="form-section-titulo" style={{ margin: 0 }}>Habilidades</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={adicionarHabilidade}
          >
            + Adicionar
          </button>
        </div>

        {(ficha.habilidades || []).length === 0 ? (
          <p className="hab-vazia">Nenhuma habilidade adicionada.</p>
        ) : (
          <div className="habilidades-form-lista">
            {ficha.habilidades.map((hab, idx) => (
              <div key={hab.id} className="hab-form-item">
                <div className="hab-form-header">
                  <span className="hab-numero">#{idx + 1}</span>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removerHabilidade(hab.id)}
                  >
                    Remover
                  </button>
                </div>

                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={hab.nome}
                    onChange={e => atualizarHabilidade(hab.id, 'nome', e.target.value)}
                    placeholder="Nome da habilidade"
                  />
                </div>
                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    value={hab.descricao}
                    onChange={e => atualizarHabilidade(hab.id, 'descricao', e.target.value)}
                    placeholder="Descreva a habilidade..."
                    rows={3}
                  />
                </div>

                {/* ── Sub-habilidades ── */}
                <div className="sub-hab-section">
                  <div className="form-section-header" style={{ marginBottom: '0.7rem' }}>
                    <span className="sub-hab-titulo">Sub-habilidades</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => adicionarSub(hab.id)}
                    >
                      + Sub
                    </button>
                  </div>

                  {(hab.sub || []).length === 0 ? (
                    <p className="hab-vazia sub-hab-vazia">Nenhuma sub-habilidade.</p>
                  ) : (
                    <div className="sub-hab-lista">
                      {(hab.sub || []).map((sub, sIdx) => (
                        <div key={sub.id} className="sub-hab-item">
                          <div className="hab-form-header">
                            <span className="hab-numero">↳ #{sIdx + 1}</span>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removerSub(hab.id, sub.id)}
                            >
                              Remover
                            </button>
                          </div>
                          <div className="form-group">
                            <label>Nome</label>
                            <input
                              type="text"
                              value={sub.nome}
                              onChange={e => atualizarSub(hab.id, sub.id, 'nome', e.target.value)}
                              placeholder="Nome da sub-habilidade"
                            />
                          </div>
                          <div className="form-group">
                            <label>Descrição</label>
                            <textarea
                              value={sub.descricao}
                              onChange={e => atualizarSub(hab.id, sub.id, 'descricao', e.target.value)}
                              placeholder="Descreva a sub-habilidade..."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Cores do Tema ── */}
      <div className="form-section">
        <div className="form-section-header" style={{ marginBottom: '0.8rem' }}>
          <h3 className="form-section-titulo" style={{ margin: 0 }}>Cores do Tema</h3>
          {temCoresCustom && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFicha(prev => ({ ...prev, cores: {} }))}
            >
              ↩ Resetar
            </button>
          )}
        </div>

        <div className="cores-lista">
          {CORES_CONFIG.map(({ key, label, cssVar }) => {
            const cor = ficha.cores?.[key] || ''
            return (
              <div key={key} className="cor-linha">
                <label className="cor-picker-wrap" title="Clique para abrir o seletor">
                  <div
                    className="cor-preview"
                    style={{ background: cor || getCorAtual(cssVar) || '#000' }}
                  />
                  <input
                    type="color"
                    className="cor-picker-hidden"
                    value={cor || getCorAtual(cssVar) || '#000000'}
                    onChange={e => setCor(key, e.target.value)}
                  />
                </label>
                <span className="cor-nome">{label}</span>
                <input
                  type="text"
                  className="cor-hex-input"
                  value={cor}
                  onChange={e => setCor(key, e.target.value)}
                  placeholder={getCorAtual(cssVar) || '#------'}
                  maxLength={7}
                  spellCheck={false}
                />
                {cor && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm cor-reset"
                    onClick={() => setCor(key, '')}
                    title="Restaurar padrão"
                  >↩</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Salvar Ficha</button>
        <button type="button" className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

export default FormularioFicha
