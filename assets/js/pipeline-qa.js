(function () {
  "use strict";

  const registry = window.UNESP_DATALENS_INSTANCIAS;
  const files = window.UNESP_DATALENS_FILES || {};
  if (!registry) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value == null ? "" : value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const normalize = (value) => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  function currentInstance() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "educacao-evasao";
    return registry.instances[id] || registry.instances["educacao-evasao"];
  }

  function path(instance, relative) {
    return `${instance.runBase}/${relative}`;
  }

  function readRaw(filePath) {
    const key = String(filePath || "").replace(/^\.\//, "");
    const entry = files[key];
    return entry && entry.content != null ? entry.content : "";
  }

  function readJson(filePath, fallback = null) {
    const raw = readRaw(filePath);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (_) { return fallback; }
  }

  function evidence(label, filePath, why) {
    return { label, path: filePath, why };
  }

  function sourcesAnswer(instance) {
    const p = path(instance, "artifacts/m01/source_inventory.json");
    const inventory = readJson(p, {});
    const items = inventory.sources || [];
    const lines = items.map((s) =>
      `<li><code>${esc(s.source_id)}</code> — <b>${esc(s.connector)}</b> · ${esc(s.object)} · ${esc(s.rows)} registros · versão <code>${esc(s.version_ref)}</code></li>`
    ).join("");
    return {
      title: "Quais são as fontes desta execução?",
      answer: `<p>Esta instância utiliza <b>${items.length} fontes</b> heterogêneas:</p><ul>${lines}</ul>`,
      modules: ["M01", "M09", "M11", "M12"],
      evidence: [evidence("Inventário de fontes", p, "Identifica fonte, conector, objeto, granularidade, volume e referência de versão.")]
    };
  }

  function lineageAnswer(instance) {
    const graphPath = path(instance, "metadata/lineage/grafo_linhagem.json");
    const invPath = path(instance, "artifacts/m01/source_inventory.json");
    const graph = readJson(graphPath, {nodes:[], edges:[]});
    const target = "dataset:analytical:student_risk:v1";
    const edges = graph.edges || [];
    const visited = new Set();
    const selected = [];
    function walk(node) {
      if (visited.has(node)) return;
      visited.add(node);
      edges.filter(e => e.to === node).forEach(e => {
        selected.push(e);
        walk(e.from);
      });
    }
    walk(target);
    selected.reverse();
    const chain = selected.map(e =>
      `<div class="qa-lineage-edge"><code>${esc(e.from)}</code><span>→ ${esc(e.activity)} / ${esc(e.module)} →</span><code>${esc(e.to)}</code></div>`
    ).join("");
    return {
      title: "De onde veio o ativo/indicador analítico?",
      answer: `<p>O ativo <code>${target}</code> é rastreável até as fontes originais. O lineage registrado mostra a cadeia de ingestão, integração, transformação, validação e publicação:</p><div class="qa-lineage">${chain}</div><p>Isso permite demonstrar a origem do resultado, em vez de apenas afirmar que o pipeline o produziu.</p>`,
      modules: ["M01", "M02", "M03", "M04", "M05", "M07", "M11"],
      evidence: [
        evidence("Grafo de linhagem", graphPath, "Registra dependências entre fontes, datasets, atividades e módulos."),
        evidence("Inventário de fontes", invPath, "Caracteriza as fontes originais que iniciam a cadeia.")
      ]
    };
  }

  function versionsAnswer(instance) {
    const p = path(instance, "artifacts/m01/source_inventory.json");
    const inventory = readJson(p, {});
    const rows = (inventory.sources || []).map(s =>
      `<tr><td><code>${esc(s.source_id)}</code></td><td>${esc(s.integrity_method)}</td><td><code>${esc(s.version_ref)}</code></td></tr>`
    ).join("");
    return {
      title: "Qual versão das fontes foi utilizada?",
      answer: `<p>Cada fonte possui uma referência explícita de versão/integridade:</p><div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Fonte</th><th>Método</th><th>Versão / fingerprint</th></tr></thead><tbody>${rows}</tbody></table></div>`,
      modules: ["M01", "M12"],
      evidence: [evidence("Inventário de fontes", p, "Contém integrity_method e version_ref para cada fonte.")]
    };
  }

  function transformationsAnswer(instance) {
    const prepPath = path(instance, "artifacts/m04/cleaning_rules_register.json");
    const integPath = path(instance, "artifacts/m03/integration_report.json");
    const prep = readJson(prepPath, {});
    const integ = readJson(integPath, {});
    return {
      title: "Quais transformações foram realizadas?",
      answer: `<p>Na integração, <b>${esc(integ.input_assets)}</b> ativos foram combinados e produziram <b>${esc(integ.output_rows)} linhas × ${esc(integ.output_columns)} atributos</b>, sem órfãos e sem conflitos de cardinalidade.</p>
        <p>Na preparação foram registradas as seguintes transformações:</p>
        <ul>
          <li>duplicidades removidas: <b>${esc(prep.duplicates_removed)}</b>;</li>
          <li>valores nulos imputados: <b>${esc(prep.nulls_imputed)}</b>;</li>
          <li>categorias normalizadas: <code>${esc((prep.categories_normalized || []).join(", "))}</code>;</li>
          <li>atributos derivados: <code>${esc((prep.derived_columns || []).join(", "))}</code>.</li>
        </ul>`,
      modules: ["M03", "M04", "M11"],
      evidence: [
        evidence("Relatório de integração", integPath, "Resume entradas, saída, órfãos e conflitos de cardinalidade."),
        evidence("Registro de limpeza e preparação", prepPath, "Registra operações concretas aplicadas aos dados.")
      ]
    };
  }

  function qualityAnswer(instance) {
    const p = path(instance, "artifacts/m05/quality_report.json");
    const q = readJson(p, {});
    const rows = (q.rules || []).map(r =>
      `<tr><td><code>${esc(r.rule_id)}</code></td><td>${esc(r.column)}</td><td>${esc(r.type)}</td><td>${esc(r.status)}</td></tr>`
    ).join("");
    return {
      title: "Quais regras de qualidade foram aplicadas?",
      answer: `<p>Foram executadas <b>${esc(q.rules_executed)}</b> regras: <b>${esc(q.passed)}</b> aprovadas, <b>${esc(q.warnings)}</b> alerta(s) e <b>${esc(q.failed_critical)}</b> falhas críticas. Completude registrada: <b>${esc(q.completeness)}</b>. Status final: <code>${esc(q.status)}</code>.</p>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Regra</th><th>Campo</th><th>Tipo</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`,
      modules: ["M05", "M09", "M11"],
      evidence: [evidence("Relatório de qualidade", p, "Contém regras executadas, status e métricas de qualidade.")]
    };
  }

  function accessAnswer(instance) {
    const p = path(instance, "metadata/governance/access_policy.json");
    const g = readJson(p, {});
    const rows = (g.rules || []).map(r =>
      `<tr><td><code>${esc(r.classification)}</code></td><td>${esc((r.allowed_roles || []).join(", "))}</td><td>${r.external_sharing ? "sim" : "não"}</td></tr>`
    ).join("");
    return {
      title: "Quem pode utilizar os dados?",
      answer: `<p>A política <code>${esc(g.policy_id)}</code> define o acesso por classificação. Compartilhamento externo está bloqueado nas regras registradas.</p><div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Classificação</th><th>Papéis autorizados</th><th>Compartilhamento externo</th></tr></thead><tbody>${rows}</tbody></table></div>`,
      modules: ["M10"],
      evidence: [evidence("Política de acesso", p, "Registra papéis autorizados e regras de compartilhamento.")]
    };
  }

  function pipelineVersionAnswer(instance) {
    const manifestPath = path(instance, "metadata/versions/manifesto_execucao.json");
    const m = readJson(manifestPath, {});
    return {
      title: "Qual versão do pipeline produziu este resultado?",
      answer: `<p>O resultado foi produzido pela execução <code>${esc(m.run_id)}</code>, pipeline <code>${esc(m.pipeline_id)}</code> versão <b>${esc(m.pipeline_version)}</b>, associada ao commit <code>${esc(m.git_commit)}</code>. A execução terminou com status <code>${esc(m.status)}</code>.</p>`,
      modules: ["M12"],
      evidence: [evidence("Manifesto da execução", manifestPath, "Registra run, versão do pipeline, commit e status dos módulos.")]
    };
  }

  function imputationAnswer(instance) {
    const p = path(instance, "artifacts/m04/cleaning_rules_register.json");
    const r = readJson(p, {});
    const n = Number(r.nulls_imputed || 0);
    return {
      title: "Alguma variável foi imputada? Qual método?",
      answer: n === 0
        ? `<p><b>Não.</b> Nesta execução, o registro de preparação indica <code>nulls_imputed = 0</code>. Portanto, não houve método de imputação aplicado aos dados desta amostra.</p>`
        : `<p>Foram imputados <b>${n}</b> valores. Consulte o registro de preparação para os detalhes do método.</p>`,
      modules: ["M04", "M11"],
      evidence: [evidence("Registro de limpeza", p, "Mostra quantos valores foram imputados e demais transformações.")]
    };
  }

  function integrationAnswer(instance) {
    const p = path(instance, "artifacts/m03/integration_report.json");
    const r = readJson(p, {});
    return {
      title: "A integração eliminou registros? Qual foi a cardinalidade?",
      answer: `<p>A integração recebeu <b>${esc(r.input_assets)}</b> ativos e produziu um dataset de <b>${esc(r.output_rows)} linhas × ${esc(r.output_columns)} atributos</b>. Foram registrados <b>${esc(r.orphan_rows)} registros órfãos</b> e <b>${esc(r.cardinality_conflicts)} conflitos de cardinalidade</b>.</p>
        <p><b>Importante:</b> não é correto interpretar os 30 registros observados nas fontes como “30 linhas antes e 6 depois” por simples eliminação, porque as fontes possuem granularidades diferentes e notas/faltas são agregadas por aluno-semestre. Nesta execução não há evidência de perda por órfãos ou conflito de cardinalidade.</p>`,
      modules: ["M03", "M11"],
      evidence: [evidence("Relatório de integração", p, "Registra quantidade de ativos, dimensão da saída, órfãos e conflitos.")]
    };
  }

  function schemaAnswer(instance) {
    const p = path(instance, "metadata/monitoring/asset_evolution_report.json");
    const r = readJson(p, {});
    return {
      title: "Houve mudança de schema?",
      answer: `<p>O monitoramento desta execução registrou <b>schema_drift = ${esc(r.schema_drift)}</b>. Portanto, ${r.schema_drift ? "foi detectada mudança de schema" : "não foi detectada mudança de schema"} no ativo monitorado. O mesmo relatório registra <b>${esc(r.data_drift_alerts)}</b> alerta(s) de data drift e status <code>${esc(r.asset_status)}</code>.</p>`,
      modules: ["M15"],
      evidence: [evidence("Relatório de evolução do ativo", p, "Registra schema drift, data drift e estado do ativo.")]
    };
  }

  function reproducibilityAnswer(instance) {
    const manifestPath = path(instance, "metadata/versions/manifesto_execucao.json");
    const envPath = path(instance, "metadata/versions/ambiente_reprodutivel.json");
    const packagePath = path(instance, "metadata/versions/pacote_reprodutibilidade.json");
    const m = readJson(manifestPath, {});
    const env = readJson(envPath, {});
    return {
      title: "O resultado pode ser reproduzido seis meses depois?",
      answer: `<p>A instância preserva as principais evidências necessárias para uma tentativa de reprodução: <b>run_id</b>, versão do pipeline, commit, versões das fontes, ambiente e dependências.</p>
        <ul>
          <li>pipeline: <code>${esc(m.pipeline_id)} ${esc(m.pipeline_version)}</code>;</li>
          <li>commit: <code>${esc(m.git_commit)}</code>;</li>
          <li>Python: <code>${esc(env.python)}</code>;</li>
          <li>pacotes: <code>${esc(Object.entries(env.packages || {}).map(([k,v])=>`${k} ${v}`).join(", "))}</code>;</li>
          <li>timezone: <code>${esc(env.timezone)}</code>.</li>
        </ul>
        <p>Isso <b>não garante automaticamente</b> que o ambiente externo continuará disponível daqui a seis meses, mas fornece evidências estruturadas para reconstruir e verificar a execução.</p>`,
      modules: ["M12", "M11"],
      evidence: [
        evidence("Manifesto da execução", manifestPath, "Versão do pipeline, commit e run."),
        evidence("Ambiente reproduzível", envPath, "Registra runtime e dependências."),
        evidence("Pacote de reprodutibilidade", packagePath, "Consolida os elementos necessários à reprodução.")
      ]
    };
  }

  function featureAnswer(instance, question) {
    const p = path(instance, "artifacts/m14/feature_catalog.json");
    const f = readJson(p, {});
    const features = f.features || [];
    const nq = normalize(question);
    const selected = features.find(x => nq.includes(normalize(x.name))) || null;
    const list = selected ? [selected] : features;
    const rows = list.map(x =>
      `<tr><td><code>${esc(x.name)}</code></td><td>${esc(x.formula)}</td><td>${esc((x.sources || []).join(", "))}</td></tr>`
    ).join("");
    return {
      title: selected ? `Como a feature ${selected.name} foi calculada?` : "Como as features foram calculadas?",
      answer: `<div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Feature</th><th>Fórmula</th><th>Origem</th></tr></thead><tbody>${rows}</tbody></table></div>${selected && selected.note ? `<p><b>Observação:</b> ${esc(selected.note)}</p>` : ""}`,
      modules: ["M14", "M11"],
      evidence: [evidence("Catálogo de features", p, "Registra fórmula e dependências de cada feature.")]
    };
  }

  function impactAnswer(instance) {
    const p = path(instance, "metadata/lineage/relatorio_impacto.json");
    const r = readJson(p, {});
    return {
      title: "Se a fonte mudar, quais produtos podem ser afetados?",
      answer: `<p>O relatório de impacto registra o exemplo <i>“${esc(r.example_question)}”</i>. Os ativos potencialmente afetados são:</p><ol>${(r.affected || []).map(x=>`<li><code>${esc(x)}</code></li>`).join("")}</ol>`,
      modules: ["M11", "M15"],
      evidence: [evidence("Relatório de impacto", p, "Lista dependências a jusante de uma mudança na fonte.")]
    };
  }


  function storageAnswer(instance) {
    const ingestionPath = path(instance, "artifacts/m02/ingestion_manifest.json");
    const storagePath = path(instance, "artifacts/m07/analytical_storage_model.json");
    const catalogPath = path(instance, "artifacts/m07/analytical_assets_catalog.json");
    const ingestion = readJson(ingestionPath, {});
    const storage = readJson(storagePath, {});
    const catalog = readJson(catalogPath, {});
    const rawRows = (ingestion.items || []).map(x =>
      `<tr><td><code>${esc(x.raw_asset)}</code></td><td><code>${esc(x.path)}</code></td><td>${esc(x.rows)} × ${esc(x.columns)}</td><td><code>${esc(String(x.checksum_sha256 || "").slice(0,16))}…</code></td></tr>`
    ).join("");
    const analyticalRows = (catalog.assets || []).map(x =>
      `<tr><td><code>${esc(x.asset_id)}</code></td><td><code>${esc(x.path)}</code></td><td>${esc(x.rows)} × ${esc(x.columns)}</td><td>${esc(x.status)}</td></tr>`
    ).join("");
    return {
      title: "Como e onde os dados foram armazenados?",
      answer: `<p>O modelo de armazenamento desta instância organiza os dados em <b>${esc((storage.layers || []).length)} camadas</b>: <code>${esc((storage.layers || []).join(" → "))}</code>. A demonstração usa <b>${esc(storage.storage || "—")}</b>.</p>
        <h4>Camada raw preservada pelo M02</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Ativo</th><th>Local</th><th>Dimensão</th><th>Checksum</th></tr></thead><tbody>${rawRows}</tbody></table></div>
        <h4>Ativo analítico publicado pelo M07</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Ativo</th><th>Local</th><th>Dimensão</th><th>Status</th></tr></thead><tbody>${analyticalRows}</tbody></table></div>
        <p>Assim, a instância não guarda apenas o resultado final: preserva a passagem por <code>raw</code>, <code>integrated</code>, <code>prepared</code>, <code>validated</code>, <code>analytical</code> e <code>features</code>.</p>`,
      modules: ["M02", "M07", "M11", "M12"],
      evidence: [
        evidence("Manifesto de ingestão", ingestionPath, "Registra os ativos raw, locais, volumes, checksums e timestamps de ingestão."),
        evidence("Modelo de armazenamento analítico", storagePath, "Define as camadas e a tecnologia/formato de armazenamento da instância."),
        evidence("Catálogo de ativos analíticos", catalogPath, "Registra o ativo publicado, localização, dimensão, granularidade e status.")
      ]
    };
  }

  function techniquesAnswer(instance) {
    const integrationPath = path(instance, "artifacts/m03/integration_plan.json");
    const transformPath = path(instance, "artifacts/m04/transformation_plan.json");
    const cleaningPath = path(instance, "artifacts/m04/cleaning_rules_register.json");
    const qualityPath = path(instance, "artifacts/m05/quality_report.json");
    const featurePath = path(instance, "artifacts/m14/feature_catalog.json");
    const integration = readJson(integrationPath, {});
    const transform = readJson(transformPath, {});
    const cleaning = readJson(cleaningPath, {});
    const quality = readJson(qualityPath, {});
    const features = readJson(featurePath, {});

    const integrationRows = (integration.operations || []).map(x => {
      let detail = "";
      if (x.type === "aggregate") detail = `group_by: ${(x.group_by || []).join(", ")} · ${Object.entries(x.aggregations || {}).map(([k,v])=>k+"="+v).join(", ")}`;
      if (x.type === "join") detail = `${x.how} join · chaves: ${(x.on || []).join(", ")}`;
      return `<tr><td><code>${esc(x.id)}</code></td><td>${esc(x.type)}</td><td>${esc(detail)}</td></tr>`;
    }).join("");

    const transformRows = (transform.operations || []).map(x =>
      `<tr><td><code>${esc(x.field)}</code></td><td><code>${esc(x.operation)}</code></td><td>${esc(x.rule || x.source || x.reference_date || "—")}</td></tr>`
    ).join("");

    const featureRows = (features.features || []).slice(0,6).map(x =>
      `<tr><td><code>${esc(x.name)}</code></td><td>${esc(x.formula)}</td></tr>`
    ).join("");

    return {
      title: "Quais técnicas foram empregadas no pipeline?",
      answer: `<p>As técnicas estão registradas por etapa, em vez de ficarem apenas implícitas no código.</p>
        <h4>M03 · Integração</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Operação</th><th>Tipo</th><th>Detalhes</th></tr></thead><tbody>${integrationRows}</tbody></table></div>
        <h4>M04 · Preparação e transformação</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Campo</th><th>Técnica/operação</th><th>Parâmetro/regra</th></tr></thead><tbody>${transformRows}</tbody></table></div>
        <p>Nesta execução foram removidas <b>${esc(cleaning.duplicates_removed)}</b> duplicidades e realizadas <b>${esc(cleaning.nulls_imputed)}</b> imputações. Foram normalizadas as categorias <code>${esc((cleaning.categories_normalized || []).join(", "))}</code> e derivados <code>${esc((cleaning.derived_columns || []).join(", "))}</code>.</p>
        <h4>M05 · Qualidade</h4>
        <p>Foram executadas <b>${esc(quality.rules_executed)}</b> regras de qualidade, com <b>${esc(quality.passed)}</b> PASS e <b>${esc(quality.warnings)}</b> WARNING.</p>
        ${featureRows ? `<h4>M14 · Engenharia de features</h4><div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Feature</th><th>Fórmula</th></tr></thead><tbody>${featureRows}</tbody></table></div>` : ""}`,
      modules: ["M03", "M04", "M05", "M14"],
      evidence: [
        evidence("Plano de integração", integrationPath, "Registra agregações, tipos de join e chaves utilizadas."),
        evidence("Plano de transformação", transformPath, "Registra operações aplicadas a cada campo."),
        evidence("Registro de limpeza", cleaningPath, "Registra duplicidades, imputações, normalizações e colunas derivadas."),
        evidence("Relatório de qualidade", qualityPath, "Registra as técnicas/regras de validação e seus resultados."),
        evidence("Catálogo de features", featurePath, "Registra as fórmulas das features produzidas.")
      ]
    };
  }

  function dataVersioningAnswer(instance) {
    const sourcePath = path(instance, "metadata/versions/source_versions.json");
    const artifactsPath = path(instance, "metadata/versions/registro_versoes.json");
    const ingestionPath = path(instance, "artifacts/m02/ingestion_manifest.json");
    const catalogPath = path(instance, "artifacts/m07/analytical_assets_catalog.json");
    const sources = readJson(sourcePath, {});
    const artifacts = readJson(artifactsPath, {});
    const ingestion = readJson(ingestionPath, {});
    const catalog = readJson(catalogPath, {});

    const sourceRows = (sources.versions || []).map(x =>
      `<tr><td><code>${esc(x.source_id)}</code></td><td><code>${esc(x.version_ref)}</code></td></tr>`
    ).join("");
    const artifactRows = (artifacts.artifacts || []).map(x =>
      `<tr><td><code>${esc(x.path)}</code></td><td><code>${esc(String(x.sha256 || "").slice(0,24))}…</code></td></tr>`
    ).join("");
    const rawRows = (ingestion.items || []).map(x =>
      `<tr><td><code>${esc(x.raw_asset)}</code></td><td><code>${esc(x.checksum_sha256)}</code></td><td>${esc(x.ingested_at)}</td></tr>`
    ).join("");
    const published = (catalog.assets || [])[0];

    return {
      title: "Como as fontes e os datasets foram versionados?",
      answer: `<p>O UnespDataLens-RM diferencia <b>versão da fonte observada</b> de <b>versão do artefato materializado</b>.</p>
        <h4>Fontes originais</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Fonte</th><th>Referência de versão</th></tr></thead><tbody>${sourceRows}</tbody></table></div>
        <p>Arquivos usam checksum; fontes PostgreSQL/API usam referências de fingerprint que combinam consulta/resposta e schema observado.</p>
        <h4>Ativos raw materializados</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Ativo</th><th>SHA-256</th><th>Ingestão</th></tr></thead><tbody>${rawRows}</tbody></table></div>
        <h4>Datasets derivados</h4>
        <div class="qa-table-wrap"><table class="qa-table"><thead><tr><th>Artefato</th><th>SHA-256</th></tr></thead><tbody>${artifactRows}</tbody></table></div>
        ${published ? `<p>O ativo publicado é <code>${esc(published.asset_id)}</code>, explicitamente identificado como versão <b>v1</b>, derivado de <code>${esc(published.source)}</code>.</p>` : ""}`,
      modules: ["M01", "M02", "M07", "M12"],
      evidence: [
        evidence("Versões das fontes", sourcePath, "Registra version_ref/fingerprint de cada fonte original."),
        evidence("Registro de versões dos artefatos", artifactsPath, "Registra SHA-256 dos datasets integrado, preparado, validado e analítico."),
        evidence("Manifesto de ingestão", ingestionPath, "Registra checksums e timestamps dos ativos raw."),
        evidence("Catálogo de ativos analíticos", catalogPath, "Registra o identificador versionado do ativo publicado e seu predecessor.")
      ]
    };
  }

  function fallbackSearch(instance, question) {
    const tokens = normalize(question).split(/\s+/).filter(t => t.length >= 4);
    const prefix = String(instance.dataBase || "").replace(/^\.\//, "") + "/";
    const ranked = Object.values(files).filter(f => f.path && f.path.startsWith(prefix))
      .map(f => {
        const hay = normalize(`${f.path} ${f.content || ""}`);
        const score = tokens.reduce((n,t)=>n + (hay.includes(t) ? 1 : 0), 0);
        return { f, score };
      })
      .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5);
    return {
      title: "Não há uma resposta estruturada suficiente para esta pergunta",
      answer: ranked.length
        ? "<p>Não vou inferir uma resposta sem evidência explícita. Encontrei arquivos relacionados que podem ajudar na investigação.</p>"
        : "<p>Não encontrei evidência suficiente nos artefatos desta execução para responder com segurança.</p>",
      modules: [],
      evidence: ranked.map(x => evidence(x.f.name || x.f.path.split("/").pop(), x.f.path, "Arquivo relacionado por correspondência com os termos da pergunta."))
    };
  }

  function resolve(instance, question) {
    const q = normalize(question);
    if (/quais.*font|quantas.*font|fontes.*(usad|entrada)/.test(q)) return sourcesAnswer(instance);
    if (/de onde.*(indicador|ativo|produto|resultado)|origem.*(indicador|ativo|produto)|linhagem|lineage/.test(q)) return lineageAnswer(instance);
    if (/versionamento.*(base|banco|dataset|dado|fonte)|como.*(fonte|base|dataset).*version|versao.*dataset|versoes.*dataset|hash.*dataset/.test(q)) return dataVersioningAnswer(instance);
    if (/versao.*fonte|versoes.*fonte|fingerprint.*fonte/.test(q)) return versionsAnswer(instance);
    if (/armazen|onde.*(dado|dataset|ativo).*guard|camada.*(raw|analytical|analit)|onde.*dataset/.test(q)) return storageAnswer(instance);
    if (/tecnica|metodo.*(integracao|transformacao|preparacao)|tipo.*join|join.*utiliz|agregacao.*utiliz/.test(q)) return techniquesAnswer(instance);
    if (/transforma|limpeza|prepara.*dado/.test(q)) return transformationsAnswer(instance);
    if (/regra.*qualidade|qualidade.*regra|validacao.*dado/.test(q)) return qualityAnswer(instance);
    if (/quem.*(usar|acessar)|permiss|politica.*acesso/.test(q)) return accessAnswer(instance);
    if (/versao.*pipeline|qual.*pipeline.*versao|versao.*execucao/.test(q)) return pipelineVersionAnswer(instance);
    if (/imput|valor.*faltante|nulo/.test(q)) return imputationAnswer(instance);
    if (/integracao.*(elimin|registro|cardinal)|cardinal|orfao|orfaos/.test(q)) return integrationAnswer(instance);
    if (/schema.*(mud|drift)|mudanca.*schema/.test(q)) return schemaAnswer(instance);
    if (/reproduz|seis meses|6 meses/.test(q)) return reproducibilityAnswer(instance);
    if (/feature|formula|calculad/.test(q)) return featureAnswer(instance, question);
    if (/fonte.*mudar|mudanca.*fonte|impact|afetad/.test(q)) return impactAnswer(instance);
    return fallbackSearch(instance, question);
  }

  function renderEvidence(items) {
    if (!items || !items.length) return "";
    return `<div class="qa-evidence"><h4>Evidências utilizadas</h4>${items.map((e,i)=>`
      <button type="button" class="qa-evidence-item" data-qa-evidence="${esc(e.path)}">
        <span class="qa-evidence-num">${i+1}</span>
        <span><strong>${esc(e.label)}</strong><small>${esc(e.why || "")}</small><code>${esc(e.path)}</code></span>
      </button>`).join("")}</div>
      <div class="qa-evidence-view" data-qa-evidence-view hidden>
        <div class="qa-evidence-head"><strong data-qa-evidence-title></strong><button type="button" data-qa-close-evidence>Fechar</button></div>
        <pre data-qa-evidence-content></pre>
      </div>`;
  }

  function renderAnswer(result, question) {
    const host = $("#pipeline-qa-answer");
    if (!host) return;
    host.innerHTML = `<article class="qa-answer-card">
      <div class="qa-answer-question">Pergunta: <strong>${esc(question)}</strong></div>
      <h3>${esc(result.title)}</h3>
      <div class="qa-answer-body">${result.answer}</div>
      ${result.modules && result.modules.length ? `<div class="qa-modules"><b>Módulos envolvidos:</b> ${result.modules.map(m=>`<span>${esc(m)}</span>`).join("")}</div>` : ""}
      ${renderEvidence(result.evidence)}
    </article>`;
  }

  function init() {
    const form = $("#pipeline-qa-form");
    const input = $("#pipeline-qa-input");
    if (!form || !input) return;
    const instance = currentInstance();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      renderAnswer(resolve(instance, question), question);
    });

    document.addEventListener("click", (event) => {
      const suggestion = event.target.closest("[data-qa-question]");
      if (suggestion) {
        input.value = suggestion.dataset.qaQuestion || suggestion.textContent.trim();
        form.requestSubmit();
        return;
      }
      const ev = event.target.closest("[data-qa-evidence]");
      if (ev) {
        const view = $("[data-qa-evidence-view]");
        const title = $("[data-qa-evidence-title]");
        const content = $("[data-qa-evidence-content]");
        const filePath = ev.dataset.qaEvidence;
        if (view && title && content) {
          title.textContent = filePath.split("/").pop();
          content.textContent = readRaw(filePath) || "Conteúdo não disponível nesta instância.";
          view.hidden = false;
          view.scrollIntoView({behavior:"smooth", block:"nearest"});
        }
        return;
      }
      if (event.target.closest("[data-qa-close-evidence]")) {
        const view = $("[data-qa-evidence-view]");
        if (view) view.hidden = true;
      }
    });
  }

  init();
})();