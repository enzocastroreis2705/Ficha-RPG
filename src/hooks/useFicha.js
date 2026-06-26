import { useState, useEffect } from 'react'
import { api } from '../services/api'

const fichaInicial = {
  nome: 'Abismo',
  titulo: '',
  atributos: {
    forca:        1000000,
    resistencia:  1000000,
    concentracao: 1000000,
    agilidade:    1000000,
    eficiencia:   1000000,
    reserva:      1000000,
  },
  anotacoes: '',
  habilidades: [],
  cores: {},
}

function hexParaRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const MAPA_CSS = {
  bg:          '--bg',
  bgCard:      '--bg-card',
  accentLight: '--accent-light',
  border:      '--border',
  text:        '--text',
  textMuted:   '--text-muted',
}

export function aplicarCores(cores = {}) {
  const hexValido = /^#[0-9a-fA-F]{6}$/
  Object.entries(MAPA_CSS).forEach(([key, cssVar]) => {
    const cor = cores?.[key]
    if (cor && hexValido.test(cor)) {
      document.documentElement.style.setProperty(cssVar, cor)
      if (key === 'accentLight') {
        document.documentElement.style.setProperty('--accent-glow', hexParaRgba(cor, 0.2))
      }
    } else {
      document.documentElement.style.removeProperty(cssVar)
      if (key === 'accentLight') {
        document.documentElement.style.removeProperty('--accent-glow')
      }
    }
  })
}

// Persiste o ID da ficha ativa do usuário no localStorage para não perder entre reloads
const FICHA_ID_KEY = 'rpg_ficha_ativa_id'

export function useFicha() {
  const [ficha, setFicha] = useState(fichaInicial)
  const [fichaId, setFichaId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('rpg_token')

    if (!token) {
      // Sem auth: fallback para localStorage (modo offline)
      const salva = localStorage.getItem('rpg_ficha_vergil')
      if (salva) {
        const dados = JSON.parse(salva)
        setFicha({ ...fichaInicial, ...dados })
        aplicarCores(dados.cores)
      }
      setCarregando(false)
      return
    }

    async function carregar() {
      try {
        const fichas = await api.listarFichas()
        if (fichas.length > 0) {
          // Tenta usar a ficha ativa salva, senão pega a primeira
          const idSalvo = localStorage.getItem(FICHA_ID_KEY)
          const ativa = fichas.find(f => String(f.id) === idSalvo) || fichas[0]
          setFichaId(ativa.id)
          setFicha({ ...fichaInicial, ...ativa })
          aplicarCores(ativa.cores)
        }
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  const salvarFicha = async (dados) => {
    const atualizada = { ...ficha, ...dados }
    setFicha(atualizada)
    aplicarCores(atualizada.cores)

    const token = localStorage.getItem('rpg_token')
    if (!token) {
      localStorage.setItem('rpg_ficha_vergil', JSON.stringify(atualizada))
      return
    }

    try {
      if (fichaId) {
        await api.atualizarFicha(fichaId, atualizada)
      } else {
        const criada = await api.criarFicha(atualizada)
        setFichaId(criada.id)
        localStorage.setItem(FICHA_ID_KEY, String(criada.id))
      }
    } catch (e) {
      setErro(e.message)
    }
  }

  return { ficha, fichaId, carregando, erro, salvarFicha }
}
