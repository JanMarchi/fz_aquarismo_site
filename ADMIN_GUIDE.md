# Guia do Painel Administrativo — FZ Aquarismo

## 🔐 Acesso ao Painel

**URL:** `admin.html`
**Senha:** `fz2026`

A senha pode ser alterada editando a variável `SENHA_ADMIN` no topo do arquivo `admin.js`.

## 🎯 Recursos Principais

### Autenticação
- Login com senha simples (protege de visitantes curiosos)
- Sessão por aba (`sessionStorage`) — reabrir aba pede senha novamente
- Logout com botão "Sair" no header

### Gerenciar Peixes
- **Adicionar**: Botão "➕ Adicionar Novo Peixe"
- **Editar**: Clique no botão "Editar" em qualquer card
- **Deletar**: Clique em "Deletar" (pede confirmação)
- **Toggle**: Marcar/desmarcar "Disponível" e "Destaque" instantaneamente

### Upload de Imagem
- Imagens são redimensionadas automaticamente (máx 800px de largura)
- Convertidas para JPEG com compressão automática
- Preview ao vivo antes de salvar
- Suporta PNG, JPEG, WebP e outros formatos

### Dados Persistem
- Tudo é salvo em `localStorage["fz_catalogo"]`
- `app.js` carrega automaticamente do localStorage no primeiro acesso
- Recarregue `index.html` para ver alterações no catálogo público

## 📊 Painel Dashboard

Mostra estatísticas em tempo real:
- **Total de Peixes**: Contagem total no catálogo
- **Disponíveis**: Quantos têm `disponivel: true`
- **Em Destaque**: Quantos têm `destaque: true`

## 🗂️ Estrutura de Dados

### Campo `imagens`
- Salvo como array com uma string base64 (imagem comprimida)
- Armazenado diretamente em localStorage (sem servidor)
- Cada imagem: ~50-200KB após compressão

### ID Gerado Automaticamente
Baseado no nome:
- Lowercase
- Remove acentos
- Substitui espaços por hífens
- Remove caracteres especiais

Exemplo: `"Aulonocara Eureka"` → `"aulonocara-eureka"`

## 📝 Campos do Formulário

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| Nome Comum | ✅ | Nome popular do peixe |
| Nome Científico | ⭕ | Nomenclatura binomial |
| Categoria | ⭕ | Ex: "Ciclídeos Africanos" |
| Subcategoria | ⭕ | Ex: "Malawi" |
| Descrição | ⭕ | Texto descritivo (pode ter quebras de linha) |
| Tamanho | ⭕ | Ex: "10–15 cm" |
| pH | ⭕ | Ex: "7.8 – 8.5" |
| Temperatura | ⭕ | Ex: "24 – 28°C" |
| Dificuldade | ⭕ | Iniciante / Intermediário / Avançado |
| Temperamento | ⭕ | Descrição do comportamento |
| Tags | ⭕ | Separadas por vírgula (usadas em buscas) |
| Imagem | ⭕ | Arquivo JPG/PNG/WebP |
| Disponível | ⭕ | Checkbox (padrão: marcado) |
| Em Destaque | ⭕ | Checkbox (padrão: desmarcado) |

## 🧪 Plano de Teste

### 1. Teste de Login
- [ ] Abrir `admin.html`
- [ ] Digitar senha errada → deve mostrar erro em vermelho
- [ ] Limpar campo e digitar `fz2026` → deve entrar no painel
- [ ] Clicar "Sair" → volta para login
- [ ] Reabrir admin.html → deve pedir senha novamente (sessão)

### 2. Teste de Listagem
- [ ] Painel carrega com todos os 11 peixes originais do `catalogo.js`
- [ ] Estatísticas mostram: Total=11, Disponível=11, Destaque=5
- [ ] Cada card mostra: nome, nome científico, categoria, toggles, botões

### 3. Teste de Adição
- [ ] Clique "➕ Adicionar Novo Peixe"
- [ ] Preencha formulário (todos campos não-obrigatórios podem ficar vazios, exceto Nome)
- [ ] Selecione uma imagem (verá preview)
- [ ] Marque "Em Destaque"
- [ ] Clique "Salvar"
- [ ] Novo peixe aparece na lista
- [ ] Recarregue `index.html` → novo peixe aparece no catálogo público

### 4. Teste de Edição
- [ ] Clique "Editar" em um peixe existente
- [ ] Altere nome científico
- [ ] Desmarque "Disponível"
- [ ] Salve
- [ ] Peixe aparece com mudanças
- [ ] Recarregue `index.html` → peixe não aparece mais (indisponível)

### 5. Teste de Deleção
- [ ] Clique "Deletar" em um peixe
- [ ] Confirme no `confirm()`
- [ ] Peixe desaparece da lista
- [ ] Recarregue `index.html` → peixe não existe mais

### 6. Teste de Toggles
- [ ] Marque/desmarque "Disponível" em um peixe → atualiza instantaneamente
- [ ] Marque "Em Destaque" → aparece na seção "Peixes em Destaque" do site
- [ ] Desmarca → sai dos destaques

### 7. Teste de Persistência
- [ ] Adicione um novo peixe
- [ ] Feche a aba
- [ ] Reabra `admin.html` → peixe continua lá
- [ ] Vá para `index.html` → peixe está no catálogo
- [ ] Limpe localStorage no DevTools (`localStorage.clear()`) → volta ao catálogo original

### 8. Teste de Responsividade
- [ ] Abra em mobile (DevTools F12, modo celular)
- [ ] Login funciona
- [ ] Cards e botões acessíveis
- [ ] Modal aparece e é usável
- [ ] Formulário funciona em toque

### 9. Teste de Imagens Grandes
- [ ] Tente fazer upload de imagem 4000x3000 em alta resolução
- [ ] Sistema deve redimensionar para ~800px de largura
- [ ] Compressão JPEG deve trazer tamanho razoável
- [ ] Preview deve mostrar imagem redimensionada

### 10. Teste de Dados Inválidos
- [ ] Tente adicionar peixe sem nome → aviso de campo obrigatório
- [ ] Tente adicionar nome duplicado → aviso de ID já existente
- [ ] Tente upload de arquivo não-imagem → aviso de erro

## 🔄 Fluxo Típico

```
1. Admin acessa admin.html
2. Login com senha fz2026
3. Painel mostra 11 peixes existentes
4. Admin clica "Adicionar Novo Peixe"
5. Preenche formulário + escolhe imagem
6. Clica "Salvar"
7. Novo peixe aparece na lista
8. Admin fecha admin.html
9. Visitante acessa index.html
10. Novo peixe aparecer no catálogo público (se disponível e/ou destaque)
```

## 🛠️ Troubleshooting

### "Catálogo vazio no painel"
- Verificar se `catalogo.js` está carregado antes de `admin.js`
- Verificar console para erros de JavaScript

### "Dados desaparecem ao recarregar"
- localStorage pode ser limpo automaticamente em navegadores privados
- Verificar se localStorage tem espaço (máx ~5-10MB dependendo do browser)
- Cada imagem base64 ocupa ~50-200KB

### "Imagem não aparece no preview"
- Verificar permissões de arquivo
- Tentar arquivo JPG em vez de PNG
- Verificar tamanho do arquivo (>50MB é grande demais)

### "Senha não funciona"
- Verificar se `SENHA_ADMIN` está correta em `admin.js`
- Limpar cache do browser (Ctrl+Shift+Delete)
- Testar em navegador privado

## 🔒 Segurança

### Proteção Implementada
- ✅ Senha simples (protege contra visitantes curiosos)
- ✅ `sessionStorage` (não persiste entre abas)
- ✅ Confirmação antes de deletar
- ✅ localStorage é cliente-side (não sobe para servidor)

### ⚠️ Não é Produção-Grade
- Senha em texto plano (editar arquivo JavaScript)
- localStorage pode ser inspecionado (DevTools)
- Sem autenticação real / servidor backend
- Sem backup automático

**Recomendação:** Para produção, implementar:
1. Backend com autenticação real (JWT, OAuth)
2. Database (PostgreSQL, etc)
3. API endpoints para CRUD
4. Backup automático

## 📱 Integração com Site Público

O `app.js` foi modificado para carregar dados do localStorage:

```javascript
// No topo do DOMContentLoaded:
const catalogoSalvo = localStorage.getItem("fz_catalogo");
if (catalogoSalvo) {
  CATALOGO.length = 0;
  CATALOGO.push(...catalogoSalvo);
}
```

**Fluxo:**
1. `app.js` tenta carregar de `localStorage["fz_catalogo"]`
2. Se existir, substitui `CATALOGO` global
3. Se não existir, usa `CATALOGO` original de `catalogo.js`
4. Admin adiciona/edita peixes → localStorage atualizado
5. Visitante visita site → vê dados atualizados

## 📄 Arquivos Modificados

| Arquivo | Ação | Modificações |
|---------|------|-------------|
| `admin.html` | ✅ CRIADO | Nova página (151 linhas) |
| `admin.css` | ✅ CRIADO | Estilos dark theme (500+ linhas) |
| `admin.js` | ✅ CRIADO | Lógica CRUD + auth (400+ linhas) |
| `app.js` | 🔧 MODIFICADO | +24 linhas para carregar localStorage |

## 🎨 Customizações Possíveis

### Mudar Senha
Editar `admin.js`, linha 3:
```javascript
const SENHA_ADMIN = "sua-nova-senha";
```

### Mudar Cores (Dark Theme)
Editar `admin.css`, linhas 8-16:
```css
--admin-accent-primary: #1181a2;  /* Azul principal */
--admin-accent-danger: #e74c3c;   /* Vermelho para deletar */
```

### Mudar Tamanho Máximo de Imagem
Editar `admin.js`, linha 5:
```javascript
const MAX_IMAGEM_WIDTH = 800;  // pixels
```

### Mudar Qualidade de Compressão
Editar `admin.js`, linha 6:
```javascript
const MAX_IMAGEM_QUALITY = 0.75;  /* 0.5 = menor tamanho, 0.9 = melhor qualidade */
```

## 📞 Suporte

Qualquer dúvida ou bug:
1. Verificar console (F12 → Console)
2. Limpar localStorage e recarregar
3. Testar em navegador diferente
4. Consultar plano original em `.claude/plans/`

---

**Última Atualização:** 2026-03-04
**Status:** ✅ Pronto para uso
