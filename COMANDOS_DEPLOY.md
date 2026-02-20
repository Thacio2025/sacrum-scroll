# Comandos para Deploy - SacrumScroll

## Método 1: Netlify CLI (Rápido)

```bash
cd "/Users/thaciosiqueira/Desktop/Instagram Católico"
npm run netlify:deploy
```

**Se der erro de permissão**, use o Método 2 abaixo.

---

## Método 2: Git + Netlify (Mais Estável - Recomendado)

### Passo 1: Criar repositório no GitHub
1. Acesse: https://github.com/new
2. Nome: `sacrum-scroll` (ou outro nome)
3. **NÃO** marque "Initialize with README"
4. Clique em "Create repository"

### Passo 2: Conectar e fazer push

```bash
# Ir para a pasta do projeto
cd "/Users/thaciosiqueira/Desktop/Instagram Católico"

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Adicionar sistema de música e preparar deploy"

# Adicionar remote (SUBSTITUA SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/sacrum-scroll.git

# Fazer push
git branch -M main
git push -u origin main
```

### Passo 3: Deploy no Netlify
1. Acesse: https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **GitHub** e autorize
4. Selecione o repositório `sacrum-scroll`
5. O Netlify detectará automaticamente:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Clique em **"Deploy site"**

Pronto! O site estará online em alguns minutos.

---

## Limpar cache (se necessário)

Se der erro `ENOTEMPTY`, limpe antes:

```bash
cd "/Users/thaciosiqueira/Desktop/Instagram Católico"
rm -rf .netlify
rm -rf .next
npm run netlify:deploy
```
