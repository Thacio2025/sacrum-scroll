# SacrumScroll — O Feed da Tradição Católica

PWA de scroll infinito focado na mística e tradição da Igreja Católica: substitua o conteúdo mundano por ascese espiritual e beleza sacra.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** (cores: Preto Batina `#050505`, Dourado Litúrgico `#d4af37`, Cinza Pedra `#a1a1aa`)
- **Framer Motion** (transições nos cards)
- **Lucide React** (ícones: cruz, chama, livro)
- **Fontes:** Cinzel (títulos), EB Garamond (citações)

## Funcionalidades

- **Scroll vertical infinito** com snap em cards de 100vh
- **Estação de Pausa:** a cada 7 cards, tela fixa de 30s com a frase *"Silêncio. Adore ao Senhor em seu coração."*
- **Modo Noturno Litúrgico:** cores de acento conforme o tempo (Roxo: Advento/Quaresma; Verde: Tempo Comum; Branco: Natal/Páscoa; Vermelho: Paixão)
- **Imagens:** API do MET Museum (arte religiosa) com overlay escuro para legibilidade
- **Conteúdo:** citações da Patrística, Escolástica, Mística e Liturgia (mock local; pronto para APIs externas)

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build e PWA

```bash
npm run build
npm start
```

Para ícones PWA: adicione `public/icon-192.png` e `public/icon-512.png` e inclua no `public/manifest.json` na chave `icons`.

## Deploy no Netlify

### Opção A: Criar e configurar o projeto pelo terminal (CLI)

1. **Login na Netlify** (uma vez):
   ```bash
   netlify login
   ```
   O navegador abrirá para você autorizar.

2. **Criar o novo projeto e vincular à pasta:**
   ```bash
   cd "/Users/thaciosiqueira/Desktop/Instagram Católico"
   npm run netlify:create
   ```
   O site `sacrum-scroll` será criado no team **Imitatio Christi** e a pasta ficará vinculada a ele (sem perguntar o team).

3. **Fazer o deploy (build + produção):**
   ```bash
   npm run netlify:deploy
   ```
   O terminal mostrará a URL do site (ex.: `https://sacrum-scroll.netlify.app`).

   **Se aparecer erro "MissingBlobsEnvironmentError":** o Netlify CLI às vezes falha no upload de Blobs no ambiente local. Soluções:
   - **Recomendado:** use a **Opção B (Git)** abaixo: suba o código no GitHub e deixe o Netlify fazer o build no servidor (não dá esse erro).
   - Ou tente renovar o login: `netlify logout` e depois `netlify login`, e rode `npm run netlify:deploy` de novo.

### Opção B: Pelo painel da Netlify (Git) — mais estável

1. **Subir o código para um repositório** (GitHub/GitLab/Bitbucket), depois:
2. Acesse [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Conecte o repositório; o Netlify detecta Next.js. Build command: `npm run build`. Clique em **Deploy site**.

O arquivo `netlify.toml` na raiz já define Node 20 e o comando de build.

## Estrutura de conteúdo (futuras APIs)

- **Patrística:** Santo Agostinho, São João Crisóstomo
- **Escolástica:** São Tomás de Aquino
- **Mística:** Santa Teresa d'Ávila, São João da Cruz
- **Liturgia:** Missal Romano (leituras/citações do dia)

Imagens: MET Museum API (`/api/art`) com buscas por "Christian", "Madonna", "religious", etc.
