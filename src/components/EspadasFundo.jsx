import './EspadasFundo.css'

const ESPADAS = [
  { id: 1,  x:  4,  y: 15, rot: -52, delay: 0,    dur: 7.2, size: 90,  op: 0.55 },
  { id: 2,  x:  8,  y: 55, rot:  35, delay: 1.8,  dur: 6.5, size: 70,  op: 0.40 },
  { id: 3,  x:  2,  y: 80, rot: -30, delay: 3.1,  dur: 8.0, size: 110, op: 0.50 },
  { id: 4,  x: 14,  y: 35, rot:  60, delay: 0.5,  dur: 5.8, size: 60,  op: 0.30 },
  { id: 5,  x: 88,  y: 10, rot: -70, delay: 2.3,  dur: 7.5, size: 100, op: 0.55 },
  { id: 6,  x: 92,  y: 45, rot:  25, delay: 0.9,  dur: 6.8, size: 80,  op: 0.45 },
  { id: 7,  x: 96,  y: 75, rot: -45, delay: 4.0,  dur: 9.0, size: 120, op: 0.50 },
  { id: 8,  x: 82,  y: 62, rot:  55, delay: 1.2,  dur: 6.2, size: 65,  op: 0.35 },
  { id: 9,  x: 20,  y:  5, rot: -15, delay: 2.7,  dur: 7.8, size: 75,  op: 0.30 },
  { id: 10, x: 75,  y:  8, rot:  40, delay: 0.3,  dur: 6.0, size: 85,  op: 0.35 },
  { id: 11, x: 50,  y:  2, rot: -60, delay: 1.5,  dur: 8.5, size: 95,  op: 0.25 },
  { id: 12, x: 40,  y: 92, rot:  20, delay: 3.6,  dur: 7.0, size: 70,  op: 0.30 },
  { id: 13, x: 65,  y: 88, rot: -35, delay: 0.7,  dur: 6.4, size: 80,  op: 0.35 },
  { id: 14, x: 30,  y: 72, rot:  75, delay: 2.0,  dur: 5.5, size: 55,  op: 0.25 },
]

function Espada({ x, y, rot, delay, dur, size, op }) {
  return (
    <div
      className="espada-wrapper"
      style={{
        left: `${x}%`,
        top:  `${y}%`,
        '--rot':    `${rot}deg`,
        '--delay':  `${delay}s`,
        '--dur':    `${dur}s`,
        '--size':   `${size}px`,
        '--op':     op,
      }}
    >
      <div className="espada-blade" />
      <div className="espada-guard" />
      <div className="espada-hilt" />
    </div>
  )
}

function EspadasFundo() {
  return (
    <div className="espadas-fundo" aria-hidden="true">
      {ESPADAS.map(e => <Espada key={e.id} {...e} />)}
    </div>
  )
}

export default EspadasFundo
