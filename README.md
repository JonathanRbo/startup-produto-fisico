# Lumen — Startup de produto físico

Landing page estilo Kickstarter para um produto fictício: **Lumen**, luminária circadiana que ajusta temperatura e intensidade ao longo do dia.

Implementa o projeto "🚀 Startup de produto físico" do [README principal](../README.md).

## Stack

- **HTML** semântico
- **CSS** — identidade visual mínima (cores, fontes, ilustração da lâmpada)
- **[Squeleton](https://cdn.squeleton.dev)** — grid, utilitários, animações on-scroll (WOW), breakpoints responsivos
- **Vanilla JS** — countdown, formulário, reveal animations
- **localStorage** — persistência de deadline, waitlist e contador
- Fonts: Instrument Serif (títulos) + Inter (corpo)

Sem build, sem bundler, sem dependências npm.

## Features

- **Countdown** de 30 dias até o lançamento, persistente entre reloads
- **Formulário de lista de espera** funcional — valida nome/email, impede duplicidade, simula loading, confirma com feedback inline
- **Contador de social proof** que cresce a cada cadastro e persiste
- **Lâmpada interativa** que cicla entre 4 fases do dia (manhã, dia, tarde, noite) com gradientes suaves
- **Marquee** de especificações em loop contínuo
- **FAQ** em `<details>` nativos (acessível, sem JS)
- **Totalmente responsivo** (breakpoints 560 / 720 / 820 / 900px via Squeleton)
- **Acessível** — respeita `prefers-reduced-motion`, labels semânticos, `aria-live` no feedback do form

## Como rodar

Abra [index.html](index.html) direto no navegador — basta duplo-clique. Não precisa de servidor.

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

## Estrutura

```
startup-produto-fisico/
├── index.html     # Marcação + classes Squeleton
├── styles.css     # Identidade visual (cores, lâmpada, botões, waitlist dark)
├── script.js      # Countdown, form, reveal, ciclo de fases
└── README.md
```

## Decisões técnicas

- **Squeleton em vez de Tailwind** — mesmo estilo utility-first, mas CSS já hospedado em CDN, 25KB gzip. Evitei escrever classes de grid/spacing/typography manualmente.
- **WOW em vez de IntersectionObserver próprio** — `class="wow fadeInUp"` com `data-wow-delay` substitui ~40 linhas de JS.
- **localStorage para persistir o countdown** — se a pessoa recarrega a página, o prazo não "reseta" a 30 dias de novo. O deadline é salvo na primeira visita.
- **Sem `<script>` inline e sem EmailJS** — o form grava em `localStorage` e simula request com `setTimeout`. Em produção, bastaria trocar o `await new Promise(r => setTimeout(r, 900))` por um `fetch` real.

## Próximos passos (se fosse evoluir)

- Trocar localStorage por integração real (Airtable, Firebase, EmailJS, Resend)
- Adicionar sitemap.xml, meta OG/Twitter, favicon
- Testar Lighthouse e otimizar CLS/LCP
- Extrair o formulário para um endpoint serverless
