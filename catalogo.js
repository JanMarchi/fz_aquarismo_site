// catalogo.js — Catálogo de Peixes FZ Aquarismo
// Esta é a ÚNICA fonte de verdade do catálogo.
// Edite este arquivo para adicionar, remover ou atualizar peixes.

const CATALOGO = [
  {
    id: "aulonocara-eureka",
    nome: "Aulonocara Eureka",
    nomeCientifico: "Aulonocara jacobfreibergi Eureka",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Aulonocara Eureka é uma variação bela e vibrante dos Aulonocaras de Malawi. Apresenta coloração azul-turquesa em todo o corpo com padrões amarelos na cabeça e nadadeiras. Peixe pacífico para um ciclídeo africano, sendo uma excelente escolha para aquários comunitários de Malawi.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Pacífico com coespecíficos da mesma espécie",
    ph: "7.8 – 8.5",
    temperatura: "24 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara Eureka.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "azul", "ciclídeo"]
  },
  {
    id: "aulonocara-golden",
    nome: "Aulonocara Golden",
    nomeCientifico: "Aulonocara jacobfreibergi Golden",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Uma das variedades mais procuradas do Aulonocara, o Golden apresenta uma deslumbrante coloração amarelo-dourada que recobre todo o corpo. A cabeça é um destaque especial com tons ainda mais intensos. Excelente para aquários plantados e comunitários de Malawi.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Pacífico com coespecíficos da mesma espécie",
    ph: "7.8 – 8.5",
    temperatura: "24 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara Golden.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "dourado", "ciclídeo"]
  },
  {
    id: "aulonocara-ngara",
    nome: "Aulonocara Ngara",
    nomeCientifico: "Aulonocara jacobfreibergi Ngara",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Aulonocara Ngara combina azul profundo na maioria do corpo com laranja-avermelhado na cabeça e nadadeiras. Uma combinação de cores vibrante e atraente, representando a biodiversidade cromática dos ciclídeos de Malawi. Comportamento territorial moderado.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Territorial, requer espaço",
    ph: "7.8 – 8.5",
    temperatura: "24 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara Ngara.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "laranja", "vermelho", "ciclídeo"]
  },
  {
    id: "aulonocara-lwanda",
    nome: "Aulonocara Lwanda",
    nomeCientifico: "Aulonocara jacobfreibergi Lwanda",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Uma joia azul dos ciclídeos de Malawi, o Aulonocara Lwanda exibe uma coloração azul-petróleo uniforme com iridescências violetas. A cabeça é pontilhada de amarelo brilhante em machos territoriais. Ideal para aquaristas intermediários que buscam beleza aliada a comportamento mais dócil.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Pacífico com coespecíficos da mesma espécie",
    ph: "7.8 – 8.5",
    temperatura: "24 – 28°C",
    disponivel: true,
    destaque: false,
    imagens: [
      "img/peixes/Aulonocara Lwanda.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "azul", "ciclídeo"]
  },
  {
    id: "aulonocara-maleri",
    nome: "Aulonocara Maleri",
    nomeCientifico: "Aulonocara jacobfreibergi Maleri",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Aulonocara Maleri é uma variante vibrante com coloração predominantemente azul-turquesa. Machos territoriais desenvolvem manchas e padrões pretos nas nadadeiras dorsais e anais, criando um contraste impressionante. Comportamento predador em relação a alevinos.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Territorial durante reprodução",
    ph: "7.8 – 8.5",
    temperatura: "24 – 28°C",
    disponivel: true,
    destaque: false,
    imagens: [
      "img/peixes/Aulonocara Maleri.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "azul", "ciclídeo"]
  },
  {
    id: "aulonocara-red-ruby",
    nome: "Aulonocara Red Ruby",
    nomeCientifico: "Aulonocara jacobfreibergi Red Ruby",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "O Red Ruby é um Aulonocara em tons avermelhados e vermelho-vivo que contrasta com áreas azuis. Uma das variações mais espetaculares dos Aulonocaras, especialmente quando os machos atingem a maturidade sexual e intensificam suas cores. Recomendado para aquaristas experientes.",
    tamanho: "10–15 cm",
    dificuldade: "Avançado",
    temperamento: "Muito territorial em períodos reprodutivos",
    ph: "7.6 – 8.6",
    temperatura: "23 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara Red Ruby.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "vermelho", "rubi", "ciclídeo"]
  },
  {
    id: "aulonocara-ob-albina",
    nome: "Aulonocara OB Albina",
    nomeCientifico: "Aulonocara jacobfreibergi OB Albina",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Aulonocara OB Albina é uma rara e exótica coloração albina com manchas pretas características do padrão OB (Orange Blotch). O corpo branco-cremoso contrasta lindamente com as marcas pretas dispersas, criando um efeito visual único. Uma joia para colecionadores de variações raras de Malawi.",
    tamanho: "10–15 cm",
    dificuldade: "Avançado",
    temperamento: "Territorial, requer espaço",
    ph: "7.6 – 8.6",
    temperatura: "23 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara OB Albina.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "albino", "ob", "raro", "ciclídeo"]
  },
  {
    id: "aulonocara-ob-blender-red",
    nome: "Aulonocara OB Blender Red",
    nomeCientifico: "Aulonocara jacobfreibergi OB Blender Red",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Uma variação impressionante que combina o padrão OB (Orange Blotch) com intensos tons vermelhos. Os machos exibem vermelho vibrante mesclado com manchas laranja-avermelhadas sobre fundo azul. Esta é uma das colorações mais visuais e atraentes para aquaristas que apreciam cores intensas.",
    tamanho: "10–15 cm",
    dificuldade: "Avançado",
    temperamento: "Muito territorial durante reprodução",
    ph: "7.6 – 8.6",
    temperatura: "23 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara OB Blender Red.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "vermelho", "ob", "laranja", "ciclídeo"]
  },
  {
    id: "aulonocara-turkis",
    nome: "Aulonocara Turkis",
    nomeCientifico: "Aulonocara jacobfreibergi Turkis",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Aulonocara Turkis é uma variação que exibe uma deslumbrante coloração turquesa-azulada em todo o corpo com reflexos de verde-água em certas condições de iluminação. A cabeça apresenta tons ainda mais intensos e iridescentes. Uma escolha perfeita para criar aquários de grande impacto visual.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Pacífico com coespecíficos da mesma espécie",
    ph: "7.6 – 8.6",
    temperatura: "23 – 28°C",
    disponivel: true,
    destaque: false,
    imagens: [
      "img/peixes/Aulonocara Turkis.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "turquesa", "azul", "ciclídeo"]
  },
  {
    id: "aulonocara-lemon-albina",
    nome: "Aulonocara Lemon Albina",
    nomeCientifico: "Aulonocara jacobfreibergi Lemon Albina",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Uma das variações mais delicadas e procuradas, o Aulonocara Lemon Albina apresenta um corpo branco-creme com tonalidades amarelo-limão, especialmente evidentes na cabeça e nadadeiras de machos territoriais. Os olhos vermelhos característicos dos albinos complementam este padrão encantador.",
    tamanho: "10–15 cm",
    dificuldade: "Avançado",
    temperamento: "Territorial durante reprodução",
    ph: "7.6 – 8.6",
    temperatura: "23 – 28°C",
    disponivel: true,
    destaque: true,
    imagens: [
      "img/peixes/Aulonocara Lemon Albina.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "albino", "amarelo", "limão", "raro", "ciclídeo"]
  },
  {
    id: "aulonocara-apache",
    nome: "Aulonocara Apache",
    nomeCientifico: "Aulonocara jacobfreibergi Apache",
    categoria: "Ciclídeos Africanos",
    subcategoria: "Malawi",
    descricao: "Aulonocara Apache é uma variação robusta com coloração que combina laranja-avermelhado intenso com padrões pretos nas nadadeiras. Especialmente quando em ambiente apropriado, os machos desenvolvem cores muito vibrantes. Uma escolha interessante para aquaristas que buscam cores quentes.",
    tamanho: "10–15 cm",
    dificuldade: "Intermediário",
    temperamento: "Pacífico com coespecíficos da mesma espécie",
    ph: "7.6 – 8.6",
    temperatura: "23 – 28°C",
    disponivel: true,
    destaque: false,
    imagens: [
      "img/peixes/Aulonocara Apache.jpeg"
    ],
    tags: ["malawi", "africano", "aulonocara", "laranja", "vermelho", "preto", "ciclídeo"]
  }
];
