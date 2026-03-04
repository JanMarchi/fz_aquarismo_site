/**
 * Sistema de Analytics - FZ Aquarismo
 * Rastreia acessos e estatísticas para gerenciar anúncios
 */

const Analytics = {
  /**
   * Inicializa o sistema de analytics
   */
  init() {
    this.registrarAcesso();
  },

  /**
   * Registra um novo acesso
   */
  registrarAcesso() {
    const agora = new Date();
    const acesso = {
      timestamp: agora.getTime(),
      data: agora.toLocaleDateString("pt-BR"),
      hora: agora.toLocaleTimeString("pt-BR"),
      dia_semana: this.obterDiaSemana(agora.getDay()),
      browser: this.detectarBrowser(),
      dispositivo: this.detectarDispositivo(),
      pagina: window.location.pathname,
    };

    // Obter histórico de acessos
    const acessos = this.obterAcessos();
    acessos.push(acesso);

    // Manter apenas últimos 90 dias de dados
    const agora_ms = Date.now();
    const noventa_dias_ms = 90 * 24 * 60 * 60 * 1000;
    const acessos_filtrados = acessos.filter(
      (a) => agora_ms - a.timestamp < noventa_dias_ms
    );

    localStorage.setItem("fz_analytics_acessos", JSON.stringify(acessos_filtrados));

    // Atualizar contador total
    const total = parseInt(localStorage.getItem("fz_analytics_total") || 0) + 1;
    localStorage.setItem("fz_analytics_total", total.toString());

    // Atualizar último acesso
    localStorage.setItem("fz_analytics_ultimo_acesso", JSON.stringify(acesso));
  },

  /**
   * Obtém lista de todos os acessos
   */
  obterAcessos() {
    const dados = localStorage.getItem("fz_analytics_acessos");
    return dados ? JSON.parse(dados) : [];
  },

  /**
   * Obtém total de acessos
   */
  obterTotal() {
    return parseInt(localStorage.getItem("fz_analytics_total") || 0);
  },

  /**
   * Obtém último acesso
   */
  obterUltimoAcesso() {
    const dados = localStorage.getItem("fz_analytics_ultimo_acesso");
    return dados ? JSON.parse(dados) : null;
  },

  /**
   * Retorna estatísticas agregadas
   */
  obterEstatisticas() {
    const acessos = this.obterAcessos();
    const total = this.obterTotal();

    // Acessos por dia
    const acessosPorDia = {};
    acessos.forEach((a) => {
      acessosPorDia[a.data] = (acessosPorDia[a.data] || 0) + 1;
    });

    // Acessos por hora
    const acessosPorHora = {};
    acessos.forEach((a) => {
      const hora = a.hora.split(":")[0];
      acessosPorHora[hora] = (acessosPorHora[hora] || 0) + 1;
    });

    // Acessos por dia da semana
    const acessosPorDiaSemana = {};
    acessos.forEach((a) => {
      acessosPorDiaSemana[a.dia_semana] =
        (acessosPorDiaSemana[a.dia_semana] || 0) + 1;
    });

    // Dispositivos mais usados
    const dispositivos = {};
    acessos.forEach((a) => {
      dispositivos[a.dispositivo] = (dispositivos[a.dispositivo] || 0) + 1;
    });

    // Browsers mais usados
    const browsers = {};
    acessos.forEach((a) => {
      browsers[a.browser] = (browsers[a.browser] || 0) + 1;
    });

    // Média de acessos por dia
    const diasUnicos = Object.keys(acessosPorDia).length;
    const mediaAcessosPorDia = diasUnicos > 0 ? total / diasUnicos : 0;

    // Pico de acesso
    let picoDia = null;
    let picoValor = 0;
    Object.entries(acessosPorDia).forEach(([dia, valor]) => {
      if (valor > picoValor) {
        picoValor = valor;
        picoDia = dia;
      }
    });

    let picoHora = null;
    picoValor = 0;
    Object.entries(acessosPorHora).forEach(([hora, valor]) => {
      if (valor > picoValor) {
        picoValor = valor;
        picoHora = `${hora}:00`;
      }
    });

    return {
      total,
      ultimoAcesso: this.obterUltimoAcesso(),
      diasUnicos,
      mediaAcessosPorDia: mediaAcessosPorDia.toFixed(1),
      acessosPorDia,
      acessosPorHora,
      acessosPorDiaSemana,
      dispositivos,
      browsers,
      picoDia,
      picoHora,
      acessosUltimos7Dias: this.obterAcessosUltimos7Dias(),
      acessosUltimos30Dias: this.obterAcessosUltimos30Dias(),
    };
  },

  /**
   * Obtém acessos dos últimos 7 dias
   */
  obterAcessosUltimos7Dias() {
    const acessos = this.obterAcessos();
    const agora = Date.now();
    const sete_dias_ms = 7 * 24 * 60 * 60 * 1000;
    return acessos.filter((a) => agora - a.timestamp < sete_dias_ms).length;
  },

  /**
   * Obtém acessos dos últimos 30 dias
   */
  obterAcessosUltimos30Dias() {
    const acessos = this.obterAcessos();
    const agora = Date.now();
    const trinta_dias_ms = 30 * 24 * 60 * 60 * 1000;
    return acessos.filter((a) => agora - a.timestamp < trinta_dias_ms).length;
  },

  /**
   * Detecta o browser do usuário
   */
  detectarBrowser() {
    const ua = navigator.userAgent;
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    if (ua.indexOf("Edge") > -1) return "Edge";
    if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera";
    return "Outro";
  },

  /**
   * Detecta o sistema operacional do usuário
   */
  detectarDispositivo() {
    const ua = navigator.userAgent;

    // iOS (iPhone e iPad)
    if (/iphone|ipad|ipod/i.test(ua)) {
      return "iOS";
    }

    // Android
    if (/android/i.test(ua)) {
      return "Android";
    }

    // Windows
    if (/windows|win32/i.test(ua)) {
      return "Windows";
    }

    // macOS
    if (/macintosh|mac os x/i.test(ua)) {
      return "macOS";
    }

    // Linux
    if (/linux/i.test(ua)) {
      return "Linux";
    }

    // Padrão
    return "Outro";
  },

  /**
   * Obtém nome do dia da semana
   */
  obterDiaSemana(num) {
    const dias = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return dias[num];
  },

  /**
   * Limpa todos os dados de analytics (use com cuidado!)
   */
  limparDados() {
    if (
      confirm(
        "Tem certeza? Isso vai deletar todo o histórico de acessos. Esta ação não pode ser desfeita."
      )
    ) {
      localStorage.removeItem("fz_analytics_acessos");
      localStorage.removeItem("fz_analytics_total");
      localStorage.removeItem("fz_analytics_ultimo_acesso");
      alert("Dados de analytics deletados com sucesso!");
      location.reload();
    }
  },

  /**
   * Exporta dados como JSON
   */
  exportarDados() {
    const stats = this.obterEstatisticas();
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fz-analytics-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  },

  /**
   * Exporta dados como CSV
   */
  exportarCSV() {
    const acessos = this.obterAcessos();
    let csv =
      "Data,Hora,Dia da Semana,Dispositivo,Browser,Página\n";

    acessos.forEach((a) => {
      csv += `"${a.data}","${a.hora}","${a.dia_semana}","${a.dispositivo}","${a.browser}","${a.pagina}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fz-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  },
};

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  Analytics.init();
});
