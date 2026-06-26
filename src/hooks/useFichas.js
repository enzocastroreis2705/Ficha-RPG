import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useFichas() {
  const [fichas, setFichas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const token = localStorage.getItem('rpg_token')

  useEffect(() => {
    if (!token) {
      // Fallback offline: lê do localStorage
      const salvas = localStorage.getItem('rpg_fichas')
      if (salvas) setFichas(JSON.parse(salvas))
      setCarregando(false)
      return
    }

    api.listarFichas()
      .then(setFichas)
      .catch(e => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [token])

  const criarFicha = async (dados) => {
    if (!token) {
      const nova = { id: Date.now().toString(), ...dados, dataCriacao: new Date().toLocaleDateString('pt-BR') }
      const novas = [...fichas, nova]
      setFichas(novas)
      localStorage.setItem('rpg_fichas', JSON.stringify(novas))
      return nova
    }
    const nova = await api.criarFicha(dados)
    setFichas(prev => [...prev, nova])
    return nova
  }

  const atualizarFicha = async (id, dados) => {
    if (!token) {
      const novas = fichas.map(f => f.id === id ? { ...f, ...dados } : f)
      setFichas(novas)
      localStorage.setItem('rpg_fichas', JSON.stringify(novas))
      return
    }
    const atualizada = await api.atualizarFicha(id, dados)
    setFichas(prev => prev.map(f => f.id === id ? atualizada : f))
  }

  const deletarFicha = async (id) => {
    if (!token) {
      const novas = fichas.filter(f => f.id !== id)
      setFichas(novas)
      localStorage.setItem('rpg_fichas', JSON.stringify(novas))
      return
    }
    await api.deletarFicha(id)
    setFichas(prev => prev.filter(f => f.id !== id))
  }

  const obterFicha = (id) => fichas.find(f => String(f.id) === String(id))

  return { fichas, carregando, erro, criarFicha, atualizarFicha, deletarFicha, obterFicha }
}
