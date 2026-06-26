const BASE_URL = '/api'

function getToken() {
  return localStorage.getItem('rpg_token')
}

async function request(method, path, body) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Erro na requisição')
  return data
}

export const api = {
  // Auth
  register: (body) => request('POST', '/auth/register', body),
  login:    (body) => request('POST', '/auth/login', body),
  me:       ()     => request('GET',  '/auth/me'),

  // Fichas
  listarFichas:   ()           => request('GET',    '/fichas/'),
  criarFicha:     (body)       => request('POST',   '/fichas/', body),
  obterFicha:     (id)         => request('GET',    `/fichas/${id}`),
  atualizarFicha: (id, body)   => request('PUT',    `/fichas/${id}`, body),
  deletarFicha:   (id)         => request('DELETE', `/fichas/${id}`),
}
