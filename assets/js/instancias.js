(function () {
  "use strict";

  const registry = window.UNESP_DATALENS_INSTANCIAS;
  const fileContents = window.UNESP_DATALENS_FILES || {};
  if (!registry) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value) => String(value == null ? "" : value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const pretty = (value) => JSON.stringify(value, null, 2);

  function renderCatalog() {
    const host = $("[data-instance-catalog]");
    if (!host) return;
    host.innerHTML = registry.catalog.map((item) => {
      const statusClass = item.available ? "green" : "gray";
      const cardClass = item.available ? "" : " planned";
      const button = item.available
        ? `<a class="btn" href="${escapeHtml(item.url)}">Explorar instância</a>`
        : `<span class="btn" aria-disabled="true">Em preparação</span>`;
      return `<article class="instance-card${cardClass}"><div class="instance-card-body">
        <div class="instance-card-top"><div><span class="eyebrow">${escapeHtml(item.domain)}</span><h3>${escapeHtml(item.title)}</h3></div><span class="chip ${statusClass}">${escapeHtml(item.status)}</span></div>
        <p>${escapeHtml(item.description)}</p><p><strong>Objetivo:</strong> ${escapeHtml(item.objective)}</p>
        <div class="instance-card-meta">${item.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="instance-card-actions">${button}<a class="btn secondary" href="https://ronaldocmc.github.io/UnespDataLens-RM/modulos/">Módulos conceituais</a></div>
      </div></article>`;
    }).join("");
  }

  function renderExplorer() {
    if (!$("#module-detail")) return;
    const params = new URLSearchParams(location.search);
    const requested = params.get("id") || "educacao-evasao";
    const instance = registry.instances[requested] || registry.instances["educacao-evasao"];
    populateInstanceSelector(instance.id);
    renderSummary(instance);
    renderRunFlow(instance);
    renderRunFileBrowser(instance);
    renderModuleMenu(instance);
    const initialModule = params.get("module") && instance.modules[params.get("module")] ? params.get("module") : "M01";
    if (params.get("view") === "why") activateWhyView(instance, false);
    else activateModule(instance, initialModule, "inputs", false);
    initSidebarToggle();

    document.addEventListener("click", (event) => {
      const inspectorButton = event.target.closest("[data-inspector-file]");
      if (inspectorButton) { activateInspectorFile(inspectorButton); return; }

      // IMPORTANTE: os botões das abas também possuem data-module-id.
      // Portanto a troca de aba precisa ser tratada ANTES da seleção de módulo;
      // caso contrário qualquer clique em Entradas/Processamento/Saídas/...
      // é interpretado como novo clique no módulo e volta para "overview".
      const tabButton = event.target.closest("[data-detail-tab]");
      if (tabButton) {
        event.preventDefault();
        activateModule(instance, tabButton.dataset.detailModule, tabButton.dataset.detailTab, false);
        return;
      }

      const metricButton = event.target.closest("[data-metric-index]");
      if (metricButton) {
        event.preventDefault();
        const activeId = metricButton.dataset.moduleId || document.body.dataset.activeModule || "M01";
        const activeModule = instance.modules[activeId];
        if (activeModule) renderMetricInspector(instance, activeId, activeModule, Number(metricButton.dataset.metricIndex || 0));
        const detail = document.getElementById("module-detail");
        if (detail && window.innerWidth < 1250) detail.scrollIntoView({behavior:"smooth", block:"start"});
        return;
      }

      const centerTab = event.target.closest("[data-center-tab]");
      if (centerTab) {
        event.preventDefault();
        const activeId = centerTab.dataset.moduleId || document.body.dataset.activeModule || "M01";
        activateModule(instance, activeId, centerTab.dataset.centerTab, false);
        const detail = document.getElementById("module-detail");
        if (detail && window.innerWidth < 1250) detail.scrollIntoView({behavior:"smooth", block:"start"});
        return;
      }

      const instanceViewButton = event.target.closest("[data-instance-view]");
      if (instanceViewButton) {
        event.preventDefault();
        if (instanceViewButton.dataset.instanceView === "why") activateWhyView(instance, true);
        return;
      }

      const moduleButton = event.target.closest("[data-module-id]");
      if (moduleButton) { activateModule(instance, moduleButton.dataset.moduleId, "inputs", true); return; }
      const navButton = event.target.closest("[data-module-nav]");
      if (navButton && !navButton.disabled) activateModule(instance, navButton.dataset.moduleNav, "inputs", true);
    });
  }

  function initSidebarToggle() {
    // Na V8, o estado do menu é controlado por v8-layout.js para permitir
    // recolhimento completo, persistência e restauração global do layout.
    const toggle = document.getElementById("sidebar-toggle");
    if (!toggle) return;
    toggle.title = "Ocultar menu lateral";
    toggle.setAttribute("aria-expanded", "true");
  }

  function populateInstanceSelector(activeId) {
    const select = $("#instance-select"); if (!select) return;
    select.innerHTML = registry.catalog.map((item) => `<option value="${escapeHtml(item.id)}"${item.id === activeId ? " selected" : ""}${item.available ? "" : " disabled"}>${escapeHtml(item.title)}${item.available ? "" : " — em preparação"}</option>`).join("");
    select.addEventListener("change", () => { const selected = registry.catalog.find((x) => x.id === select.value); if (selected && selected.available) location.href = selected.url; });
  }

  function renderSummary(instance) {
    const host = $("#instance-summary"); if (!host) return;
    host.innerHTML = `<div><span class="eyebrow">${escapeHtml(instance.domain)} · Instância ${escapeHtml(instance.version)}</span><h1>${escapeHtml(instance.title)}</h1><p>${escapeHtml(instance.description)}</p></div>
      <div class="summary-meta"><span class="chip green">Ativa</span><span class="chip">run_id: ${escapeHtml(instance.runId)}</span><span class="chip">target: ${escapeHtml(instance.target)}</span></div>`;
    document.title = `${instance.title} · UnespDataLens-RM`;
  }

  function renderSources(instance) {
    const host = $("#source-strip"); if (!host) return;
    host.innerHTML = instance.sources.map((source) => `<article class="source-card">
      <div class="source-card-head"><span class="source-format">${escapeHtml(source.connector || source.format)}</span><span class="chip">${escapeHtml(source.format)}</span></div>
      <strong>${escapeHtml(source.name)}</strong><p><b>Sistema:</b> ${escapeHtml(source.system || "—")}</p><p><b>Local/objeto:</b> ${escapeHtml(source.location || "—")}</p>
      <p><b>Granularidade:</b> ${escapeHtml(source.granularity)}</p><p><b>Volume observado:</b> ${escapeHtml(source.recordCount || "—")} registros · ${escapeHtml(source.columnCount || "—")} atributos</p><p><b>Sensibilidade:</b> ${escapeHtml(source.sensitivity)}</p>
      ${source.mockUrl ? `<a class="micro-link" href="${escapeHtml(source.mockUrl)}" target="_blank" rel="noopener">Abrir dado/snapshot ↗</a>` : ""}
    </article>`).join("");
  }

  function sortedModules(instance, kind) { return Object.entries(instance.modules).filter(([,m]) => m.kind === kind).sort(([a],[b]) => Number(a.slice(1))-Number(b.slice(1))); }
  function renderPipelines(instance) {
    const op=$("#operational-pipeline"), tr=$("#transversal-pipeline");
    if(op) op.innerHTML=sortedModules(instance,"operational").map(([id,m])=>pipelineNode(id,m)).join("");
    if(tr) tr.innerHTML=sortedModules(instance,"transversal").map(([id,m])=>pipelineNode(id,m)).join("");
  }
  function pipelineNode(id,module){ return `<button class="pipeline-node ${module.kind === "transversal" ? "transversal" : ""}" type="button" data-module-id="${id}"><span class="node-id">${id}</span><span class="node-name">${escapeHtml(module.name)}</span><span class="node-output">${escapeHtml((module.instance && module.instance.outputSummary) || module.primaryOutput || "")}</span></button>`; }
  function renderRunFlow(instance){ const host=$("#run-flow"); if(host) host.innerHTML=instance.runFlow.map(([a,b])=>`<div class="run-step"><strong>${escapeHtml(a)}</strong><span>${escapeHtml(b)}</span></div>`).join(""); }
  function renderModuleMenu(instance){
    const host=$("#module-list"); if(!host)return;
    const about = `<div class="module-group-title">Sobre a instância</div>
      <div class="module-menu instance-view-menu">
        <button type="button" class="instance-view-button" data-instance-view="why">
          <span class="menu-id info">?</span>
          <span class="menu-name">Objetivos e Contribuições</span>
        </button>
      </div>`;
    const groups=[["Módulos operacionais",sortedModules(instance,"operational")],["Módulos transversais",sortedModules(instance,"transversal")]];
    host.innerHTML = about + groups.map(([title,modules])=>`<div class="module-group-title">${escapeHtml(title)}</div><div class="module-menu">${modules.map(([id,m])=>`<button type="button" class="${m.kind === "transversal" ? "transversal" : ""}" data-module-id="${id}"><span class="menu-id">${id}</span><span class="menu-name">${escapeHtml(m.name)}</span></button>`).join("")}</div>`).join("");
  }

  function setCenterView(view) {
    const workspace = $("#instance-workspace");
    const why = $("#why-view");
    const moduleViews = $(".module-center-view");
    const isWhy = view === "why";
    if (workspace) workspace.classList.toggle("why-view-active", isWhy);
    if (why) why.hidden = !isWhy;
    moduleViews.forEach(el => { el.hidden = isWhy; });
    $("[data-instance-view]").forEach(b => b.classList.toggle("active", isWhy && b.dataset.instanceView === "why"));
    if (isWhy) $("[data-module-id]").forEach(b => b.classList.remove("active"));
  }

  function activateWhyView(instance, updateUrl=true) {
    setCenterView("why");
    document.body.dataset.activeView = "why";
    const why = $("#why-view");
    if (why) why.scrollTop = 0;
    if (updateUrl && history.replaceState) {
      const url = new URL(location.href);
      url.searchParams.set("id", instance.id);
      url.searchParams.set("view", "why");
      url.searchParams.delete("module");
      history.replaceState({}, "", url);
    }
  }

  function activateModule(instance,moduleId,tab="overview",updateUrl=true){
    const module=instance.modules[moduleId]; if(!module)return;
    setCenterView("module");
    document.body.dataset.activeView = "module";
    document.body.dataset.activeModule = moduleId;
    $$('[data-module-id]').forEach((b)=>b.classList.toggle('active',b.dataset.moduleId===moduleId));
    renderModuleCanvas(instance,moduleId,module);
    renderDetail(instance,moduleId,module,tab);
    $$('[data-center-tab]').forEach((b)=>{
      b.dataset.moduleId = moduleId;
      b.classList.toggle('active', b.dataset.centerTab === tab);
    });
    if(updateUrl && history.replaceState){ const url=new URL(location.href); url.searchParams.set('id',instance.id); url.searchParams.set('module',moduleId); url.searchParams.delete('view'); history.replaceState({},'',url); }
  }

  function renderModuleCanvas(instance,moduleId,module){
    const d=module.instance || {};
    const label=$("#selected-module-label"); if(label) label.textContent=`${moduleId} — ${module.name}`;
    const objective=$("#selected-module-objective"); if(objective) objective.textContent=module.objective || "";
    const kind=$("#selected-module-kind"); if(kind) kind.textContent=module.kind === "transversal" ? "Transversal" : "Operacional";

    const metrics=$("#module-instance-metrics");
    if(metrics) metrics.innerHTML=(d.metrics||[]).map((x,index)=>`<button type="button" class="module-metric metric-clickable" data-metric-index="${index}" data-module-id="${moduleId}" title="Ver composição de ${escapeHtml(x.label)}"><span>${escapeHtml(x.label)}</span><strong>${escapeHtml(x.value)}</strong><small>${escapeHtml(metricQuickSummary(instance,moduleId,module,x,index))}</small><em>Ver composição →</em></button>`).join("");

    const inputCount=(d.inputs||[]).length;
    const outputCount=(d.outputs||[]).length;
    const responsibilityCount=(d.responsibilityEvidence||module.process||[]).length;
    const traceCount=(d.processTrace||[]).length;
    const provenanceCount=(d.provenanceRecords||[]).length;
    const transversals=d.transversals||[];

    setText("#center-input-title", `${inputCount} ${inputCount===1?"entrada concreta":"entradas concretas"}`);
    setText("#center-input-summary", summarizeAssets(d.inputs||[], d.inputSummary));
    setText("#center-process-title", `${responsibilityCount} ações executadas`);
    setText("#center-process-summary", `${traceCount} passos registrados · evidências e eventos persistidos`);
    setText("#center-output-title", `${outputCount} ${outputCount===1?"saída concreta":"saídas concretas"}`);
    setText("#center-output-summary", summarizeAssets(d.outputs||[], d.outputSummary));
    setText("#center-provenance-summary", provenanceCount ? `${provenanceCount} registros concretos de rastreabilidade` : "Eventos e rastreabilidade da execução");
    setText("#center-transversal-summary", transversals.length ? transversals.map(x=>x.id).join(" · ") : "Nenhum transversal adicional nesta etapa");

    const trace=$("#module-instance-trace"); if(trace) { const steps=(d.processTrace||[]); trace.innerHTML=renderTrace(steps.slice(0,4)) + (steps.length>4?`<button type="button" class="more-details-button" data-center-tab="process">Ver todos os ${steps.length} passos em Detalhes e Evidências →</button>`:""); }
    const trans=$("#module-instance-transversal"); if(trans) trans.innerHTML=renderTransversalCompact(instance,transversals);
    const ex=$("#module-instance-example"); if(ex) ex.innerHTML=renderExample(d.example);
  }

  function metricQuickSummary(instance,moduleId,module,metric,index){
    const d=module.instance||{};
    const label=String(metric.label||"").toLowerCase();
    if(moduleId==="M01"){
      if(index===0) return instance.sources.map(s=>s.id).join(" · ");
      if(index===1) return instance.sources.map(s=>`✓ ${s.id}`).join(" · ");
      if(index===2) return instance.sources.map(s=>`${s.id} ${s.recordCount||0}`).join(" + ");
      if(index===3) return [...new Set(instance.sources.map(s=>s.connector))].join(" · ");
    }
    if(/entrada|fonte/.test(label) && (d.inputs||[]).length) return shortAssetNames(d.inputs);
    if(/saída|saida|ativo|produto/.test(label) && (d.outputs||[]).length) return shortAssetNames(d.outputs);
    if(/regra|responsabilidade|pass/.test(label) && (d.processTrace||[]).length) return (d.processTrace||[]).slice(0,3).map(x=>x.title).join(" · ");
    if(/linha|registro/.test(label)) {
      const withRecords=[...(d.inputs||[]),...(d.outputs||[])].filter(x=>x.records!=null);
      if(withRecords.length) return withRecords.slice(0,3).map(x=>`${x.name}: ${x.records}`).join(" · ");
    }
    return "Clique para ver os dados e evidências que compõem este indicador";
  }

  function shortAssetNames(items){
    const names=(items||[]).map(x=>x.name||x.id).filter(Boolean);
    return `${names.slice(0,3).join(" · ")}${names.length>3?` · +${names.length-3}`:""}`;
  }

  function sourceDeclarationFiles(instance){
    return instance.sources.map(source=>fileEntryFromHref(`${instance.dataBase}/declarations/sources/${source.id}.yml`,{
      name:`${source.id}.yml`,format:"YAML",role:`Declaração da fonte ${source.id}`
    }));
  }

  function renderSourceComposition(instance, mode){
    const rows=instance.sources.map(source=>{
      const status="ACCESSIBLE";
      const connector=source.connector||source.format||"—";
      const location=source.location||"—";
      const volume=`${source.recordCount||0} registros · ${source.columnCount||0} atributos`;
      return [source.id,source.name,connector,location,source.granularity||"—",volume,status];
    });
    let intro="As quatro fontes declaradas na instância educacional.";
    if(mode==="access") intro="As quatro fontes foram verificadas com o conector apropriado e ficaram acessíveis nesta execução.";
    if(mode==="records") intro="O total de 30 registros observados é a soma dos volumes observados em cada fonte (6 + 6 + 12 + 6).";
    if(mode==="connectors") intro="Há três tecnologias de acesso distintas: 1 arquivo CSV, 2 objetos PostgreSQL e 1 endpoint REST API.";
    return `<p>${escapeHtml(intro)}</p>${renderTable(["source_id","Fonte","Conector","Objeto/local","Granularidade","Volume observado","Acesso"],rows)}`;
  }

  function metricEvidenceFiles(instance,moduleId,module,metricIndex){
    if(moduleId==="M01"){
      if(metricIndex===0) return uniqueFiles([fileEntryFromHref(`${instance.dataBase}/pipeline.yml`,{name:"pipeline.yml",format:"YAML",role:"Declaração completa das fontes"}),...sourceDeclarationFiles(instance)]);
      if(metricIndex===1) return uniqueFiles([fileEntryFromHref(`${instance.runBase}/artifacts/m01/source_access_registry.json`,{name:"source_access_registry.json",format:"JSON",role:"Resultado das verificações de acesso"})]);
      if(metricIndex===2) return uniqueFiles([fileEntryFromHref(`${instance.runBase}/artifacts/m01/source_inventory.json`,{name:"source_inventory.json",format:"JSON",role:"Inventário com volumes observados"}),fileEntryFromHref(`${instance.runBase}/artifacts/m01/source_schemas.json`,{name:"source_schemas.json",format:"JSON",role:"Schemas e atributos observados"})]);
      if(metricIndex===3) return uniqueFiles([fileEntryFromHref(`${instance.dataBase}/pipeline.yml`,{name:"pipeline.yml",format:"YAML",role:"Conectores declarados"}),fileEntryFromHref(`${instance.runBase}/artifacts/m01/source_access_registry.json`,{name:"source_access_registry.json",format:"JSON",role:"Conectores efetivamente verificados"})]);
    }
    const d=module.instance||{};
    return uniqueFiles([...moduleInputFiles(instance,moduleId,module),...moduleOutputFiles(instance,moduleId,module)]).slice(0,8);
  }

  function renderMetricComposition(instance,moduleId,module,metric,index){
    const d=module.instance||{};
    let body="";
    if(moduleId==="M01"){
      body=renderSourceComposition(instance,index===0?"sources":index===1?"access":index===2?"records":"connectors");
      if(index===0){
        body+=`<div class="metric-breakdown-grid">${instance.sources.map(source=>`<article class="metric-source-card"><strong>${escapeHtml(source.id)}</strong><span>${escapeHtml(source.connector)}</span><b>${escapeHtml(source.recordCount)} registros · ${escapeHtml(source.columnCount)} atributos</b><small>${escapeHtml(source.location)}</small></article>`).join("")}</div>`;
      }
    } else {
      const inputs=d.inputs||[], outputs=d.outputs||[], trace=d.processTrace||[];
      body=`<p>Este valor foi registrado na execução <code>${escapeHtml(instance.runId)}</code>. A composição abaixo usa os ativos, passos e evidências vinculados ao módulo.</p>`;
      if(inputs.length) body+=`<h4>Entradas relacionadas</h4>${renderAssetCards(inputs,true)}`;
      if(outputs.length) body+=`<h4>Saídas relacionadas</h4>${renderAssetCards(outputs,true)}`;
      if(trace.length) body+=`<h4>Passos que sustentam o indicador</h4>${renderTrace(trace.slice(0,4))}`;
    }
    const evidence=metricEvidenceFiles(instance,moduleId,module,index);
    return `<div class="metric-detail-hero"><span>Indicador da execução</span><h3>${escapeHtml(metric.label)} <b>${escapeHtml(metric.value)}</b></h3><p>${escapeHtml(metricQuickSummary(instance,moduleId,module,metric,index))}</p></div>${body}<h3>Arquivos e evidências</h3>${renderFileInspector(evidence,"Evidências deste indicador")}`;
  }

  function renderMetricInspector(instance,moduleId,module,index){
    const d=module.instance||{};
    const metric=(d.metrics||[])[index];
    if(!metric) return;
    const detailHost=$("#module-detail");
    const tabs=[["inputs","Entradas"],["process","Processamento"],["outputs","Saídas"],["contract","Contrato"],["provenance","Proveniência"],["example","Exemplo"],["integration","Integração"]];
    detailHost.innerHTML=`<div class="detail-head ${module.kind==='transversal'?'transversal':''}"><div><span class="eyebrow">Composição do indicador</span><h2>Detalhes e Evidências · ${moduleId}</h2></div><div class="detail-actions"><a class="detail-link" href="${escapeHtml(module.conceptualUrl)}" target="_blank" rel="noopener">Documentação conceitual ↗</a><button type="button" class="panel-layout-button inspector-layout-button" data-layout-action="inspector-maximize" title="Maximizar Detalhes e Evidências" aria-label="Maximizar Detalhes e Evidências">⛶</button></div></div>
      <div class="detail-tabs">${tabs.map(([id,label])=>`<button type="button" data-detail-tab="${id}" data-detail-module="${moduleId}">${label}</button>`).join('')}</div>
      <div class="detail-panel">${renderMetricComposition(instance,moduleId,module,metric,index)}</div>`;
    document.dispatchEvent(new CustomEvent("unespdatalens:detail-rendered", { detail: { moduleId, tab:"metric", metricIndex:index } }));
  }

  function setText(selector,value){ const el=$(selector); if(el) el.textContent=value || "—"; }

  function summarizeAssets(items,fallback){
    if (fallback) return fallback;
    if (!items || !items.length) return "Nenhum ativo declarado";
    const names=items.slice(0,3).map(x=>x.name||x.id).filter(Boolean);
    return `${names.join(" · ")}${items.length>3?` · +${items.length-3}`:""}`;
  }

  function renderAssetCards(assets,compact=false){
    if(!assets.length) return '<div class="empty-inline">Nenhum ativo declarado.</div>';
    return assets.map(a=>`<article class="module-asset-card ${compact ? 'compact' : ''}"><div class="asset-card-head"><strong>${escapeHtml(a.name)}</strong><span class="asset-kind">${escapeHtml(a.format || a.kind || '')}</span></div>
      <code>${escapeHtml(a.id || '')}</code>${a.role?`<p>${escapeHtml(a.role)}</p>`:''}<dl>${a.records!=null?`<dt>Registros</dt><dd>${escapeHtml(a.records)}</dd>`:''}${a.columns!=null?`<dt>Atributos</dt><dd>${escapeHtml(a.columns)}</dd>`:''}<dt>Local</dt><dd>${escapeHtml(a.path || '—')}</dd></dl>
      ${a.href?`<a class="micro-link" href="${escapeHtml(a.href)}" target="_blank" rel="noopener">Abrir ↗</a>`:''}</article>`).join("");
  }

  function renderTrace(items){ if(!items.length)return '<div class="empty-inline">Sem passos detalhados.</div>'; return items.map(x=>`<article class="trace-step"><span class="trace-num">${escapeHtml(x.step)}</span><div class="trace-body"><strong>${escapeHtml(x.title)}</strong><div class="trace-grid"><div><b>Entrada</b><span>${escapeHtml(x.input)}</span></div><div><b>Operação</b><span>${escapeHtml(x.operation)}</span></div><div><b>Saída</b><span>${escapeHtml(x.output)}</span></div><div><b>Registra</b><span>${escapeHtml(x.registers)}</span></div></div>${x.events&&x.events.length?`<div class="trace-tags"><b>Eventos:</b>${x.events.map(e=>`<code>${escapeHtml(e)}</code>`).join('')}</div>`:''}${x.transversal&&x.transversal.length?`<div class="trace-tags transversal"><b>Transversais:</b>${x.transversal.map(e=>`<span>${escapeHtml(e)}</span>`).join('')}</div>`:''}</div></article>`).join(''); }

  function renderArtifactLinks(instance,paths){ if(!paths.length)return '<div class="empty-inline">Nenhum artefato materializado.</div>'; return paths.map(p=>`<a class="artifact-file" href="${escapeHtml(instance.runBase+'/'+p)}" target="_blank" rel="noopener"><span>▧</span><code>${escapeHtml(p)}</code><b>↗</b></a>`).join(''); }
  function renderTransversalCompact(instance,items){ if(!items.length)return '<div class="empty-inline">Este módulo não possui interação transversal adicional nesta etapa.</div>'; return items.map(x=>`<article class="transversal-instance"><div class="transversal-instance-head"><strong>${escapeHtml(x.id)}</strong><span>${escapeHtml(x.action||'')}</span></div>${x.consumes&&x.consumes.length?`<div><b>Consome</b> ${x.consumes.map(e=>`<code>${escapeHtml(e)}</code>`).join(' ')}</div>`:''}${x.stores&&x.stores.length?`<div><b>Persiste</b>${x.stores.map(p=>`<a href="${escapeHtml(instance.runBase+'/'+p)}" target="_blank" rel="noopener"><code>${escapeHtml(p)}</code> ↗</a>`).join('')}</div>`:''}${x.sample?`<details><summary>Exemplo do registro transversal</summary><pre class="detail-code">${escapeHtml(pretty(x.sample))}</pre></details>`:''}</article>`).join(''); }

  function renderExample(ex){ if(!ex)return '<div class="empty-inline">Sem exemplo específico.</div>'; if(ex.type==='table') return `<div class="example-title">${escapeHtml(ex.title||'Exemplo')}</div>${renderTable(ex.headers||[],ex.rows||[])}`; if(ex.type==='json') return `<div class="example-title">${escapeHtml(ex.title||'Exemplo')}</div><pre class="detail-code">${escapeHtml(pretty(ex.data||{}))}</pre>`; if(ex.type==='flow') return `<div class="example-title">${escapeHtml(ex.title||'Fluxo')}</div><div class="example-flow">${(ex.items||[]).map((x,i)=>`${i?'<span class="flow-chevron">→</span>':''}<span>${escapeHtml(x)}</span>`).join('')}</div>`; return `<pre class="detail-code">${escapeHtml(pretty(ex))}</pre>`; }
  function renderTable(headers,rows){ return `<div class="instance-table-wrap"><table class="instance-table"><thead><tr>${headers.map(h=>`<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${escapeHtml(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }


  function normalizeHref(href) {
    return String(href || "").replace(/^\.?\//, "");
  }

  function fileEntryFromHref(href, meta={}) {
    const key = normalizeHref(href);
    const embedded = fileContents[key] || {};
    return {
      href: key,
      name: meta.name || embedded.name || key.split("/").pop() || key,
      format: meta.format || embedded.format || "",
      role: meta.role || "",
      content: embedded.content != null ? embedded.content : (meta.content || ""),
      size: embedded.size || 0
    };
  }

  function uniqueFiles(files) {
    const seen = new Set();
    return (files || []).filter(Boolean).map(f => {
      if (typeof f === "string") return fileEntryFromHref(f);
      const sourceHref = f.href || f.path || "";
      return sourceHref ? fileEntryFromHref(sourceHref, {...f, href: sourceHref}) : f;
    }).filter(f => {
      const k = f.href || `${f.name}:${f.role}`;
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
  }

  function moduleInputFiles(instance, moduleId, module) {
    const d = module.instance || {};
    const files = [];
    (d.inputs || []).forEach(a => { if (a.href) files.push(a); });
    (d.extraFiles || []).forEach(f => {
      if (moduleId === "M01" && /declarations\/sources/.test(f.href || "")) files.push(f);
      if (moduleId === "M05" && /evasao_rules/.test(f.href || "")) files.push(f);
      if (moduleId === "M10" && /policies\.yml/.test(f.href || "")) files.push(f);
    });
    if (moduleId === "M01") {
      files.unshift({name:"pipeline.yml",format:"YAML",href:`${instance.dataBase}/pipeline.yml`,role:"Configuração completa da instância e declaração das fontes"});
    }
    return uniqueFiles(files);
  }

  function moduleOutputFiles(instance, moduleId, module) {
    const d = module.instance || {};
    const files = [];
    (d.outputs || []).forEach(a => { if (a.href) files.push(a); });
    (d.artifacts || []).forEach(path => files.push({
      name: path.split("/").pop(),
      format: (path.split(".").pop() || "").toUpperCase(),
      href: `${instance.runBase}/${path}`,
      role: "Artefato materializado pelo módulo"
    }));
    (d.extraFiles || []).forEach(f => {
      if (/execution\.json$/.test(f.href || "") || /_contract\.json$/.test(f.href || "")) files.push(f);
    });
    return uniqueFiles(files);
  }

  function integrationFiles(instance, module) {
    const d = module.instance || {};
    const files = [];
    (d.transversals || []).forEach(t => (t.stores || []).forEach(path => files.push({
      name: `${t.id} · ${path.split("/").pop()}`,
      format: (path.split(".").pop() || "").toUpperCase(),
      href: `${instance.runBase}/${path}`,
      role: `Persistido pelo transversal ${t.id}`
    })));
    return uniqueFiles(files);
  }

  function provenanceFiles(instance, moduleId, module) {
    const d = module.instance || {};
    const files = [];
    (d.artifacts || []).forEach(path => {
      if (/proven|lineage|version|manifest|integrity|event/i.test(path)) files.push({
        name:path.split("/").pop(), format:(path.split(".").pop()||"").toUpperCase(),
        href:`${instance.runBase}/${path}`, role:"Evidência de proveniência/rastreabilidade"
      });
    });
    if (moduleId === "M01") {
      files.push({name:"provenance_events.json",format:"JSON",href:`${instance.runBase}/metadata/lineage/provenance_events.json`,role:"Eventos consumidos pelo M11"});
      files.push({name:"source_versions.json",format:"JSON",href:`${instance.runBase}/metadata/versions/source_versions.json`,role:"Versões observadas consumidas pelo M12"});
    }
    (d.extraFiles || []).forEach(f => { if (/execution\.json$/.test(f.href || "")) files.push(f); });
    return uniqueFiles(files);
  }

  function renderFileInspector(files, title="Arquivos desta etapa") {
    files = uniqueFiles(files);
    if (!files.length) return '<div class="empty-inline">Nenhum arquivo materializado para esta seção.</div>';
    const initial = files[0];
    const buttons = files.map((f,i)=>`<button type="button" class="inspector-file${i===0?' active':''}" data-inspector-file="${escapeHtml(f.href||f.path||'')}" data-inspector-name="${escapeHtml(f.name||'')}">
      <span class="inspector-file-icon">${escapeHtml((f.format||'TXT').slice(0,4))}</span>
      <span><strong>${escapeHtml(f.name||'arquivo')}</strong>${f.role?`<small>${escapeHtml(f.role)}</small>`:''}<code>${escapeHtml(f.href||f.path||'')}</code></span>
    </button>`).join("");
    return `<div class="file-inspector">
      <div class="file-inspector-head"><strong>${escapeHtml(title)}</strong><span>${files.length} arquivo${files.length===1?'':'s'}</span></div>
      <div class="file-inspector-body">
        <div class="file-inspector-list">${buttons}</div>
        <div class="file-inspector-view">
          <div class="file-view-head"><div><strong data-inspector-title>${escapeHtml(initial.name)}</strong><code data-inspector-path>${escapeHtml(initial.href||'')}</code></div><span data-inspector-format>${escapeHtml(initial.format||'TEXT')}</span></div>
          <pre class="detail-code file-content" data-inspector-content>${escapeHtml(initial.content != null && initial.content !== "" ? initial.content : "Conteúdo indisponível para este item.")}</pre>
        </div>
      </div>
    </div>`;
  }

  function activateInspectorFile(button) {
    const inspector = button.closest(".file-inspector");
    if (!inspector) return;
    const href = normalizeHref(button.dataset.inspectorFile || "");
    const entry = fileEntryFromHref(href, {name:button.dataset.inspectorName});
    $$(".inspector-file", inspector).forEach(b=>b.classList.toggle("active",b===button));
    const title = $("[data-inspector-title]", inspector);
    const path = $("[data-inspector-path]", inspector);
    const format = $("[data-inspector-format]", inspector);
    const content = $("[data-inspector-content]", inspector);
    if (title) title.textContent = entry.name;
    if (path) path.textContent = entry.href;
    if (format) format.textContent = entry.format || "TEXT";
    if (content) content.textContent = entry.content != null && entry.content !== "" ? entry.content : "Conteúdo indisponível para este item.";
  }

  function renderResponsibilityEvidence(instance, moduleId, module) {
    const items = (module.instance && module.instance.responsibilityEvidence) || [];
    if (!items.length) return list(module.process || []);
    return `<div class="responsibility-matrix">${items.map((r,i)=>`<article class="responsibility-row">
      <div class="responsibility-number">${i+1}</div>
      <div class="responsibility-body">
        <strong>${escapeHtml(r.responsibility || "")}</strong>
        <div class="responsibility-concrete"><b>Nesta execução:</b> ${escapeHtml(r.concreteAction || "")}</div>
        ${r.input?`<div><b>Entrada:</b> ${escapeHtml(r.input)}</div>`:''}
        ${r.result?`<div><b>Resultado:</b> ${escapeHtml(r.result)}</div>`:''}
        ${r.registers?`<div><b>Registro:</b> ${escapeHtml(r.registers)}</div>`:''}
        ${(r.events||[]).length?`<div class="trace-tags"><b>Eventos</b>${r.events.map(x=>`<code>${escapeHtml(x)}</code>`).join('')}</div>`:''}
        ${(r.transversals||[]).length?`<div class="trace-tags transversal"><b>Transversais</b>${r.transversals.map(x=>`<span>${escapeHtml(x)}</span>`).join('')}</div>`:''}
        ${(r.evidence||[]).length?`<div class="responsibility-evidence"><b>Evidências geradas:</b>${r.evidence.map(path=>`<code>${escapeHtml(path)}</code>`).join('')}</div>`:''}
      </div>
    </article>`).join('')}</div>`;
  }

  function renderSourceDeclarations(instance) {
    const files = [
      {name:"pipeline.yml",format:"YAML",href:`${instance.dataBase}/pipeline.yml`,role:"Arquivo completo da instância"},
      ...(instance.sources||[]).map(src=>({
        name:`${src.id}.yml`,format:"YAML",href:`${instance.dataBase}/declarations/sources/${src.id}.yml`,role:`Trecho sources: referente a ${src.id}`
      }))
    ];
    return renderFileInspector(files, "Declaração das fontes no pipeline.yml");
  }

  function renderRunFileBrowser(instance) {
    const host = $("#run-file-browser"); if (!host) return;
    const prefix = normalizeHref(instance.dataBase || "data/educacao-evasao");
    const files = Object.values(fileContents)
      .filter(f => f.path && f.path.startsWith(prefix + "/"))
      .sort((a,b)=>a.path.localeCompare(b.path,"pt-BR"));
    host.innerHTML = `<div class="run-files-intro"><strong>${files.length} arquivos disponíveis na instância</strong><span>Inclui configurações, snapshots, dados intermediários, saídas, contratos, metadados, logs e relatórios.</span></div>${renderFileInspector(files,"Todos os arquivos da instância")}`;
  }

  function renderDetail(instance,moduleId,module,tab){
    if (tab === "overview") tab = "inputs";
    const detailHost=$("#module-detail");
    const tabs=[["inputs","Entradas"],["process","Processamento"],["outputs","Saídas"],["contract","Contrato"],["provenance","Proveniência"],["example","Exemplo"],["integration","Integração"]];
    const moduleIds=Object.keys(instance.modules).sort((a,b)=>Number(a.slice(1))-Number(b.slice(1)));
    const index=moduleIds.indexOf(moduleId),prev=index>0?moduleIds[index-1]:"",next=index<moduleIds.length-1?moduleIds[index+1]:"";
    detailHost.innerHTML=`<div class="detail-head ${module.kind==='transversal'?'transversal':''}"><h2>Detalhes e Evidências · ${moduleId}</h2><div class="detail-actions"><a class="detail-link" href="${escapeHtml(module.conceptualUrl)}" target="_blank" rel="noopener">Documentação conceitual ↗</a><button type="button" class="panel-layout-button inspector-layout-button" data-layout-action="inspector-maximize" title="Maximizar Detalhes e Evidências" aria-label="Maximizar Detalhes e Evidências">⛶</button></div></div>
      <div class="detail-tabs">${tabs.map(([id,label])=>`<button type="button" class="${tab===id?'active':''}" data-detail-tab="${id}" data-detail-module="${moduleId}">${label}</button>`).join('')}</div>
      <div class="detail-panel">${renderTab(instance,moduleId,module,tab)}</div>`;
    document.dispatchEvent(new CustomEvent("unespdatalens:detail-rendered", { detail: { moduleId, tab } }));
  }

  function renderTab(instance,moduleId,module,tab){
    const d=module.instance||{};
    if(tab==='inputs') {
      const inputFiles=moduleInputFiles(instance,moduleId,module);
      return `${moduleId==='M01'?`<h3>1. Declaração concreta da instância e das fontes</h3><p>Selecione <code>pipeline.yml</code> ou uma fonte para ver exatamente o conteúdo da declaração <code>sources:</code>.</p>${renderSourceDeclarations(instance)}`:''}
        <h3>${moduleId==='M01'?'2. Dados/objetos que o M01 inspeciona':'Entradas concretas deste módulo'}</h3>
        <p>Os arquivos abaixo são os dados ou snapshots didáticos usados nesta execução. Clique em qualquer um para ver seu conteúdo.</p>
        ${renderFileInspector(inputFiles,'Conteúdo das entradas')}
        <h3>Contrato conceitual de entrada</h3>${list(module.inputs||[])}`;
    }
    if(tab==='process') return `<h3>Responsabilidades transformadas em ações concretas</h3><p>Cada responsabilidade abaixo mostra o que foi feito <b>nesta execução</b>, qual resultado foi obtido e quais evidências/eventos foram gerados.</p>${renderResponsibilityEvidence(instance,moduleId,module)}
      <h3>Passo a passo registrado pela execução</h3>${renderTrace(d.processTrace||[])}
      <h3>Registro completo do módulo</h3>${renderFileInspector((d.extraFiles||[]).filter(f=>/execution\.json$/.test(f.href||'')),'module_execution.json')}`;
    if(tab==='outputs') {
      const outputFiles=moduleOutputFiles(instance,moduleId,module);
      return `<h3>Saída principal nesta execução</h3><div class="detail-box emphasis"><strong>${escapeHtml(d.outputSummary||module.primaryOutput||'—')}</strong><span>Não é apenas uma descrição: selecione abaixo cada arquivo gerado e veja o conteúdo materializado.</span></div>
        ${renderFileInspector(outputFiles,'Arquivos gerados por este módulo')}`;
    }
    if(tab==='contract') {
      const contractFiles=(d.extraFiles||[]).filter(f=>/_contract\.json$/.test(f.href||''));
      return `<h3>Contrato concreto desta instância</h3><p>O contrato abaixo identifica exatamente quais ativos entram, quais saem e quais artefatos/eventos o módulo deve registrar.</p>
        ${renderFileInspector(contractFiles,'Arquivo de contrato')}
        <h3>Conteúdo do contrato carregado pela interface</h3><pre class="detail-code">${escapeHtml(pretty(d.contract||module.contract||{}))}</pre>
        <h3>Envelope de retorno esperado</h3><pre class="detail-code">${escapeHtml(pretty({run_id:instance.runId,module_id:moduleId,status:'SUCCESS',inputs:(d.inputs||[]).map(x=>x.id),outputs:(d.outputs||[]).map(x=>x.id),artifacts:d.artifacts||[],metrics:d.metrics||[],provenance_events:(d.provenanceRecords||[]).map((x,i)=>x.event_id||x.query_id||x.event||`event-${i+1}`)}))}</pre>`;
    }
    if(tab==='provenance') {
      return `<h3>Campos que precisam ser preservados</h3><div>${(module.provenanceFields||[]).map(([field,desc])=>`<div class="prov-field"><code>${escapeHtml(field)}</code><span>${escapeHtml(desc)}</span></div>`).join('')}</div>
        <h3>Registros concretos da execução</h3>${(d.provenanceRecords||[]).map((x,i)=>`<div class="prov-example"><strong>Registro ${i+1}</strong><pre class="detail-code">${escapeHtml(pretty(x))}</pre></div>`).join('')||'<div class="empty-inline">Nenhum evento específico.</div>'}
        <h3>Arquivos onde a proveniência/rastreabilidade foi persistida</h3>${renderFileInspector(provenanceFiles(instance,moduleId,module),'Evidências de proveniência')}`;
    }
    if(tab==='example') return `<h3>Exemplo dos dados/resultados deste módulo</h3>${renderExample(d.example)}
      <h3>Dados e arquivos associados ao exemplo</h3>${renderFileInspector(uniqueFiles([...moduleInputFiles(instance,moduleId,module),...moduleOutputFiles(instance,moduleId,module)]),'Arquivos do exemplo')}`;
    if(tab==='integration') return `<h3>Interação desta execução com módulos transversais</h3><p>O módulo publica ativos/eventos no <b>PipelineContext</b>. Os transversais aplicáveis consomem esses registros e persistem seus próprios artefatos. Abaixo, os arquivos persistidos também podem ser abertos dentro da interface.</p>
      ${renderTransversalCompact(instance,d.transversals||[])}
      <h3>Conteúdo persistido pelos transversais</h3>${renderFileInspector(integrationFiles(instance,module),'Saídas dos módulos transversais relacionadas a esta etapa')}
      <h3>Regra arquitetural</h3><div class="integration-rule"><b>${escapeHtml(moduleId)}</b><span>→</span><b>PipelineContext / eventos</b><span>→</span><b>transversais aplicáveis</b></div>`;
    return `<h3>Objetivo</h3><p>${escapeHtml(module.objective)}</p><div class="detail-grid"><div class="detail-box emphasis"><strong>Entrada nesta instância</strong><span>${escapeHtml(d.inputSummary||((module.inputs||[])[0])||'—')}</span></div><div class="detail-box emphasis"><strong>Saída nesta instância</strong><span>${escapeHtml(d.outputSummary||module.primaryOutput||'—')}</span></div><div class="detail-box"><strong>Run</strong><span>${escapeHtml(instance.runId)}</span></div><div class="detail-box"><strong>Formatos</strong><span>${escapeHtml((module.formats||[]).join(' · '))}</span></div></div>
      <h3>Métricas desta execução</h3><div class="detail-metrics">${(d.metrics||[]).map(x=>`<div><span>${escapeHtml(x.label)}</span><strong>${escapeHtml(x.value)}</strong></div>`).join('')}</div>
      <h3>O que este módulo realmente fez nesta instância</h3>${renderResponsibilityEvidence(instance,moduleId,module)}
      <h3>Entradas e saídas concretas</h3><div class="io-mini"><div><b>Entradas</b>${(d.inputs||[]).map(x=>`<code>${escapeHtml(x.id)}</code>`).join('')}</div><div><b>Saídas</b>${(d.outputs||[]).map(x=>`<code>${escapeHtml(x.id)}</code>`).join('')}</div></div>`;
  }

  function list(items){ return `<ul class="detail-list">${(items||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`; }

  renderCatalog(); renderExplorer();
})();