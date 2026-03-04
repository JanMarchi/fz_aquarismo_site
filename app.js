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

// ========== CARREGAR CATÁLOGO DO LOCALSTORAGE ==========
(function() {
  const catalogoSalvo = localStorage.getItem("fz_catalogo");
  if (catalogoSalvo) {
    try {
      const dados = JSON.parse(catalogoSalvo);
      if (Array.isArray(dados)) {
        CATALOGO.length = 0;
        CATALOGO.push(...dados);
      }
    } catch (e) {
      console.error("Erro ao carregar catálogo do localStorage:", e);
      // Usa CATALOGO original em caso de erro
    }
  }
})();

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="display: inline-block; margin-right: 6px; vertical-align: middle;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.116-4.687 5.367-4.687 8.905 0 1.584.292 3.131.851 4.583l-1.265 4.621 4.71-1.235c1.377.746 2.924 1.14 4.422 1.14h.004c5.568 0 10.107-4.534 10.107-10.107 0-2.693-1.088-5.226-3.066-7.257-1.979-2.032-4.615-3.149-7.41-3.149"/></svg>
            WhatsApp
          </button>
          <button
            class="btn-social"
            onclick="abrirInstagram()"
            title="Seguir no Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="display: inline-block; margin-right: 6px; vertical-align: middle;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/></svg>
            Instagram
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display: inline-block; margin-right: 8px; vertical-align: middle;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.116-4.687 5.367-4.687 8.905 0 1.584.292 3.131.851 4.583l-1.265 4.621 4.71-1.235c1.377.746 2.924 1.14 4.422 1.14h.004c5.568 0 10.107-4.534 10.107-10.107 0-2.693-1.088-5.226-3.066-7.257-1.979-2.032-4.615-3.149-7.41-3.149"/></svg>
        Quero esse peixe → WhatsApp
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
