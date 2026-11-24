(function () {
  "use strict";

  const workspace = document.getElementById("instance-workspace");
  if (!workspace) return;

  const root = document.documentElement;
  const body = document.body;
  const modulesToggle = document.getElementById("modules-toggle");
  const restoreButton = document.getElementById("restore-layout");
  const modeIndicator = document.getElementById("layout-mode-indicator");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const STORAGE_KEY = "unespdatalens.v8.layout";

  const defaults = {
    sidebarHidden: false,
    sidebarWidth: 240,
    inspectorWidth: 520,
    mode: "normal"
  };

  let state = loadState();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function loadState() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}
    // Migra a preferência de recolhimento da V7, se existir.
    if (saved.sidebarHidden == null) {
      try { saved.sidebarHidden = localStorage.getItem("unespdatalens.sidebarCollapsed") === "1"; } catch (_) {}
    }
    return {
      sidebarHidden: Boolean(saved.sidebarHidden ?? defaults.sidebarHidden),
      sidebarWidth: clamp(Number(saved.sidebarWidth) || defaults.sidebarWidth, 190, 380),
      inspectorWidth: clamp(Number(saved.inspectorWidth) || defaults.inspectorWidth, 360, 820),
      mode: ["normal", "center", "inspector"].includes(saved.mode) ? saved.mode : "normal"
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem("unespdatalens.sidebarCollapsed", state.sidebarHidden ? "1" : "0");
    } catch (_) {}
  }

  function computePanelTop() {
    const header = document.querySelector(".site-header");
    const top = header ? Math.ceil(header.getBoundingClientRect().bottom) : 126;
    root.style.setProperty("--v8-panel-top", `${top}px`);
  }

  function modeLabel() {
    if (state.mode === "center") return "Modo: Visão da execução maximizada";
    if (state.mode === "inspector") return "Modo: Detalhes e Evidências maximizado";
    if (state.sidebarHidden) return "Modo: Menu recolhido";
    return "Modo: Normal";
  }

  function syncDynamicButtons() {
    document.querySelectorAll('[data-layout-action="center-maximize"]').forEach((button) => {
      const active = state.mode === "center";
      button.textContent = active ? "↙" : "⛶";
      button.title = active ? "Restaurar visão da execução" : "Maximizar visão da execução";
      button.setAttribute("aria-label", button.title);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll('[data-layout-action="inspector-maximize"]').forEach((button) => {
      const active = state.mode === "inspector";
      button.textContent = active ? "↙" : "⛶";
      button.title = active ? "Restaurar Detalhes e Evidências" : "Maximizar Detalhes e Evidências";
      button.setAttribute("aria-label", button.title);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function applyState({ persist = true } = {}) {
    computePanelTop();
    root.style.setProperty("--v8-sidebar-width", `${state.sidebarWidth}px`);
    root.style.setProperty("--v8-inspector-width", `${state.inspectorWidth}px`);

    workspace.classList.toggle("sidebar-collapsed", state.sidebarHidden);
    workspace.classList.toggle("v8-center-max", state.mode === "center");
    workspace.classList.toggle("v8-inspector-max", state.mode === "inspector");
    body.classList.toggle("v8-panel-maximized", state.mode !== "normal");

    if (modulesToggle) {
      modulesToggle.setAttribute("aria-pressed", String(!state.sidebarHidden));
      modulesToggle.title = state.sidebarHidden ? "Mostrar menu lateral" : "Ocultar menu lateral";
    }
    if (sidebarToggle) {
      sidebarToggle.setAttribute("aria-expanded", String(!state.sidebarHidden));
      sidebarToggle.title = state.sidebarHidden ? "Mostrar menu lateral" : "Ocultar menu lateral";
      const sr = sidebarToggle.querySelector(".sr-only");
      if (sr) sr.textContent = sidebarToggle.title;
    }
    if (modeIndicator) modeIndicator.textContent = modeLabel();
    syncDynamicButtons();
    if (persist) saveState();
  }

  function setMode(mode) {
    state.mode = state.mode === mode ? "normal" : mode;
    applyState();
  }

  function restoreLayout() {
    state = { ...defaults };
    applyState();
  }

  if (modulesToggle) {
    modulesToggle.addEventListener("click", () => {
      if (state.mode !== "normal") state.mode = "normal";
      state.sidebarHidden = !state.sidebarHidden;
      applyState();
    });
  }

  // O botão interno do menu e o botão global usam o mesmo estado da V8.
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      if (state.mode !== "normal") state.mode = "normal";
      state.sidebarHidden = !state.sidebarHidden;
      applyState();
    });
  }

  if (restoreButton) restoreButton.addEventListener("click", restoreLayout);

  // Delegação porque o cabeçalho do Inspector é reconstruído ao trocar de módulo/aba.
  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-layout-action]");
    if (!action) return;
    event.preventDefault();
    const type = action.dataset.layoutAction;
    if (type === "center-maximize") setMode("center");
    if (type === "inspector-maximize") setMode("inspector");
  });

  function startResize(event, type) {
    if (window.innerWidth <= 1320 || state.mode !== "normal") return;
    event.preventDefault();
    const splitter = event.currentTarget;
    splitter.classList.add("is-dragging");
    body.classList.add("v8-resizing");
    const rect = workspace.getBoundingClientRect();

    const move = (moveEvent) => {
      if (type === "sidebar") {
        state.sidebarHidden = false;
        state.sidebarWidth = clamp(moveEvent.clientX - rect.left, 190, Math.min(380, rect.width * .32));
      } else {
        state.inspectorWidth = clamp(rect.right - moveEvent.clientX, 360, Math.min(820, rect.width * .48));
      }
      applyState({ persist: false });
    };
    const stop = () => {
      splitter.classList.remove("is-dragging");
      body.classList.remove("v8-resizing");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
      saveState();
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop, { once: true });
  }

  document.querySelectorAll('[data-splitter="sidebar"]').forEach((el) => el.addEventListener("pointerdown", (e) => startResize(e, "sidebar")));
  document.querySelectorAll('[data-splitter="inspector"]').forEach((el) => el.addEventListener("pointerdown", (e) => startResize(e, "inspector")));

  // Teclado nos divisores: setas ajustam 16 px por toque.
  document.querySelectorAll("[data-splitter]").forEach((splitter) => {
    splitter.addEventListener("keydown", (event) => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key) || state.mode !== "normal") return;
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 16 : -16;
      if (splitter.dataset.splitter === "sidebar") {
        state.sidebarHidden = false;
        state.sidebarWidth = clamp(state.sidebarWidth + delta, 190, 380);
      } else {
        // Mover divisor para a direita diminui o Inspector.
        state.inspectorWidth = clamp(state.inspectorWidth - delta, 360, 820);
      }
      applyState();
    });
  });

  // O Inspector é reconstruído com innerHTML ao trocar de módulo/aba.
  // A V8 original usava MutationObserver aqui, mas o próprio syncDynamicButtons()
  // altera o texto do botão e gerava uma nova mutação, criando um loop infinito.
  // A sincronização agora é explícita e ocorre somente após a renderização do Inspector.
  document.addEventListener("unespdatalens:detail-rendered", syncDynamicButtons);

  window.addEventListener("resize", () => {
    computePanelTop();
    if (window.innerWidth <= 1320 && state.mode === "normal") {
      // Não altera a preferência salva; apenas deixa o CSS responsivo assumir.
      syncDynamicButtons();
    }
  });

  applyState({ persist: false });
})();