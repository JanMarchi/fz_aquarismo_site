// ==========================================
// app.js — Lógica da aplicação
// ==========================================

// ========== CONFIGURAÇÕES ==========
const CONFIG = {
  whatsapp: {
    numero: "5541999999999", // DDI + DDD + número, sem espaços | EDITE AQUI
    mensagemPadrao: "Olá! Tenho interesse em um peixe do catálogo."
  },
  instagram: {
    usuario: "fz_aquarismo", // EDITE AQUI se necessário
    url: "https://www.instagram.com/fz_aquarismo"
  }
};

// ========== ESTADO GLOBAL ==========
const STATE = {
  filtros: {
    busca: "",
    categoria: null,
    dificuldade: null
  },
  modalAberto: false,
  lightboxAberto: false,
  indexLightbox: 0,
  peixeAtualLightbox: null
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", function () {
  renderDestaques();
  renderCatalogo();
  renderCategorias();
  configurarFiltros();
  configurarNavbar();
  configurarEventosGlobais();
  renderFooter();
});

// ========== RENDERIZAÇÃO: DESTAQUES ==========
function renderDestaques() {
  const destaques = CATALOGO.filter(peixe => peixe.destaque && peixe.disponivel);
  const carousel = document.querySelector(".destaque-carousel");

  carousel.innerHTML = destaques
    .map(
      peixe => `
    <div class="destaque-card" onclick="abrirModal('${peixe.id}')">
      <img src="${peixe.imagens[0]}" alt="${peixe.nome}" loading="lazy" />
      <div class="destaque-card-content">
        <h3>${peixe.nome}</h3>
        <p>${peixe.descricao.substring(0, 80)}...</p>
        <button class="btn-detalhes">Ver mais</button>
      </div>
    </div>
  `
    )
    .join("");
}

// ========== RENDERIZAÇÃO: CATÁLOGO ==========
function renderCatalogo(filtros = STATE.filtros) {
  let peixes = CATALOGO.filter(p => p.disponivel);

  // Filtrar por busca
  if (filtros.busca) {
    const termo = filtros.busca.toLowerCase();
    peixes = peixes.filter(
      p =>
        p.nome.toLowerCase().includes(termo) ||
        p.nomeCientifico.toLowerCase().includes(termo) ||
        p.tags.some(tag => tag.toLowerCase().includes(termo))
    );
  }

  // Filtrar por categoria
  if (filtros.categoria) {
    peixes = peixes.filter(p => p.categoria === filtros.categoria);
  }

  // Filtrar por dificuldade
  if (filtros.dificuldade) {
    peixes = peixes.filter(p => p.dificuldade === filtros.dificuldade);
  }

  // Renderizar grid
  const grid = document.querySelector(".grid-catalogo");
  grid.innerHTML = peixes
    .map(
      peixe => `
    <div class="card-peixe">
      <div style="position: relative;">
        <img
          src="${peixe.imagens[0]}"
          alt="${peixe.nome}"
          class="card-peixe-img"
          loading="lazy"
          onclick="abrirLightbox('${peixe.id}', 0)"
        />
        <span class="card-badge">${peixe.categoria}</span>
      </div>
      <div class="card-content">
        <h3 class="card-nome">${peixe.nome}</h3>
        <p class="card-cientifico">${peixe.nomeCientifico}</p>
        <div class="card-info">
          <span>📏 ${peixe.tamanho}</span>
          <span>🌡️ ${peixe.temperatura}</span>
          <span>⚗️ pH ${peixe.ph}</span>
          <span>😤 ${peixe.dificuldade}</span>
        </div>
        <button class="btn-detalhes" onclick="abrirModal('${peixe.id}')">
          Ver Detalhes
        </button>
        <div class="card-sociais">
          <button
            class="btn-social"
            onclick="abrirWhatsApp('${peixe.nome}')"
            title="Contato WhatsApp"
          >
            💬 WhatsApp
          </button>
          <button
            class="btn-social"
            onclick="abrirInstagram()"
            title="Seguir no Instagram"
          >
            📸 Instagram
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Atualizar contador
  const contador = document.querySelector(".contador");
  const total = CATALOGO.filter(p => p.disponivel).length;
  contador.textContent = `Exibindo ${peixes.length} de ${total} peixes`;

  // Atualizar estado
  STATE.filtros = filtros;
}

// ========== RENDERIZAÇÃO: CATEGORIAS ==========
function renderCategorias() {
  const categorias = [...new Set(CATALOGO.map(p => p.categoria))];
  const container = document.querySelector(".filtros-grupo");

  // Encontrar o label de categorias
  let labelCat = container.querySelector("[data-filter='categoria']");
  if (!labelCat) {
    labelCat = document.createElement("div");
    labelCat.setAttribute("data-filter", "categoria");
    labelCat.style.display = "contents";
    container.insertBefore(labelCat, container.firstChild);
  }

  labelCat.innerHTML = `
    <span class="filtros-label">Categoria:</span>
    ${categorias
      .map(
        cat => `
      <button class="filtro-btn" onclick="filtrarCategoria('${cat}')">
        ${cat}
      </button>
    `
      )
      .join("")}
    <button class="filtro-btn" onclick="filtrarCategoria(null)">
      Limpar
    </button>
  `;
}

// ========== RENDERIZAÇÃO: FOOTER ==========
function renderFooter() {
  const footer = document.querySelector("footer");
  footer.innerHTML = `
    <div class="footer-content">
      <img src="img/logo.jpeg" alt="FZ Aquarismo" class="footer-logo" />
      <div class="footer-links">
        <a href="#inicio">Início</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </div>
      <div class="footer-sociais">
        <a href="https://www.instagram.com/${CONFIG.instagram.usuario}" target="_blank" title="Instagram">📷</a>
        <a href="https://wa.me/${CONFIG.whatsapp.numero}" target="_blank" title="WhatsApp">💬</a>
      </div>
    </div>
    <div class="footer-copyright">
      © 2025 FZ Aquarismo. Todos os direitos reservados.
    </div>
  `;
}

// ========== FILTROS ==========
function configurarFiltros() {
  // Busca
  const inputBusca = document.querySelector(".busca-input");
  inputBusca.addEventListener("input", function () {
    STATE.filtros.busca = this.value;
    renderCatalogo(STATE.filtros);
  });
}

function filtrarCategoria(categoria) {
  STATE.filtros.categoria = categoria;
  renderCatalogo(STATE.filtros);
}

function filtrarDificuldade(dificuldade) {
  STATE.filtros.dificuldade = dificuldade || null;
  renderCatalogo(STATE.filtros);
}

// ========== MODAL ==========
function abrirModal(peixeId) {
  const peixe = CATALOGO.find(p => p.id === peixeId);
  if (!peixe) return;

  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".modal-overlay");

  modal.innerHTML = `
    <button class="modal-close" onclick="fecharModal()">✕</button>

    <div class="modal-gallery">
      <img src="${peixe.imagens[0]}" alt="${peixe.nome}" id="modalMainImg" />
    </div>

    ${
      peixe.imagens.length > 1
        ? `
      <div style="padding: 0 var(--space-xl);">
        <div class="modal-thumbnails">
          ${peixe.imagens
            .map(
              (img, idx) => `
            <div class="thumbnail ${idx === 0 ? "active" : ""}"
                 onclick="trocarImagemModal('${peixeId}', ${idx})">
              <img src="${img}" alt="Thumbnail ${idx + 1}" />
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
        : ""
    }

    <div class="modal-content">
      <h2 class="modal-title">${peixe.nome}</h2>
      <p class="modal-cientifico">${peixe.nomeCientifico}</p>

      <p class="modal-descricao">${peixe.descricao}</p>

      <div class="modal-params">
        <div class="modal-param">
          <div class="modal-param-label">Tamanho</div>
          <div>${peixe.tamanho}</div>
        </div>
        <div class="modal-param">
          <div class="modal-param-label">Temperatura</div>
          <div>${peixe.temperatura}</div>
        </div>
        <div class="modal-param">
          <div class="modal-param-label">pH</div>
          <div>${peixe.ph}</div>
        </div>
        <div class="modal-param">
          <div class="modal-param-label">Dificuldade</div>
          <div>${peixe.dificuldade}</div>
        </div>
        <div class="modal-param">
          <div class="modal-param-label">Temperamento</div>
          <div>${peixe.temperamento}</div>
        </div>
      </div>

      ${
        peixe.tags && peixe.tags.length > 0
          ? `
        <div class="modal-tags">
          ${peixe.tags
            .map(tag => `<button class="tag" onclick="filtrarPorTag('${tag}')">#${tag}</button>`)
            .join("")}
        </div>
      `
          : ""
      }

      <button class="modal-cta" onclick="abrirWhatsApp('${peixe.nome}')">
        ✓ Quero esse peixe → WhatsApp
      </button>
    </div>
  `;

  overlay.classList.add("active");
  STATE.modalAberto = true;
  document.body.style.overflow = "hidden";
}

function fecharModal() {
  const overlay = document.querySelector(".modal-overlay");
  overlay.classList.remove("active");
  STATE.modalAberto = false;
  document.body.style.overflow = "auto";
}

// ========== MODAL DE CONTATO ==========
function abrirModalContato() {
  const overlay = document.querySelector("#modalContatoOverlay");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function fecharModalContato() {
  const overlay = document.querySelector("#modalContatoOverlay");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

function trocarImagemModal(peixeId, index) {
  const peixe = CATALOGO.find(p => p.id === peixeId);
  if (!peixe) return;

  const img = document.querySelector("#modalMainImg");
  img.src = peixe.imagens[index];

  // Atualizar thumbnail ativo
  document.querySelectorAll(".thumbnail").forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === index);
  });
}

function filtrarPorTag(tag) {
  fecharModal();
  const inputBusca = document.querySelector(".busca-input");
  inputBusca.value = tag;
  STATE.filtros.busca = tag;
  renderCatalogo(STATE.filtros);
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
}

// ========== LIGHTBOX ==========
function abrirLightbox(peixeId, indexInicial = 0) {
  const peixe = CATALOGO.find(p => p.id === peixeId);
  if (!peixe || !peixe.imagens.length) return;

  STATE.peixeAtualLightbox = peixe;
  STATE.indexLightbox = indexInicial;
  STATE.lightboxAberto = true;

  const overlay = document.querySelector(".lightbox-overlay");
  const img = document.querySelector(".lightbox-img");

  img.src = peixe.imagens[STATE.indexLightbox];
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function fecharLightbox() {
  const overlay = document.querySelector(".lightbox-overlay");
  overlay.classList.remove("active");
  STATE.lightboxAberto = false;
  STATE.peixeAtualLightbox = null;
  document.body.style.overflow = "auto";
}

function proximaImagemLightbox() {
  if (!STATE.peixeAtualLightbox) return;

  STATE.indexLightbox =
    (STATE.indexLightbox + 1) % STATE.peixeAtualLightbox.imagens.length;
  document.querySelector(".lightbox-img").src =
    STATE.peixeAtualLightbox.imagens[STATE.indexLightbox];
}

function imagemAnteriorLightbox() {
  if (!STATE.peixeAtualLightbox) return;

  STATE.indexLightbox =
    (STATE.indexLightbox - 1 + STATE.peixeAtualLightbox.imagens.length) %
    STATE.peixeAtualLightbox.imagens.length;
  document.querySelector(".lightbox-img").src =
    STATE.peixeAtualLightbox.imagens[STATE.indexLightbox];
}

// ========== INTEGRAÇÃO: WHATSAPP ==========
function abrirWhatsApp(nomePeixe) {
  const mensagem = `Olá! Vi o ${nomePeixe} no site da FZ Aquarismo e tenho interesse. Está disponível?`;
  const url = `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// ========== INTEGRAÇÃO: INSTAGRAM ==========
function abrirInstagram() {
  window.open(CONFIG.instagram.url, "_blank");
}

// ========== NAVBAR ==========
function configurarNavbar() {
  const hamburger = document.querySelector(".navbar-hamburger");
  const menu = document.querySelector(".navbar-menu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll(".navbar-menu a").forEach(link => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      menu.classList.remove("active");
    });
  });
}

// ========== EVENTOS GLOBAIS ==========
function configurarEventosGlobais() {
  // Fechar modal ao clicar fora
  document.querySelector(".modal-overlay").addEventListener("click", function (e) {
    if (e.target === this) {
      fecharModal();
    }
  });

  // Fechar modal de contato ao clicar fora
  document.querySelector("#modalContatoOverlay").addEventListener("click", function (e) {
    if (e.target === this) {
      fecharModalContato();
    }
  });

  // Fechar lightbox ao clicar fora
  document.querySelector(".lightbox-overlay").addEventListener("click", function (e) {
    if (e.target === this) {
      fecharLightbox();
    }
  });

  // Navegação do lightbox
  document.querySelector(".lightbox-nav.prev").addEventListener("click", imagemAnteriorLightbox);
  document.querySelector(".lightbox-nav.next").addEventListener("click", proximaImagemLightbox);

  // Teclas globais
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const modalContato = document.querySelector("#modalContatoOverlay");
      if (STATE.modalAberto) fecharModal();
      if (STATE.lightboxAberto) fecharLightbox();
      if (modalContato.classList.contains("active")) fecharModalContato();
    }
    if (STATE.lightboxAberto) {
      if (e.key === "ArrowLeft") imagemAnteriorLightbox();
      if (e.key === "ArrowRight") proximaImagemLightbox();
    }
  });


  // Botões CTA do hero
  document
    .querySelector(".hero-buttons .btn-primary")
    .addEventListener("click", function () {
      document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
    });

  document
    .querySelector(".hero-buttons .btn-secondary")
    .addEventListener("click", function () {
      abrirWhatsApp("aquário");
    });

  // Link do Instagram no hero
  document
    .querySelector(".hero-social .social-link")
    .addEventListener("click", abrirInstagram);

  // Botões CTA da seção de contato
  document.querySelectorAll(".contato-buttons button").forEach(btn => {
    if (btn.textContent.includes("WhatsApp")) {
      btn.addEventListener("click", function () {
        abrirWhatsApp("aquário");
      });
    } else if (btn.textContent.includes("Instagram")) {
      btn.addEventListener("click", abrirInstagram);
    }
  });

  // Selects de filtro de dificuldade
  document.querySelectorAll('[onclick*="filtrarDificuldade"]').forEach(btn => {
    btn.addEventListener("click", function () {
      const dificuldade = this.getAttribute("onclick").match(/'([^']*)'/) ||
        this.getAttribute("onclick").match(/\(([^)]*)\)/);
      if (dificuldade && dificuldade[1]) {
        filtrarDificuldade(dificuldade[1] === "null" ? null : dificuldade[1]);
      }
    });
  });
}

// ========== FUNÇÕES UTILITÁRIAS ==========
function gerarWhatsAppLink(nomePeixe) {
  const mensagem = `Olá! Vi o ${nomePeixe} no site da FZ Aquarismo e tenho interesse. Está disponível?`;
  return `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}
