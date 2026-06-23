import { useState } from 'react'
import './FormularioFicha.css'

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
    classe: '',
    raca: '',
    nivel: 1,
    atributos: {
      forca: 1000000, resistencia: 1000000, concentracao: 1000000,
      agilidade: 1000000, eficiencia: 1000000, reserva: 1000000,
    },
    anotacoes: '',
    ...fichaInicial
  })

  const set = (campo, valor) =>
    setFicha(prev => ({ ...prev, [campo]: valor }))

  const setAtrib = (atrib, valor) => {
    const num = parseInt(valor.replace(/\D/g, '')) || 0
    setFicha(prev => ({
      ...prev,
      atributos: { ...prev.atributos, [atrib]: num }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ficha.nome.trim()) return
    onSalvar(ficha)
  }

  return (
    <form className="formulario-ficha" onSubmit={handleSubmit}>
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

        <div className="form-row">
          <div className="form-group">
            <label>Raça</label>
            <input
              type="text"
              value={ficha.raca}
              onChange={e => set('raca', e.target.value)}
              placeholder="Ex: Humano"
            />
          </div>
          <div className="form-group">
            <label>Classe</label>
            <input
              type="text"
              value={ficha.classe}
              onChange={e => set('classe', e.target.value)}
              placeholder="Ex: Guerreiro"
            />
          </div>
          <div className="form-group form-group-small">
            <label>Nível</label>
            <input
              type="number"
              value={ficha.nivel}
              onChange={e => set('nivel', Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-titulo">Atributos</h3>
        <div className="atributos-form-grid">
          {ATRIBUTOS.map(({ key, label }) => (
            <div key={key} className="atrib-form-group">
              <label>{label}</label>
              <input
                type="text"
                inputMode="numeric"
                value={ficha.atributos[key].toLocaleString('pt-BR')}
                onChange={e => setAtrib(key, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-titulo">Anotações</h3>
        <div className="form-group">
          <textarea
            value={ficha.anotacoes}
            onChange={e => set('anotacoes', e.target.value)}
            placeholder="Habilidades, equipamentos, história..."
            rows={5}
          />
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
