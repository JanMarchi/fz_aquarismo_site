// admin.js — Painel Administrativo FZ Aquarismo
// Gerenciar catálogo com upload de imagens, CRUD completo e localStorage

const MAX_IMAGEM_WIDTH = 800;
const MAX_IMAGEM_QUALITY = 0.75;

// ========== AUTENTICAÇÃO ==========
function verificarSessao() {
  const usuarioLogado = obterUsuarioLogado();
  if (!usuarioLogado) {
    mostrarTela("login");
  } else {
    mostrarTela("painel");
    atualizarHeaderAdmin();
    carregarListaPeixes();
  }
}

function atualizarHeaderAdmin() {
  const usuario = obterUsuarioLogado();
  if (usuario) {
    const headerLeft = document.querySelector(".admin-header-left");
    if (headerLeft) {
      headerLeft.innerHTML = `
        <img src="img/logo.jpeg" alt="FZ Aquarismo" class="admin-logo" />
        <div>
          <h1 class="admin-titulo">Painel Admin</h1>
          <p style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin: 0;">Olá, ${usuario.nome}</p>
        </div>
      `;
    }
  }
}

async function fazerLogin() {
  const email = document.getElementById("inputEmailLogin").value.trim();
  const senha = document.getElementById("inputSenhaLogin").value;
  const erroDiv = document.getElementById("erroLogin");

  if (!email || !senha) {
    erroDiv.textContent = "Email e senha são obrigatórios";
    erroDiv.style.display = "block";
    return;
  }

  const resultado = await fazerLogin(email, senha);

  if (resultado.sucesso) {
    erroDiv.style.display = "none";
    mostrarTela("painel");
    atualizarHeaderAdmin();
    carregarListaPeixes();
  } else {
    erroDiv.textContent = resultado.erro;
    erroDiv.style.display = "block";
  }
}

async function fazerCadastro() {
  const nome = document.getElementById("inputNomeCadastro").value.trim();
  const email = document.getElementById("inputEmailCadastro").value.trim();
  const senha = document.getElementById("inputSenhaCadastro").value;
  const senhaConfirm = document.getElementById("inputSenhaConfirm").value;
  const erroDiv = document.getElementById("erroCadastro");

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

  const resultado = await cadastrarUsuario(email, senha, nome);

  if (resultado.sucesso) {
    erroDiv.style.display = "none";
    alert("Conta criada com sucesso! Faça login para continuar.");
    mostrarTelaLogin();
    document.getElementById("telaLoginForm").reset();
  } else {
    erroDiv.textContent = resultado.erro;
    erroDiv.style.display = "block";
  }
}

function mostrarTelaLogin() {
  document.getElementById("telaLoginForm").style.display = "block";
  document.getElementById("telaCadastroForm").style.display = "none";
  document.getElementById("inputEmailLogin").focus();
}

function mostrarTelaCadastro() {
  document.getElementById("telaLoginForm").style.display = "none";
  document.getElementById("telaCadastroForm").style.display = "block";
  document.getElementById("inputNomeCadastro").focus();
}

function sair() {
  if (confirm("Tem certeza que quer fazer logout?")) {
    fazerLogout();
    mostrarTela("login");
    document.getElementById("telaLoginForm").style.display = "block";
    document.getElementById("telaCadastroForm").style.display = "none";
  }
}

function mostrarTela(tela) {
  document.getElementById("telaLogin").style.display = tela === "login" ? "flex" : "none";
  document.getElementById("telaPainel").style.display = tela === "painel" ? "block" : "none";
}

function abrirModalAlterarSenha() {
  document.getElementById("modalAlterarSenhaOverlay").style.display = "flex";
}

function fecharModalAlterarSenha() {
  document.getElementById("modalAlterarSenhaOverlay").style.display = "none";
  document.getElementById("inputSenhaAtual").value = "";
  document.getElementById("inputNovaSenha").value = "";
  document.getElementById("inputConfirmNovaSenha").value = "";
  document.getElementById("erroAlterarSenha").style.display = "none";
}

async function processarAlterarSenha() {
  const senhaAtual = document.getElementById("inputSenhaAtual").value;
  const novaSenha = document.getElementById("inputNovaSenha").value;
  const senhaConfirm = document.getElementById("inputConfirmNovaSenha").value;
  const erroDiv = document.getElementById("erroAlterarSenha");

  if (!senhaAtual || !novaSenha || !senhaConfirm) {
    erroDiv.textContent = "Todos os campos são obrigatórios";
    erroDiv.style.display = "block";
    return;
  }

  if (novaSenha !== senhaConfirm) {
    erroDiv.textContent = "As senhas não conferem";
    erroDiv.style.display = "block";
    return;
  }

  const usuario = obterUsuarioLogado();
  const resultado = await alterarSenha(usuario.email, senhaAtual, novaSenha);

  if (resultado.sucesso) {
    erroDiv.style.display = "none";
    alert("Senha alterada com sucesso!");
    fecharModalAlterarSenha();
  } else {
    erroDiv.textContent = resultado.erro;
    erroDiv.style.display = "block";
  }
}

// ========== CARREGAMENTO DO CATÁLOGO ==========
function carregarCatalogo() {
  const salvo = localStorage.getItem("fz_catalogo");
  if (salvo) {
    try {
      return JSON.parse(salvo);
    } catch (e) {
      console.error("Erro ao parsear localStorage:", e);
      return [...CATALOGO];
    }
  }
  return [...CATALOGO];
}

function salvarCatalogo(catalogo) {
  localStorage.setItem("fz_catalogo", JSON.stringify(catalogo));
}

// ========== CRUD PEIXES ==========
function gerarId(nome) {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function adicionarPeixe(dados) {
  const catalogo = carregarCatalogo();
  const id = gerarId(dados.nome);

  // Verificar se ID já existe
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

  salvarCatalogo(catalogo);
  return true;
}

function editarPeixe(id, dados) {
  const catalogo = carregarCatalogo();
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

  salvarCatalogo(catalogo);
  return true;
}

function deletarPeixe(id) {
  const catalogo = carregarCatalogo();
  const peixe = catalogo.find(p => p.id === id);

  if (!peixe) {
    alert("Peixe não encontrado.");
    return false;
  }

  if (!confirm(`Tem certeza que quer deletar "${peixe.nome}"? Essa ação não pode ser desfeita.`)) {
    return false;
  }

  const novosCatalogo = catalogo.filter(p => p.id !== id);
  salvarCatalogo(novosCatalogo);
  return true;
}

function toggleDisponivel(id) {
  const catalogo = carregarCatalogo();
  const peixe = catalogo.find(p => p.id === id);

  if (peixe) {
    peixe.disponivel = !peixe.disponivel;
    salvarCatalogo(catalogo);
  }
}

function toggleDestaque(id) {
  const catalogo = carregarCatalogo();
  const peixe = catalogo.find(p => p.id === id);

  if (peixe) {
    peixe.destaque = !peixe.destaque;
    salvarCatalogo(catalogo);
  }
}

// ========== PROCESSAMENTO DE IMAGEM ==========
function processarImagem(file) {
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

        // Redimensionar se necessário
        if (w > MAX_IMAGEM_WIDTH) {
          h = (h * MAX_IMAGEM_WIDTH) / w;
          w = MAX_IMAGEM_WIDTH;
        }

        canvas.width = w;
        canvas.height = h;

        canvas.getContext("2d").drawImage(img, 0, 0, w, h);

        const base64 = canvas.toDataURL("image/jpeg", MAX_IMAGEM_QUALITY);
        const sizeKB = (base64.length / 1024).toFixed(1);

        if (sizeKB > 500) {
          console.warn(`Imagem grande (${sizeKB}KB) pode ocupar bastante espaço no localStorage`);
        }

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
function carregarListaPeixes() {
  const catalogo = carregarCatalogo();
  const container = document.getElementById("listaPeixes");

  // Atualizar estatísticas
  const total = catalogo.length;
  const disponivel = catalogo.filter(p => p.disponivel).length;
  const destaque = catalogo.filter(p => p.destaque).length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statDisponivel").textContent = disponivel;
  document.getElementById("statDestaque").textContent = destaque;

  if (catalogo.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #ffffff;'>Nenhum peixe cadastrado.</p>";
    return;
  }

  container.innerHTML = catalogo.map(peixe => `
    <div class="admin-peixe-card">
      <div class="admin-peixe-img-container">
        ${peixe.imagens && peixe.imagens[0]
          ? `<img src="${peixe.imagens[0]}" alt="${peixe.nome}" class="admin-peixe-img" />`
          : `<div class="admin-peixe-img-vazio">Sem imagem</div>`
        }
      </div>
      <div class="admin-peixe-info">
        <h3>${peixe.nome}</h3>
        <p class="admin-peixe-cientifico">${peixe.nomeCientifico}</p>
        <p class="admin-peixe-meta">${peixe.categoria}</p>
        <div class="admin-peixe-toggles">
          <label class="admin-toggle">
            <input type="checkbox" ${peixe.disponivel ? "checked" : ""} onchange="toggleDisponivel('${peixe.id}'); carregarListaPeixes();">
            <span>Disponível</span>
          </label>
          <label class="admin-toggle">
            <input type="checkbox" ${peixe.destaque ? "checked" : ""} onchange="toggleDestaque('${peixe.id}'); carregarListaPeixes();">
            <span>Destaque</span>
          </label>
        </div>
      </div>
      <div class="admin-peixe-actions">
        <button class="btn-admin btn-editar" onclick="abrirModalEdicao('${peixe.id}')">Editar</button>
        <button class="btn-admin btn-deletar" onclick="deletarPeixe('${peixe.id}'); carregarListaPeixes();">Deletar</button>
      </div>
    </div>
  `).join("");
}

// ========== MODAL DE FORMULÁRIO ==========
function abrirModalAdicao() {
  limparFormulario();
  document.getElementById("modalTitulo").textContent = "Adicionar Novo Peixe";
  document.getElementById("modalFormId").value = "";
  document.getElementById("modalOverlay").style.display = "flex";
  document.getElementById("inputNome").focus();
}

function abrirModalEdicao(id) {
  const catalogo = carregarCatalogo();
  const peixe = catalogo.find(p => p.id === id);

  if (!peixe) {
    alert("Peixe não encontrado.");
    return;
  }

  document.getElementById("modalTitulo").textContent = "Editar Peixe";
  document.getElementById("modalFormId").value = peixe.id;
  document.getElementById("inputNome").value = peixe.nome;
  document.getElementById("inputNomeCientifico").value = peixe.nomeCientifico;
  document.getElementById("inputCategoria").value = peixe.categoria;
  document.getElementById("inputSubcategoria").value = peixe.subcategoria;
  document.getElementById("inputDescricao").value = peixe.descricao;
  document.getElementById("inputTamanho").value = peixe.tamanho;
  document.getElementById("inputPH").value = peixe.ph;
  document.getElementById("inputTemperatura").value = peixe.temperatura;
  document.getElementById("inputDificuldade").value = peixe.dificuldade;
  document.getElementById("inputTemperamento").value = peixe.temperamento;
  document.getElementById("inputTags").value = Array.isArray(peixe.tags) ? peixe.tags.join(", ") : peixe.tags;
  document.getElementById("checkDisponivel").checked = peixe.disponivel;
  document.getElementById("checkDestaque").checked = peixe.destaque;

  // Preview de imagem existente
  if (peixe.imagens && peixe.imagens[0]) {
    document.getElementById("previewImagem").innerHTML = `<img src="${peixe.imagens[0]}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />`;
  } else {
    document.getElementById("previewImagem").innerHTML = "";
  }

  document.getElementById("modalOverlay").style.display = "flex";
  document.getElementById("inputNome").focus();
}

function fecharModal() {
  document.getElementById("modalOverlay").style.display = "none";
  limparFormulario();
}

function limparFormulario() {
  document.getElementById("formularioPeixe").reset();
  document.getElementById("previewImagem").innerHTML = "";
  document.getElementById("modalFormId").value = "";
}

async function salvarPeixe() {
  const id = document.getElementById("modalFormId").value;
  const nome = document.getElementById("inputNome").value.trim();

  if (!nome) {
    alert("Nome do peixe é obrigatório.");
    return;
  }

  // Processar imagem se foi selecionada
  let imagem = null;
  const inputFile = document.getElementById("inputImagem");
  if (inputFile.files.length > 0) {
    try {
      imagem = await processarImagem(inputFile.files[0]);
    } catch (error) {
      alert("Erro ao processar imagem: " + error.message);
      return;
    }
  }

  const dados = {
    nome,
    nomeCientifico: document.getElementById("inputNomeCientifico").value.trim(),
    categoria: document.getElementById("inputCategoria").value.trim(),
    subcategoria: document.getElementById("inputSubcategoria").value.trim(),
    descricao: document.getElementById("inputDescricao").value.trim(),
    tamanho: document.getElementById("inputTamanho").value.trim(),
    ph: document.getElementById("inputPH").value.trim(),
    temperatura: document.getElementById("inputTemperatura").value.trim(),
    dificuldade: document.getElementById("inputDificuldade").value,
    temperamento: document.getElementById("inputTemperamento").value.trim(),
    disponivel: document.getElementById("checkDisponivel").checked,
    destaque: document.getElementById("checkDestaque").checked,
    imagens: imagem ? [imagem] : [],
    tags: document.getElementById("inputTags").value.trim().split(",").map(t => t.trim()).filter(t => t)
  };

  let sucesso;
  if (id) {
    sucesso = editarPeixe(id, dados);
  } else {
    sucesso = adicionarPeixe(dados);
  }

  if (sucesso) {
    fecharModal();
    carregarListaPeixes();
  }
}

// ========== PREVIEW DE IMAGEM ==========
document.addEventListener("DOMContentLoaded", function() {
  const inputFile = document.getElementById("inputImagem");
  if (inputFile) {
    inputFile.addEventListener("change", async function(e) {
      if (e.target.files.length > 0) {
        try {
          const base64 = await processarImagem(e.target.files[0]);
          document.getElementById("previewImagem").innerHTML = `
            <img src="${base64}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />
          `;
        } catch (error) {
          alert("Erro ao processar imagem: " + error.message);
          e.target.value = "";
        }
      }
    });
  }

  // Verificar sessão ao carregar
  verificarSessao();

  // Permitir Enter na senha
  const inputSenha = document.getElementById("inputSenha");
  if (inputSenha) {
    inputSenha.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        enviarSenha();
      }
    });
  }

  // Fechar modal clicando no overlay
  const modal = document.getElementById("modalOverlay");
  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === this) {
        fecharModal();
      }
    });
  }
});
