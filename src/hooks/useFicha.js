import { useState, useEffect } from 'react'

const STORAGE_KEY = 'rpg_ficha_vergil'

const fichaInicial = {
  nome: 'Abismo',
  titulo: '',
  classe: '',
  raca: '',
  nivel: 1,
  atributos: {
    forca:        1000000,
    resistencia:  1000000,
    concentracao: 1000000,
    agilidade:    1000000,
    eficiencia:   1000000,
    reserva:      1000000,
  },
  anotacoes: ''
}

export function useFicha() {
  const [ficha, setFicha] = useState(fichaInicial)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const salva = localStorage.getItem(STORAGE_KEY)
    if (salva) {
      setFicha({ ...fichaInicial, ...JSON.parse(salva) })
    }
    setCarregando(false)
  }, [])

  const salvarFicha = (dados) => {
    const atualizada = { ...ficha, ...dados }
    setFicha(atualizada)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizada))
  }

  return { ficha, carregando, salvarFicha }
}
