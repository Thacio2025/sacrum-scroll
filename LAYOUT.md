# Layout do SacrumScroll

Este arquivo explica como a tela está organizada, de cima para baixo.

---

## Ordem dos elementos (de cima para baixo)

```
┌─────────────────────────────────────────┐
│  HEADER (fixo no topo)                  │  ← SacrumScroll, @professor_thacio, site, Direção espiritual
├─────────────────────────────────────────┤
│  LITURGICAL BANNER                      │  ← Uma linha: tempo litúrgico (Advento, Quaresma, etc.)
├─────────────────────────────────────────┤
│  CATEGORY FILTER                        │  ← Chips: Todos | Patrística | Escolástica | Mística | Liturgia | Escritura
├─────────────────────────────────────────┤
│  DAILY QUOTE BAR                        │  ← Uma linha: "Citação do dia: «...» — Autor"
├─────────────────────────────────────────┤
│                                         │
│  FEED (área de scroll)                  │  ← Aqui rola o conteúdo:
│  · Tela de boas-vindas (WelcomeCard)   │     - Primeira tela: boas-vindas
│  · Cards de citação (QuoteCard)         │     - Depois: cards com frases + imagens
│  · Pausas (BufferPause, PauseStation)   │     - A cada 5 cards: pausa curta (coração)
│  · ... infinito                         │     - A cada 7 cards: pausa longa (cruz + sino)
│                                         │
└─────────────────────────────────────────┘

  [MusicPlayer]  ← Barra fixa no canto inferior esquerdo (play, próxima faixa, volume)
  [Passar sozinho]  ← Botão fixo ao lado (ativa rolagem automática)
```

---

## Onde cada coisa está no código

| Elemento            | Arquivo              | O que faz |
|---------------------|----------------------|-----------|
| **Header**          | `components/Header.tsx` | Título, links, tela cheia |
| **LiturgicalBanner**| `components/LiturgicalBanner.tsx` | Mostra o tempo litúrgico |
| **CategoryFilter**  | `components/CategoryFilter.tsx` | Filtra o feed por categoria |
| **DailyQuoteBar**   | `components/DailyQuoteBar.tsx` | Citação do dia |
| **Feed**            | `components/Feed.tsx` | Monta a lista (welcome + cards + pausas) e o scroll |
| **WelcomeCard**     | `components/WelcomeCard.tsx` | Primeira tela de boas-vindas |
| **QuoteCard**       | `components/QuoteCard.tsx` | Cada card de citação com imagem |
| **BufferPause**     | `components/BufferPause.tsx` | Pausa curta (coração, “imagens carregando”) |
| **PauseStation**    | `components/PauseStation.tsx` | Pausa longa (cruz, “Silêncio…”, sino) |
| **MusicPlayer**     | `components/MusicPlayer.tsx` | Música em segundo plano |

---

## Página principal (`app/page.tsx`)

A página só monta a ordem:

1. **LiturgicalTheme** – Ajusta as cores conforme o tempo litúrgico (roxo, verde, etc.).
2. **main** – Container em coluna que ocupa a tela toda.
3. Dentro do **main**:
   - **Header** (fixo)
   - **LiturgicalBanner**
   - **Feed** (que já inclui CategoryFilter, DailyQuoteBar e a área de scroll)
   - **MusicPlayer** (fixo no canto)

O **Feed** é quem coloca, na ordem: filtro de categoria → barra da citação do dia → área de scroll com os cards.

---

## Fontes (layout.tsx)

- **Cinzel** – Títulos gerais.
- **Cinzel Decorative** – Título “SacrumScroll” na boas-vindas.
- **Cormorant Garamond** – Texto do corpo da página.
- **EB Garamond** – Citações em itálico nos cards.

Todas vêm do Google Fonts via `next/font/google` e são carregadas pelo Next.js.
