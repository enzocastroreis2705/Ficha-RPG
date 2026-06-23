import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rpg_fichas'

export function useFichas() {
  const [fichas, setFichas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const fichasSalvas = localStorage.getItem(STORAGE_KEY)
    if (fichasSalvas) {
      setFichas(JSON.parse(fichasSalvas))
    }
    setCarregando(false)
  }, [])

  const salvarFichas = (novasFichas) => {
    setFichas(novasFichas)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasFichas))
  }

  const criarFicha = (dados) => {
    const novaFicha = {
      id: Date.now().toString(),
      ...dados,
      dataCriacao: new Date().toLocaleDateString('pt-BR')
    }
    const novasFichas = [...fichas, novaFicha]
    salvarFichas(novasFichas)
    return novaFicha
  }

  const atualizarFicha = (id, dados) => {
    const novasFichas = fichas.map(ficha =>
      ficha.id === id ? { ...ficha, ...dados } : ficha
    )
    salvarFichas(novasFichas)
  }

  const deletarFicha = (id) => {
    const novasFichas = fichas.filter(ficha => ficha.id !== id)
    salvarFichas(novasFichas)
  }

  const obterFicha = (id) => {
    return fichas.find(ficha => ficha.id === id)
  }

  return {
    fichas,
    carregando,
    criarFicha,
    atualizarFicha,
    deletarFicha,
    obterFicha,
    salvarFichas
  }
}
