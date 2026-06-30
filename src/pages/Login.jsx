import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EspadasFundo from '../components/EspadasFundo'
import '../styles/auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [dados, setDados] = useState({ email: '', password: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const set = (campo, valor) => setDados(p => ({ ...p, [campo]: valor }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(dados.email, dados.password)
      navigate('/')
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-tela">
      <EspadasFundo />
      <div className="auth-card">
        <div className="auth-ornamento">◈ ✦ ◈</div>
        <h1>Entrar</h1>
        <p className="auth-subtitulo">Acesse sua ficha de personagem</p>
        <div className="auth-divisor">✦</div>

        {erro && <div className="auth-alerta erro">{erro}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-grupo">
            <label>Email</label>
            <input
              type="email" value={dados.email} required
              onChange={e => set('email', e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div className="auth-grupo">
            <label>Senha</label>
            <input
              type="password" value={dados.password} required
              onChange={e => set('password', e.target.value)}
              placeholder="••••••"
            />
          </div>
          <button type="submit" className="auth-btn-submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
