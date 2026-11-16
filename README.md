# Secure Privacy — site institucional

Site estático (HTML + CSS + JS puro, sem build). Abra `index.html` no navegador ou publique a pasta em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel).

## Estrutura
- `index.html` — conteúdo e textos
- `assets/css/style.css` — visual (cores em `:root`)
- `assets/js/main.js` — interações (lanterna do hero, console, abas, formulário)
- `assets/favicon.svg`

## Formulário de contato
Crie um endpoint (ex.: Formspree) e cole a URL em `FORM_ENDPOINT`, no topo de `assets/js/main.js`.
Sem isso, o formulário mostra a confirmação, mas não envia os dados.
