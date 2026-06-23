# CLAUDE.md — Ficha de Personagem RPG

## Visão Geral

Aplicação React + Vite para gerenciar **uma única ficha de personagem RPG** com tema visual baseado no Vergil (DMC). Suporta modo claro/escuro. O desenvolvedor tem background em Laravel/PHP e JavaScript/JSX.

## Stack

- **Frontend:** React + Vite
- **Roteamento:** React Router DOM (rota única `/`)
- **Linguagem:** JavaScript + JSX
- **Estilo:** CSS puro com variáveis CSS para tema (dark/light)
- **Persistência:** `localStorage` (sem backend)

## Estrutura de Pastas

```
src/
├── assets/              # Imagens e recursos estáticos
├── context/
│   └── ThemeContext.jsx # Contexto de dark/light mode
├── hooks/
│   └── useFicha.js      # Hook para ler/salvar ficha no localStorage
├── pages/
│   └── FichaPersonagem.jsx  # Página principal (toggle view/edit)
├── components/
│   ├── VisualizacaoFicha.jsx  # Exibição da ficha (modo leitura)
│   ├── VisualizacaoFicha.css
│   ├── FormularioFicha.jsx    # Formulário de edição
│   ├── FormularioFicha.css
│   ├── ToggleTema.jsx         # Botão dark/light
│   └── ToggleTema.css
├── App.jsx          # Navbar + rota única
├── App.css          # Estilos globais: navbar, botões
├── main.jsx         # BrowserRouter + ThemeProvider
└── index.css        # Reset, variáveis CSS do tema Vergil
```

## Tema Visual (Vergil)

As cores ficam em variáveis CSS no `index.css`, via `data-theme` no `<html>`:

```css
/* Dark (padrão) */
--bg: #03030c
--accent: #0d2159      /* azul escuro */
--accent-light: #3a6fd8

/* Light */
--bg: #eef2ff
--accent-light: #2a52b8
```

O atributo `data-theme="dark"|"light"` é aplicado pelo `ThemeContext` no `document.documentElement`.

## Dados da Ficha (localStorage)

Chave: `rpg_ficha_vergil`

```js
{
  nome: '',
  titulo: '',        // epíteto, ex: "Filho de Sparda"
  classe: '',
  raca: '',
  nivel: 1,
  atributos: {
    forca, destreza, constituicao, inteligencia, sabedoria, carisma
  },
  anotacoes: ''      // texto livre para habilidades, equipamentos etc
}
```

## Como Rodar

```bash
npm install
npm run dev    # http://localhost:5173
npm run build
```

## Padrões do Projeto

- Uma página, duas visões: view mode e edit mode (toggle via estado em `FichaPersonagem.jsx`)
- Cada componente tem seu `.css` com o mesmo nome
- Variáveis CSS globais em `index.css` — nunca usar cores hardcoded nos componentes
- Botões usam as classes `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger` do `App.css`
