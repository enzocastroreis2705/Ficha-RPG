import { useState, useEffect } from 'react'
import { aplicarCores } from '../hooks/useFicha'
import { calcularReikiTotal, valorComBuff } from '../utils/atributos'
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
      buffs: {},
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

  const setRefino = (valor) => {
    const num = parseInt(valor.replace(/\D/g, '')) || 0
    setFicha(prev => ({
      ...prev,
      atributos: { ...prev.atributos, refino: num }
    }))
  }

  const setBuff = (atrib, valor) => {
    const num = parseInt(valor.replace(/[^\d-]/g, '')) || 0
    setFicha(prev => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        buffs: { ...(prev.atributos.buffs || {}), [atrib]: num }
      }
    }))
  }

  const reikiTotal = calcularReikiTotal(ficha.atributos).toLocaleString('pt-BR')

  const setCor = (key, valor) =>
    setFicha(prev => ({ ...prev, cores: { ...(prev.cores || {}), [key]: valor } }))

  const temCoresCustom = Object.values(ficha.cores || {}).some(v => v)

  /* ── Habilidades ── */
  const adicionarHabilidade = () => {
    const nova = { id: Date.now().toString(), nome: '', descricao: '', imagem: '', sub: [] }
    set('habilidades', [...(ficha.habilidades || []), nova])
  }

  const handleImagemHab = (habId, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => atualizarHabilidade(habId, 'imagem', e.target.result)
    reader.readAsDataURL(file)
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
    const nova = { id: Date.now().toString(), nome: '', descricao: '', imagem: '' }
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

  const handleImagemSub = (habId, subId, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => atualizarSub(habId, subId, 'imagem', e.target.result)
    reader.readAsDataURL(file)
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
          {ATRIBUTOS.map(({ key, label }) => {
            const base = ficha.atributos[key] || 0
            const buff = ficha.atributos.buffs?.[key] || 0
            const final = valorComBuff(base, buff)
            return (
              <div key={key} className="atrib-form-linha">
                <div className="atrib-form-topo">
                  <label>{label}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={base.toLocaleString('pt-BR')}
                    onChange={e => setAtrib(key, e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="atrib-form-buff-linha">
                  <span className="atrib-buff-label">Buff</span>
                  <div className="atrib-buff-wrap">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="atrib-input-buff"
                      value={buff || ''}
                      onChange={e => setBuff(key, e.target.value)}
                      placeholder="0"
                    />
                    <span className="atrib-buff-simbolo">%</span>
                  </div>
                  <span className="atrib-form-final" title="Base + buff%">
                    = {final.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="refino-form-row">
          <label className="refino-form-label">Refino</label>
          <input
            type="text"
            inputMode="numeric"
            className="refino-form-input"
            value={(ficha.atributos.refino || 0).toLocaleString('pt-BR')}
            onChange={e => setRefino(e.target.value)}
            placeholder="0"
          />
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

                {/* ── Imagem / GIF ── */}
                <div className="form-group">
                  <label>Imagem / GIF</label>
                  {hab.imagem && (
                    <div className="hab-imagem-preview-wrap">
                      <img src={hab.imagem} alt="" className="hab-imagem-preview" />
                    </div>
                  )}
                  <div className="hab-imagem-controles">
                    <input
                      type="text"
                      className="hab-imagem-url"
                      value={hab.imagem || ''}
                      onChange={e => atualizarHabilidade(hab.id, 'imagem', e.target.value)}
                      placeholder="https://... ou use o upload"
                    />
                    <label className="btn btn-ghost btn-sm hab-upload-btn" title="Enviar arquivo">
                      ↑ Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handleImagemHab(hab.id, e.target.files[0])}
                      />
                    </label>
                    {hab.imagem && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => atualizarHabilidade(hab.id, 'imagem', '')}
                        title="Remover imagem"
                      >✕</button>
                    )}
                  </div>
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

                          {/* ── Imagem / GIF da sub-habilidade ── */}
                          <div className="form-group">
                            <label>Imagem / GIF</label>
                            {sub.imagem && (
                              <div className="hab-imagem-preview-wrap">
                                <img src={sub.imagem} alt="" className="hab-imagem-preview" />
                              </div>
                            )}
                            <div className="hab-imagem-controles">
                              <input
                                type="text"
                                className="hab-imagem-url"
                                value={sub.imagem || ''}
                                onChange={e => atualizarSub(hab.id, sub.id, 'imagem', e.target.value)}
                                placeholder="https://... ou use o upload"
                              />
                              <label className="btn btn-ghost btn-sm hab-upload-btn" title="Enviar arquivo">
                                ↑ Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={e => handleImagemSub(hab.id, sub.id, e.target.files[0])}
                                />
                              </label>
                              {sub.imagem && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => atualizarSub(hab.id, sub.id, 'imagem', '')}
                                  title="Remover imagem"
                                >✕</button>
                              )}
                            </div>
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
