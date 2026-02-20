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

1. **Coloque o projeto no Git** (se ainda não estiver):
   ```bash
   git init
   git add .
   git commit -m "SacrumScroll"
   git remote add origin <URL-do-seu-repositório>
   git push -u origin main
   ```

2. **Conecte ao Netlify:**
   - Acesse [app.netlify.com](https://app.netlify.com) e faça login.
   - **Add new site** → **Import an existing project**.
   - Conecte GitHub/GitLab/Bitbucket e escolha o repositório do SacrumScroll.
   - O Netlify detecta Next.js sozinho; confira:
     - **Build command:** `npm run build`
     - **Publish directory:** (deixe em branco; o adapter Next.js define)
     - **Base directory:** (vazio)
   - Clique em **Deploy site**.

3. Depois do deploy, o site ficará em `https://<nome-do-site>.netlify.app`. Você pode alterar o nome em **Site settings** → **Domain management**.

O arquivo `netlify.toml` na raiz já define Node 20 e o comando de build.

## Estrutura de conteúdo (futuras APIs)

- **Patrística:** Santo Agostinho, São João Crisóstomo
- **Escolástica:** São Tomás de Aquino
- **Mística:** Santa Teresa d'Ávila, São João da Cruz
- **Liturgia:** Missal Romano (leituras/citações do dia)

Imagens: MET Museum API (`/api/art`) com buscas por "Christian", "Madonna", "religious", etc.
