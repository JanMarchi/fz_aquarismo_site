// editor-panel.js — Painel de Editor Integrado no Site

const MAX_IMAGEM_WIDTH = 800;
const MAX_IMAGEM_QUALITY = 0.75;

// ========== GERENCIAR PAINEL DO EDITOR ==========
function abrirPanelEditor() {
  const usuario = obterUsuarioLogado();
  if (usuario) {
    mostrarPainelGerenciamento();
  } else {
    mostrarTelaLoginEditor();
  }
  document.getElementById("panelEditorOverlay").style.display = "flex";
}

function fecharPanelEditor() {
  document.getElementById("panelEditorOverlay").style.display = "none";
}

function mostrarTelaLoginEditor() {
  document.getElementById("telaLoginEditor").style.display = "block";
  document.getElementById("telaCadastroEditor").style.display = "none";
  document.getElementById("painelGerenciamentoEditor").style.display = "none";
}

function mostrarTelaCadastroEditor() {
  document.getElementById("telaLoginEditor").style.display = "none";
  document.getElementById("telaCadastroEditor").style.display = "block";
  document.getElementById("painelGerenciamentoEditor").style.display = "none";
}

function mostrarPainelGerenciamento() {
  document.getElementById("telaLoginEditor").style.display = "none";
  document.getElementById("telaCadastroEditor").style.display = "none";
  document.getElementById("painelGerenciamentoEditor").style.display = "block";
  carregarListaPeixesEditor();
}

// ========== LOGIN/CADASTRO DO EDITOR ==========
async function fazerLoginEditor() {
  const email = document.getElementById("inputEmailEditor").value.trim();
  const senha = document.getElementById("inputSenhaEditor").value;
  const erroDiv = document.getElementById("erroEditorLogin");

  if (!email || !senha) {
    erroDiv.textContent = "Email e senha são obrigatórios";
    erroDiv.style.display = "block";
    return;
  }

  // Login direto com credencial de teste
  if (email === "teste" && senha === "123456") {
    sessionStorage.setItem("fz_usuario_logado", JSON.stringify({
      id: 1,
      email: "teste@test.com",
      nome: "Teste Editor"
    }));
    erroDiv.style.display = "none";
    mostrarPainelGerenciamento();
    return;
  }

  // Tentar com auth.js se disponível
  if (typeof window.fazerLogin === "function") {
    const resultado = await window.fazerLogin(email, senha);
    if (resultado.sucesso) {
      erroDiv.style.display = "none";
      mostrarPainelGerenciamento();
      return;
    } else {
      erroDiv.textContent = resultado.erro;
      erroDiv.style.display = "block";
    }
  } else {
    erroDiv.textContent = "Use: teste / 123456";
    erroDiv.style.display = "block";
  }
}

async function fazerCadastroEditor() {
  const nome = document.getElementById("inputNomeEditor").value.trim();
  const email = document.getElementById("inputEmailCadastroEditor").value.trim();
  const senha = document.getElementById("inputSenhaCadastroEditor").value;
  const senhaConfirm = document.getElementById("inputConfirmSenhaEditor").value;
  const erroDiv = document.getElementById("erroCadastroEditor");

  if (!nome || !email || !senha || !senhaConfirm) {
    erroDiv.textContent = "Todos os campos são obrigatórios";
    erroDiv.style.display = "block";
    return;
  }

  if (senha !== senhaConfirm) {
    erroDiv.textContent = "As senhas não conferem";
    erroDiv.style.display = "block";
    return;
  }

  const resultado = await window.cadastrarUsuario(email, senha, nome);

  if (resultado.sucesso) {
    erroDiv.style.display = "none";
    alert("Conta criada com sucesso! Faça login para continuar.");
    mostrarTelaLoginEditor();
    document.getElementById("inputEmailEditor").focus();
  } else {
    erroDiv.textContent = resultado.erro;
    erroDiv.style.display = "block";
  }
}

// ========== CARREGAR CATÁLOGO ==========
function carregarCatalogoEditor() {
  const salvo = localStorage.getItem("fz_catalogo");
  if (salvo) {
    try {
      return JSON.parse(salvo);
    } catch (e) {
      return [...CATALOGO];
    }
  }
  return [...CATALOGO];
}

function salvarCatalogoEditor(catalogo) {
  localStorage.setItem("fz_catalogo", JSON.stringify(catalogo));
  // Recarregar catálogo no site
  if (window.renderCatalogo) {
    window.renderCatalogo();
    window.renderDestaques();
  }
}

// ========== CRUD PEIXES ==========
function gerarIdEditor(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function adicionarPeixeEditor(dados) {
  const catalogo = carregarCatalogoEditor();
  const id = gerarIdEditor(dados.nome);

  if (catalogo.some(p => p.id === id)) {
    alert("Já existe um peixe com esse nome. Use um nome diferente.");
    return false;
  }

  catalogo.push({
    id,
    nome: dados.nome,
    nomeCientifico: dados.nomeCientifico,
    categoria: dados.categoria,
    subcategoria: dados.subcategoria,
    descricao: dados.descricao,
    tamanho: dados.tamanho,
    ph: dados.ph,
    temperatura: dados.temperatura,
    dificuldade: dados.dificuldade,
    temperamento: dados.temperamento,
    disponivel: dados.disponivel !== false,
    destaque: dados.destaque === true,
    imagens: dados.imagens && dados.imagens.length > 0 ? [dados.imagens[0]] : [],
    tags: Array.isArray(dados.tags) ? dados.tags : (dados.tags ? dados.tags.split(",").map(t => t.trim()) : [])
  });

  salvarCatalogoEditor(catalogo);
  return true;
}

function editarPeixeEditor(id, dados) {
  const catalogo = carregarCatalogoEditor();
  const idx = catalogo.findIndex(p => p.id === id);

  if (idx === -1) {
    alert("Peixe não encontrado.");
    return false;
  }

  const peixeExistente = catalogo[idx];

  catalogo[idx] = {
    ...peixeExistente,
    nome: dados.nome,
    nomeCientifico: dados.nomeCientifico,
    categoria: dados.categoria,
    subcategoria: dados.subcategoria,
    descricao: dados.descricao,
    tamanho: dados.tamanho,
    ph: dados.ph,
    temperatura: dados.temperatura,
    dificuldade: dados.dificuldade,
    temperamento: dados.temperamento,
    disponivel: dados.disponivel !== false,
    destaque: dados.destaque === true,
    imagens: dados.imagens && dados.imagens.length > 0 ? [dados.imagens[0]] : peixeExistente.imagens,
    tags: Array.isArray(dados.tags) ? dados.tags : (dados.tags ? dados.tags.split(",").map(t => t.trim()) : [])
  };

  salvarCatalogoEditor(catalogo);
  return true;
}

function deletarPeixeEditor(id) {
  const catalogo = carregarCatalogoEditor();
  const peixe = catalogo.find(p => p.id === id);

  if (!peixe) {
    alert("Peixe não encontrado.");
    return false;
  }

  if (!confirm(`Tem certeza que quer deletar "${peixe.nome}"? Essa ação não pode ser desfeita.`)) {
    return false;
  }

  const novosCatalogo = catalogo.filter(p => p.id !== id);
  salvarCatalogoEditor(novosCatalogo);
  return true;
}

// ========== PROCESSAMENTO DE IMAGEM ==========
function processarImagemEditor(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Arquivo selecionado não é uma imagem."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;

        if (w > MAX_IMAGEM_WIDTH) {
          h = (h * MAX_IMAGEM_WIDTH) / w;
          w = MAX_IMAGEM_WIDTH;
        }

        canvas.width = w;
        canvas.height = h;

        canvas.getContext("2d").drawImage(img, 0, 0, w, h);

        const base64 = canvas.toDataURL("image/jpeg", MAX_IMAGEM_QUALITY);
        resolve(base64);
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem."));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Erro ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

// ========== LISTA DE PEIXES ==========
function carregarListaPeixesEditor() {
  const catalogo = carregarCatalogoEditor();
  const container = document.getElementById("listaPeixesEditor");

  if (catalogo.length === 0) {
    container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: rgba(255, 255, 255, 0.5);'>Nenhum peixe cadastrado.</p>";
    return;
  }

  container.innerHTML = catalogo.map(peixe => `
    <div style="background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; padding: 12px; overflow: hidden;">
      <div style="height: 150px; background: linear-gradient(135deg, rgba(17, 129, 162, 0.1), rgba(17, 129, 162, 0.05)); border-radius: 8px; margin-bottom: 12px; overflow: hidden;">
        ${peixe.imagens && peixe.imagens[0] ? `<img src="${peixe.imagens[0]}" style="width: 100%; height: 100%; object-fit: contain;" />` : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.3);">Sem imagem</div>'}
      </div>
      <h4 style="margin: 0 0 4px 0; font-size: 14px;">${peixe.nome}</h4>
      <p style="margin: 0 0 12px 0; font-size: 12px; color: rgba(255, 255, 255, 0.6);">${peixe.categoria}</p>
      <div style="display: flex; gap: 6px;">
        <button onclick="abrirModalEditarPeixeEditor('${peixe.id}')" style="flex: 1; padding: 6px; background: var(--color-accent); color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Editar</button>
        <button onclick="deletarPeixeEditor('${peixe.id}'); carregarListaPeixesEditor();" style="flex: 1; padding: 6px; background: #e74c3c; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Deletar</button>
      </div>
    </div>
  `).join("");
}

// ========== MODAL DE FORMULÁRIO ==========
let peixeEmEdicao = null;

function abrirModalAdicionarPeixeEditor() {
  peixeEmEdicao = null;
  abrirModalFormularioPeixeEditor();
}

function abrirModalEditarPeixeEditor(id) {
  const catalogo = carregarCatalogoEditor();
  peixeEmEdicao = catalogo.find(p => p.id === id);
  abrirModalFormularioPeixeEditor();
}

function abrirModalFormularioPeixeEditor() {
  let html = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;" id="modalPeixeEditor">
      <div style="background: var(--color-bg-primary); border: 1px solid var(--color-border); border-radius: 12px; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto; padding: 24px;">
        <h3 style="margin: 0 0 16px 0;">${peixeEmEdicao ? "Editar Peixe" : "Adicionar Peixe"}</h3>
        <form onsubmit="event.preventDefault(); salvarPeixeEditor();" style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" id="editorNome" placeholder="Nome" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.nome || ''}" required />
          <input type="text" id="editorNomeCientifico" placeholder="Nome Científico" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.nomeCientifico || ''}" />
          <input type="text" id="editorCategoria" placeholder="Categoria" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.categoria || ''}" />
          <textarea id="editorDescricao" placeholder="Descrição" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary); min-height: 80px; font-family: inherit;">${peixeEmEdicao?.descricao || ''}</textarea>
          <input type="text" id="editorTamanho" placeholder="Tamanho (ex: 10-15 cm)" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.tamanho || ''}" />
          <input type="text" id="editorPH" placeholder="pH" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.ph || ''}" />
          <input type="text" id="editorTemperatura" placeholder="Temperatura" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.temperatura || ''}" />
          <select id="editorDificuldade" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);">
            <option value="Iniciante" ${peixeEmEdicao?.dificuldade === "Iniciante" ? "selected" : ""}>Iniciante</option>
            <option value="Intermediário" ${peixeEmEdicao?.dificuldade === "Intermediário" ? "selected" : ""}>Intermediário</option>
            <option value="Avançado" ${peixeEmEdicao?.dificuldade === "Avançado" ? "selected" : ""}>Avançado</option>
          </select>
          <input type="text" id="editorTemperamento" placeholder="Temperamento" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.temperamento || ''}" />
          <input type="text" id="editorTags" placeholder="Tags (separadas por vírgula)" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary);" value="${peixeEmEdicao?.tags?.join(", ") || ''}" />
          <div>
            <label style="display: block; font-size: 12px; margin-bottom: 4px;">Imagem</label>
            <input type="file" id="editorImagem" accept="image/*" style="padding: 8px; background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-primary); width: 100%;" />
            <div id="previewImagemEditor" style="margin-top: 8px; text-align: center;"></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
              <input type="checkbox" id="editorDisponivel" ${peixeEmEdicao?.disponivel !== false ? "checked" : ""} />
              Disponível
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
              <input type="checkbox" id="editorDestaque" ${peixeEmEdicao?.destaque ? "checked" : ""} />
              Destaque
            </label>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="submit" style="flex: 1; padding: 10px; background: var(--color-accent); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Salvar</button>
            <button type="button" onclick="fecharModalPeixeEditor()" style="flex: 1; padding: 10px; background: var(--color-border); color: var(--color-text-primary); border: none; border-radius: 6px; cursor: pointer;">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  // Carregar imagem se existir
  if (peixeEmEdicao?.imagens?.[0]) {
    document.getElementById("previewImagemEditor").innerHTML = `<img src="${peixeEmEdicao.imagens[0]}" style="max-width: 100%; max-height: 150px; border-radius: 6px;" />`;
  }

  // Evento para preview de imagem
  document.getElementById("editorImagem").addEventListener("change", async function(e) {
    if (e.target.files.length > 0) {
      try {
        const base64 = await processarImagemEditor(e.target.files[0]);
        document.getElementById("previewImagemEditor").innerHTML = `<img src="${base64}" style="max-width: 100%; max-height: 150px; border-radius: 6px;" />`;
        e.target.dataset.base64 = base64;
      } catch (error) {
        alert("Erro ao processar imagem: " + error.message);
      }
    }
  });
}

function fecharModalPeixeEditor() {
  const modal = document.getElementById("modalPeixeEditor");
  if (modal) modal.remove();
}

async function salvarPeixeEditor() {
  const nome = document.getElementById("editorNome").value.trim();
  if (!nome) {
    alert("Nome é obrigatório");
    return;
  }

  const inputFile = document.getElementById("editorImagem");
  let imagem = null;

  if (inputFile.dataset.base64) {
    imagem = inputFile.dataset.base64;
  } else if (inputFile.files.length > 0) {
    try {
      imagem = await processarImagemEditor(inputFile.files[0]);
    } catch (error) {
      alert("Erro ao processar imagem: " + error.message);
      return;
    }
  }

  const dados = {
    nome,
    nomeCientifico: document.getElementById("editorNomeCientifico").value.trim(),
    categoria: document.getElementById("editorCategoria").value.trim(),
    subcategoria: document.getElementById("editorSubcategoria")?.value.trim() || "",
    descricao: document.getElementById("editorDescricao").value.trim(),
    tamanho: document.getElementById("editorTamanho").value.trim(),
    ph: document.getElementById("editorPH").value.trim(),
    temperatura: document.getElementById("editorTemperatura").value.trim(),
    dificuldade: document.getElementById("editorDificuldade").value,
    temperamento: document.getElementById("editorTemperamento").value.trim(),
    disponivel: document.getElementById("editorDisponivel").checked,
    destaque: document.getElementById("editorDestaque").checked,
    imagens: imagem ? [imagem] : [],
    tags: document.getElementById("editorTags").value.trim().split(",").map(t => t.trim()).filter(t => t)
  };

  let sucesso;
  if (peixeEmEdicao) {
    sucesso = editarPeixeEditor(peixeEmEdicao.id, dados);
  } else {
    sucesso = adicionarPeixeEditor(dados);
  }

  if (sucesso) {
    fecharModalPeixeEditor();
    carregarListaPeixesEditor();
  }
}
