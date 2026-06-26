import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import EspadasFundo from '../components/EspadasFundo'
import Viewer from './Viewer'
import '../styles/auth.css'

/* ── Formulário de Login ─────────────────────────────────────────── */
function FormLogin({ onSucesso, onIrRegistro, onVoltar }) {
  const { login } = useAuth()
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
      onSucesso()
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <button className="auth-voltar" onClick={onVoltar}>← Voltar</button>
      <div className="auth-ornamento">◈ ✦ ◈</div>
      <h1>Acesso do Dono</h1>
      <p className="auth-subtitulo">Entre para editar sua ficha</p>
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

      <p className="auth-rodape">
        Não tem conta?{' '}
        <button className="link" onClick={onIrRegistro}>Criar conta</button>
      </p>
    </>
  )
}

/* ── Formulário de Registro ──────────────────────────────────────── */
function FormRegistro({ onSucesso, onIrLogin, onVoltar }) {
  const { register } = useAuth()
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
      onSucesso()
    } catch (err) {
      setErroGlobal(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const campo = (key, label, type = 'text', placeholder = '') => (
    <div className="auth-grupo">
      <label>{label}</label>
      <input
        type={type} value={dados[key]} required
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className={erros[key] ? 'campo-erro' : ''}
      />
      {erros[key] && <span className="auth-erro-texto">{erros[key]}</span>}
    </div>
  )

  return (
    <>
      <button className="auth-voltar" onClick={onVoltar}>← Voltar</button>
      <div className="auth-ornamento">◈ ✦ ◈</div>
      <h1>Criar Conta</h1>
      <p className="auth-subtitulo">Registre-se para gerenciar sua ficha</p>
      <div className="auth-divisor">✦</div>

      {erroGlobal && <div className="auth-alerta erro">{erroGlobal}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        {campo('name',            'Nome',             'text',     'Seu nome')}
        {campo('email',           'Email',            'email',    'seu@email.com')}
        {campo('password',        'Senha',            'password', '••••••')}
        {campo('confirmPassword', 'Confirmar Senha',  'password', '••••••')}
        <button type="submit" className="auth-btn-submit" disabled={carregando}>
          {carregando ? 'Criando conta...' : 'Cadastrar'}
        </button>
      </form>

      <p className="auth-rodape">
        Já tem conta?{' '}
        <button className="link" onClick={onIrLogin}>Entrar</button>
      </p>
    </>
  )
}

/* ── Tela de Pergunta ────────────────────────────────────────────── */
function TelaPergunta({ onSim, onNao }) {
  return (
    <>
      <div className="auth-ornamento">⚔ ◈ ⚔</div>
      <h1 className="auth-pergunta-titulo">Você é o Dono<br />da Ficha?</h1>
      <p className="auth-pergunta-desc">
        Donos podem editar a ficha.<br />
        Visitantes visualizam em tempo real.
      </p>
      <div className="auth-pergunta-botoes">
        <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} onClick={onSim}>
          Sim — Sou o dono
        </button>
        <button className="btn btn-ghost" style={{ width: '100%', padding: '0.9rem' }} onClick={onNao}>
          Não — Apenas visualizar
        </button>
      </div>
    </>
  )
}

/* ── Entrada (componente principal) ─────────────────────────────── */
// Estados: 'pergunta' | 'login' | 'registro' | 'viewer'
export default function Entrada() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Se já logado, vai direto para o viewer
  const [modo, setModo] = useState(user ? 'viewer' : 'pergunta')

  if (modo === 'viewer') {
    return (
      <Layout mostrarSair={false}>
        <Viewer />
      </Layout>
    )
  }

  return (
    <div className="auth-tela">
      <EspadasFundo />
      <div className="auth-card" style={{ position: 'relative' }}>
        {modo === 'pergunta' && (
          <TelaPergunta
            onSim={() => setModo('login')}
            onNao={() => setModo('viewer')}
          />
        )}
        {modo === 'login' && (
          <FormLogin
            onSucesso={() => navigate('/')}
            onIrRegistro={() => setModo('registro')}
            onVoltar={() => setModo('pergunta')}
          />
        )}
        {modo === 'registro' && (
          <FormRegistro
            onSucesso={() => navigate('/')}
            onIrLogin={() => setModo('login')}
            onVoltar={() => setModo('pergunta')}
          />
        )}
      </div>
    </div>
  )
}
