# 🌐 Configurar Domínio sacrumscroll.com no Netlify

## Passo 1: Adicionar Domínio no Netlify

1. No painel do Netlify, clique em **"Domain management"** no menu lateral
2. Clique em **"Add custom domain"** ou **"Add domain"**
3. Digite: `sacrumscroll.com`
4. Clique em **"Verify"** ou **"Add domain"**

## Passo 2: Configurar DNS

O Netlify mostrará os registros DNS que você precisa configurar. Vá até o painel do seu provedor de domínio (onde você comprou o domínio) e configure:

### Se você comprou no Registro.br:

1. Acesse: https://registro.br
2. Faça login
3. Vá em **"Meus domínios"** → **"sacrumscroll.com"** → **"DNS"**
4. Adicione/edite os registros:

**Registro A:**
- Nome: `@` (ou deixe em branco)
- Tipo: `A`
- Valor: `75.2.60.5` (ou o IP que o Netlify fornecer)

**Registro CNAME:**
- Nome: `www`
- Tipo: `CNAME`
- Valor: `sacrum-scroll.netlify.app` (ou o que o Netlify indicar)

### Se você comprou em outro provedor (GoDaddy, Namecheap, etc.):

1. Acesse o painel do seu provedor
2. Vá em **"DNS Management"** ou **"Gerenciar DNS"**
3. Adicione os mesmos registros acima

## Passo 3: Aguardar Propagação

- ⏱️ Pode levar de **15 minutos a 48 horas**
- Geralmente funciona em **1-2 horas**
- Você pode verificar em: https://www.whatsmydns.net

## Passo 4: Verificar SSL/HTTPS

- O Netlify ativa SSL automaticamente após verificar o DNS
- Aguarde até aparecer o cadeado verde 🔒 no Netlify

## Passo 5: Configurar Domínio Principal (Opcional)

No Netlify, você pode definir qual domínio é o principal:
- `sacrumscroll.com` (sem www)
- `www.sacrumscroll.com` (com www)

Recomendação: Use `sacrumscroll.com` como principal e configure redirecionamento de `www` para o principal.

## Verificação

Após configurar, teste:
- ✅ `https://sacrumscroll.com` deve abrir seu site
- ✅ `https://www.sacrumscroll.com` deve redirecionar para o principal

## Problemas Comuns

### Domínio não funciona após 2 horas
- Verifique se os registros DNS estão corretos
- Use https://www.whatsmydns.net para verificar propagação
- Aguarde mais tempo (pode levar até 48h)

### Erro de SSL
- Aguarde a verificação do DNS completar
- O Netlify ativa SSL automaticamente

### Site não carrega
- Verifique se o deploy está publicado
- Confirme que os registros DNS estão corretos
- Limpe o cache do navegador (Ctrl+Shift+R)
