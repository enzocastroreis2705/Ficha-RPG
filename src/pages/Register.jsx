import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EspadasFundo from '../components/EspadasFundo'
import '../styles/auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [dados, setDados] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [erros, setErros] = useState({})
  const [erroGlobal, setErroGlobal] = useState('')
  const [carregando, setCarregando] = useState(false)

  const set = (campo, valor) => setDados(p => ({ ...p, [campo]: valor }))

  const validate = () => {
    const e = {}
    if (!dados.name.trim()) e.name = 'Nome obrigatório'
    if (!dados.email.trim()) e.email = 'Email obrigatório'
    if (!dados.password) e.password = 'Senha obrigatória'
    else if (dados.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (dados.password !== dados.confirmPassword) e.confirmPassword = 'Senhas não coincidem'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErros(v); return }
    setErros({})
    setErroGlobal('')
    setCarregando(true)
    try {
      await register(dados.name, dados.email, dados.password)
      navigate('/')
    } catch (err) {
      setErroGlobal(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-tela">
      <EspadasFundo />
      <div className="auth-card">
        <div className="auth-ornamento">◈ ✦ ◈</div>
        <h1>Criar Conta</h1>
        <p className="auth-subtitulo">Registre-se para gerenciar sua ficha</p>
        <div className="auth-divisor">✦</div>

        {erroGlobal && <div className="auth-alerta erro">{erroGlobal}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-grupo">
            <label>Nome</label>
            <input
              type="text" value={dados.name} required
              onChange={e => set('name', e.target.value)}
              placeholder="Seu nome"
              className={erros.name ? 'campo-erro' : ''}
            />
            {erros.name && <span className="auth-erro-texto">{erros.name}</span>}
          </div>

          <div className="auth-grupo">
            <label>Email</label>
            <input
              type="email" value={dados.email} required
              onChange={e => set('email', e.target.value)}
              placeholder="seu@email.com"
              className={erros.email ? 'campo-erro' : ''}
            />
            {erros.email && <span className="auth-erro-texto">{erros.email}</span>}
          </div>

          <div className="auth-grupo">
            <label>Senha</label>
            <input
              type="password" value={dados.password} required
              onChange={e => set('password', e.target.value)}
              placeholder="••••••"
              className={erros.password ? 'campo-erro' : ''}
            />
            {erros.password && <span className="auth-erro-texto">{erros.password}</span>}
          </div>

          <div className="auth-grupo">
            <label>Confirmar Senha</label>
            <input
              type="password" value={dados.confirmPassword} required
              onChange={e => set('confirmPassword', e.target.value)}
              placeholder="••••••"
              className={erros.confirmPassword ? 'campo-erro' : ''}
            />
            {erros.confirmPassword && <span className="auth-erro-texto">{erros.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn-submit" disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-rodape">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
