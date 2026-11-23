(function () {
  "use strict";

  var registry = window.UNESP_DATALENS_INSTANCIAS;
  var files = window.UNESP_DATALENS_FILES || {};
  var cfg = window.UNESP_DATALENS_QA_CONFIG || {};
  if (!registry) return;

  function $(selector, root) { return (root || document).querySelector(selector); }
  function esc(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function norm(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  var stop = new Set(["a","o","as","os","de","da","do","das","dos","e","em","no","na","nos","nas","um","uma","para","por","com","sem","que","qual","quais","como","foi","foram","ser","sao","esta","este","essa","esse","se","ao","aos","mais","sobre","onde","quando","quem","pode"]);
  var synonyms = {
    evasao:["evadiu","evadido","abandono","risco"],
    qualidade:["quality","regra","validacao","completude","warning","pass"],
    origem:["lineage","linhagem","source","fonte","proveniencia"],
    versao:["version","fingerprint","checksum","commit","manifesto"],
    transformacao:["transform","limpeza","preparacao","derivada","normalizada"],
    acesso:["governanca","permissao","allowed_roles","classification"],
    reproducao:["reprodutibilidade","ambiente","dependencias","manifesto","commit"],
    feature:["feature_id","formula","feature_store","feature_catalog"],
    impacto:["afetado","dependencia","downstream","relatorio_impacto"],
    schema:["schema_drift","atributo","coluna","estrutura"],
    drift:["data_drift","schema_drift","monitoramento","alerta"]
  };

  function instanceNow() {
    var id = new URLSearchParams(location.search).get("id") || "educacao-evasao";
    return registry.instances[id] || registry.instances["educacao-evasao"];
  }

  function tokens(value) {
    var base = norm(value).replace(/[^a-z0-9_.-]+/g, " ").split(/\s+/).filter(function (t) {
      return t && t.length > 2 && !stop.has(t);
    });
    var all = new Set(base);
    base.forEach(function (t) {
      Object.keys(synonyms).forEach(function (k) {
        var vals = synonyms[k];
        if (t === k || vals.indexOf(t) >= 0) {
          all.add(k);
          vals.forEach(function (v) { all.add(v); });
        }
      });
    });
    return Array.from(all);
  }

  function inferModule(path) {
    var m = String(path).match(/\/(m\d{2})(?:\/|_|\.)/i);
    if (m) return m[1].toUpperCase();
    if (/lineage|provenance/i.test(path)) return "M11";
    if (/versions|manifest|reprodut/i.test(path)) return "M12";
    if (/governance|policy|permiss/i.test(path)) return "M10";
    if (/monitoring|drift|baseline/i.test(path)) return "M15";
    if (/agents/i.test(path)) return "M16";
    if (/catalog|glossario|dicionario/i.test(path)) return "M09";
    return "—";
  }

  function allowed(instance, file) {
    var p = String(file.path || "");
    var prefix = String(instance.runBase || "") + "/";
    if (!p.startsWith(prefix)) return false;
    if (/\/data\//i.test(p)) return false;
    if (/\/(input|mock)\//i.test(p)) return false;
    var rel = p.slice(prefix.length);
    var gov = cfg.governance || {};
    var prefixes = gov.allowedPathPrefixes || ["artifacts/","metadata/","contracts/","reports/"];
    var roots = gov.allowedRootFiles || ["manifest.json"];
    return prefixes.some(function (x) { return rel.startsWith(x); }) || roots.indexOf(rel) >= 0;
  }

  function chunks(content) {
    var limit = Math.max(500, Number(cfg.maxChunkChars || 1800));
    var lines = String(content || "").trim().split(/\r?\n/);
    var out = [], buf = "";
    lines.forEach(function (line) {
      if ((buf + "\n" + line).length > limit && buf) {
        out.push(buf.trim());
        buf = line;
      } else {
        buf += (buf ? "\n" : "") + line;
      }
    });
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  function buildIndex(instance) {
    var out = [];
    Object.values(files).forEach(function (file) {
      if (!allowed(instance, file)) return;
      chunks(file.content).forEach(function (content, idx) {
        out.push({
          evidence_id:"EV-AUTO-" + String(out.length + 1).padStart(3,"0"),
          path:file.path,
          name:file.name || String(file.path).split("/").pop(),
          module:inferModule(file.path),
          chunk_index:idx,
          content:content,
          normalized:norm(file.path + " " + (file.name || "") + " " + content)
        });
      });
    });
    return out;
  }

  function score(item, question, ts) {
    var s = 0, q = norm(question), p = norm(item.path), n = norm(item.name);
    ts.forEach(function (t) {
      if (item.normalized.indexOf(t) >= 0) s += 2;
      if (p.indexOf(t) >= 0 || n.indexOf(t) >= 0) s += 3;
    });
    if (q.length > 8 && item.normalized.indexOf(q) >= 0) s += 10;
    if (/qualidade|regra/.test(q) && /m05|quality/.test(p)) s += 5;
    if (/feature|formula/.test(q) && /m14|feature/.test(p)) s += 5;
    if (/linhagem|lineage|origem|proven/.test(q) && /m11|lineage|proven/.test(p)) s += 5;
    if (/versao|reprodu|commit|fingerprint/.test(q) && /m12|versions|manifest/.test(p)) s += 5;
    if (/govern|acesso|permiss/.test(q) && /m10|governance|policy/.test(p)) s += 5;
    if (/drift|schema|monitor/.test(q) && /m15|monitoring|drift/.test(p)) s += 5;
    return s;
  }

  function retrieve(instance, question) {
    var ts = tokens(question);
    return buildIndex(instance).map(function (item) {
      item.score = score(item, question, ts);
      return item;
    }).filter(function (x) {
      return x.score > 0;
    }).sort(function (a,b) {
      return b.score - a.score || a.path.localeCompare(b.path);
    }).slice(0, Number(cfg.maxEvidence || 6));
  }

  function flatten(obj, prefix, rows) {
    prefix = prefix || ""; rows = rows || [];
    if (rows.length > 120) return rows;
    if (Array.isArray(obj)) {
      obj.slice(0,20).forEach(function (v,i) { flatten(v, prefix + "[" + i + "]", rows); });
    } else if (obj && typeof obj === "object") {
      Object.keys(obj).forEach(function (k) { flatten(obj[k], prefix ? prefix + "." + k : k, rows); });
    } else {
      rows.push([prefix, String(obj)]);
    }
    return rows;
  }

  function facts(item, question) {
    var ts = tokens(question), result = [];
    try {
      var obj = JSON.parse(item.content);
      result = flatten(obj).map(function (pair) {
        var h = norm(pair[0] + " " + pair[1]);
        var s = ts.reduce(function (n,t) { return n + (h.indexOf(t) >= 0 ? 1 : 0); }, 0);
        return {k:pair[0], v:pair[1], score:s};
      }).filter(function (x) { return x.score > 0; })
        .sort(function (a,b) { return b.score - a.score; }).slice(0,4)
        .map(function (x) { return "<li><code>" + esc(x.k) + "</code> = <b>" + esc(x.v) + "</b></li>"; });
    } catch (_) {}
    if (result.length) return result.join("");

    return item.content.split(/\r?\n/).map(function (line) {
      var h = norm(line);
      var s = ts.reduce(function (n,t) { return n + (h.indexOf(t) >= 0 ? 1 : 0); }, 0);
      return {line:line.trim(), score:s};
    }).filter(function (x) { return x.line && x.score > 0; })
      .sort(function (a,b) { return b.score - a.score; }).slice(0,4)
      .map(function (x) { return "<li>" + esc(x.line.slice(0,420)) + "</li>"; }).join("");
  }

  function localResult(question, retrieved) {
    if (!retrieved.length) return {
      title:"Não há evidência suficiente para responder",
      answer:"<p>O M16 não encontrou artefatos autorizados suficientemente relacionados à pergunta. A resposta não será completada por suposição.</p>",
      status:"INSUFFICIENT_EVIDENCE"
    };
    var blocks = retrieved.slice(0,4).map(function (item) {
      var f = facts(item, question) || "<li>" + esc(item.content.slice(0,420)) + "</li>";
      return '<article class="rag-fact-block"><div><span>' + esc(item.module) + '</span><strong>' + esc(item.name) + '</strong><em>score ' + item.score + '</em></div><ul>' + f + '</ul></article>';
    }).join("");
    return {
      title:"Resposta recuperada dos artefatos do pipeline",
      answer:"<p>O M16 recuperou <b>" + retrieved.length + " evidências governadas</b>. Os fatos abaixo são extraídos dos artefatos da execução; o sistema não completa lacunas sem suporte explícito.</p>" + blocks,
      status:"SUPPORTED_BY_RETRIEVAL"
    };
  }

  async function backendResult(instance, question, retrieved) {
    var endpoint = String(cfg.backendEndpoint || "").trim();
    if (!endpoint) return null;
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, Number(cfg.requestTimeoutMs || 20000));
    try {
      var response = await fetch(endpoint, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"same-origin",
        signal:controller.signal,
        body:JSON.stringify({
          question:question,
          instance_id:instance.id,
          run_id:instance.runId,
          evidence:retrieved.map(function (x) {
            return {evidence_id:x.evidence_id,module:x.module,path:x.path,score:x.score,content:x.content};
          }),
          governance:{raw_personal_data_allowed:false,require_evidence_citations:true,abstain_when_unsupported:true}
        })
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      var data = await response.json();
      if (!data || !data.answer) throw new Error("Resposta sem campo answer");
      return {
        title:data.title || "Resposta do M16 com LLM/RAG",
        answer:"<p>" + esc(data.answer) + "</p>" + (Array.isArray(data.limitations) && data.limitations.length ? "<p><b>Limitações:</b> " + esc(data.limitations.join(" · ")) + "</p>" : ""),
        status:data.status || "SUPPORTED_BY_EVIDENCE"
      };
    } catch (e) {
      var fallback = localResult(question, retrieved);
      fallback.title = "Backend LLM indisponível — resposta local baseada em evidências";
      fallback.backendError = e.message;
      return fallback;
    } finally {
      clearTimeout(timer);
    }
  }

  function evidenceHtml(retrieved) {
    if (!retrieved.length) return "";
    var items = retrieved.map(function (x,i) {
      return '<button type="button" class="rag-evidence-item" data-rag-path="' + esc(x.path) + '"><span>' + (i+1) + '</span><div><strong>' + esc(x.name) + '</strong><small>' + esc(x.module) + ' · score ' + x.score + '</small><code>' + esc(x.path) + '</code></div></button>';
    }).join("");
    return '<div class="rag-evidence-list"><h4>Evidências recuperadas</h4>' + items + '</div><div class="qa-evidence-view" data-rag-view hidden><div class="qa-evidence-head"><strong data-rag-title></strong><button type="button" data-rag-close>Fechar</button></div><pre data-rag-content></pre></div>';
  }

  function saveQuery(instance, question, result, retrieved, mode) {
    var key = "unespdatalens.m16.querylog." + instance.id, log = [];
    try { log = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) {}
    var record = {
      query_id:"Q-LOCAL-" + new Date().toISOString().replace(/[-:.TZ]/g,"").slice(0,14),
      asked_at:new Date().toISOString(),
      instance_id:instance.id,
      run_id:instance.runId,
      question:question,
      mode:mode,
      status:result.status,
      evidence_ids:retrieved.map(function (x) { return x.evidence_id; }),
      evidence_paths:retrieved.map(function (x) { return x.path; }),
      events:["EVIDENCE_FILTERED","EVIDENCE_RETRIEVED","AGENT_QUERY_COMPLETED"]
    };
    log.unshift(record);
    localStorage.setItem(key, JSON.stringify(log.slice(0,50)));
    return record;
  }

  function exportRecord(record) {
    var blob = new Blob([JSON.stringify(record,null,2)], {type:"application/json"});
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = record.query_id + ".json"; a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function renderRuntime(instance) {
    var host = $("#m16-rag-runtime");
    if (!host) return;
    var index = buildIndex(instance);
    var fileCount = new Set(index.map(function (x) { return x.path; })).size;
    var backend = String(cfg.backendEndpoint || "").trim();
    host.innerHTML = '<div><span>Evidências autorizadas</span><strong>' + fileCount + ' arquivos</strong></div>' +
      '<div><span>Trechos indexados</span><strong>' + index.length + '</strong></div>' +
      '<div><span>Dados pessoais brutos</span><strong>bloqueados</strong></div>' +
      '<div><span>LLM backend</span><strong>' + (backend ? "configurado" : "não configurado") + '</strong></div>';
  }

  function known(question) {
    var q = norm(question);
    return [
      /quais.*font|quantas.*font|fontes.*(usad|entrada)/,
      /de onde.*(indicador|ativo|produto|resultado)|origem.*(indicador|ativo|produto)|linhagem|lineage/,
      /versionamento.*(base|banco|dataset|dado|fonte)|como.*(fonte|base|dataset).*version|versao.*dataset|versoes.*dataset|hash.*dataset/,
      /versao.*fonte|versoes.*fonte|fingerprint.*fonte/,
      /armazen|onde.*(dado|dataset|ativo).*guard|camada.*(raw|analytical|analit)|onde.*dataset/,
      /tecnica|metodo.*(integracao|transformacao|preparacao)|tipo.*join|join.*utiliz|agregacao.*utiliz/,
      /transforma|limpeza|prepara.*dado/,
      /regra.*qualidade|qualidade.*regra|validacao.*dado/,
      /quem.*(usar|acessar)|permiss|politica.*acesso/,
      /versao.*pipeline|qual.*pipeline.*versao|versao.*execucao/,
      /imput|valor.*faltante|nulo/,
      /integracao.*(elimin|registro|cardinal)|cardinal|orfao|orfaos/,
      /schema.*(mud|drift)|mudanca.*schema/,
      /reproduz|seis meses|6 meses/,
      /feature|formula|calculad/,
      /fonte.*mudar|mudanca.*fonte|impact|afetad/
    ].some(function (re) { return re.test(q); });
  }

  async function answerFree(instance, question) {
    var host = $("#pipeline-qa-answer");
    if (!host) return;
    host.innerHTML = '<article class="qa-answer-card"><p>Recuperando evidências governadas do pipeline…</p></article>';
    var retrieved = retrieve(instance, question);
    var endpoint = String(cfg.backendEndpoint || "").trim();
    var result = endpoint ? await backendResult(instance, question, retrieved) : localResult(question, retrieved);
    var mode = endpoint ? "LLM_RAG_BACKEND" : "LOCAL_EVIDENCE_RAG";
    var record = saveQuery(instance, question, result, retrieved, mode);
    host.innerHTML = '<article class="qa-answer-card rag-answer">' +
      '<div class="qa-answer-question">Pergunta livre: <strong>' + esc(question) + '</strong></div>' +
      '<div class="rag-status-line"><span>M16</span><b>' + esc(result.status) + '</b><em>' + esc(mode) + '</em></div>' +
      '<h3>' + esc(result.title) + '</h3><div class="qa-answer-body">' + result.answer + '</div>' +
      '<div class="qa-modules"><b>Eventos:</b><span>EVIDENCE_FILTERED</span><span>EVIDENCE_RETRIEVED</span><span>AGENT_QUERY_COMPLETED</span></div>' +
      evidenceHtml(retrieved) +
      '<div class="rag-query-record"><span>Consulta registrada localmente como <code>' + esc(record.query_id) + '</code></span><button type="button" data-rag-export>Exportar registro JSON</button></div>' +
      '</article>';
    host.dataset.ragRecord = JSON.stringify(record);
  }

  function init() {
    var form = $("#pipeline-qa-form"), input = $("#pipeline-qa-input");
    if (!form || !input) return;
    var instance = instanceNow();
    renderRuntime(instance);

    document.addEventListener("submit", function (event) {
      if (event.target !== form) return;
      var question = input.value.trim();
      if (!question || known(question)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      answerFree(instance, question);
    }, true);

    document.addEventListener("click", function (event) {
      var item = event.target.closest("[data-rag-path]");
      if (item) {
        var view = $("[data-rag-view]"), title = $("[data-rag-title]"), content = $("[data-rag-content]");
        var file = files[item.dataset.ragPath];
        if (view && title && content && file) {
          title.textContent = file.name || item.dataset.ragPath.split("/").pop();
          content.textContent = file.content || "Conteúdo indisponível.";
          view.hidden = false;
          view.scrollIntoView({behavior:"smooth",block:"nearest"});
        }
        return;
      }
      if (event.target.closest("[data-rag-close]")) {
        var v = $("[data-rag-view]"); if (v) v.hidden = true; return;
      }
      if (event.target.closest("[data-rag-export]")) {
        var h = $("#pipeline-qa-answer");
        if (h && h.dataset.ragRecord) {
          try { exportRecord(JSON.parse(h.dataset.ragRecord)); } catch (_) {}
        }
      }
    });
  }

  init();
})();