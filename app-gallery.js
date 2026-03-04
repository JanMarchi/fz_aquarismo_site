/**
 * FZ Aquarismo - Galeria Premium
 *
 * Funcionalidades:
 * - Renderização de cards com design system
 * - Filtros dinâmicos (categoria, dificuldade)
 * - Busca em tempo real
 * - Lightbox com swipe/navegação
 * - Lazy loading de imagens
 * - Dark mode support
 */

// ========== STATE ==========
let filtrosAtivos = {
  categoria: null,
  dificuldade: null,
  busca: ''
};

let lightboxState = {
  isOpen: false,
  peixeAtual: null,
  imagemAtual: 0
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  inicializarGaleria();
  setupFiltros();
  setupBusca();
  setupDarkMode();
});

function inicializarGaleria() {
  renderizarGaleria();
  atualizarContador();
}

function setupFiltros() {
  // Extrair categorias únicas do catálogo
  const categorias = [...new Set(CATALOGO.map(p => p.categoria))];

  const filtrosCategoriaContainer = document.querySelector('.filtro-categoria-buttons');
  if (filtrosCategoriaContainer) {
    filtrosCategoriaContainer.innerHTML = '';
    categorias.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filtro-btn';
      btn.textContent = cat;
      btn.onclick = () => {
        filtrosAtivos.categoria = filtrosAtivos.categoria === cat ? null : cat;
        renderizarGaleria();
        atualizarContador();
      };
      filtrosCategoriaContainer.appendChild(btn);
    });
  }

  // Dificuldade
  ['Iniciante', 'Intermediário', 'Avançado'].forEach(dif => {
    const btn = document.querySelector(`[data-dificuldade="${dif}"]`);
    if (btn) {
      btn.onclick = () => {
        filtrosAtivos.dificuldade = filtrosAtivos.dificuldade === dif ? null : dif;
        renderizarGaleria();
        atualizarContador();
      };
    }
  });
}

function setupBusca() {
  const buscaInput = document.querySelector('.busca-input');
  if (buscaInput) {
    // Debounce 300ms
    let timeout;
    buscaInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        filtrosAtivos.busca = e.target.value.toLowerCase();
        renderizarGaleria();
        atualizarContador();
      }, 300);
    });
  }
}

function setupDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    }
  }
}

// ========== FILTRAGEM & BUSCA ==========
function obterPeixesFiltrados() {
  return CATALOGO.filter(peixe => {
    const mostraPorCategoria = !filtrosAtivos.categoria || peixe.categoria === filtrosAtivos.categoria;
    const mostraPorDificuldade = !filtrosAtivos.dificuldade || peixe.dificuldade === filtrosAtivos.dificuldade;
    const mostraPorBusca = !filtrosAtivos.busca ||
      peixe.nome.toLowerCase().includes(filtrosAtivos.busca) ||
      peixe.nomeCientifico.toLowerCase().includes(filtrosAtivos.busca) ||
      (peixe.tags && peixe.tags.some(tag => tag.toLowerCase().includes(filtrosAtivos.busca)));
    const mostraDisponivel = peixe.disponivel !== false;

    return mostraPorCategoria && mostraPorDificuldade && mostraPorBusca && mostraDisponivel;
  });
}

function atualizarContador() {
  const contador = document.querySelector('.contador');
  const peixesFiltrados = obterPeixesFiltrados();
  if (contador) {
    contador.textContent = `${peixesFiltrados.length} peixes encontrados`;
  }
}

// ========== RENDERIZAÇÃO ==========
function renderizarGaleria() {
  const grid = document.querySelector('.grid-catalogo');
  const peixesFiltrados = obterPeixesFiltrados();

  if (!grid) return;

  grid.innerHTML = '';

  if (peixesFiltrados.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-2xl); color: var(--color-neutral-600);"><p>Nenhum peixe encontrado. Tente outro filtro.</p></div>';
    return;
  }

  peixesFiltrados.forEach(peixe => {
    const card = criarCardPeixe(peixe);
    grid.appendChild(card);
  });
}

function criarCardPeixe(peixe) {
  const card = document.createElement('div');
  card.className = 'card card-interactive';
  card.role = 'article';
  card.setAttribute('aria-label', `${peixe.nome} - ${peixe.nomeCientifico}`);

  const imagem = peixe.imagens?.[0] || 'img/placeholder.jpg';
  const corDificuldade = {
    'Iniciante': '#10b981',
    'Intermediário': '#f59e0b',
    'Avançado': '#ef4444'
  };

  card.innerHTML = `
    <img
      src="${imagem}"
      alt="${peixe.nome}"
      class="card-image"
      loading="lazy"
    >
    <div class="card-body">
      <h3 class="card-title">${peixe.nome}</h3>
      <p class="card-subtitle">${peixe.nomeCientifico}</p>
      <p class="card-description">${peixe.descricao}</p>
      <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap; margin-bottom: var(--spacing-md);">
        <span class="badge badge-primary">${peixe.categoria}</span>
        <span class="badge badge-secondary" style="background-color: rgba(${corDificuldade[peixe.dificuldade] === '#10b981' ? '16, 185, 129' : corDificuldade[peixe.dificuldade] === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.15);">${peixe.dificuldade}</span>
        ${peixe.disponivel ? '<span class="badge badge-success">✓ Disponível</span>' : '<span class="badge" style="opacity: 0.5;">Indisponível</span>'}
      </div>
    </div>
  `;

  card.addEventListener('click', () => abrirDetalhePeixe(peixe));
  return card;
}

// ========== MODAL DETALHE ==========
function abrirDetalhePeixe(peixe) {
  const modal = document.querySelector('.modal-overlay');
  if (!modal) return;

  const imagem = peixe.imagens?.[0] || 'img/placeholder.jpg';

  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" onclick="fecharDetalhePeixe()" aria-label="Fechar detalhes">✕</button>
      <div class="modal-body">
        <div style="margin-bottom: var(--spacing-lg);">
          <img src="${imagem}" alt="${peixe.nome}" style="width: 100%; border-radius: var(--radius-lg); margin-bottom: var(--spacing-md);">
          <h2 id="modal-title" style="margin-bottom: var(--spacing-xs);">${peixe.nome}</h2>
          <p style="font-size: var(--font-size-sm); color: var(--color-neutral-600); margin-bottom: var(--spacing-lg);">${peixe.nomeCientifico}</p>
          <p style="margin-bottom: var(--spacing-md); line-height: var(--line-height-normal);">${peixe.descricao}</p>

          <div style="background-color: var(--color-neutral-100); padding: var(--spacing-md); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg);">
            <p><strong>Tamanho:</strong> ${peixe.tamanho}</p>
            <p><strong>Temperamento:</strong> ${peixe.temperamento}</p>
            <p><strong>pH:</strong> ${peixe.ph}</p>
            <p><strong>Temperatura:</strong> ${peixe.temperatura}</p>
          </div>

          ${peixe.tags ? `
            <div style="margin-bottom: var(--spacing-lg);">
              <p style="font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-sm);">Tags:</p>
              <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                ${peixe.tags.map(tag => `<span class="badge badge-info">${tag}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="modal-footer" style="justify-content: flex-end;">
        <button class="btn btn-primary" onclick="abrirWhatsApp('${peixe.nome}')">💬 Consultar via WhatsApp</button>
      </div>
    </div>
  `;

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function fecharDetalhePeixe() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = 'auto';
  }
}

// ========== NAVEGAÇÃO DO MODAL ==========
document.addEventListener('keydown', (e) => {
  const modal = document.querySelector('.modal-overlay');
  if (modal && modal.classList.contains('is-open')) {
    if (e.key === 'Escape') {
      fecharDetalhePeixe();
    }
  }
});

// ========== INTEROPERABILIDADE ==========
// Funções usadas no index.html
function filtrarDificuldade(dif) {
  filtrosAtivos.dificuldade = filtrosAtivos.dificuldade === dif ? null : dif;
  renderizarGaleria();
  atualizarContador();
}

function buscarPeixe() {
  renderizarGaleria();
  atualizarContador();
}
