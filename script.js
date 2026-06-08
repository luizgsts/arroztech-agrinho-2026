const canvas = document.getElementById("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const instructionsBtn = document.getElementById("instructionsBtn");
const closeInstructionsBtn = document.getElementById("closeInstructionsBtn");
const instructionsModal = document.getElementById("instructionsModal");
const phaseObjectiveEl = document.getElementById("phaseObjective");
const educationalMessageEl = document.getElementById("educationalMessage");
const diaryListEl = document.getElementById("diaryList");
const resultPanel = document.getElementById("resultPanel");

const hudTempo = document.getElementById("hudTempo");
const hudFase = document.getElementById("hudFase");
const hudSacas = document.getElementById("hudSacas");
const hudPontuacao = document.getElementById("hudPontuacao");
const hudCombustivel = document.getElementById("hudCombustivel");
const hudVida = document.getElementById("hudVida");
const hudSustentabilidade = document.getElementById("hudSustentabilidade");
const hudEficiencia = document.getElementById("hudEficiencia");

const resultSacas = document.getElementById("resultSacas");
const resultPontos = document.getElementById("resultPontos");
const resultCombustivel = document.getElementById("resultCombustivel");
const resultVida = document.getElementById("resultVida");
const resultSustentabilidade = document.getElementById("resultSustentabilidade");
const resultClassificacao = document.getElementById("resultClassificacao");
const resultEntregue = document.getElementById("resultEntregue");
const resultLucro = document.getElementById("resultLucro");

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const touchButtons = document.querySelectorAll(".touch-btn");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizContent = document.getElementById("quizContent");
const quizResult = document.getElementById("quizResult");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizProgress = document.getElementById("quizProgress");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const GAME_DURATION_SECONDS = 50;
const MAX_CARGA = 12;
const PRECO_SACA_ARROZ = 78.63;
const QUANTIDADE_LAMAS = 2;
const LAMA_LARGURA = 132;
const LAMA_ALTURA = 88;
const CHUVA_INICIO_SEGUNDOS = 25;
const CHUVA_DURACAO_SEGUNDOS = 9;
const CHUVA_LAMA_DELAY_SEGUNDOS = 2.8;

const spriteConfig = {
  colheitadeira: { src: "assets/colheitadeira-clean.png" },
  arrozMaduro: { src: "assets/arroz-maduro-clean.png" },
  lama: { src: "assets/lama-clean.png" },
  pedra: { src: "assets/pedra-clean.png" },
  galho: { src: "assets/galhos-clean.png" },
  campo: { src: "assets/campo-base.png" },
  chuva: { src: "assets/chuva-nuvens.png" }
};

const sprites = {
  colheitadeira: { imagem: null, pronto: false },
  arrozMaduro: { imagem: null, pronto: false },
  lama: { imagem: null, pronto: false },
  pedra: { imagem: null, pronto: false },
  galho: { imagem: null, pronto: false },
  campo: { imagem: null, pronto: false },
  chuva: { imagem: null, pronto: false }
};

const mensagensEducativas = [
  "Colher no tempo certo melhora a qualidade dos grãos.",
  "Tecnologia no campo aumenta eficiência e reduz perdas.",
  "Produção forte também depende de cuidado ambiental.",
  "Lama pesada exige estratégia para não perder tempo.",
  "Boa colheita é equilíbrio entre produtividade e sustentabilidade."
];

const colheitadeira = {
  x: canvas ? 130 : 0,
  y: canvas ? canvas.height / 2 : 0,
  larguraColisao: 74,
  alturaColisao: 44,
  larguraSprite: 112,
  alturaSprite: 74,
  velocidadeBase: 3.35,
  velocidadeAtual: 3.35,
  direcao: "right"
};

const zonaCaminhao = { x: 16, y: 186, largura: 130, altura: 148 };

const estado = {
  emExecucao: false,
  pausado: false,
  jogoFinalizado: false,
  tempoRestante: GAME_DURATION_SECONDS,
  pontuacao: 0,
  sacasColhidas: 0,
  sacasEntregues: 0,
  cargaAtual: 0,
  vida: 100,
  sustentabilidade: 100,
  eficiencia: 100,
  nivelAtolamento: 0,
  colheitasMaduras: 0,
  colheitasVerdes: 0,
  teclas: {},
  entidades: [],
  ultimoFrame: 0,
  frameId: null,
  ultimoDanoLama: 0,
  ultimoAvisoLama: 0,
  ultimoDescarregamento: 0,
  ultimoAvisoCargaCheia: 0,
  indiceMensagem: 0,
  ultimoAvisoMensagem: 0,
  qualidadeLote: 100,
  tipoLote: "Tipo 1",
  penalidadeLamaQualidade: 0,
  climaFase: "Céu limpo",
  chuvaIniciada: false,
  chuvaAtiva: false,
  chuvaEncerrada: false,
  chuvaInicioTimestamp: 0,
  lamasLiberadas: false,
  lamasPlanejadas: [],
  tempoNaLama: 0,
  encalhadoNaLama: false
};

const perguntasQuiz = [
  {
    pergunta: "Qual a vantagem de colher arroz no ponto certo?",
    opcoes: [
      "Aumentar desperdício",
      "Melhorar qualidade e reduzir perdas",
      "Gastar mais tempo sem necessidade",
      "Diminuir produtividade"
    ],
    correta: 1,
    explicacao: "Colheita no ponto certo reduz perdas e melhora o produto final."
  },
  {
    pergunta: "Por que proteger áreas ambientais próximas da lavoura?",
    opcoes: [
      "Porque não tem utilidade",
      "Para atrapalhar a produção",
      "Para proteger água, solo e biodiversidade",
      "Apenas por estética"
    ],
    correta: 2,
    explicacao: "Preservação ambiental protege recursos essenciais para o agro."
  },
  {
    pergunta: "Qual tecnologia ajuda a guiar máquinas no campo?",
    opcoes: ["GPS agrícola", "Lanterna", "Bússola antiga", "Rádio FM"],
    correta: 0,
    explicacao: "GPS agrícola permite trajetos mais precisos e eficientes."
  },
  {
    pergunta: "Lama intensa durante a colheita pode:",
    opcoes: [
      "Aumentar muito a velocidade",
      "Não alterar a operação",
      "Reduzir o ritmo e causar atolamento",
      "Melhorar automaticamente a eficiência"
    ],
    correta: 2,
    explicacao: "Atolamento reduz rendimento e exige estratégia de deslocamento."
  },
  {
    pergunta: "Uma ação sustentável na cultura do arroz é:",
    opcoes: [
      "Desperdiçar água de irrigação",
      "Ignorar conservação do solo",
      "Usar recursos de forma responsável",
      "Colher tudo antes de amadurecer"
    ],
    correta: 2,
    explicacao: "Uso responsável de recursos é base da sustentabilidade agrícola."
  },
  {
    pergunta: "A relação campo-cidade na cadeia do arroz:",
    opcoes: [
      "Não existe",
      "Conecta produção, economia e alimentação",
      "Depende apenas de máquinas",
      "Não envolve consumidores"
    ],
    correta: 1,
    explicacao: "O arroz liga o trabalho no campo ao consumo nas cidades."
  }
];

const estadoQuiz = {
  indiceAtual: 0,
  acertos: 0,
  ativo: false,
  respondeuAtual: false
};

const ETAPAS_PRODUCAO = [
  {
    titulo: "Preparo do solo",
    descricao: "Diagnóstico da área, correção e estruturação para iniciar a safra com base técnica.",
    pontos: [
      "Análise de solo para orientar decisão agronômica.",
      "Nivelamento e correção para melhor operação de máquinas.",
      "Planejamento da safra para reduzir risco e desperdício."
    ]
  },
  {
    titulo: "Plantio",
    descricao: "Sementes selecionadas, janela ideal e densidade correta para formar uma lavoura forte.",
    pontos: [
      "Escolha de cultivar adequada ao ambiente local.",
      "Semeadura no período de maior segurança climática.",
      "Distribuição uniforme para melhor aproveitamento da área."
    ]
  },
  {
    titulo: "Irrigação",
    descricao: "Gestão inteligente da água para garantir rendimento sem desperdício hídrico.",
    pontos: [
      "Controle de lâminas conforme fase da cultura.",
      "Monitoramento para evitar excesso e falta de água.",
      "Uso racional do recurso hídrico com foco em eficiência."
    ]
  },
  {
    titulo: "Crescimento da planta",
    descricao: "Monitoramento contínuo de clima, nutrição e sanidade para manter estabilidade produtiva.",
    pontos: [
      "Acompanhamento técnico da evolução da lavoura.",
      "Manejo nutricional e sanitário no momento certo.",
      "Resposta rápida a risco climático e operacional."
    ]
  },
  {
    titulo: "Colheita",
    descricao: "Operação no ponto ideal de maturação para reduzir perdas e elevar padrão dos grãos.",
    pontos: [
      "Definição do ponto correto para qualidade final.",
      "Regulagem de máquina para menor perda mecânica.",
      "Execução eficiente com foco em produtividade."
    ]
  },
  {
    titulo: "Secagem",
    descricao: "Controle de umidade para preservar qualidade, evitar deterioração e ampliar vida útil.",
    pontos: [
      "Redução da umidade para nível seguro de armazenagem.",
      "Padrão de qualidade para evitar fermentação.",
      "Conservação dos grãos para transporte e indústria."
    ]
  },
  {
    titulo: "Beneficiamento",
    descricao: "Limpeza e classificação que transformam produção em produto pronto para o mercado.",
    pontos: [
      "Remoção de impurezas e padronização dos lotes.",
      "Classificação conforme exigência de mercado.",
      "Valorização do produto final para comercialização."
    ]
  },
  {
    titulo: "Distribuição",
    descricao: "Logística com rastreabilidade para conectar eficiência no campo e confiança no consumo.",
    pontos: [
      "Transporte com controle de qualidade e origem.",
      "Fluxo entre produtor, indústria, varejo e consumidor.",
      "Integração entre eficiência no campo e segurança alimentar."
    ]
  }
];

function configurarEtapasProducao() {
  const botoes = Array.from(document.querySelectorAll(".production-step"));
  const indexEl = document.getElementById("prodIndex");
  const titleEl = document.getElementById("prodTitle");
  const descriptionEl = document.getElementById("prodDescription");
  const pointsEl = document.getElementById("prodPoints");
  const prevBtn = document.getElementById("prodPrev");
  const nextBtn = document.getElementById("prodNext");
  const progressEl = document.getElementById("prodProgress");

  if (!botoes.length || !indexEl || !titleEl || !descriptionEl || !pointsEl || !prevBtn || !nextBtn || !progressEl) return;

  let etapaAtual = 0;

  const renderizarEtapa = (indice) => {
    etapaAtual = limitar(indice, 0, ETAPAS_PRODUCAO.length - 1);
    const etapa = ETAPAS_PRODUCAO[etapaAtual];
    indexEl.textContent = `Etapa ${etapaAtual + 1} de ${ETAPAS_PRODUCAO.length}`;
    titleEl.textContent = etapa.titulo;
    descriptionEl.textContent = etapa.descricao;
    pointsEl.innerHTML = etapa.pontos.map((ponto) => `<li>${ponto}</li>`).join("");

    botoes.forEach((botao) => {
      const ativo = Number(botao.dataset.step) === etapaAtual;
      botao.classList.toggle("active", ativo);
      botao.setAttribute("aria-selected", ativo ? "true" : "false");
    });

    const progresso = ((etapaAtual + 1) / ETAPAS_PRODUCAO.length) * 100;
    progressEl.style.width = `${progresso}%`;
    prevBtn.disabled = etapaAtual === 0;
    nextBtn.textContent = etapaAtual === ETAPAS_PRODUCAO.length - 1 ? "Reiniciar ciclo" : "Próxima etapa";
  };

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const indice = Number(botao.dataset.step);
      renderizarEtapa(indice);
    });
  });

  prevBtn.addEventListener("click", () => renderizarEtapa(etapaAtual - 1));
  nextBtn.addEventListener("click", () => {
    if (etapaAtual === ETAPAS_PRODUCAO.length - 1) {
      renderizarEtapa(0);
      return;
    }
    renderizarEtapa(etapaAtual + 1);
  });

  renderizarEtapa(0);
}

function configurarMenuResponsivo() {
  if (!menuToggle || !mainNav) return;
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}

function configurarInstrucoes() {
  if (!instructionsBtn || !closeInstructionsBtn || !instructionsModal) return;
  instructionsBtn.addEventListener("click", () => instructionsModal.showModal());
  closeInstructionsBtn.addEventListener("click", () => instructionsModal.close());
}

function configurarControlesTeclado() {
  window.addEventListener("keydown", (event) => {
    const tecla = event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(tecla)) {
      event.preventDefault();
    }
    estado.teclas[tecla] = true;
  });
  window.addEventListener("keyup", (event) => {
    estado.teclas[event.key] = false;
  });
}

function configurarControlesToque() {
  touchButtons.forEach((botao) => {
    const tecla = botao.dataset.key;
    botao.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      estado.teclas[tecla] = true;
      botao.setPointerCapture(event.pointerId);
    });
    const liberar = () => {
      estado.teclas[tecla] = false;
    };
    botao.addEventListener("pointerup", liberar);
    botao.addEventListener("pointercancel", liberar);
    botao.addEventListener("pointerleave", liberar);
  });
}

function prepararLayoutJogo() {
  const hudGrid = document.querySelector(".hud-grid");
  if (hudGrid) hudGrid.classList.add("hidden");

  const gameWrap = document.querySelector(".game-board-wrap");
  if (gameWrap && startBtn) {
    startBtn.classList.add("start-overlay-btn");
    gameWrap.appendChild(startBtn);
  }

  if (phaseObjectiveEl) {
    phaseObjectiveEl.textContent = "Objetivo: colher e descarregar antes do tempo acabar.";
  }

  if (resultCombustivel) {
    const linha = resultCombustivel.closest("p");
    const rotulo = linha ? linha.querySelector("strong") : null;
    if (linha) linha.classList.remove("hidden");
    if (rotulo) rotulo.textContent = "Tipo de lote final:";
    resultCombustivel.textContent = "Tipo 1 (100/100)";
  }
}

function configurarBotoesJogo() {
  if (startBtn) startBtn.addEventListener("click", iniciarJogo);
  if (pauseBtn) pauseBtn.addEventListener("click", pausarJogo);
  if (restartBtn) restartBtn.addEventListener("click", reiniciarJogo);
}

function configurarQuiz() {
  if (!startQuizBtn || !nextQuestionBtn) return;
  startQuizBtn.addEventListener("click", iniciarQuiz);
  nextQuestionBtn.addEventListener("click", () => {
    estadoQuiz.indiceAtual += 1;
    renderizarPerguntaQuiz();
  });
}

function carregarSprites() {
  Object.keys(spriteConfig).forEach((chave) => carregarSprite(chave, spriteConfig[chave]));
}

function carregarSprite(chave, config) {
  const imagem = new Image();
  imagem.decoding = "async";
  imagem.onload = () => {
    sprites[chave].imagem = chave === "chuva" ? limparFundoSpriteChuva(imagem) : imagem;
    sprites[chave].pronto = true;
    desenharCena();
  };
  imagem.onerror = () => {
    sprites[chave].pronto = false;
    sprites[chave].imagem = null;
  };
  imagem.src = config.src;
}

function limparFundoSpriteChuva(imagemOriginal) {
  const offCanvas = document.createElement("canvas");
  offCanvas.width = imagemOriginal.width;
  offCanvas.height = imagemOriginal.height;
  const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
  if (!offCtx) return imagemOriginal;

  offCtx.drawImage(imagemOriginal, 0, 0);
  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const { data, width, height } = imageData;
  const total = width * height;
  const visitado = new Uint8Array(total);
  const fila = new Int32Array(total);
  let inicio = 0;
  let fim = 0;

  const pixelEhFundo = (indicePixel) => {
    const base = indicePixel * 4;
    const r = data[base];
    const g = data[base + 1];
    const b = data[base + 2];
    const a = data[base + 3];
    if (a === 0) return false;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brilho = (r + g + b) / 3;
    return brilho > 188 && max - min < 30;
  };

  const enfileirar = (indicePixel) => {
    if (visitado[indicePixel]) return;
    if (!pixelEhFundo(indicePixel)) return;
    visitado[indicePixel] = 1;
    fila[fim] = indicePixel;
    fim += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enfileirar(x);
    enfileirar((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enfileirar(y * width);
    enfileirar(y * width + (width - 1));
  }

  while (inicio < fim) {
    const atual = fila[inicio];
    inicio += 1;
    const x = atual % width;
    const y = Math.floor(atual / width);

    if (x > 0) enfileirar(atual - 1);
    if (x < width - 1) enfileirar(atual + 1);
    if (y > 0) enfileirar(atual - width);
    if (y < height - 1) enfileirar(atual + width);
  }

  for (let i = 0; i < total; i += 1) {
    if (!visitado[i]) continue;
    data[i * 4 + 3] = 0;
  }

  offCtx.putImageData(imageData, 0, 0);
  return offCanvas;
}

function iniciarJogo() {
  if (!ctx) return;

  if (estado.emExecucao && estado.pausado) {
    estado.pausado = false;
    registrarDiario("Missão retomada.");
    if (pauseBtn) pauseBtn.textContent = "Pausar";
    return;
  }

  if (estado.emExecucao) return;

  reiniciarEstadoPartida(true);
  gerarEntidades();
  estado.emExecucao = true;
  estado.jogoFinalizado = false;
  estado.pausado = false;
  estado.ultimoFrame = 0;
  if (pauseBtn) pauseBtn.textContent = "Pausar";
  if (startBtn) startBtn.classList.add("hidden");
  if (resultPanel) resultPanel.classList.add("hidden");
  registrarDiario("Missão iniciada. Colha e descarregue no caminhão!");
  mostrarMensagemEducativa("Missão ativa: encha a colheitadeira e descarregue no caminhão.");
  estado.frameId = requestAnimationFrame(gameLoop);
}

function pausarJogo() {
  if (!estado.emExecucao || estado.jogoFinalizado) return;
  estado.pausado = !estado.pausado;
  if (pauseBtn) pauseBtn.textContent = estado.pausado ? "Retomar" : "Pausar";
  registrarDiario(estado.pausado ? "Jogo pausado." : "Jogo retomado.");
}

function reiniciarJogo() {
  if (estado.frameId) cancelAnimationFrame(estado.frameId);
  estado.emExecucao = false;
  estado.pausado = false;
  estado.jogoFinalizado = false;
  reiniciarEstadoPartida(true);
  gerarEntidades();
  atualizarInterface();
  desenharCena();
  if (resultPanel) resultPanel.classList.add("hidden");
  if (startBtn) {
    startBtn.classList.remove("hidden");
    startBtn.textContent = "Iniciar";
  }
  if (pauseBtn) pauseBtn.textContent = "Pausar";
  registrarDiario("Missão reiniciada.");
}

function reiniciarEstadoPartida(limparDiarioLista) {
  estado.tempoRestante = GAME_DURATION_SECONDS;
  estado.pontuacao = 0;
  estado.sacasColhidas = 0;
  estado.sacasEntregues = 0;
  estado.cargaAtual = 0;
  estado.vida = 100;
  estado.sustentabilidade = 100;
  estado.eficiencia = 100;
  estado.nivelAtolamento = 0;
  estado.colheitasMaduras = 0;
  estado.colheitasVerdes = 0;
  estado.teclas = {};
  estado.entidades = [];
  estado.ultimoDanoLama = 0;
  estado.ultimoAvisoLama = 0;
  estado.ultimoDescarregamento = 0;
  estado.ultimoAvisoCargaCheia = 0;
  estado.indiceMensagem = 0;
  estado.ultimoAvisoMensagem = 0;
  estado.qualidadeLote = 100;
  estado.tipoLote = "Tipo 1";
  estado.penalidadeLamaQualidade = 0;
  estado.climaFase = "Céu limpo";
  estado.chuvaIniciada = false;
  estado.chuvaAtiva = false;
  estado.chuvaEncerrada = false;
  estado.chuvaInicioTimestamp = 0;
  estado.lamasLiberadas = false;
  estado.lamasPlanejadas = gerarLamasPlanejadas();
  estado.tempoNaLama = 0;
  estado.encalhadoNaLama = false;
  colheitadeira.x = 170;
  colheitadeira.y = canvas ? canvas.height / 2 : 0;
  colheitadeira.direcao = "right";
  if (limparDiarioLista) limparDiario();
}

function gerarEntidades() {
  estado.entidades = [];
  adicionarEntidades("arrozMaduro", 22, 42, 42);
  adicionarEntidades("pedra", 7, 30, 30);
  adicionarEntidades("galho", 7, 46, 30);
}

function adicionarLamasFixas() {
  estado.lamasPlanejadas.forEach((lama) => {
    estado.entidades.push({
      tipo: "lama",
      x: lama.x,
      y: lama.y,
      largura: lama.largura,
      altura: lama.altura,
      nivelLama: lama.nivelLama,
      ativo: true,
      flip: false
    });
  });
}

function gerarLamasPlanejadas() {
  if (!canvas) return [];

  const lamas = [];
  const areaInicialColheitadeira = {
    x: 120,
    y: canvas.height / 2 - 90,
    largura: 180,
    altura: 180
  };

  let tentativa = 0;
  while (lamas.length < QUANTIDADE_LAMAS && tentativa < 220) {
    tentativa += 1;
    const lama = {
      x: randomInt(188, canvas.width - LAMA_LARGURA - 20),
      y: randomInt(24, canvas.height - LAMA_ALTURA - 20),
      largura: LAMA_LARGURA,
      altura: LAMA_ALTURA,
      nivelLama: randomInt(1, 3),
      ativo: true,
      flip: false
    };

    const pertoDoCaminhao = retangulosColidem(lama, zonaCaminhao, 6);
    const pertoDoSpawn = retangulosColidem(lama, areaInicialColheitadeira, 8);
    const sobrepoeOutraLama = lamas.some((outra) => retangulosComDistancia(lama, outra, 150));
    if (!pertoDoCaminhao && !pertoDoSpawn && !sobrepoeOutraLama) {
      lamas.push(lama);
    }
  }

  while (lamas.length < QUANTIDADE_LAMAS) {
    lamas.push({
      x: 330 + lamas.length * 220,
      y: 140 + lamas.length * 120,
      largura: LAMA_LARGURA,
      altura: LAMA_ALTURA,
      nivelLama: 2,
      ativo: true,
      flip: false
    });
  }

  return lamas;
}

function atualizarEventoClimatico(delta, timestamp) {
  const tempoDecorrido = GAME_DURATION_SECONDS - estado.tempoRestante;

  if (!estado.chuvaIniciada && tempoDecorrido >= CHUVA_INICIO_SEGUNDOS) {
    estado.chuvaIniciada = true;
    estado.chuvaAtiva = true;
    estado.chuvaEncerrada = false;
    estado.chuvaInicioTimestamp = timestamp;
    estado.climaFase = "Chuva";
    registrarDiario("Chuva chegando na lavoura.");
    mostrarMensagemEducativa("Chuva no campo: cuidado com a lama.");
  }

  if (!estado.chuvaIniciada) return;
  if (!estado.chuvaAtiva) return;

  const tempoChuva = (timestamp - estado.chuvaInicioTimestamp) / 1000;
  if (!estado.lamasLiberadas && tempoChuva >= CHUVA_LAMA_DELAY_SEGUNDOS) {
    adicionarLamasFixas();
    estado.lamasLiberadas = true;
    estado.climaFase = "Pós-chuva com lama";
    registrarDiario("A chuva encharcou o solo. Duas áreas de lama surgiram no campo.");
    mostrarMensagemEducativa("Não entre na lama: ficar muito tempo pode encalhar a máquina.");
  }

  if (tempoChuva >= CHUVA_DURACAO_SEGUNDOS) {
    estado.chuvaAtiva = false;
    estado.chuvaEncerrada = true;
    if (estado.lamasLiberadas) estado.climaFase = "Pós-chuva com lama";
    else estado.climaFase = "Pós-chuva";
    registrarDiario("A chuva passou, mas o solo segue desafiador.");
  }
}

function adicionarEntidades(tipo, quantidade, largura, altura) {
  for (let i = 0; i < quantidade; i += 1) {
    estado.entidades.push(gerarEntidade(tipo, largura, altura));
  }
}

function gerarEntidade(tipo, largura, altura) {
  let tentativa = 0;
  while (tentativa < 80) {
    tentativa += 1;
    const xMin = tipo === "lama" ? 170 : 180;
    const x = randomInt(xMin, canvas.width - largura - 18);
    const y = randomInt(20, canvas.height - altura - 18);
    const entidade = {
      tipo,
      x,
      y,
      largura,
      altura,
      nivelLama: tipo === "lama" ? randomInt(1, 3) : 0,
      ativo: true,
      flip: Math.random() > 0.5
    };
    const colideOutra = estado.entidades.some((item) => {
      const margemBase = 8;
      const margemLama = tipo === "lama" && item.tipo === "lama" ? 64 : margemBase;
      return retangulosColidem(entidade, item, margemLama);
    });
    const muitoPertoCaminhao = retangulosColidem(entidade, zonaCaminhao, 0);
    const conflitaComLamaFutura = tipo !== "lama" && estado.lamasPlanejadas.some((lama) => retangulosColidem(entidade, lama, 6));
    if (!colideOutra && !muitoPertoCaminhao && !conflitaComLamaFutura) return entidade;
  }
  return {
    tipo,
    x: randomInt(180, canvas.width - largura - 20),
    y: randomInt(20, canvas.height - altura - 20),
    largura,
    altura,
    nivelLama: tipo === "lama" ? randomInt(1, 3) : 0,
    ativo: true,
    flip: Math.random() > 0.5
  };
}

function gameLoop(timestamp) {
  if (!estado.emExecucao) return;

  if (estado.pausado) {
    estado.ultimoFrame = timestamp;
    desenharCena();
    estado.frameId = requestAnimationFrame(gameLoop);
    return;
  }

  if (!estado.ultimoFrame) estado.ultimoFrame = timestamp;
  const delta = Math.min((timestamp - estado.ultimoFrame) / 1000, 0.05);
  estado.ultimoFrame = timestamp;

  atualizarEventoClimatico(delta, timestamp);
  moverColheitadeira(delta, timestamp);
  if (estado.encalhadoNaLama) {
    finalizarJogo("Encalhado na lama por 5 segundos.");
    return;
  }
  detectarColisoes(timestamp);
  atualizarMensagensAutomaticas(timestamp);
  atualizarEficiencia();
  atualizarQualidadeLote(delta);

  estado.tempoRestante -= delta;

  desenharCena();
  atualizarInterface();

  if (estado.tempoRestante <= 0) {
    finalizarJogo("Tempo encerrado.");
    return;
  }
  if (estado.vida <= 0) {
    finalizarJogo("A colheitadeira não suportou os impactos.");
    return;
  }
  if (estado.sustentabilidade <= 0) {
    finalizarJogo("Sustentabilidade zerada.");
    return;
  }

  estado.frameId = requestAnimationFrame(gameLoop);
}

function moverColheitadeira(delta, timestamp) {
  let eixoX = 0;
  let eixoY = 0;

  if (estado.teclas.ArrowUp || estado.teclas.w || estado.teclas.W) eixoY -= 1;
  if (estado.teclas.ArrowDown || estado.teclas.s || estado.teclas.S) eixoY += 1;
  if (estado.teclas.ArrowLeft || estado.teclas.a || estado.teclas.A) eixoX -= 1;
  if (estado.teclas.ArrowRight || estado.teclas.d || estado.teclas.D) eixoX += 1;

  if (eixoX !== 0 && eixoY !== 0) {
    eixoX *= 0.7071;
    eixoY *= 0.7071;
  }

  const nivelLama = obterNivelLamaAtual();
  estado.nivelAtolamento = nivelLama;
  const fatorLama = nivelLama === 1 ? 0.82 : nivelLama === 2 ? 0.58 : nivelLama === 3 ? 0.3 : 1;
  colheitadeira.velocidadeAtual = colheitadeira.velocidadeBase * fatorLama;

  if (nivelLama !== 0 && timestamp - estado.ultimoAvisoLama > 2500) {
    estado.ultimoAvisoLama = timestamp;
    registrarDiario("Atenção: não entre na lama.");
    mostrarMensagemEducativa("Não entre na lama. Se ficar 5 segundos nela, a máquina encalha.");
  }

  if (nivelLama > 0) {
    estado.tempoNaLama += delta;
    if (estado.tempoNaLama >= 5) {
      estado.encalhadoNaLama = true;
      registrarDiario("A colheitadeira ficou presa na lama por muito tempo.");
      mostrarMensagemEducativa("Encalhado: 5 segundos na lama.");
      return;
    }
  } else {
    estado.tempoNaLama = 0;
  }

  if (nivelLama === 3 && (eixoX !== 0 || eixoY !== 0) && timestamp - estado.ultimoDanoLama > 900) {
    estado.ultimoDanoLama = timestamp;
    estado.vida -= 1.2;
  }

  if (eixoX > 0) colheitadeira.direcao = "right";
  if (eixoX < 0) colheitadeira.direcao = "left";

  const velocidadePixel = colheitadeira.velocidadeAtual * 60 * delta;
  const desvioPatinada = nivelLama === 3 ? Math.sin(timestamp / 70) * 0.8 : 0;
  colheitadeira.x += eixoX * velocidadePixel + desvioPatinada;
  colheitadeira.y += eixoY * velocidadePixel;

  colheitadeira.x = limitar(colheitadeira.x, colheitadeira.larguraColisao / 2, canvas.width - colheitadeira.larguraColisao / 2);
  colheitadeira.y = limitar(colheitadeira.y, colheitadeira.alturaColisao / 2, canvas.height - colheitadeira.alturaColisao / 2);
}

function obterNivelLamaAtual() {
  const jogador = retanguloJogador();
  let maiorNivel = 0;
  estado.entidades.forEach((entidade) => {
    if (!entidade.ativo) return;
    if (entidade.tipo !== "lama") return;
    if (!retangulosColidem(jogador, entidade, 0)) return;
    maiorNivel = Math.max(maiorNivel, entidade.nivelLama);
  });
  return maiorNivel;
}

function detectarColisoes(timestamp) {
  const jogador = retanguloJogador();
  const plataforma = retanguloPlataforma();

  estado.entidades.forEach((entidade) => {
    if (!entidade.ativo) return;

    if (entidade.tipo === "arrozMaduro") {
      if (!retangulosColidem(plataforma, entidade, 0)) return;
      if (estado.cargaAtual >= MAX_CARGA) {
        if (timestamp - estado.ultimoAvisoCargaCheia > 1300) {
          estado.ultimoAvisoCargaCheia = timestamp;
          registrarDiario("Carga cheia. Vá para o caminhão descarregar.");
          mostrarMensagemEducativa("Carga cheia. Aproxime-se do caminhão para descarregar.");
        }
        return;
      }
      estado.cargaAtual += 1;
      estado.sacasColhidas += 1;
      estado.colheitasMaduras += 1;
      estado.pontuacao += 10;
      reposicionarEntidade(entidade);
      registrarDiario("Arroz maduro coletado. Carga +1.");
      return;
    }

    if (!retangulosColidem(jogador, entidade, 0)) return;

    if (entidade.tipo === "pedra") {
      estado.vida -= 8;
      estado.pontuacao -= 2;
      entidade.ativo = false;
      registrarDiario("Pedra removida da rota.");
      return;
    }

    if (entidade.tipo === "galho") {
      estado.vida -= 4;
      estado.pontuacao -= 1;
      entidade.ativo = false;
      registrarDiario("Galho removido da rota.");
      return;
    }
  });

  if (retangulosColidem(jogador, zonaCaminhao, 0) && estado.cargaAtual > 0 && timestamp - estado.ultimoDescarregamento > 1000) {
    const cargaEntregue = estado.cargaAtual;
    estado.cargaAtual = 0;
    estado.sacasEntregues += cargaEntregue;
    estado.pontuacao += cargaEntregue * 6;
    estado.ultimoDescarregamento = timestamp;
    registrarDiario("Carga descarregada no caminhão: " + cargaEntregue + " sacas.");
    mostrarMensagemEducativa("Descarga concluída. Retorne para a área de colheita.");
  }
}
function reposicionarEntidade(entidade) {
  const nova = gerarEntidade(entidade.tipo, entidade.largura, entidade.altura);
  entidade.x = nova.x;
  entidade.y = nova.y;
  entidade.nivelLama = nova.nivelLama;
  entidade.flip = nova.flip;
}

function atualizarEficiencia() {
  const total = estado.colheitasMaduras + estado.colheitasVerdes;
  estado.eficiencia = total === 0 ? 100 : (estado.colheitasMaduras / total) * 100;
}

function atualizarQualidadeLote(delta) {
  if (estado.nivelAtolamento === 1) estado.penalidadeLamaQualidade += delta * 0.95;
  if (estado.nivelAtolamento === 2) estado.penalidadeLamaQualidade += delta * 1.7;
  if (estado.nivelAtolamento === 3) estado.penalidadeLamaQualidade += delta * 3.0;

  const tempoDecorrido = GAME_DURATION_SECONDS - estado.tempoRestante;
  const penalidadeVida = (100 - limitar(estado.vida, 0, 100)) * 0.7;
  const penalidadeLama = Math.min(28, estado.penalidadeLamaQualidade);
  const penalidadeTempo = limitar((tempoDecorrido / GAME_DURATION_SECONDS) * 8, 0, 8);

  estado.qualidadeLote = limitar(100 - penalidadeVida - penalidadeLama - penalidadeTempo, 0, 100);
  estado.tipoLote = calcularTipoLote(estado.qualidadeLote);
}

function calcularTipoLote(qualidade) {
  if (qualidade >= 86) return "Tipo 1";
  if (qualidade >= 71) return "Tipo 2";
  if (qualidade >= 51) return "Tipo 3";
  if (qualidade >= 31) return "Tipo 4";
  return "Tipo 5";
}

function mudarFase() {
  return false;
}

function finalizarJogo(motivo) {
  estado.emExecucao = false;
  estado.pausado = false;
  estado.jogoFinalizado = true;
  if (estado.frameId) cancelAnimationFrame(estado.frameId);
  if (pauseBtn) pauseBtn.textContent = "Pausar";

  const notaFinal = calcularNotaFinal();
  const classificacao = calcularClassificacao(notaFinal);
  const sacasEntregues = Math.round(estado.sacasEntregues);
  const lucroEstimado = sacasEntregues * PRECO_SACA_ARROZ;

  if (resultSacas) resultSacas.textContent = String(estado.sacasColhidas);
  if (resultPontos) resultPontos.textContent = String(Math.max(0, Math.round(estado.pontuacao)));
  if (resultVida) resultVida.textContent = `${Math.max(0, Math.round(estado.vida))}%`;
  if (resultSustentabilidade) resultSustentabilidade.textContent = `${Math.max(0, Math.round(estado.sustentabilidade))}%`;
  if (resultClassificacao) resultClassificacao.textContent = `${classificacao} (${Math.round(notaFinal)}/100)`;
  if (resultEntregue) resultEntregue.textContent = `${sacasEntregues} sacas`;
  if (resultLucro) resultLucro.textContent = formatarMoeda(lucroEstimado);
  if (resultCombustivel) resultCombustivel.textContent = `${estado.tipoLote} (${Math.round(estado.qualidadeLote)}/100)`;
  if (resultPanel) resultPanel.classList.remove("hidden");

  if (startBtn) {
    startBtn.classList.remove("hidden");
    startBtn.textContent = "Jogar novamente";
  }

  registrarDiario("Fim de jogo: " + motivo);
  mostrarMensagemEducativa(motivo);
  desenharCena();
  atualizarInterface();
}

function calcularNotaFinal() {
  const componenteEntrega = limitar((estado.sacasEntregues / 40) * 45, 0, 45);
  const componentePontuacao = limitar((Math.max(0, estado.pontuacao) / 600) * 20, 0, 20);
  const componenteVida = limitar(estado.vida, 0, 100) * 0.15;
  const componenteSustentabilidade = limitar(estado.sustentabilidade, 0, 100) * 0.15;
  const componenteEficiencia = limitar(estado.eficiencia, 0, 100) * 0.05;
  return componenteEntrega + componentePontuacao + componenteVida + componenteSustentabilidade + componenteEficiencia;
}

function calcularClassificacao(notaFinal) {
  if (notaFinal >= 85) return "Mestre da Colheita Sustentável";
  if (notaFinal >= 65) return "Produtor Consciente";
  if (notaFinal >= 40) return "Colheita em Risco";
  return "Campo Prejudicado";
}

function registrarDiario(acao) {
  if (!diaryListEl) return;
  const horario = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  diaryListEl.textContent = `[${horario}] ${acao}`;
}

function limparDiario() {
  if (!diaryListEl) return;
  diaryListEl.textContent = "Nenhuma ação registrada.";
}

function mostrarMensagemEducativa(texto) {
  if (educationalMessageEl) educationalMessageEl.textContent = texto;
}

function atualizarMensagensAutomaticas(timestamp) {
  if (timestamp - estado.ultimoAvisoMensagem < 9500) return;
  estado.ultimoAvisoMensagem = timestamp;
  estado.indiceMensagem = (estado.indiceMensagem + 1) % mensagensEducativas.length;
  mostrarMensagemEducativa(mensagensEducativas[estado.indiceMensagem]);
}

function atualizarInterface() {
  if (hudTempo) hudTempo.textContent = formatarTempo(Math.max(0, estado.tempoRestante));
  if (hudFase) hudFase.textContent = estado.climaFase;
  if (hudSacas) hudSacas.textContent = String(estado.sacasColhidas);
  if (hudPontuacao) hudPontuacao.textContent = String(Math.round(estado.pontuacao));
  if (hudCombustivel) hudCombustivel.textContent = `${estado.tipoLote} (${Math.round(estado.qualidadeLote)})`;
  if (hudVida) hudVida.textContent = `${Math.max(0, Math.round(estado.vida))}%`;
  if (hudSustentabilidade) hudSustentabilidade.textContent = `${Math.max(0, Math.round(estado.sustentabilidade))}%`;
  if (hudEficiencia) hudEficiencia.textContent = `${Math.max(0, Math.round(estado.eficiencia))}%`;
}

function formatarTempo(segundos) {
  const total = Math.max(0, Math.floor(segundos));
  const min = String(Math.floor(total / 60)).padStart(2, "0");
  const sec = String(total % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function desenharCena() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharFundo();
  desenharClimaChuva();
  desenharZonaCaminhao();
  desenharEntidades();
  desenharColheitadeira();
  desenharPainelHUDCanvas();

  if (!estado.emExecucao && !estado.jogoFinalizado) {
    desenharOverlayTexto("Clique em Iniciar");
  }
  if (estado.pausado) {
    desenharOverlayTexto("PAUSADO");
  }
}

function desenharFundo() {
  if (sprites.campo.pronto && sprites.campo.imagem) {
    ctx.drawImage(sprites.campo.imagem, 0, 0, canvas.width, canvas.height);
    return;
  }
  const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradiente.addColorStop(0, "#8dd3ed");
  gradiente.addColorStop(0.2, "#74be74");
  gradiente.addColorStop(1, "#4c9844");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function desenharClimaChuva() {
  if (!estado.chuvaAtiva) return;

  ctx.fillStyle = "rgba(18, 38, 56, 0.24)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const t = performance.now() * 0.045;
  ctx.strokeStyle = "rgba(145, 205, 255, 0.66)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 150; i += 1) {
    const x = ((i * 37 + t * 54) % (canvas.width + 44)) - 22;
    const y = ((i * 71 + t * 116) % (canvas.height + 58)) - 28;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y + 16);
    ctx.stroke();
  }
}

function desenharZonaCaminhao() {
  ctx.fillStyle = "rgba(14, 31, 41, 0.24)";
  ctx.fillRect(zonaCaminhao.x, zonaCaminhao.y, zonaCaminhao.largura, zonaCaminhao.altura);
  ctx.strokeStyle = "rgba(255, 241, 171, 0.8)";
  ctx.lineWidth = 2;
  ctx.strokeRect(zonaCaminhao.x + 1, zonaCaminhao.y + 1, zonaCaminhao.largura - 2, zonaCaminhao.altura - 2);
  ctx.fillStyle = "#fff2b3";
  ctx.font = "bold 12px Trebuchet MS";
  ctx.fillText("Descarga", zonaCaminhao.x + 28, zonaCaminhao.y - 8);
}

function desenharEntidades() {
  const ordem = ["lama", "arrozMaduro", "pedra", "galho"];
  ordem.forEach((tipo) => {
    estado.entidades.forEach((entidade) => {
      if (!entidade.ativo) return;
      if (entidade.tipo !== tipo) return;
      desenharEntidade(entidade);
    });
  });
}

function desenharEntidade(entidade) {
  const { tipo, x, y, largura, altura } = entidade;

  if (tipo === "lama") {
    if (sprites.lama.pronto && sprites.lama.imagem) {
      ctx.drawImage(sprites.lama.imagem, x, y, largura, altura);
    } else {
      ctx.fillStyle = "#6d4a2d";
      ctx.fillRect(x, y, largura, altura);
    }
    return;
  }

  if (tipo === "arrozMaduro") {
    if (sprites.arrozMaduro.pronto && sprites.arrozMaduro.imagem) {
      ctx.drawImage(sprites.arrozMaduro.imagem, x, y, largura, altura);
    } else {
      ctx.fillStyle = "#e5b94e";
      ctx.fillRect(x + 4, y + 8, largura - 8, altura - 8);
    }
    return;
  }

  if (tipo === "pedra") {
    if (sprites.pedra.pronto && sprites.pedra.imagem) {
      ctx.drawImage(sprites.pedra.imagem, x, y, largura, altura);
    } else {
      ctx.fillStyle = "#6f7071";
      ctx.fillRect(x, y, largura, altura);
    }
    return;
  }

  if (tipo === "galho") {
    if (sprites.galho.pronto && sprites.galho.imagem) {
      ctx.save();
      ctx.translate(x + largura / 2, y + altura / 2);
      if (entidade.flip) ctx.scale(-1, 1);
      ctx.rotate(entidade.flip ? -0.22 : 0.18);
      ctx.drawImage(sprites.galho.imagem, -largura / 2, -altura / 2, largura, altura);
      ctx.restore();
    } else {
      ctx.strokeStyle = "#8d5e31";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + altura - 5);
      ctx.lineTo(x + largura - 4, y + 5);
      ctx.stroke();
    }
  }
}

function desenharColheitadeira() {
  const x = colheitadeira.x;
  const y = colheitadeira.y;

  if (sprites.colheitadeira.pronto && sprites.colheitadeira.imagem) {
    ctx.save();
    ctx.translate(x, y);
    if (colheitadeira.direcao === "right") ctx.scale(-1, 1);
    ctx.drawImage(
      sprites.colheitadeira.imagem,
      -colheitadeira.larguraSprite / 2,
      -colheitadeira.alturaSprite / 2,
      colheitadeira.larguraSprite,
      colheitadeira.alturaSprite
    );
    ctx.restore();
  } else {
    const esquerda = x - colheitadeira.larguraColisao / 2;
    const topo = y - colheitadeira.alturaColisao / 2;
    ctx.fillStyle = "#f3bd40";
    ctx.fillRect(esquerda, topo, colheitadeira.larguraColisao, colheitadeira.alturaColisao);
    ctx.fillStyle = "#2f2e2d";
    ctx.beginPath();
    ctx.arc(esquerda + 12, topo + colheitadeira.alturaColisao, 7, 0, Math.PI * 2);
    ctx.arc(esquerda + colheitadeira.larguraColisao - 12, topo + colheitadeira.alturaColisao, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const larguraBarra = 60;
  const alturaBarra = 8;
  const topoBarra = y - colheitadeira.alturaSprite / 2 - 16;
  const esquerdaBarra = x - larguraBarra / 2;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(esquerdaBarra, topoBarra, larguraBarra, alturaBarra);
  ctx.fillStyle = "#f2cf66";
  ctx.fillRect(esquerdaBarra, topoBarra, larguraBarra * (estado.cargaAtual / MAX_CARGA), alturaBarra);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeRect(esquerdaBarra, topoBarra, larguraBarra, alturaBarra);
}

function desenharPainelHUDCanvas() {
  const avisoLama = estado.nivelAtolamento > 0
    ? `SAIA DA LAMA ${Math.max(0, 5 - estado.tempoNaLama).toFixed(1)}s`
    : estado.lamasLiberadas
      ? "Evite a lama"
      : "";
  const alturaPainel = avisoLama ? 132 : 112;

  ctx.fillStyle = "rgba(8, 22, 14, 0.62)";
  ctx.fillRect(12, 12, 238, alturaPainel);
  ctx.strokeStyle = "rgba(255, 232, 155, 0.42)";
  ctx.lineWidth = 1;
  ctx.strokeRect(12, 12, 238, alturaPainel);

  ctx.fillStyle = "#fff3ca";
  ctx.font = "bold 14px Trebuchet MS";
  ctx.fillText(`Tempo ${formatarTempo(estado.tempoRestante)}`, 22, 34);
  ctx.fillText(`Carga ${estado.cargaAtual}/${MAX_CARGA}`, 132, 34);

  ctx.font = "12px Trebuchet MS";
  ctx.fillText(`Colhidas ${estado.sacasColhidas}`, 22, 58);
  ctx.fillText(`Entregues ${Math.round(estado.sacasEntregues)}`, 132, 58);
  ctx.fillText(`Pontos ${Math.round(estado.pontuacao)}`, 22, 80);
  ctx.fillText(`${estado.tipoLote} (${Math.round(estado.qualidadeLote)})`, 132, 80);
  ctx.fillText(`Vida ${Math.max(0, Math.round(estado.vida))}%`, 22, 102);
  ctx.fillText(`Sust. ${Math.max(0, Math.round(estado.sustentabilidade))}%`, 132, 102);

  if (avisoLama) {
    ctx.fillStyle = estado.nivelAtolamento > 0 ? "#ffcf9e" : "#fff3ca";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText(avisoLama, 22, 124);
  }
}

function desenharOverlayTexto(texto) {
  ctx.fillStyle = "rgba(8, 19, 12, 0.42)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff8dc";
  ctx.font = "bold 36px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(texto, canvas.width / 2, canvas.height / 2);
  ctx.textAlign = "left";
}

function retanguloJogador() {
  return {
    x: colheitadeira.x - colheitadeira.larguraColisao / 2,
    y: colheitadeira.y - colheitadeira.alturaColisao / 2,
    largura: colheitadeira.larguraColisao,
    altura: colheitadeira.alturaColisao
  };
}
function retanguloPlataforma() {
  const base = retanguloJogador();
  const larguraCabecote = Math.round(colheitadeira.larguraColisao * 0.42);
  const alturaCabecote = Math.round(colheitadeira.alturaColisao * 0.9);
  const alcanceFrontal = 16;
  const y = colheitadeira.y - alturaCabecote / 2;

  if (colheitadeira.direcao === "right") {
    return {
      x: base.x + base.largura - 6,
      y,
      largura: larguraCabecote + alcanceFrontal,
      altura: alturaCabecote
    };
  }

  return {
    x: base.x - larguraCabecote - alcanceFrontal + 6,
    y,
    largura: larguraCabecote + alcanceFrontal,
    altura: alturaCabecote
  };
}

function retangulosColidem(a, b, margem) {
  return !(
    a.x + a.largura - margem < b.x ||
    a.x + margem > b.x + b.largura ||
    a.y + a.altura - margem < b.y ||
    a.y + margem > b.y + b.altura
  );
}

function retangulosComDistancia(a, b, distancia) {
  const expandido = {
    x: a.x - distancia,
    y: a.y - distancia,
    largura: a.largura + distancia * 2,
    altura: a.altura + distancia * 2
  };
  return retangulosColidem(expandido, b, 0);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limitar(valor, min, max) {
  return Math.max(min, Math.min(max, valor));
}

function iniciarQuiz() {
  if (!quizContent || !quizResult || !startQuizBtn) return;
  estadoQuiz.indiceAtual = 0;
  estadoQuiz.acertos = 0;
  estadoQuiz.ativo = true;
  estadoQuiz.respondeuAtual = false;
  startQuizBtn.classList.add("hidden");
  quizResult.classList.add("hidden");
  quizContent.classList.remove("hidden");
  renderizarPerguntaQuiz();
}

function renderizarPerguntaQuiz() {
  if (estadoQuiz.indiceAtual >= perguntasQuiz.length) {
    finalizarQuiz();
    return;
  }

  estadoQuiz.respondeuAtual = false;
  if (quizFeedback) quizFeedback.textContent = "";
  if (nextQuestionBtn) nextQuestionBtn.classList.add("hidden");
  if (!quizProgress || !quizQuestion || !quizOptions) return;

  const pergunta = perguntasQuiz[estadoQuiz.indiceAtual];
  quizProgress.textContent = `Pergunta ${estadoQuiz.indiceAtual + 1} de ${perguntasQuiz.length}`;
  quizQuestion.textContent = pergunta.pergunta;
  quizOptions.innerHTML = "";

  pergunta.opcoes.forEach((opcao, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "quiz-option";
    botao.textContent = opcao;
    botao.addEventListener("click", () => verificarRespostaQuiz(indice));
    quizOptions.appendChild(botao);
  });
}

function verificarRespostaQuiz(indiceResposta) {
  if (!estadoQuiz.ativo || estadoQuiz.respondeuAtual || !quizOptions) return;
  const pergunta = perguntasQuiz[estadoQuiz.indiceAtual];
  const correta = indiceResposta === pergunta.correta;
  const botoes = quizOptions.querySelectorAll("button");

  botoes.forEach((botao, indice) => {
    botao.disabled = true;
    if (indice === pergunta.correta) {
      botao.style.background = "#c9efb9";
      botao.style.borderColor = "#86b671";
    } else if (indice === indiceResposta) {
      botao.style.background = "#f7c2ba";
      botao.style.borderColor = "#c87163";
    }
  });

  if (correta) {
    estadoQuiz.acertos += 1;
    if (quizFeedback) quizFeedback.textContent = `Correto! ${pergunta.explicacao}`;
  } else if (quizFeedback) {
    quizFeedback.textContent = `Resposta incorreta. ${pergunta.explicacao}`;
  }

  estadoQuiz.respondeuAtual = true;
  if (nextQuestionBtn) {
    nextQuestionBtn.classList.remove("hidden");
    nextQuestionBtn.textContent = estadoQuiz.indiceAtual === perguntasQuiz.length - 1 ? "Ver resultado" : "Próxima pergunta";
  }
}

function finalizarQuiz() {
  if (!quizContent || !quizResult || !startQuizBtn) return;
  estadoQuiz.ativo = false;
  quizContent.classList.add("hidden");
  quizResult.classList.remove("hidden");
  startQuizBtn.classList.remove("hidden");
  startQuizBtn.textContent = "Refazer quiz";

  const percentual = Math.round((estadoQuiz.acertos / perguntasQuiz.length) * 100);
  let nivel = "";
  if (percentual >= 85) nivel = "Excelente conhecimento sustentável!";
  else if (percentual >= 65) nivel = "Bom desempenho, continue praticando.";
  else if (percentual >= 40) nivel = "Você aprendeu parte do conteúdo.";
  else nivel = "Vamos revisar os conceitos e tentar novamente.";

  quizResult.textContent = `Resultado: ${estadoQuiz.acertos} de ${perguntasQuiz.length} acertos (${percentual}%). ${nivel}`;
}

function iniciarAplicacao() {
  configurarMenuResponsivo();
  configurarInstrucoes();
  configurarControlesTeclado();
  configurarControlesToque();
  configurarEtapasProducao();
  prepararLayoutJogo();
  configurarBotoesJogo();
  configurarQuiz();
  carregarSprites();
  atualizarInterface();
  desenharCena();
}

iniciarAplicacao();


