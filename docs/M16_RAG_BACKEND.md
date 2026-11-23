# M16 — Contrato do backend LLM/RAG

A V8.5 do UnespDataLens-Ins funciona sem LLM, usando recuperação local de evidências.
Quando um backend for configurado, o navegador continua responsável apenas por:

1. receber a pergunta;
2. aplicar o escopo de governança da demonstração;
3. recuperar até 6 trechos autorizados;
4. enviar somente esses trechos ao backend.

Nenhuma chave de provedor de LLM deve ser publicada no GitHub Pages.

## Endpoint

`POST /api/pipeline-qa`

## Requisição

```json
{
  "question": "Explique por que o dataset foi aceito com warning.",
  "instance_id": "educacao-evasao",
  "run_id": "run-edu-2026-11-18-001",
  "evidence": [
    {
      "evidence_id": "EV-AUTO-001",
      "module": "M05",
      "path": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m05/quality_report.json",
      "score": 17,
      "content": "{ ... trecho recuperado ... }"
    }
  ],
  "governance": {
    "raw_personal_data_allowed": false,
    "require_evidence_citations": true,
    "abstain_when_unsupported": true
  }
}
```

## Resposta esperada

```json
{
  "title": "Qualidade do dataset validado",
  "answer": "O dataset foi aceito com warning porque 11 das 12 regras passaram e uma regra não crítica ficou em WARNING.",
  "status": "SUPPORTED_BY_EVIDENCE",
  "evidence_ids": [
    "EV-AUTO-001"
  ],
  "limitations": []
}
```

## Regras obrigatórias

- responder somente com base nos trechos recebidos;
- nunca solicitar diretamente dados brutos pessoais;
- citar `evidence_id` e preservar `run_id`;
- retornar `INSUFFICIENT_EVIDENCE` quando não houver suporte;
- não inferir causalidade a partir de associação;
- respeitar as políticas do M10;
- registrar pergunta, evidências recuperadas, status e versão do modelo no backend de produção.

## Configuração no frontend

Arquivo:

`assets/js/pipeline-qa-config.js`

Definir somente o endpoint:

```javascript
window.UNESP_DATALENS_QA_CONFIG = {
  mode: "auto",
  backendEndpoint: "https://SEU-SERVIDOR/api/pipeline-qa",
  ...
};
```

A credencial do provedor de LLM permanece exclusivamente no servidor.
