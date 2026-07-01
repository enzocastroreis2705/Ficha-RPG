export const CHAVES_ATRIBUTOS = [
  'forca', 'resistencia', 'concentracao', 'agilidade', 'eficiencia', 'reserva',
]

export const LABELS_ATRIBUTOS = {
  forca:        'Força',
  resistencia:  'Resistência',
  concentracao: 'Concentração',
  agilidade:    'Agilidade',
  eficiencia:   'Eficiência',
  reserva:      'Reserva',
}

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

export function calcularAmplificacao(reservaAplicada, atributo, atributos = {}) {
  const refino = Number(atributos.refino) || 0
  const divisor = (100 - refino) / 100
  if (divisor <= 0) return null

  const efFinal = valorComBuff(
    Number(atributos.eficiencia) || 0,
    Number(atributos.buffs?.eficiencia) || 0
  )

  const X = Number(reservaAplicada) * (efFinal / 100)
  const Y = X / divisor
  const Z = Y * 25

  const atribFinal = valorComBuff(
    Number(atributos[atributo]) || 0,
    Number(atributos.buffs?.[atributo]) || 0
  )

  return { X, Y, Z, atribFinal, resultado: atribFinal * (1 + Z / 100) }
}
