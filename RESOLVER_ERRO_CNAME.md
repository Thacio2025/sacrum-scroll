# 🔧 Resolver Erro: "O nome do registro www é referente a outro registro"

## ❌ Problema:
O GoDaddy não deixa editar o CNAME existente e quando tenta criar um novo aparece erro de conflito.

## ✅ Solução Passo a Passo:

### Passo 1: Deletar o Registro CNAME Existente

1. Na lista de registros DNS, encontre o registro **CNAME** com nome `www`
2. Clique no **ícone de lixeira** (🗑️ deletar) ao lado desse registro
3. Confirme a exclusão quando solicitado
4. Aguarde alguns segundos para o registro ser removido

### Passo 2: Verificar se há Registro A para `www`

⚠️ **Importante:** Você **NÃO pode ter** registro A e CNAME com o mesmo nome!

1. Procure na lista se existe algum registro **A** com nome `www`
2. Se existir, **delete-o também** (clique na lixeira)
3. Você só precisa do registro A para `@` (raiz), não para `www`

### Passo 3: Criar Novo CNAME para `www`

Agora que deletou o registro antigo:

1. Clique em **"Adicionar outros registros"** ou **"Adicionar"**
2. Preencha o formulário:
   - **Tipo:** `CNAME`
   - **Nome:** `www`
   - **Valor:** `sacrum-scroll.netlify.app` (ou o hostname que o Netlify forneceu)
   - **TTL:** `1 hora` (ou padrão)
3. Clique em **"Salvar"**

### Passo 4: Verificar Configuração Final

Após salvar, seus registros devem ficar assim:

✅ **Registro A:**
- Tipo: `A`
- Nome: `@`
- Valor: `75.2.60.5`

✅ **Registro CNAME:**
- Tipo: `CNAME`
- Nome: `www`
- Valor: `sacrum-scroll.netlify.app`

## 🔍 Se Ainda Não Funcionar:

### Verificar no Netlify os Valores Corretos:

1. Acesse: https://app.netlify.com
2. Vá em **"Domain management"**
3. Clique no domínio `sacrumscroll.com`
4. Veja os valores DNS recomendados:
   - Anote o valor exato do CNAME para `www`

### Limpar Cache do Navegador:

Às vezes o GoDaddy mostra dados em cache:
- Pressione `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)
- Ou feche e abra o navegador novamente

### Aguardar Alguns Minutos:

Após deletar um registro, pode levar alguns minutos para o sistema atualizar. Aguarde 2-3 minutos antes de tentar criar o novo.

## 📝 Resumo:

1. ❌ **Delete** o CNAME `www` existente
2. ❌ **Delete** qualquer registro A para `www` (se existir)
3. ✅ **Crie** novo CNAME `www` apontando para `sacrum-scroll.netlify.app`
4. ✅ **Salve** e aguarde propagação

## ⏱️ Tempo de Propagação:

- Após salvar: **15 minutos a 2 horas**
- O Netlify verificará automaticamente
- Quando aparecer "DNS configured correctly", está pronto!
