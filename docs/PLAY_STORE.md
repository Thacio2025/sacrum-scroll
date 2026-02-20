# Publicar o SacrumScroll na Google Play Store

O app é uma **PWA** (Progressive Web App). Para publicar na Play Store usamos **TWA (Trusted Web Activity)**: um app Android mínimo que abre o site `sacrumscroll.com` em tela cheia, sem barra do navegador. O conteúdo continua sendo o site; o app é só a “embalagem”.

## Pré-requisitos

- **Conta Google Play Developer** ([play.google.com/console](https://play.google.com/console)) — taxa única ~US$ 25
- **Node.js** 18+
- **Java JDK 11** (recomendado para Bubblewrap)
- **Android SDK** (Android Studio ou só command-line tools)
- **Site em produção** em HTTPS: [https://sacrumscroll.com](https://sacrumscroll.com)

## 1. Deixar o PWA pronto

- Manifest com **name**, **short_name**, **start_url**, **display**, **theme_color**, **icons** (192 e 512).
- Ícones: rode no projeto:
  ```bash
  npm install
  npm run icons
  ```
- Faça deploy do site (incluindo `manifest.json` e `/icons/`) na Netlify.

## 2. Instalar e configurar o Bubblewrap

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) gera o projeto Android (TWA) e o pacote para a Play Store.

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://sacrumscroll.com/manifest.json
```

Siga o assistente:

- **Package name**: ex. `com.sacrumscroll.app` (único, não mudar depois)
- **App name**: SacrumScroll
- **Launcher name**: SacrumScroll
- **Theme color**, **Background color**: pode usar `#050505` (como no site)
- **Start URL**: `https://sacrumscroll.com/`
- **Signing key**: ele pode gerar um novo; guarde a senha e o caminho do keystore.

Ao terminar, o Bubblewrap cria uma pasta (ex. `sacrumscroll-app`) com o projeto Android.

## 3. Digital Asset Links (verificação do domínio)

O Android exige que o site declare que “confia” no app pelo arquivo `/.well-known/assetlinks.json`.

1. **Obter o fingerprint do app**  
   Na pasta do projeto TWA gerado pelo Bubblewrap:
   ```bash
   bubblewrap fingerprint
   ```
   Anote o **SHA256 certificate fingerprint** (formato `AA:BB:CC:...`).

2. **Configurar no site**  
   No Netlify, em **Site settings → Environment variables**, defina:
   - `TWA_PACKAGE_NAME` = package name do app (ex. `com.sacrumscroll.app`)
   - `TWA_SHA256_FINGERPRINTS` = fingerprint (um ou mais, separados por vírgula)

   O Next.js já está configurado para servir `/.well-known/assetlinks.json` usando essas variáveis (rota que lê `TWA_PACKAGE_NAME` e `TWA_SHA256_FINGERPRINTS`).

3. **Deploy**  
   Faça um novo deploy para a Netlify. Depois confira no navegador:
   - [https://sacrumscroll.com/.well-known/assetlinks.json](https://sacrumscroll.com/.well-known/assetlinks.json)  
   Deve retornar um JSON com `relation` e `target` (package name + fingerprint).

## 4. Gerar o App Bundle (AAB) e testar

Na pasta do projeto TWA:

```bash
bubblewrap build
```

Isso gera um **AAB** (Android App Bundle) assinado, usado para publicar na Play Store. Você também pode gerar um APK para testes locais.

Instale o AAB/APK em um dispositivo ou emulador e confira se o app abre o site em tela cheia e se não aparece a barra do Chrome.

## 5. Publicar na Play Store

1. Acesse [Google Play Console](https://play.google.com/console).
2. Crie um **novo app** (ou use um existente).
3. Preencha:
   - **Store listing**: título, descrição curta/longa, screenshots (mobile 16:9 ou 9:16), ícone 512×512, gráfico de destaque (se quiser).
   - **Política de privacidade**: URL de uma página com a política (ex. no seu site ou GitHub).
   - **Classificação de conteúdo**: questionário.
   - **Público-alvo**: faixa etária, se há anúncios (não), etc.
4. Em **Release → Production** (ou teste interno/fechado), faça upload do **AAB** gerado pelo `bubblewrap build`.
5. Revise e envie para análise.

A análise costuma levar algumas horas ou dias. Depois de aprovado, o app fica disponível na Play Store como “SacrumScroll” e, ao abrir, mostra o feed em [sacrumscroll.com](https://sacrumscroll.com).

## Resumo rápido

| Etapa | O que fazer |
|-------|-----------------------------|
| PWA | `npm run icons`, deploy com manifest e ícones |
| TWA | `bubblewrap init` com `https://sacrumscroll.com/manifest.json` |
| Asset links | `bubblewrap fingerprint` → configurar `TWA_*` no Netlify → deploy |
| Build | `bubblewrap build` na pasta do TWA |
| Loja | Play Console → novo app → store listing + AAB → enviar |

## Referências

- [PWA in Play (Google Codelab)](https://developers.google.com/codelabs/pwa-in-play)
- [Bubblewrap (GitHub)](https://github.com/GoogleChromeLabs/bubblewrap)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)
