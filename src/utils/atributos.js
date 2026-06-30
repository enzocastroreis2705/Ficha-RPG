export const CHAVES_ATRIBUTOS = [
  'forca', 'resistencia', 'concentracao', 'agilidade', 'eficiencia', 'reserva',
]

export function valorComBuff(base, buffPercent) {
  const b = Number(base) || 0
  const buff = Number(buffPercent) || 0
  return b + b * (buff / 100)
}

export function calcularReikiTotal(atributos = {}) {
  return CHAVES_ATRIBUTOS.reduce(
    (soma, key) => soma + (Number(atributos[key]) || 0),
    0
  )
}
