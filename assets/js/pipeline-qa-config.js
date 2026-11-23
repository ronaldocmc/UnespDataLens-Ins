(function () {
  "use strict";

  /*
   * Configuração segura do M16.
   * O GitHub Pages NÃO deve conter chaves de API.
   * Para habilitar um LLM, configure apenas um endpoint de backend próprio
   * (por exemplo, no servidor ia.fct.unesp.br). O backend guarda a credencial
   * e recebe somente as evidências autorizadas recuperadas pelo M16.
   */
  window.UNESP_DATALENS_QA_CONFIG = {
    mode: "auto",
    backendEndpoint: "",
    requestTimeoutMs: 20000,
    maxEvidence: 6,
    maxChunkChars: 1800,
    governance: {
      allowRawPersonalData: false,
      allowedPathPrefixes: [
        "artifacts/",
        "metadata/",
        "contracts/",
        "reports/"
      ],
      allowedRootFiles: [
        "manifest.json"
      ]
    }
  };
})();