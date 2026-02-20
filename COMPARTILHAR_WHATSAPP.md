# 📱 Compartilhar no WhatsApp - Imagem Personalizada

## ✅ O que foi configurado:

- ✅ Imagem copiada para `public/og-image.png`
- ✅ Meta tags Open Graph configuradas no `layout.tsx`
- ✅ Meta tags Twitter Cards configuradas
- ✅ URL absoluto configurado para `https://sacrumscroll.com`

## 🚀 Fazer Deploy das Alterações:

```bash
cd "/Users/thaciosiqueira/Desktop/Instagram Católico"
git add .
git commit -m "Adicionar imagem Open Graph para compartilhamento no WhatsApp"
git push origin main
```

Após o push, o Netlify fará deploy automaticamente em 2-3 minutos.

## 🧪 Como Testar:

### Opção 1: Testar Localmente (Antes do Deploy)

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Use ferramentas de validação:
   - **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
   - **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
   - Cole a URL: `https://sacrumscroll.com` (ou `http://localhost:3000` para teste local)

### Opção 2: Testar no WhatsApp (Após Deploy)

1. Aguarde o deploy completar no Netlify
2. Abra o WhatsApp no celular
3. Compartilhe o link: `https://sacrumscroll.com`
4. A imagem deve aparecer automaticamente no preview

## 📋 O que aparece ao compartilhar:

- **Título:** "SacrumScroll — O Feed da Tradição Católica"
- **Descrição:** "Substitua o scroll mundano por ascese espiritual e beleza sacra..."
- **Imagem:** A imagem do scroll que você forneceu

## 🔧 Se a imagem não aparecer:

### 1. Limpar Cache do WhatsApp:
- WhatsApp pode cachear previews antigos
- Use o **Facebook Sharing Debugger** para forçar atualização:
  - Acesse: https://developers.facebook.com/tools/debug/
  - Cole: `https://sacrumscroll.com`
  - Clique em **"Scrape Again"** para atualizar o cache

### 2. Verificar se a imagem está acessível:
- Acesse diretamente: `https://sacrumscroll.com/og-image.png`
- Deve abrir a imagem

### 3. Verificar tamanho da imagem:
- WhatsApp recomenda: **1200x630px**
- Tamanho máximo: **8MB**
- Formato: PNG ou JPG

### 4. Aguardar propagação:
- Pode levar algumas horas para o WhatsApp atualizar o cache
- Use o Facebook Debugger para forçar atualização

## 📝 Notas Importantes:

- ✅ A imagem deve estar em `public/og-image.png`
- ✅ O URL deve ser absoluto (`https://sacrumscroll.com/og-image.png`)
- ✅ Após fazer deploy, aguarde alguns minutos antes de testar
- ✅ Use o Facebook Debugger para limpar cache se necessário

## 🎯 Próximos Passos:

1. Fazer commit e push das alterações
2. Aguardar deploy no Netlify
3. Testar compartilhando no WhatsApp
4. Se não aparecer, usar Facebook Debugger para atualizar cache
