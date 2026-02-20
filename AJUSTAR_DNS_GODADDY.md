# 🔧 Ajustar DNS no GoDaddy para Netlify

## ✅ O que já está correto:

- **Registro A (`@`):** `75.2.60.5` ✅ (IP do Netlify - está correto!)

## ⚠️ O que precisa ser alterado:

### 1. Editar CNAME do `www`

**Passo a passo:**

1. Na tabela de DNS, encontre o registro **CNAME** com nome `www`
2. Clique no **ícone de lápis** (editar) ao lado desse registro
3. Você verá um formulário de edição
4. No campo **"Valor"** ou **"Points to"**, altere de:
   - ❌ `sacrumscroll.com.` 
   
   Para:
   - ✅ `sacrum-scroll.netlify.app` (ou o hostname que o Netlify forneceu)

5. Mantenha:
   - Nome: `www`
   - Tipo: `CNAME`
   - TTL: `1 hora` (ou o padrão)

6. Clique em **"Salvar"** ou **"Save"**

### 2. Verificar valores no Netlify

Antes de editar, confirme os valores corretos no Netlify:

1. Acesse: https://app.netlify.com
2. Vá em **"Domain management"**
3. Clique no domínio `sacrumscroll.com`
4. Veja os valores DNS recomendados:
   - **A Record:** deve ser `75.2.60.5` (já está correto!)
   - **CNAME (www):** deve ser algo como `sacrum-scroll.netlify.app`

### 3. Configuração Final Esperada

Após ajustar, seus registros devem ficar assim:

**Registro A:**
- Tipo: `A`
- Nome: `@`
- Valor: `75.2.60.5` ✅
- TTL: `1 hora`

**Registro CNAME:**
- Tipo: `CNAME`
- Nome: `www`
- Valor: `sacrum-scroll.netlify.app` ✅ (ou o que o Netlify indicar)
- TTL: `1 hora`

## ⏱️ Aguardar Propagação

- Após salvar, aguarde **15 minutos a 2 horas**
- O Netlify verificará automaticamente
- Quando aparecer "DNS configured correctly" no Netlify, está pronto!

## ✅ Verificar se Funcionou

Após 1-2 horas, teste:

- `https://sacrumscroll.com` → deve abrir seu site
- `https://www.sacrumscroll.com` → deve redirecionar para o principal

## 📝 Nota sobre outros registros

**Não mexa nestes registros:**
- ❌ Registros NS (nameservers) - deixe como está
- ❌ Registro `_domainconnect` - é do GoDaddy
- ✅ Registro `email` (Mailgun) - pode manter se usar email

**Importante:** O registro A já está correto (`75.2.60.5`), você só precisa ajustar o CNAME do `www`!
