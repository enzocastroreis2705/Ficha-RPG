import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rpg_ficha_vergil'

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

export function useFicha() {
  const [ficha, setFicha] = useState(fichaInicial)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const salva = localStorage.getItem(STORAGE_KEY)
    if (salva) {
      const dados = JSON.parse(salva)
      setFicha({ ...fichaInicial, ...dados })
      aplicarCores(dados.cores)
    }
    setCarregando(false)
  }, [])

  const salvarFicha = (dados) => {
    const atualizada = { ...ficha, ...dados }
    setFicha(atualizada)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
    aplicarCores(atualizada.cores)
  }

  return { ficha, carregando, salvarFicha }
}
