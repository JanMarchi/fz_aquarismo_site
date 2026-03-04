# 🐠 FZ Aquarismo — Site de Catálogo de Peixes

Bem-vindo! Este é um site estático simples para mostrar seus peixes e direcionar clientes para WhatsApp e Instagram.

---

## 🚀 Como Usar o Site

Abra o arquivo **`index.html`** em qualquer navegador. Pronto! O site carrega todos os peixes do arquivo **`catalogo.js`**.

---

## 📝 Como Adicionar um Peixe

1. Abra o arquivo **`catalogo.js`** em um editor de texto (Bloco de Notas, VS Code, Notepad++, etc.)
2. Procure pelo último peixe na lista e copie este bloco de exemplo:

```javascript
{
  id: "seu-peixe-id",
  nome: "Nome Comum do Peixe",
  nomeCientifico: "Gênero espécie",
  categoria: "Categoria Principal",
  subcategoria: "Subcategoria",
  descricao: "Descrição completa do peixe em português",
  tamanho: "X–Y cm",
  dificuldade: "Iniciante", // ou "Intermediário" ou "Avançado"
  temperamento: "Descrição do temperamento",
  ph: "X.X – X.X",
  temperatura: "XX – XX°C",
  disponivel: true, // true = aparece no site, false = fica oculto
  destaque: false, // true = aparece na seção "Destaques" da home
  imagens: [
    "img/peixes/nome-da-foto.jpeg"
  ],
  tags: ["tag1", "tag2", "tag3"]
}
```

3. Preencha os campos com as informações do seu peixe
4. Salve o arquivo e recarregue o navegador (F5 ou Ctrl+R)

**Dicas:**
- O `id` deve ser único e sem espaços (use hífens: `aulonocara-eureka`)
- A `descricao` aparece em vários lugares — seja detalhado mas conciso
- Use `disponivel: true` para peixes que você tem disponível
- Use `destaque: true` para até 3-4 peixes que você quer destacar na home
- Adicione `tags` para melhorar a busca (ex: `["malawi", "azul", "africano"]`)

---

## 📸 Como Adicionar Fotos

1. Coloque suas fotos em **JPEG** ou **PNG** na pasta **`img/peixes/`**
2. No arquivo `catalogo.js`, adicione o caminho da foto no campo `imagens`:

```javascript
imagens: [
  "img/peixes/meu-peixe-foto-1.jpeg",
  "img/peixes/meu-peixe-foto-2.jpeg"
]
```

A **primeira imagem** da lista é a que aparece no card do catálogo. As demais aparecem quando o cliente clica em "Ver Detalhes" ou na galeria.

**Dica:** Nomes de arquivo sem espaços funcionam melhor. Use hífens: `aulonocara-eureka-01.jpeg`

---

## 👁️ Como Ocultar um Peixe Temporariamente

Se você quer tirar um peixe da venda, mas não quer deletá-lo:

```javascript
disponivel: false
```

O peixe desaparecerá do site. Para ativar novamente, troque para `true`.

---

## ⭐ Como Marcar um Peixe como Destaque

Na home, existe uma seção "Peixes em Destaque" com um carrossel. Para adicionar um peixe lá:

```javascript
destaque: true
```

Use para seus peixes mais bonitos ou os que você quer destacar. Limite a 3–4 peixes para não ficar poluído.

---

## 📱 Como Trocar o Número do WhatsApp

1. Abra o arquivo **`app.js`** em um editor de texto
2. Procure por esta linha (perto do topo):

```javascript
numero: "5541999999999", // DDI + DDD + número, sem espaços
```

3. Troque para seu número no formato: `DDI + DDD + número` (sem espaços)
   - Exemplo para Brasil: `5541987654321` (55 = Brasil, 41 = DDD Curitiba)

4. Salve e recarregue o site

---

## 🔍 Dúvidas Frequentes

**P: Onde salvo as alterações?**
R: Salve os arquivos no próprio editor de texto. Depois, recarregue o site no navegador (F5).

**P: Posso editar o texto "Sobre" ou "Contato"?**
R: Sim! Abra o `index.html` com um editor de texto e procure pelas seções "Sobre" e "Contato". Edite normalmente.

**P: Posso mudar as cores?**
R: Sim, mas é mais complicado. Abra `style.css` e procure por `:root { --color-...` . Aí estão todas as cores. Mude os códigos hexadecimais conforme achar.

**P: Como faço o site ficar online na internet?**
R: Você pode usar serviços gratuitos como Netlify, Vercel ou GitHub Pages. Suba os arquivos (todos os arquivos da pasta `fz-aquarismo/`) e eles criam um link para você compartilhar.

---

## 📞 Suporte

Se tiver problemas ao editar os arquivos, mantenha a estrutura e o formato JSON válido. Qualquer dúvida, você pode pedir ajuda a um desenvolvedor para validar a sintaxe do `catalogo.js`.

Boa sorte com sua loja! 🐠✨
