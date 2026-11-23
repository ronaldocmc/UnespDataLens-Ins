(function(){"use strict";
window.UNESP_DATALENS_INSTANCIAS = {
  "catalog": [
    {
      "id": "educacao-evasao",
      "title": "Educação — Risco de Evasão",
      "domain": "Educação",
      "status": "Disponível",
      "available": true,
      "description": "Instância didática completa do UnespDataLens-RM com fontes heterogêneas (CSV, PostgreSQL e REST API). Cada módulo mostra entradas concretas, dados/amostras, processamento, saídas materializadas, contratos preenchidos, proveniência e interação transversal.",
      "objective": "Construir um ativo analítico confiável, governado, rastreável e reprodutível para apoiar a análise de risco de evasão estudantil.",
      "tags": [
        "16 módulos",
        "CSV + PostgreSQL + API",
        "dados concretos",
        "proveniência",
        "contratos",
        "transversais"
      ],
      "url": "explorar.html?id=educacao-evasao"
    },
    {
      "id": "varejo-churn",
      "title": "Varejo — Churn e Comportamento de Clientes",
      "domain": "Varejo",
      "status": "Planejada",
      "available": false,
      "description": "Segunda instância prevista para demonstrar que o mesmo modelo pode ser aplicado a clientes, vendas, produtos e estoque sem alterar os contratos dos módulos.",
      "objective": "Produzir ativos analíticos para comportamento de clientes e risco de churn.",
      "tags": [
        "clientes",
        "vendas",
        "produtos",
        "churn"
      ],
      "url": "explorar.html?id=varejo-churn"
    }
  ],
  "instances": {
    "educacao-evasao": {
      "id": "educacao-evasao",
      "title": "Educação — Risco de Evasão",
      "shortTitle": "Risco de Evasão",
      "domain": "Educação",
      "status": "disponivel",
      "available": true,
      "version": "1.2",
      "objective": "Construir um ativo analítico confiável, governado, rastreável e reprodutível para apoiar a análise de risco de evasão estudantil.",
      "description": "Instância didática completa do UnespDataLens-RM com fontes heterogêneas (CSV, PostgreSQL e REST API). Cada módulo mostra entradas concretas, dados/amostras, processamento, saídas materializadas, contratos preenchidos, proveniência e interação transversal.",
      "problem": "Quais estudantes apresentam características associadas a maior risco de evasão e quais evidências do pipeline sustentam essa análise?",
      "target": "evadiu",
      "runId": "run-edu-2026-11-18-001",
      "dataBase": "data/educacao-evasao",
      "runBase": "data/educacao-evasao/run/run-edu-2026-11-18-001",
      "sources": [
        {
          "id": "alunos_csv",
          "name": "Cadastro complementar de alunos",
          "connector": "Arquivo",
          "type": "CSV",
          "format": "CSV",
          "system": "Arquivo institucional / legado",
          "location": "instancias/data/educacao-evasao/input/alunos.csv",
          "access": "leitura de arquivo",
          "credentialRef": null,
          "granularity": "1 linha por aluno",
          "columns": [
            "aluno_id",
            "nome",
            "sexo",
            "data_nascimento",
            "cidade",
            "curso",
            "ano_ingresso"
          ],
          "sample": "1002,Joao Santos,M,2003-06-17,Presidente Prudente,Computacao,2022",
          "owner": "Graduação",
          "updateFrequency": "mensal",
          "sensitivity": "alta",
          "candidateKeys": [
            "aluno_id"
          ],
          "mockUrl": "data/educacao-evasao/input/alunos.csv",
          "recordCount": 6,
          "columnCount": 7,
          "schema": [
            {
              "name": "aluno_id",
              "type": "integer",
              "nullable": false,
              "candidate_key": true
            },
            {
              "name": "nome",
              "type": "string",
              "nullable": false,
              "personal_data": true
            },
            {
              "name": "sexo",
              "type": "string",
              "nullable": false,
              "protected_attribute": true
            },
            {
              "name": "data_nascimento",
              "type": "date",
              "nullable": false,
              "personal_data": true
            },
            {
              "name": "cidade",
              "type": "string",
              "nullable": true
            },
            {
              "name": "curso",
              "type": "string",
              "nullable": false
            },
            {
              "name": "ano_ingresso",
              "type": "integer",
              "nullable": false
            }
          ]
        },
        {
          "id": "matriculas_pg",
          "name": "Matrículas do Sistema Acadêmico",
          "connector": "PostgreSQL",
          "type": "Banco relacional",
          "format": "Tabela PostgreSQL",
          "system": "Sistema Acadêmico",
          "location": "sistema-academico / academico / public.matriculas",
          "access": "SELECT controlado via conexão de leitura",
          "credentialRef": "secret://academic-postgres",
          "granularity": "1 linha por aluno/semestre",
          "columns": [
            "matricula_id",
            "aluno_id",
            "semestre",
            "situacao"
          ],
          "sample": "5002 | 1002 | 2026-1 | EVADIDO",
          "owner": "STI / Graduação",
          "updateFrequency": "diária",
          "sensitivity": "alta",
          "candidateKeys": [
            "matricula_id"
          ],
          "mockUrl": "data/educacao-evasao/mock/postgres/matriculas_snapshot.csv",
          "recordCount": 6,
          "columnCount": 4,
          "schema": [
            {
              "name": "matricula_id",
              "type": "integer",
              "nullable": false,
              "candidate_key": true
            },
            {
              "name": "aluno_id",
              "type": "integer",
              "nullable": false,
              "foreign_key": "alunos_csv.aluno_id"
            },
            {
              "name": "semestre",
              "type": "string",
              "nullable": false
            },
            {
              "name": "situacao",
              "type": "string",
              "nullable": false
            }
          ]
        },
        {
          "id": "notas_pg",
          "name": "Notas e faltas do Sistema Acadêmico",
          "connector": "PostgreSQL",
          "type": "Banco relacional",
          "format": "View PostgreSQL",
          "system": "Sistema Acadêmico",
          "location": "sistema-academico / academico / public.vw_notas_faltas",
          "access": "SELECT controlado via conexão de leitura",
          "credentialRef": "secret://academic-postgres",
          "granularity": "1 linha por aluno/disciplina/semestre",
          "columns": [
            "aluno_id",
            "disciplina_id",
            "semestre",
            "nota",
            "faltas"
          ],
          "sample": "1002 | BD1 | 2026-1 | 3.5 | 18",
          "owner": "STI / Graduação",
          "updateFrequency": "diária",
          "sensitivity": "média",
          "candidateKeys": [
            "aluno_id",
            "disciplina_id",
            "semestre"
          ],
          "mockUrl": "data/educacao-evasao/mock/postgres/notas_snapshot.csv",
          "recordCount": 12,
          "columnCount": 5,
          "schema": [
            {
              "name": "aluno_id",
              "type": "integer",
              "nullable": false
            },
            {
              "name": "disciplina_id",
              "type": "string",
              "nullable": false
            },
            {
              "name": "semestre",
              "type": "string",
              "nullable": false
            },
            {
              "name": "nota",
              "type": "numeric",
              "nullable": false
            },
            {
              "name": "faltas",
              "type": "integer",
              "nullable": false
            }
          ]
        },
        {
          "id": "apoio_api",
          "name": "Benefícios e apoio estudantil",
          "connector": "REST API",
          "type": "API externa/institucional",
          "format": "JSON",
          "system": "Serviço de Assistência Estudantil",
          "location": "GET https://api.exemplo.edu.br/v1/beneficios-estudantis",
          "access": "HTTPS + token referenciado",
          "credentialRef": "secret://student-support-api",
          "granularity": "1 objeto por aluno",
          "columns": [
            "aluno_id",
            "bolsa",
            "auxilio_permanencia",
            "monitoria"
          ],
          "sample": "{\"aluno_id\":1002,\"bolsa\":\"NAO\",\"auxilio_permanencia\":\"NAO\",\"monitoria\":\"NAO\"}",
          "owner": "Assistência Estudantil",
          "updateFrequency": "diária",
          "sensitivity": "alta",
          "candidateKeys": [
            "aluno_id"
          ],
          "mockUrl": "data/educacao-evasao/mock/api/apoio_response.json",
          "recordCount": 6,
          "columnCount": 4,
          "schema": [
            {
              "name": "aluno_id",
              "type": "integer",
              "nullable": false,
              "candidate_key": true
            },
            {
              "name": "bolsa",
              "type": "string",
              "nullable": false
            },
            {
              "name": "auxilio_permanencia",
              "type": "string",
              "nullable": false
            },
            {
              "name": "monitoria",
              "type": "string",
              "nullable": false
            }
          ]
        }
      ],
      "runFlow": [
        [
          "Fontes",
          "alunos · matrículas · notas · apoio"
        ],
        [
          "Raw",
          "cópia íntegra + checksum"
        ],
        [
          "Integrado",
          "aluno × semestre"
        ],
        [
          "Preparado",
          "limpeza + padronização"
        ],
        [
          "Validado",
          "regras + relatório de qualidade"
        ],
        [
          "Produto",
          "ativo analítico + features + evidências"
        ]
      ],
      "manifest": {
        "run_id": "run-edu-2026-11-18-001",
        "pipeline_id": "EDU-EVASAO-01",
        "pipeline_version": "1.1.0",
        "domain": "educacao",
        "status": "SUCCESS",
        "target_column": "evadiu",
        "primary_entity": "student_semester"
      },
      "modules": {
        "M01": {
          "kind": "operational",
          "name": "Fontes e Inventário de Dados",
          "objective": "Identificar, mapear, caracterizar, classificar e documentar todas as fontes que entrarão no pipeline antes de qualquer transformação.",
          "inputs": [
            "pipeline.yml com identificação da instância e declaração das fontes",
            "fonte arquivo CSV: alunos.csv",
            "fonte PostgreSQL: public.matriculas e public.vw_notas_faltas do Sistema Acadêmico",
            "fonte REST API: GET /v1/beneficios-estudantis",
            "metadados de conexão sem segredos: connector, location/object, owner, periodicidade, granularidade e sensibilidade",
            "referências seguras para credenciais, por exemplo secret://academic-postgres; credenciais nunca são gravadas no inventário"
          ],
          "process": [
            "verificar se cada fonte existe e se pode ser acessada usando o conector apropriado",
            "identificar tipo, formato, tecnologia e objeto lógico da fonte (arquivo, tabela/view, endpoint etc.)",
            "ler o schema observado sem alterar os dados",
            "contar registros e atributos; para API, registrar paginação e quantidade observada; para banco, registrar a consulta de perfil usada",
            "calcular checksum SHA-256 quando houver conteúdo materializado; para banco/API, calcular fingerprint da consulta/resposta e do schema observado",
            "identificar granularidade e possíveis chaves candidatas",
            "classificar sensibilidade, dados pessoais e restrições de acesso",
            "registrar sistema de origem, owner, periodicidade, localização lógica e referência de credencial sem armazenar segredo",
            "emitir eventos padronizados SOURCE_REGISTERED, SCHEMA_OBSERVED, SOURCE_PROFILED, SOURCE_CLASSIFIED e SOURCE_VERSION_OBSERVED para os módulos transversais"
          ],
          "outputs": [
            "source_inventory.json",
            "source_schemas.json",
            "source_relationships.json",
            "source_classification.json",
            "source_access_registry.json",
            "m01_source_provenance.json"
          ],
          "formats": [
            "YAML",
            "CSV",
            "PostgreSQL",
            "REST/JSON",
            "JSON (artefatos e metadados)"
          ],
          "contract": {
            "requires": {
              "config": [
                "pipeline.yml"
              ],
              "sources": [
                "alunos_csv:file/csv",
                "matriculas_pg:postgresql/table",
                "notas_pg:postgresql/view",
                "apoio_api:rest/json"
              ]
            },
            "produces": {
              "artifacts": [
                "source_inventory",
                "source_schemas",
                "source_relationships",
                "source_classification",
                "source_access_registry"
              ],
              "provenance_events": [
                "SOURCE_REGISTERED",
                "SCHEMA_OBSERVED",
                "SOURCE_PROFILED",
                "SOURCE_CLASSIFIED",
                "SOURCE_VERSION_OBSERVED"
              ],
              "metrics": [
                "sources_count",
                "rows_observed",
                "columns_observed",
                "accessible_sources",
                "inaccessible_sources"
              ]
            }
          },
          "provenanceFields": [
            [
              "run_id",
              "execução que registrou a fonte"
            ],
            [
              "provenance_id",
              "identificador único do registro de proveniência"
            ],
            [
              "source_id",
              "identificador estável da fonte"
            ],
            [
              "source_name",
              "nome legível da fonte"
            ],
            [
              "source_system",
              "sistema ou unidade de origem"
            ],
            [
              "original_location",
              "caminho, URL, endpoint ou identificação física original"
            ],
            [
              "owner",
              "responsável institucional pela fonte"
            ],
            [
              "registered_at",
              "data/hora do inventário"
            ],
            [
              "connector",
              "tipo de conector usado: file, postgresql, rest_api etc."
            ],
            [
              "access_descriptor",
              "descrição não secreta do acesso: arquivo, host alias/database/object ou método/base URL/endpoint"
            ],
            [
              "credential_ref",
              "referência ao segredo; nunca a credencial em claro"
            ],
            [
              "integrity_method",
              "sha256 para arquivo; query/response fingerprint para fontes não materializadas"
            ],
            [
              "checksum_sha256",
              "hash dos bytes quando houver arquivo/materialização"
            ],
            [
              "query_fingerprint",
              "assinatura da consulta usada em banco, quando aplicável"
            ],
            [
              "response_fingerprint",
              "assinatura da resposta/payload observado em API, quando aplicável"
            ],
            [
              "schema_fingerprint",
              "assinatura do schema observado"
            ],
            [
              "granularity",
              "unidade representada por cada registro"
            ],
            [
              "candidate_keys",
              "chaves candidatas observadas"
            ],
            [
              "sensitivity",
              "classificação de sensibilidade"
            ],
            [
              "contains_personal_data",
              "indicação de dados pessoais"
            ],
            [
              "update_frequency",
              "periodicidade esperada"
            ],
            [
              "module_version",
              "versão do componente que realizou o registro"
            ]
          ],
          "provenanceExample": {
            "event_id": "prov-m01-alunos-001",
            "run_id": "run-edu-2026-11-18-001",
            "module_id": "M01",
            "activity": "SOURCE_REGISTRATION",
            "source_id": "source:alunos",
            "source_name": "Cadastro de Alunos",
            "source_system": "Sistema Academico",
            "connector": "file",
            "original_location": "instancias/data/educacao-evasao/input/alunos.csv",
            "owner": "Graduacao",
            "granularity": "aluno",
            "checksum_sha256": "842e...91ab",
            "schema_fingerprint": "92bc...44d1",
            "candidate_keys": [
              "aluno_id"
            ],
            "sensitivity": "alta",
            "contains_personal_data": true,
            "update_frequency": "diaria"
          },
          "provenanceExamples": [
            {
              "title": "Arquivo CSV",
              "data": {
                "source_id": "alunos_csv",
                "connector": "file",
                "location": "instancias/data/educacao-evasao/input/alunos.csv",
                "integrity_method": "sha256",
                "checksum_sha256": "842e...91ab",
                "schema_fingerprint": "92bc...44d1",
                "credential_ref": null
              }
            },
            {
              "title": "PostgreSQL",
              "data": {
                "source_id": "matriculas_pg",
                "connector": "postgresql",
                "host_alias": "sistema-academico",
                "database": "academico",
                "object": "public.matriculas",
                "credential_ref": "secret://academic-postgres",
                "integrity_method": "query+schema_fingerprint",
                "query_fingerprint": "qf-7c21...",
                "schema_fingerprint": "sf-144a..."
              }
            },
            {
              "title": "REST API",
              "data": {
                "source_id": "apoio_api",
                "connector": "rest_api",
                "method": "GET",
                "base_url": "https://api.exemplo.edu.br",
                "endpoint": "/v1/beneficios-estudantis",
                "credential_ref": "secret://student-support-api",
                "integrity_method": "response+schema_fingerprint",
                "response_fingerprint": "rf-91be...",
                "schema_fingerprint": "sf-a83c..."
              }
            }
          ],
          "exampleTitle": "O que acontece com alunos.csv?",
          "example": [
            "M01 não limpa nem copia o arquivo. Ele somente o conhece e registra.",
            "A chave candidata aluno_id é identificada.",
            "A granularidade é registrada como aluno.",
            "O arquivo recebe checksum para que a integridade possa ser verificada depois.",
            "O M11 poderá usar esse evento como origem do grafo de linhagem."
          ],
          "transversal": [
            [
              "M09",
              "recebe nome, schema, granularidade e responsável para o catálogo"
            ],
            [
              "M10",
              "recebe sensibilidade, presença de dados pessoais e finalidade"
            ],
            [
              "M11",
              "recebe o primeiro evento de proveniência da fonte"
            ],
            [
              "M12",
              "recebe checksum, schema fingerprint e versão"
            ],
            [
              "M15",
              "recebe perfil observado, schema e volume como baseline inicial"
            ]
          ],
          "emittedEvents": [
            [
              "SOURCE_REGISTERED",
              "fonte identificada, acessível e registrada com source_id estável"
            ],
            [
              "SCHEMA_OBSERVED",
              "schema lido diretamente da fonte sem transformação"
            ],
            [
              "SOURCE_PROFILED",
              "volume, quantidade de atributos e estatísticas básicas de inventário"
            ],
            [
              "SOURCE_CLASSIFIED",
              "sensibilidade, dados pessoais, owner e restrições iniciais"
            ],
            [
              "SOURCE_VERSION_OBSERVED",
              "checksum/fingerprint, timestamp e versão observada da fonte"
            ]
          ],
          "transversalInteractions": [
            {
              "id": "M09",
              "consumes": [
                "SOURCE_REGISTERED",
                "SCHEMA_OBSERVED",
                "SOURCE_PROFILED"
              ],
              "stores": [
                "metadata/catalog/source_catalog.json",
                "metadata/catalog/source_dictionary.json"
              ],
              "result": "Cria/atualiza a ficha catalográfica da fonte, schema, owner, granularidade e termos semânticos."
            },
            {
              "id": "M10",
              "consumes": [
                "SOURCE_REGISTERED",
                "SOURCE_CLASSIFIED"
              ],
              "stores": [
                "metadata/governance/source_classification.json",
                "metadata/governance/access_policy.json"
              ],
              "result": "Registra sensibilidade, dados pessoais, finalidade, papéis autorizados e restrições de acesso."
            },
            {
              "id": "M11",
              "consumes": [
                "SOURCE_REGISTERED",
                "SCHEMA_OBSERVED",
                "SOURCE_CLASSIFIED",
                "SOURCE_VERSION_OBSERVED"
              ],
              "stores": [
                "metadata/lineage/source_nodes.json",
                "metadata/lineage/provenance_events.json"
              ],
              "result": "Cria o nó de origem no grafo e preserva o evento que permitirá rastrear todas as derivações futuras."
            },
            {
              "id": "M12",
              "consumes": [
                "SCHEMA_OBSERVED",
                "SOURCE_VERSION_OBSERVED"
              ],
              "stores": [
                "metadata/versions/source_versions.json"
              ],
              "result": "Registra checksum/fingerprint, schema fingerprint, timestamp e referência da configuração usada."
            },
            {
              "id": "M15",
              "consumes": [
                "SOURCE_PROFILED",
                "SCHEMA_OBSERVED"
              ],
              "stores": [
                "metadata/monitoring/source_baseline.json"
              ],
              "result": "Cria baseline de volume e schema para detectar mudanças futuras na fonte."
            }
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m01.html",
          "primaryOutput": "Inventário + proveniência de origem",
          "instance": {
            "inputSummary": "pipeline.yml + 4 fontes heterogêneas (CSV, 2 objetos PostgreSQL e 1 endpoint REST API)",
            "outputSummary": "Inventário das 4 fontes + schemas + relacionamentos + classificação + registro de acesso + proveniência de origem",
            "metrics": [
              {
                "label": "Fontes",
                "value": "4"
              },
              {
                "label": "Acessíveis",
                "value": "4/4"
              },
              {
                "label": "Registros observados",
                "value": "30"
              },
              {
                "label": "Conectores",
                "value": "3 tipos"
              }
            ],
            "configText": "pipeline:\n  id: EDU-EVASAO-01\n  name: Pipeline educacional — risco de evasão\n  version: 1.2.0\n  domain: educacao\n  owner: Laboratório de Dados — UNESP\n  objective: Produzir ativo analítico rastreável para análise de risco de evasão\n  target_column: evadiu\n  primary_entity: student_semester\n\nrun:\n  run_id: run-edu-2026-11-18-001\n\nsources:\n  - source_id: alunos_csv\n    name: Cadastro complementar de alunos\n    connector: file\n    type: csv\n    path: input/alunos.csv\n    owner: Graduacao\n    granularity: aluno\n    candidate_keys: [aluno_id]\n    sensitivity: alta\n    update_frequency: mensal\n\n  - source_id: matriculas_pg\n    name: Matriculas do Sistema Academico\n    connector: postgresql\n    connection_ref: secret://academic-postgres\n    host_alias: sistema-academico\n    database: academico\n    object: public.matriculas\n    extraction_mode: snapshot\n    owner: STI / Graduacao\n    granularity: aluno_semestre\n    candidate_keys: [matricula_id]\n    sensitivity: alta\n    update_frequency: diaria\n\n  - source_id: notas_pg\n    name: Notas e faltas do Sistema Academico\n    connector: postgresql\n    connection_ref: secret://academic-postgres\n    host_alias: sistema-academico\n    database: academico\n    object: public.vw_notas_faltas\n    extraction_mode: snapshot\n    owner: STI / Graduacao\n    granularity: aluno_disciplina_semestre\n    candidate_keys: [aluno_id, disciplina_id, semestre]\n    sensitivity: media\n    update_frequency: diaria\n\n  - source_id: apoio_api\n    name: Beneficios e apoio estudantil\n    connector: rest_api\n    base_url: https://api.exemplo.edu.br\n    endpoint: /v1/beneficios-estudantis\n    auth_ref: secret://student-support-api\n    method: GET\n    response_format: json\n    owner: Assistencia Estudantil\n    granularity: aluno\n    candidate_keys: [aluno_id]\n    sensitivity: alta\n    update_frequency: diaria\n\nintegration:\n  target_granularity: aluno_semestre\n  joins:\n    - left: alunos_csv\n      right: matriculas_pg\n      on: [aluno_id]\n      how: inner\n    - left: student_enrollment\n      right: notas_agregadas\n      on: [aluno_id, semestre]\n      how: left\n    - left: student_performance\n      right: apoio_api\n      on: [aluno_id]\n      how: left\n\nquality_rules: configs/quality/evasao_rules.yml\nprotected_attributes: [sexo]\nfeatures: [media_nota,total_faltas,qtd_disciplinas,recebe_apoio,risco_academico_simples]\nproducts: [indicadores_risco_evasao]\n",
            "inputs": [
              {
                "id": "config:pipeline",
                "name": "pipeline.yml",
                "kind": "config",
                "format": "YAML",
                "path": "pipeline.yml",
                "href": "data/educacao-evasao/pipeline.yml",
                "role": "Declara a instância, fontes, chaves, granularidade e políticas"
              },
              {
                "id": "source:alunos_csv",
                "name": "Cadastro complementar de alunos",
                "kind": "source",
                "format": "CSV",
                "path": "input/alunos.csv",
                "href": "data/educacao-evasao/input/alunos.csv",
                "role": "Fonte arquivo",
                "records": 6,
                "columns": 7
              },
              {
                "id": "source:matriculas_pg",
                "name": "Matrículas do Sistema Acadêmico",
                "kind": "source",
                "format": "PostgreSQL table",
                "path": "mock/postgres/matriculas_snapshot.csv",
                "href": "data/educacao-evasao/mock/postgres/matriculas_snapshot.csv",
                "role": "Snapshot didático de public.matriculas",
                "records": 6,
                "columns": 4
              },
              {
                "id": "source:notas_pg",
                "name": "Notas e faltas",
                "kind": "source",
                "format": "PostgreSQL view",
                "path": "mock/postgres/notas_snapshot.csv",
                "href": "data/educacao-evasao/mock/postgres/notas_snapshot.csv",
                "role": "Snapshot didático de public.vw_notas_faltas",
                "records": 12,
                "columns": 5
              },
              {
                "id": "source:apoio_api",
                "name": "Benefícios e apoio estudantil",
                "kind": "source",
                "format": "REST/JSON",
                "path": "mock/api/apoio_response.json",
                "href": "data/educacao-evasao/mock/api/apoio_response.json",
                "role": "Resposta didática do endpoint",
                "records": 6,
                "columns": 4
              }
            ],
            "outputs": [
              {
                "id": "artifact:source_inventory",
                "name": "source_inventory.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_inventory.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_inventory.json",
                "role": "Inventário consolidado"
              },
              {
                "id": "artifact:source_schemas",
                "name": "source_schemas.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_schemas.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_schemas.json",
                "role": "Schemas observados"
              },
              {
                "id": "artifact:source_relationships",
                "name": "source_relationships.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_relationships.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_relationships.json",
                "role": "Relações entre fontes"
              },
              {
                "id": "artifact:source_classification",
                "name": "source_classification.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_classification.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_classification.json",
                "role": "Sensibilidade e dados pessoais"
              },
              {
                "id": "artifact:source_access",
                "name": "source_access_registry.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_access_registry.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_access_registry.json",
                "role": "Descritores de acesso sem segredos"
              },
              {
                "id": "artifact:m01_prov",
                "name": "m01_source_provenance.json",
                "kind": "provenance",
                "format": "JSON",
                "path": "artifacts/m01/m01_source_provenance.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/m01_source_provenance.json",
                "role": "Eventos de proveniência de origem"
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Ler declaração",
                "input": "pipeline.yml",
                "operation": "Carregar identificação da instância e lista de sources",
                "output": "4 SourceSpec",
                "registers": "run_id, source_id, connector, owner",
                "events": [
                  "SOURCE_REGISTERED"
                ],
                "transversal": [
                  "M09",
                  "M10",
                  "M11"
                ]
              },
              {
                "step": 2,
                "title": "Verificar acesso",
                "input": "4 SourceSpec",
                "operation": "file exists / PostgreSQL metadata query / HTTP GET de perfil",
                "output": "4 fontes acessíveis",
                "registers": "status, latência, credential_ref; nunca segredo",
                "events": [
                  "SOURCE_PROFILED"
                ],
                "transversal": [
                  "M15"
                ]
              },
              {
                "step": 3,
                "title": "Observar schema",
                "input": "fonte acessível",
                "operation": "Ler metadados/schema sem alterar dados",
                "output": "4 schemas observados",
                "registers": "tipo, nullable, chaves, schema_fingerprint",
                "events": [
                  "SCHEMA_OBSERVED"
                ],
                "transversal": [
                  "M09",
                  "M11",
                  "M12",
                  "M15"
                ]
              },
              {
                "step": 4,
                "title": "Perfilar volume",
                "input": "schema + fonte",
                "operation": "Contar registros e atributos",
                "output": "30 registros observados",
                "registers": "row_count, column_count, paginação/consulta de perfil",
                "events": [
                  "SOURCE_PROFILED"
                ],
                "transversal": [
                  "M09",
                  "M15"
                ]
              },
              {
                "step": 5,
                "title": "Fixar versão/origem",
                "input": "conteúdo observado",
                "operation": "SHA-256 para arquivo; fingerprint para banco/API",
                "output": "4 versões observadas",
                "registers": "checksum/query_fingerprint/response_fingerprint",
                "events": [
                  "SOURCE_VERSION_OBSERVED"
                ],
                "transversal": [
                  "M11",
                  "M12"
                ]
              },
              {
                "step": 6,
                "title": "Classificar",
                "input": "metadados de negócio",
                "operation": "Granularidade, chaves, sensibilidade, dados pessoais",
                "output": "classificação das 4 fontes",
                "registers": "owner, sensitivity, candidate_keys",
                "events": [
                  "SOURCE_CLASSIFIED"
                ],
                "transversal": [
                  "M10",
                  "M11"
                ]
              }
            ],
            "contract": {
              "run_id": "run-edu-2026-11-18-001",
              "module_id": "M01",
              "requires": {
                "config": [
                  "pipeline.yml"
                ],
                "sources": [
                  "alunos_csv:file/csv",
                  "matriculas_pg:postgresql/table",
                  "notas_pg:postgresql/view",
                  "apoio_api:rest/json"
                ]
              },
              "produces": {
                "artifacts": [
                  "source_inventory.json",
                  "source_schemas.json",
                  "source_relationships.json",
                  "source_classification.json",
                  "source_access_registry.json"
                ],
                "provenance": [
                  "m01_source_provenance.json"
                ],
                "events": [
                  "SOURCE_REGISTERED",
                  "SCHEMA_OBSERVED",
                  "SOURCE_PROFILED",
                  "SOURCE_CLASSIFIED",
                  "SOURCE_VERSION_OBSERVED"
                ]
              },
              "next_operational_module": "M02"
            },
            "provenanceRecords": [
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "alunos_csv",
                "connector": "file",
                "source_system": "Arquivo institucional / legado",
                "object": "input/alunos.csv",
                "owner": "Graduação",
                "event_id": "m01-001",
                "event": "SOURCE_REGISTERED",
                "occurred_at": "2026-11-18T10:00:00-03:00",
                "payload": {
                  "access_status": "ACCESSIBLE",
                  "granularity": "aluno",
                  "candidate_keys": [
                    "aluno_id"
                  ],
                  "update_frequency": "mensal"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "alunos_csv",
                "connector": "file",
                "source_system": "Arquivo institucional / legado",
                "object": "input/alunos.csv",
                "owner": "Graduação",
                "event_id": "m01-002",
                "event": "SCHEMA_OBSERVED",
                "occurred_at": "2026-11-18T10:00:00-03:00",
                "payload": {
                  "schema": [
                    {
                      "name": "aluno_id",
                      "type": "integer",
                      "nullable": false,
                      "candidate_key": true
                    },
                    {
                      "name": "nome",
                      "type": "string",
                      "nullable": false,
                      "personal_data": true
                    },
                    {
                      "name": "sexo",
                      "type": "string",
                      "nullable": false,
                      "protected_attribute": true
                    },
                    {
                      "name": "data_nascimento",
                      "type": "date",
                      "nullable": false,
                      "personal_data": true
                    },
                    {
                      "name": "cidade",
                      "type": "string",
                      "nullable": true
                    },
                    {
                      "name": "curso",
                      "type": "string",
                      "nullable": false
                    },
                    {
                      "name": "ano_ingresso",
                      "type": "integer",
                      "nullable": false
                    }
                  ],
                  "schema_fingerprint": "sha256:2b3eaffe30873b46871a2481a8788895af90073ac2a54bb4e381361c1a1aec93",
                  "column_count": 7
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "alunos_csv",
                "connector": "file",
                "source_system": "Arquivo institucional / legado",
                "object": "input/alunos.csv",
                "owner": "Graduação",
                "event_id": "m01-003",
                "event": "SOURCE_PROFILED",
                "occurred_at": "2026-11-18T10:00:00-03:00",
                "payload": {
                  "row_count": 6,
                  "column_count": 7,
                  "granularity": "aluno"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "alunos_csv",
                "connector": "file",
                "source_system": "Arquivo institucional / legado",
                "object": "input/alunos.csv",
                "owner": "Graduação",
                "event_id": "m01-004",
                "event": "SOURCE_CLASSIFIED",
                "occurred_at": "2026-11-18T10:00:00-03:00",
                "payload": {
                  "sensitivity": "alta",
                  "contains_personal_data": true,
                  "access_class": "RESTRICTED"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "alunos_csv",
                "connector": "file",
                "source_system": "Arquivo institucional / legado",
                "object": "input/alunos.csv",
                "owner": "Graduação",
                "event_id": "m01-005",
                "event": "SOURCE_VERSION_OBSERVED",
                "occurred_at": "2026-11-18T10:00:01-03:00",
                "payload": {
                  "integrity_method": "sha256",
                  "version_ref": "sha256:1e9c4b12a29629ec752ad6187db82d4dd620e8bf6888a84611794ef57958071f",
                  "schema_fingerprint": "sha256:2b3eaffe30873b46871a2481a8788895af90073ac2a54bb4e381361c1a1aec93"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "matriculas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.matriculas",
                "owner": "STI / Graduação",
                "event_id": "m01-006",
                "event": "SOURCE_REGISTERED",
                "occurred_at": "2026-11-18T10:00:01-03:00",
                "payload": {
                  "access_status": "ACCESSIBLE",
                  "granularity": "aluno_semestre",
                  "candidate_keys": [
                    "matricula_id"
                  ],
                  "update_frequency": "diaria"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "matriculas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.matriculas",
                "owner": "STI / Graduação",
                "event_id": "m01-007",
                "event": "SCHEMA_OBSERVED",
                "occurred_at": "2026-11-18T10:00:01-03:00",
                "payload": {
                  "schema": [
                    {
                      "name": "matricula_id",
                      "type": "integer",
                      "nullable": false,
                      "candidate_key": true
                    },
                    {
                      "name": "aluno_id",
                      "type": "integer",
                      "nullable": false,
                      "foreign_key": "alunos_csv.aluno_id"
                    },
                    {
                      "name": "semestre",
                      "type": "string",
                      "nullable": false
                    },
                    {
                      "name": "situacao",
                      "type": "string",
                      "nullable": false
                    }
                  ],
                  "schema_fingerprint": "sha256:731015bad528436f1cc2fe9da4e6d8fe3d820b7dc6f0fc38a22bd8a482146d1c",
                  "column_count": 4
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "matriculas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.matriculas",
                "owner": "STI / Graduação",
                "event_id": "m01-008",
                "event": "SOURCE_PROFILED",
                "occurred_at": "2026-11-18T10:00:01-03:00",
                "payload": {
                  "row_count": 6,
                  "column_count": 4,
                  "granularity": "aluno_semestre",
                  "profile_query": "SELECT count(*) AS rows_observed FROM public.matriculas WHERE semestre = :semestre",
                  "query_parameters": {
                    "semestre": "2026-1"
                  }
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "matriculas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.matriculas",
                "owner": "STI / Graduação",
                "event_id": "m01-009",
                "event": "SOURCE_CLASSIFIED",
                "occurred_at": "2026-11-18T10:00:01-03:00",
                "payload": {
                  "sensitivity": "alta",
                  "contains_personal_data": true,
                  "access_class": "RESTRICTED"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "matriculas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.matriculas",
                "owner": "STI / Graduação",
                "event_id": "m01-010",
                "event": "SOURCE_VERSION_OBSERVED",
                "occurred_at": "2026-11-18T10:00:02-03:00",
                "payload": {
                  "integrity_method": "query+schema_fingerprint",
                  "version_ref": "fingerprint:586352710de81a63b28f",
                  "schema_fingerprint": "sha256:731015bad528436f1cc2fe9da4e6d8fe3d820b7dc6f0fc38a22bd8a482146d1c"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "notas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.vw_notas_faltas",
                "owner": "STI / Graduação",
                "event_id": "m01-011",
                "event": "SOURCE_REGISTERED",
                "occurred_at": "2026-11-18T10:00:02-03:00",
                "payload": {
                  "access_status": "ACCESSIBLE",
                  "granularity": "aluno_disciplina_semestre",
                  "candidate_keys": [
                    "aluno_id",
                    "disciplina_id",
                    "semestre"
                  ],
                  "update_frequency": "diaria"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "notas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.vw_notas_faltas",
                "owner": "STI / Graduação",
                "event_id": "m01-012",
                "event": "SCHEMA_OBSERVED",
                "occurred_at": "2026-11-18T10:00:02-03:00",
                "payload": {
                  "schema": [
                    {
                      "name": "aluno_id",
                      "type": "integer",
                      "nullable": false
                    },
                    {
                      "name": "disciplina_id",
                      "type": "string",
                      "nullable": false
                    },
                    {
                      "name": "semestre",
                      "type": "string",
                      "nullable": false
                    },
                    {
                      "name": "nota",
                      "type": "numeric",
                      "nullable": false
                    },
                    {
                      "name": "faltas",
                      "type": "integer",
                      "nullable": false
                    }
                  ],
                  "schema_fingerprint": "sha256:76e3c930544b636db23ed6c18666142934099adc7716300a4fd5703f2ef9c1fc",
                  "column_count": 5
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "notas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.vw_notas_faltas",
                "owner": "STI / Graduação",
                "event_id": "m01-013",
                "event": "SOURCE_PROFILED",
                "occurred_at": "2026-11-18T10:00:02-03:00",
                "payload": {
                  "row_count": 12,
                  "column_count": 5,
                  "granularity": "aluno_disciplina_semestre",
                  "profile_query": "SELECT count(*) AS rows_observed FROM public.vw_notas_faltas WHERE semestre = :semestre",
                  "query_parameters": {
                    "semestre": "2026-1"
                  }
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "notas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.vw_notas_faltas",
                "owner": "STI / Graduação",
                "event_id": "m01-014",
                "event": "SOURCE_CLASSIFIED",
                "occurred_at": "2026-11-18T10:00:02-03:00",
                "payload": {
                  "sensitivity": "media",
                  "contains_personal_data": true,
                  "access_class": "INTERNAL"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "notas_pg",
                "connector": "postgresql",
                "source_system": "Sistema Acadêmico",
                "object": "public.vw_notas_faltas",
                "owner": "STI / Graduação",
                "event_id": "m01-015",
                "event": "SOURCE_VERSION_OBSERVED",
                "occurred_at": "2026-11-18T10:00:03-03:00",
                "payload": {
                  "integrity_method": "query+schema_fingerprint",
                  "version_ref": "fingerprint:f1f5a5a544fbb20d6a50",
                  "schema_fingerprint": "sha256:76e3c930544b636db23ed6c18666142934099adc7716300a4fd5703f2ef9c1fc"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "apoio_api",
                "connector": "rest_api",
                "source_system": "Serviço de Assistência Estudantil",
                "object": "GET /v1/beneficios-estudantis",
                "owner": "Assistência Estudantil",
                "event_id": "m01-016",
                "event": "SOURCE_REGISTERED",
                "occurred_at": "2026-11-18T10:00:03-03:00",
                "payload": {
                  "access_status": "ACCESSIBLE",
                  "granularity": "aluno",
                  "candidate_keys": [
                    "aluno_id"
                  ],
                  "update_frequency": "diaria"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "apoio_api",
                "connector": "rest_api",
                "source_system": "Serviço de Assistência Estudantil",
                "object": "GET /v1/beneficios-estudantis",
                "owner": "Assistência Estudantil",
                "event_id": "m01-017",
                "event": "SCHEMA_OBSERVED",
                "occurred_at": "2026-11-18T10:00:03-03:00",
                "payload": {
                  "schema": [
                    {
                      "name": "aluno_id",
                      "type": "integer",
                      "nullable": false,
                      "candidate_key": true
                    },
                    {
                      "name": "bolsa",
                      "type": "string",
                      "nullable": false
                    },
                    {
                      "name": "auxilio_permanencia",
                      "type": "string",
                      "nullable": false
                    },
                    {
                      "name": "monitoria",
                      "type": "string",
                      "nullable": false
                    }
                  ],
                  "schema_fingerprint": "sha256:9d2e2d914cb7117ba026dbb8c70659ef98b3b94464843c2586fdbc69ab3d0caf",
                  "column_count": 4
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "apoio_api",
                "connector": "rest_api",
                "source_system": "Serviço de Assistência Estudantil",
                "object": "GET /v1/beneficios-estudantis",
                "owner": "Assistência Estudantil",
                "event_id": "m01-018",
                "event": "SOURCE_PROFILED",
                "occurred_at": "2026-11-18T10:00:03-03:00",
                "payload": {
                  "row_count": 6,
                  "column_count": 4,
                  "granularity": "aluno",
                  "pagination": {
                    "strategy": "page/page_size",
                    "page": 1,
                    "page_size": 100,
                    "pages_observed": 1,
                    "objects_observed": 6
                  }
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "apoio_api",
                "connector": "rest_api",
                "source_system": "Serviço de Assistência Estudantil",
                "object": "GET /v1/beneficios-estudantis",
                "owner": "Assistência Estudantil",
                "event_id": "m01-019",
                "event": "SOURCE_CLASSIFIED",
                "occurred_at": "2026-11-18T10:00:03-03:00",
                "payload": {
                  "sensitivity": "alta",
                  "contains_personal_data": true,
                  "access_class": "RESTRICTED"
                }
              },
              {
                "run_id": "run-edu-2026-11-18-001",
                "module_id": "M01",
                "source_id": "apoio_api",
                "connector": "rest_api",
                "source_system": "Serviço de Assistência Estudantil",
                "object": "GET /v1/beneficios-estudantis",
                "owner": "Assistência Estudantil",
                "event_id": "m01-020",
                "event": "SOURCE_VERSION_OBSERVED",
                "occurred_at": "2026-11-18T10:00:04-03:00",
                "payload": {
                  "integrity_method": "response+schema_fingerprint",
                  "version_ref": "fingerprint:33f0e6c2cadb760744dd",
                  "schema_fingerprint": "sha256:9d2e2d914cb7117ba026dbb8c70659ef98b3b94464843c2586fdbc69ab3d0caf"
                }
              }
            ],
            "artifacts": [
              "artifacts/m01/source_inventory.json",
              "artifacts/m01/source_schemas.json",
              "artifacts/m01/source_relationships.json",
              "artifacts/m01/source_classification.json",
              "artifacts/m01/source_access_registry.json",
              "artifacts/m01/m01_source_provenance.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "SOURCE_REGISTERED",
                  "SCHEMA_OBSERVED",
                  "SOURCE_PROFILED"
                ],
                "action": "Cataloga cada fonte, schema, owner e granularidade.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json",
                  "metadata/catalog/dicionario_dados.json"
                ],
                "sample": {
                  "source_id": "matriculas_pg",
                  "owner": "STI / Graduação",
                  "granularity": "aluno_semestre"
                }
              },
              {
                "id": "M10",
                "consumes": [
                  "SOURCE_REGISTERED",
                  "SOURCE_CLASSIFIED"
                ],
                "action": "Define classificação, finalidade e política de acesso.",
                "stores": [
                  "metadata/governance/politica_acesso.json"
                ],
                "sample": {
                  "source_id": "alunos_csv",
                  "classification": "RESTRICTED"
                }
              },
              {
                "id": "M11",
                "consumes": [
                  "SOURCE_REGISTERED",
                  "SCHEMA_OBSERVED",
                  "SOURCE_VERSION_OBSERVED"
                ],
                "action": "Cria nós de origem e preserva eventos de proveniência.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json",
                  "metadata/lineage/registro_proveniencia.json"
                ],
                "sample": {
                  "node": "source:alunos_csv",
                  "type": "source"
                }
              },
              {
                "id": "M12",
                "consumes": [
                  "SCHEMA_OBSERVED",
                  "SOURCE_VERSION_OBSERVED"
                ],
                "action": "Versiona checksum/fingerprint e schema.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ],
                "sample": {
                  "source_id": "alunos_csv",
                  "version_ref": "sha256:1e9c4b12a29629ec752ad6187db82d4dd620e8bf6888a84611794ef57958071f"
                }
              },
              {
                "id": "M15",
                "consumes": [
                  "SOURCE_PROFILED",
                  "SCHEMA_OBSERVED"
                ],
                "action": "Cria baseline inicial de volume e schema.",
                "stores": [
                  "metadata/monitoring/baseline_current.json"
                ],
                "sample": {
                  "sources_count": 4,
                  "rows_observed_total": 30
                }
              }
            ],
            "example": {
              "title": "Inventário produzido pelo M01",
              "type": "table",
              "headers": [
                "source_id",
                "conector",
                "objeto",
                "granularidade",
                "registros",
                "atributos",
                "sensibilidade"
              ],
              "rows": [
                [
                  "alunos_csv",
                  "file",
                  "input/alunos.csv",
                  "aluno",
                  6,
                  7,
                  "alta"
                ],
                [
                  "matriculas_pg",
                  "postgresql",
                  "public.matriculas",
                  "aluno_semestre",
                  6,
                  4,
                  "alta"
                ],
                [
                  "notas_pg",
                  "postgresql",
                  "public.vw_notas_faltas",
                  "aluno_disciplina_semestre",
                  12,
                  5,
                  "media"
                ],
                [
                  "apoio_api",
                  "rest_api",
                  "GET /v1/beneficios-estudantis",
                  "aluno",
                  6,
                  4,
                  "alta"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "Verificar se cada fonte existe e pode ser acessada usando o conector apropriado.",
                "concreteAction": "CSV: verificou input/alunos.csv. PostgreSQL: simulou conexão por secret://academic-postgres e verificou public.matriculas e public.vw_notas_faltas. API: verificou GET /v1/beneficios-estudantis com auth_ref.",
                "evidence": [
                  "artifacts/m01/source_access_registry.json",
                  "metadata/execution/modules/m01_execution.json"
                ],
                "result": "4/4 fontes acessíveis",
                "events": [
                  "SOURCE_REGISTERED",
                  "SOURCE_PROFILED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M15"
                ]
              },
              {
                "responsibility": "Identificar tipo, formato, tecnologia e objeto lógico da fonte.",
                "concreteAction": "Registrou file/CSV para alunos_csv; PostgreSQL table public.matriculas; PostgreSQL view public.vw_notas_faltas; REST/JSON endpoint para apoio_api.",
                "evidence": [
                  "artifacts/m01/source_inventory.json",
                  "artifacts/m01/source_access_registry.json"
                ],
                "result": "3 tipos de conectores e 4 objetos lógicos identificados",
                "events": [
                  "SOURCE_REGISTERED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11"
                ]
              },
              {
                "responsibility": "Ler o schema observado sem alterar os dados.",
                "concreteAction": "Leu cabeçalho e tipos do CSV; metadados das colunas dos objetos PostgreSQL; campos observados no payload JSON da API. Nenhuma transformação foi aplicada.",
                "evidence": [
                  "artifacts/m01/source_schemas.json"
                ],
                "result": "4 schemas observados e fingerprintados",
                "events": [
                  "SCHEMA_OBSERVED"
                ],
                "transversals": [
                  "M09",
                  "M11",
                  "M12",
                  "M15"
                ]
              },
              {
                "responsibility": "Contar registros e atributos; registrar paginação da API e consulta de perfil do banco.",
                "concreteAction": "Contou 6 registros no CSV, 6 em matrículas, 12 em notas e 6 objetos na resposta da API; registrou column_count e o modo de observação de cada fonte.",
                "evidence": [
                  "artifacts/m01/source_inventory.json",
                  "metadata/monitoring/source_baseline.json"
                ],
                "result": "30 registros observados no exemplo didático",
                "events": [
                  "SOURCE_PROFILED"
                ],
                "transversals": [
                  "M09",
                  "M15"
                ]
              },
              {
                "responsibility": "Calcular checksum/fingerprint da versão observada.",
                "concreteAction": "Arquivo: SHA-256 dos bytes de alunos.csv. PostgreSQL: query_fingerprint + schema_fingerprint. API: response_fingerprint + schema_fingerprint.",
                "evidence": [
                  "artifacts/m01/m01_source_provenance.json",
                  "metadata/versions/source_versions.json"
                ],
                "result": "4 versões de origem identificadas",
                "events": [
                  "SOURCE_VERSION_OBSERVED"
                ],
                "transversals": [
                  "M11",
                  "M12"
                ]
              },
              {
                "responsibility": "Identificar granularidade e possíveis chaves candidatas.",
                "concreteAction": "alunos_csv→aluno/aluno_id; matriculas_pg→aluno_semestre/matricula_id; notas_pg→aluno_disciplina_semestre/(aluno_id,disciplina_id,semestre); apoio_api→aluno/aluno_id.",
                "evidence": [
                  "artifacts/m01/source_inventory.json",
                  "artifacts/m01/source_schemas.json"
                ],
                "result": "Granularidade e candidate_keys registradas para 4 fontes",
                "events": [
                  "SOURCE_PROFILED"
                ],
                "transversals": [
                  "M09",
                  "M11"
                ]
              },
              {
                "responsibility": "Classificar sensibilidade, dados pessoais e restrições de acesso.",
                "concreteAction": "Classificou alunos, matrículas e apoio como alta sensibilidade; notas como média; marcou presença de dados pessoais e enviou classificação para governança.",
                "evidence": [
                  "artifacts/m01/source_classification.json",
                  "metadata/governance/source_classification.json",
                  "metadata/governance/access_policy.json"
                ],
                "result": "4 fontes classificadas",
                "events": [
                  "SOURCE_CLASSIFIED"
                ],
                "transversals": [
                  "M10",
                  "M11"
                ]
              },
              {
                "responsibility": "Registrar sistema de origem, owner, periodicidade, localização lógica e referência de credencial sem armazenar segredo.",
                "concreteAction": "Persistiu owner, system, path/object/endpoint, update_frequency e apenas secret://... para fontes protegidas.",
                "evidence": [
                  "artifacts/m01/source_access_registry.json",
                  "metadata/catalog/source_catalog.json"
                ],
                "result": "Descritores de acesso persistidos sem segredo em claro",
                "events": [
                  "SOURCE_REGISTERED",
                  "SOURCE_CLASSIFIED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ]
              },
              {
                "responsibility": "Emitir eventos padronizados para os módulos transversais.",
                "concreteAction": "Publicou SOURCE_REGISTERED, SCHEMA_OBSERVED, SOURCE_PROFILED, SOURCE_CLASSIFIED e SOURCE_VERSION_OBSERVED no registro da execução.",
                "evidence": [
                  "metadata/execution/events.json",
                  "metadata/lineage/provenance_events.json"
                ],
                "result": "Eventos disponíveis no PipelineContext para consumo transversal",
                "events": [
                  "SOURCE_REGISTERED",
                  "SCHEMA_OBSERVED",
                  "SOURCE_PROFILED",
                  "SOURCE_CLASSIFIED",
                  "SOURCE_VERSION_OBSERVED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12",
                  "M15"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m01_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m01_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m01_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m01_execution.json",
                "role": "Registro completo da execução do módulo"
              },
              {
                "name": "alunos_csv.yml",
                "format": "YAML",
                "href": "data/educacao-evasao/declarations/sources/alunos_csv.yml",
                "role": "Declaração concreta da fonte alunos_csv extraída do pipeline.yml"
              },
              {
                "name": "matriculas_pg.yml",
                "format": "YAML",
                "href": "data/educacao-evasao/declarations/sources/matriculas_pg.yml",
                "role": "Declaração concreta da fonte matriculas_pg extraída do pipeline.yml"
              },
              {
                "name": "notas_pg.yml",
                "format": "YAML",
                "href": "data/educacao-evasao/declarations/sources/notas_pg.yml",
                "role": "Declaração concreta da fonte notas_pg extraída do pipeline.yml"
              },
              {
                "name": "apoio_api.yml",
                "format": "YAML",
                "href": "data/educacao-evasao/declarations/sources/apoio_api.yml",
                "role": "Declaração concreta da fonte apoio_api extraída do pipeline.yml"
              }
            ]
          }
        },
        "M02": {
          "kind": "operational",
          "name": "Extração, Ingestão e Armazenamento Bruto",
          "objective": "Trazer as fontes inventariadas para a camada raw preservando o conteúdo original e registrando integridade, horário, volume e falhas.",
          "inputs": [
            "source_inventory e source_schemas produzidos por M01",
            "referências das quatro fontes originais",
            "políticas de ingestão e diretório raw"
          ],
          "process": [
            "abrir cada fonte declarada no inventário",
            "copiar os bytes para data/raw sem limpeza ou enriquecimento",
            "comparar checksum da origem e da cópia",
            "registrar data/hora, linhas, colunas e tamanho",
            "registrar falhas ou rejeições",
            "emitir evento de lineage da fonte para o dataset raw"
          ],
          "outputs": [
            "data/raw/alunos.csv",
            "data/raw/matriculas.csv",
            "data/raw/notas.csv",
            "data/raw/apoio.csv",
            "ingestion_manifest.json",
            "ingestion_failures.json",
            "integrity_register.json"
          ],
          "formats": [
            "CSV",
            "JSON"
          ],
          "contract": {
            "requires": {
              "artifacts": [
                "source_inventory",
                "source_schemas"
              ]
            },
            "produces": {
              "datasets": [
                "raw:alunos",
                "raw:matriculas",
                "raw:notas",
                "raw:apoio"
              ],
              "artifacts": [
                "ingestion_manifest",
                "integrity_register"
              ],
              "provenance_events": [
                "INGESTION"
              ]
            }
          },
          "provenanceFields": [
            [
              "input_asset",
              "source_id registrado no M01"
            ],
            [
              "output_asset",
              "identificador do dataset raw"
            ],
            [
              "checksum_before",
              "hash da fonte original"
            ],
            [
              "checksum_after",
              "hash da cópia raw"
            ],
            [
              "ingested_at",
              "data/hora da ingestão"
            ],
            [
              "row_count",
              "quantidade de registros lidos"
            ],
            [
              "column_count",
              "quantidade de atributos"
            ],
            [
              "copy_mode",
              "tipo de ingestão; nesta instância BYTE_PRESERVING_COPY"
            ]
          ],
          "provenanceExample": {
            "event_id": "prov-m02-alunos-001",
            "module_id": "M02",
            "activity": "INGESTION",
            "used": [
              "source:alunos"
            ],
            "generated": [
              "dataset:raw:alunos:v1"
            ],
            "transformation": "BYTE_PRESERVING_COPY",
            "checksum_before": "842e...91ab",
            "checksum_after": "842e...91ab",
            "integrity": "MATCH"
          },
          "exampleTitle": "Regra didática",
          "example": [
            "Se o checksum da cópia raw for diferente do checksum da fonte, a ingestão deve falhar.",
            "Nenhuma correção de nome, nulo, duplicidade ou tipo é feita em M02."
          ],
          "transversal": [
            [
              "M09",
              "cataloga os novos datasets raw"
            ],
            [
              "M10",
              "herda a classificação de sensibilidade das fontes"
            ],
            [
              "M11",
              "cria arestas fonte → dataset raw"
            ],
            [
              "M12",
              "registra checksums e versão dos datasets raw"
            ],
            [
              "M15",
              "registra volume e falhas de ingestão"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m02.html",
          "primaryOutput": "Datasets raw íntegros",
          "instance": {
            "inputSummary": "Inventário e schemas de M01 + acesso às 4 fontes declaradas",
            "outputSummary": "4 materializações raw preservadas + manifesto de ingestão + integridade + falhas",
            "metrics": [
              {
                "label": "Fontes ingeridas",
                "value": "4"
              },
              {
                "label": "Falhas",
                "value": "0"
              },
              {
                "label": "Registros raw",
                "value": "30"
              },
              {
                "label": "Integridade",
                "value": "4/4 OK"
              }
            ],
            "inputs": [
              {
                "id": "artifact:source_inventory",
                "name": "source_inventory.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_inventory.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_inventory.json",
                "role": "Define o que ingerir"
              },
              {
                "id": "source:alunos_csv",
                "name": "alunos_csv",
                "kind": "source",
                "format": "CSV",
                "path": "input/alunos.csv",
                "href": "data/educacao-evasao/input/alunos.csv",
                "role": "",
                "records": 6,
                "columns": 7
              },
              {
                "id": "source:matriculas_pg",
                "name": "matriculas_pg",
                "kind": "source",
                "format": "PostgreSQL",
                "path": "mock/postgres/matriculas_snapshot.csv",
                "href": "data/educacao-evasao/mock/postgres/matriculas_snapshot.csv",
                "role": "",
                "records": 6,
                "columns": 4
              },
              {
                "id": "source:notas_pg",
                "name": "notas_pg",
                "kind": "source",
                "format": "PostgreSQL",
                "path": "mock/postgres/notas_snapshot.csv",
                "href": "data/educacao-evasao/mock/postgres/notas_snapshot.csv",
                "role": "",
                "records": 12,
                "columns": 5
              },
              {
                "id": "source:apoio_api",
                "name": "apoio_api",
                "kind": "source",
                "format": "REST/JSON",
                "path": "mock/api/apoio_response.json",
                "href": "data/educacao-evasao/mock/api/apoio_response.json",
                "role": "",
                "records": 6,
                "columns": 4
              }
            ],
            "outputs": [
              {
                "id": "dataset:raw:alunos:v1",
                "name": "raw/alunos.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/raw/alunos.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/alunos.csv",
                "role": "Cópia raw do CSV",
                "records": 6,
                "columns": 7
              },
              {
                "id": "dataset:raw:matriculas:v1",
                "name": "raw/matriculas.csv",
                "kind": "dataset",
                "format": "CSV snapshot",
                "path": "data/raw/matriculas.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/matriculas.csv",
                "role": "Materialização raw da tabela",
                "records": 6,
                "columns": 4
              },
              {
                "id": "dataset:raw:notas:v1",
                "name": "raw/notas.csv",
                "kind": "dataset",
                "format": "CSV snapshot",
                "path": "data/raw/notas.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/notas.csv",
                "role": "Materialização raw da view",
                "records": 12,
                "columns": 5
              },
              {
                "id": "dataset:raw:apoio:v1",
                "name": "raw/apoio.json",
                "kind": "dataset",
                "format": "JSON",
                "path": "data/raw/apoio.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/apoio.json",
                "role": "Materialização raw da resposta API",
                "records": 6,
                "columns": 4
              },
              {
                "id": "artifact:ingestion_manifest",
                "name": "ingestion_manifest.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m02/ingestion_manifest.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m02/ingestion_manifest.json",
                "role": ""
              },
              {
                "id": "artifact:integrity_register",
                "name": "integrity_register.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m02/integrity_register.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m02/integrity_register.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Resolver fonte",
                "input": "source_inventory",
                "operation": "Selecionar conector e credential_ref",
                "output": "4 conexões resolvidas",
                "registers": "source_id + connector",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Extrair",
                "input": "fonte original",
                "operation": "Leitura sem transformação semântica",
                "output": "30 registros obtidos",
                "registers": "query/endpoint/path + timestamp",
                "events": [
                  "INGESTION_STARTED"
                ],
                "transversal": []
              },
              {
                "step": 3,
                "title": "Materializar raw",
                "input": "conteúdo extraído",
                "operation": "Persistir snapshot/cópia na camada raw",
                "output": "4 datasets raw",
                "registers": "path + row_count + column_count",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversal": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ]
              },
              {
                "step": 4,
                "title": "Validar integridade",
                "input": "origem + raw",
                "operation": "Comparar checksum/fingerprint",
                "output": "4 verificações OK",
                "registers": "checksum/fingerprint",
                "events": [
                  "INGESTION_COMPLETED"
                ],
                "transversal": [
                  "M11",
                  "M12",
                  "M15"
                ]
              }
            ],
            "contract": {
              "run_id": "run-edu-2026-11-18-001",
              "module_id": "M02",
              "requires": {
                "artifacts": [
                  "M01/source_inventory",
                  "M01/source_schemas"
                ],
                "sources": [
                  "4 source refs"
                ]
              },
              "produces": {
                "datasets": [
                  "raw:alunos",
                  "raw:matriculas",
                  "raw:notas",
                  "raw:apoio"
                ],
                "artifacts": [
                  "ingestion_manifest",
                  "integrity_register",
                  "ingestion_failures"
                ],
                "events": [
                  "INGESTION_STARTED",
                  "DATASET_CREATED",
                  "INGESTION_COMPLETED"
                ]
              },
              "next_operational_module": "M03"
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m02-001",
                "activity": "INGESTION",
                "used": [
                  "source:alunos_csv"
                ],
                "generated": [
                  "dataset:raw:alunos:v1"
                ],
                "copy_mode": "BYTE_PRESERVING_COPY",
                "checksum_after": "1e9c4b12a29629ec752ad6187db82d4dd620e8bf6888a84611794ef57958071f",
                "status": "MATCH"
              },
              {
                "event_id": "prov-m02-002",
                "activity": "INGESTION",
                "used": [
                  "source:matriculas_pg"
                ],
                "generated": [
                  "dataset:raw:matriculas:v1"
                ],
                "extraction": "snapshot from public.matriculas",
                "status": "SUCCESS"
              }
            ],
            "artifacts": [
              "artifacts/m02/ingestion_manifest.json",
              "artifacts/m02/integrity_register.json",
              "artifacts/m02/ingestion_failures.json",
              "data/raw/alunos.csv",
              "data/raw/matriculas.csv",
              "data/raw/notas.csv",
              "data/raw/apoio.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Cataloga os 4 datasets raw.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Propaga classificação das fontes para raw.",
                "stores": [
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "INGESTION_COMPLETED"
                ],
                "action": "Cria arestas source → raw.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Versiona as materializações.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "INGESTION_COMPLETED"
                ],
                "action": "Registra volume/latência como baseline operacional.",
                "stores": [
                  "metadata/monitoring/baseline_current.json"
                ]
              }
            ],
            "example": {
              "title": "Manifesto de ingestão",
              "type": "table",
              "headers": [
                "source_id",
                "raw_asset",
                "linhas",
                "colunas",
                "status"
              ],
              "rows": [
                [
                  "alunos_csv",
                  "dataset:raw:alunos:v1",
                  6,
                  7,
                  "SUCCESS"
                ],
                [
                  "matriculas_pg",
                  "dataset:raw:matriculas:v1",
                  6,
                  4,
                  "SUCCESS"
                ],
                [
                  "notas_pg",
                  "dataset:raw:notas:v1",
                  12,
                  5,
                  "SUCCESS"
                ],
                [
                  "apoio_api",
                  "dataset:raw:apoio:v1",
                  6,
                  4,
                  "SUCCESS"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "abrir cada fonte declarada no inventário",
                "concreteAction": "Selecionar conector e credential_ref",
                "input": "source_inventory",
                "result": "4 conexões resolvidas",
                "registers": "source_id + connector",
                "events": [],
                "transversals": [],
                "evidence": [
                  "artifacts/m02/ingestion_manifest.json",
                  "artifacts/m02/integrity_register.json",
                  "artifacts/m02/ingestion_failures.json"
                ]
              },
              {
                "responsibility": "copiar os bytes para data/raw sem limpeza ou enriquecimento",
                "concreteAction": "Leitura sem transformação semântica",
                "input": "fonte original",
                "result": "30 registros obtidos",
                "registers": "query/endpoint/path + timestamp",
                "events": [
                  "INGESTION_STARTED"
                ],
                "transversals": [],
                "evidence": [
                  "artifacts/m02/ingestion_manifest.json",
                  "artifacts/m02/integrity_register.json",
                  "artifacts/m02/ingestion_failures.json"
                ]
              },
              {
                "responsibility": "comparar checksum da origem e da cópia",
                "concreteAction": "Persistir snapshot/cópia na camada raw",
                "input": "conteúdo extraído",
                "result": "4 datasets raw",
                "registers": "path + row_count + column_count",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "artifacts/m02/ingestion_manifest.json",
                  "artifacts/m02/integrity_register.json",
                  "artifacts/m02/ingestion_failures.json"
                ]
              },
              {
                "responsibility": "registrar data/hora, linhas, colunas e tamanho",
                "concreteAction": "Comparar checksum/fingerprint",
                "input": "origem + raw",
                "result": "4 verificações OK",
                "registers": "checksum/fingerprint",
                "events": [
                  "INGESTION_COMPLETED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m02/ingestion_manifest.json",
                  "artifacts/m02/integrity_register.json",
                  "artifacts/m02/ingestion_failures.json"
                ]
              },
              {
                "responsibility": "registrar falhas ou rejeições",
                "concreteAction": "Comparar checksum/fingerprint",
                "input": "origem + raw",
                "result": "4 verificações OK",
                "registers": "checksum/fingerprint",
                "events": [
                  "INGESTION_COMPLETED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m02/ingestion_manifest.json",
                  "artifacts/m02/integrity_register.json",
                  "artifacts/m02/ingestion_failures.json"
                ]
              },
              {
                "responsibility": "emitir evento de lineage da fonte para o dataset raw",
                "concreteAction": "Comparar checksum/fingerprint",
                "input": "origem + raw",
                "result": "4 verificações OK",
                "registers": "checksum/fingerprint",
                "events": [
                  "INGESTION_COMPLETED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m02/ingestion_manifest.json",
                  "artifacts/m02/integrity_register.json",
                  "artifacts/m02/ingestion_failures.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m02_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m02_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m02_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m02_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M03": {
          "kind": "operational",
          "name": "Integração e Harmonização",
          "objective": "Combinar as fontes raw respeitando granularidade, chaves e cardinalidades para produzir uma visão integrada aluno × semestre.",
          "inputs": [
            "raw:alunos",
            "raw:matriculas",
            "raw:notas",
            "raw:apoio",
            "regras de integração declaradas"
          ],
          "process": [
            "validar granularidade de cada fonte",
            "agregar notas por aluno_id + semestre",
            "calcular media_nota, total_faltas e qtd_disciplinas",
            "relacionar alunos e matrículas",
            "relacionar notas agregadas e apoio",
            "validar cardinalidades dos joins",
            "registrar registros órfãos e conflitos",
            "gerar dataset integrado"
          ],
          "outputs": [
            "data/integrated/student_semester.csv",
            "integration_plan.json",
            "integration_conflicts.json",
            "integration_graph.json"
          ],
          "formats": [
            "CSV ou Parquet",
            "JSON"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "raw:alunos",
                "raw:matriculas",
                "raw:notas",
                "raw:apoio"
              ]
            },
            "produces": {
              "datasets": [
                "integrated:student_semester"
              ],
              "artifacts": [
                "integration_plan",
                "integration_conflicts",
                "integration_graph"
              ],
              "metrics": [
                "integrated_rows",
                "orphan_rows",
                "join_conflicts"
              ]
            }
          },
          "provenanceFields": [
            [
              "used",
              "IDs dos datasets raw usados"
            ],
            [
              "generated",
              "ID do dataset integrado"
            ],
            [
              "operations",
              "agregações e joins aplicados"
            ],
            [
              "join_keys",
              "chaves usadas em cada relacionamento"
            ],
            [
              "cardinality_expected",
              "cardinalidade esperada"
            ],
            [
              "row_count_before_after",
              "volume antes e depois de cada operação"
            ],
            [
              "conflicts",
              "órfãos e violações de cardinalidade"
            ]
          ],
          "provenanceExample": {
            "activity": "INTEGRATION",
            "module_id": "M03",
            "used": [
              "raw:alunos",
              "raw:matriculas",
              "raw:notas",
              "raw:apoio"
            ],
            "generated": [
              "integrated:student_semester"
            ],
            "operations": [
              {
                "type": "aggregate",
                "source": "raw:notas",
                "group_by": [
                  "aluno_id",
                  "semestre"
                ],
                "nota": "mean",
                "faltas": "sum"
              },
              {
                "type": "join",
                "left": "alunos",
                "right": "matriculas",
                "key": [
                  "aluno_id"
                ],
                "join_type": "inner"
              },
              {
                "type": "join",
                "left": "resultado",
                "right": "notas_agregadas",
                "key": [
                  "aluno_id",
                  "semestre"
                ],
                "join_type": "left"
              }
            ]
          },
          "exampleTitle": "Aluno 1002",
          "example": [
            "BD1: nota 3,5 e 18 faltas; ED1: nota 4,0 e 20 faltas.",
            "Após a agregação: media_nota = 3,75 e total_faltas = 38.",
            "A linha integrada contém também situação = EVADIDO e dados de apoio."
          ],
          "transversal": [
            [
              "M09",
              "registra o novo ativo e seu significado semântico"
            ],
            [
              "M10",
              "reavalia classificação do ativo integrado"
            ],
            [
              "M11",
              "registra todas as arestas e operações de integração"
            ],
            [
              "M12",
              "versiona plano de integração e dataset produzido"
            ],
            [
              "M15",
              "acompanha órfãos, conflitos e variação de volume"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m03.html",
          "primaryOutput": "Dataset aluno × semestre",
          "instance": {
            "inputSummary": "4 datasets raw com granularidades diferentes",
            "outputSummary": "dataset integrado aluno × semestre (6 linhas × 15 colunas) + plano/relatório/grafo de integração",
            "metrics": [
              {
                "label": "Entradas",
                "value": "4 datasets"
              },
              {
                "label": "Saída",
                "value": "6 linhas"
              },
              {
                "label": "Órfãos",
                "value": "0"
              },
              {
                "label": "Conflitos",
                "value": "0"
              }
            ],
            "inputs": [
              {
                "id": "dataset:raw:alunos:v1",
                "name": "raw/alunos.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/raw/alunos.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/alunos.csv",
                "role": "",
                "records": 6,
                "columns": 7
              },
              {
                "id": "dataset:raw:matriculas:v1",
                "name": "raw/matriculas.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/raw/matriculas.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/matriculas.csv",
                "role": "",
                "records": 6,
                "columns": 4
              },
              {
                "id": "dataset:raw:notas:v1",
                "name": "raw/notas.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/raw/notas.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/notas.csv",
                "role": "",
                "records": 12,
                "columns": 5
              },
              {
                "id": "dataset:raw:apoio:v1",
                "name": "raw/apoio.json",
                "kind": "dataset",
                "format": "JSON",
                "path": "data/raw/apoio.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/raw/apoio.json",
                "role": "",
                "records": 6,
                "columns": 4
              }
            ],
            "outputs": [
              {
                "id": "dataset:integrated:student_semester:v1",
                "name": "student_semester.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/integrated/student_semester.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/integrated/student_semester.csv",
                "role": "Uma linha por estudante/semestre",
                "records": 6,
                "columns": 15
              },
              {
                "id": "artifact:integration_plan",
                "name": "integration_plan.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m03/integration_plan.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m03/integration_plan.json",
                "role": ""
              },
              {
                "id": "artifact:integration_report",
                "name": "integration_report.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m03/integration_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m03/integration_report.json",
                "role": ""
              },
              {
                "id": "artifact:integration_graph",
                "name": "integration_graph.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m03/integration_graph.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m03/integration_graph.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Definir granularidade",
                "input": "4 raw assets",
                "operation": "Fixar alvo aluno_semestre",
                "output": "student_semester",
                "registers": "target_granularity",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Agregar notas",
                "input": "raw:notas",
                "operation": "group_by aluno_id, semestre; mean(nota), sum(faltas), count(disciplina)",
                "output": "notas_agregadas 6 linhas",
                "registers": "regra de agregação",
                "events": [
                  "TRANSFORMATION_APPLIED"
                ],
                "transversal": [
                  "M11"
                ]
              },
              {
                "step": 3,
                "title": "Integrar cadastro + matrícula",
                "input": "raw:alunos + raw:matriculas",
                "operation": "INNER JOIN aluno_id",
                "output": "6 linhas",
                "registers": "join keys + cardinalidade",
                "events": [
                  "DATASET_DERIVED"
                ],
                "transversal": [
                  "M09",
                  "M11"
                ]
              },
              {
                "step": 4,
                "title": "Juntar desempenho e apoio",
                "input": "base estudante-semestre + agregados + apoio",
                "operation": "LEFT JOINs controlados",
                "output": "6 × 15",
                "registers": "órfãos=0; conflitos=0",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversal": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ]
              }
            ],
            "contract": {
              "run_id": "run-edu-2026-11-18-001",
              "module_id": "M03",
              "requires": {
                "datasets": [
                  "raw:alunos",
                  "raw:matriculas",
                  "raw:notas",
                  "raw:apoio"
                ]
              },
              "produces": {
                "dataset": "dataset:integrated:student_semester:v1",
                "granularity": "student_semester",
                "artifacts": [
                  "integration_plan",
                  "integration_report",
                  "integration_graph"
                ],
                "events": [
                  "TRANSFORMATION_APPLIED",
                  "DATASET_DERIVED",
                  "DATASET_CREATED"
                ]
              },
              "next_operational_module": "M04"
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m03-001",
                "activity": "AGGREGATION",
                "used": [
                  "dataset:raw:notas:v1"
                ],
                "generated": [
                  "derived:notas_agregadas"
                ],
                "rule": {
                  "group_by": [
                    "aluno_id",
                    "semestre"
                  ],
                  "nota": "mean",
                  "faltas": "sum",
                  "disciplina_id": "count"
                }
              },
              {
                "event_id": "prov-m03-002",
                "activity": "INTEGRATION",
                "used": [
                  "dataset:raw:alunos:v1",
                  "dataset:raw:matriculas:v1",
                  "derived:notas_agregadas",
                  "dataset:raw:apoio:v1"
                ],
                "generated": [
                  "dataset:integrated:student_semester:v1"
                ],
                "joins": [
                  {
                    "on": [
                      "aluno_id"
                    ],
                    "how": "inner"
                  },
                  {
                    "on": [
                      "aluno_id",
                      "semestre"
                    ],
                    "how": "left"
                  },
                  {
                    "on": [
                      "aluno_id"
                    ],
                    "how": "left"
                  }
                ]
              }
            ],
            "artifacts": [
              "data/integrated/student_semester.csv",
              "artifacts/m03/integration_plan.json",
              "artifacts/m03/integration_report.json",
              "artifacts/m03/conflict_report.json",
              "artifacts/m03/integration_graph.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Cataloga o dataset integrado e seu schema.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Mantém classificação RESTRICTED.",
                "stores": [
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "TRANSFORMATION_APPLIED",
                  "DATASET_DERIVED"
                ],
                "action": "Registra agregações e joins no lineage.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Versiona o integrado.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              }
            ],
            "example": {
              "title": "Dataset integrado — student_semester",
              "type": "table",
              "headers": [
                "aluno_id",
                "nome",
                "sexo",
                "data_nascimento",
                "cidade",
                "curso",
                "ano_ingresso",
                "semestre",
                "situacao",
                "media_nota",
                "total_faltas",
                "qtd_disciplinas",
                "bolsa",
                "auxilio_permanencia",
                "monitoria"
              ],
              "rows": [
                [
                  1001,
                  "Ana Silva",
                  "F",
                  "2004-02-10",
                  "Presidente Prudente",
                  "Computacao",
                  2023,
                  "2026-1",
                  "ATIVO",
                  7.5,
                  10,
                  2,
                  "NAO",
                  "SIM",
                  "NAO"
                ],
                [
                  1002,
                  "Joao Santos",
                  "M",
                  "2003-06-17",
                  "Presidente Prudente",
                  "Computacao",
                  2022,
                  "2026-1",
                  "EVADIDO",
                  3.75,
                  38,
                  2,
                  "NAO",
                  "NAO",
                  "NAO"
                ],
                [
                  1003,
                  "Maria Costa",
                  "F",
                  "2005-01-22",
                  "Assis",
                  "Computacao",
                  2024,
                  "2026-1",
                  "ATIVO",
                  8.75,
                  5,
                  2,
                  "SIM",
                  "SIM",
                  "SIM"
                ],
                [
                  1004,
                  "Carlos Lima",
                  "M",
                  "2002-09-05",
                  "Bauru",
                  "Computacao",
                  2021,
                  "2026-1",
                  "ATIVO",
                  5.25,
                  26,
                  2,
                  "NAO",
                  "NAO",
                  "SIM"
                ],
                [
                  1005,
                  "Luiza Rocha",
                  "F",
                  "2004-11-29",
                  "Presidente Prudente",
                  "Computacao",
                  2023,
                  "2026-1",
                  "ATIVO",
                  6.75,
                  12,
                  2,
                  "SIM",
                  "NAO",
                  "NAO"
                ],
                [
                  1006,
                  "Pedro Alves",
                  "M",
                  "2003-03-14",
                  "Marilia",
                  "Computacao",
                  2022,
                  "2026-1",
                  "EVADIDO",
                  2.5,
                  46,
                  2,
                  "NAO",
                  "NAO",
                  "NAO"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "validar granularidade de cada fonte",
                "concreteAction": "Fixar alvo aluno_semestre",
                "input": "4 raw assets",
                "result": "student_semester",
                "registers": "target_granularity",
                "events": [],
                "transversals": [],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "agregar notas por aluno_id + semestre",
                "concreteAction": "group_by aluno_id, semestre; mean(nota), sum(faltas), count(disciplina)",
                "input": "raw:notas",
                "result": "notas_agregadas 6 linhas",
                "registers": "regra de agregação",
                "events": [
                  "TRANSFORMATION_APPLIED"
                ],
                "transversals": [
                  "M11"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "calcular media_nota, total_faltas e qtd_disciplinas",
                "concreteAction": "INNER JOIN aluno_id",
                "input": "raw:alunos + raw:matriculas",
                "result": "6 linhas",
                "registers": "join keys + cardinalidade",
                "events": [
                  "DATASET_DERIVED"
                ],
                "transversals": [
                  "M09",
                  "M11"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "relacionar alunos e matrículas",
                "concreteAction": "LEFT JOINs controlados",
                "input": "base estudante-semestre + agregados + apoio",
                "result": "6 × 15",
                "registers": "órfãos=0; conflitos=0",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "relacionar notas agregadas e apoio",
                "concreteAction": "LEFT JOINs controlados",
                "input": "base estudante-semestre + agregados + apoio",
                "result": "6 × 15",
                "registers": "órfãos=0; conflitos=0",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "validar cardinalidades dos joins",
                "concreteAction": "LEFT JOINs controlados",
                "input": "base estudante-semestre + agregados + apoio",
                "result": "6 × 15",
                "registers": "órfãos=0; conflitos=0",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "registrar registros órfãos e conflitos",
                "concreteAction": "LEFT JOINs controlados",
                "input": "base estudante-semestre + agregados + apoio",
                "result": "6 × 15",
                "registers": "órfãos=0; conflitos=0",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              },
              {
                "responsibility": "gerar dataset integrado",
                "concreteAction": "LEFT JOINs controlados",
                "input": "base estudante-semestre + agregados + apoio",
                "result": "6 × 15",
                "registers": "órfãos=0; conflitos=0",
                "events": [
                  "DATASET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/integrated/student_semester.csv",
                  "artifacts/m03/integration_plan.json",
                  "artifacts/m03/integration_report.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m03_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m03_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m03_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m03_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M04": {
          "kind": "operational",
          "name": "Transformação, Limpeza, Enriquecimento e Preparação dos Dados",
          "objective": "Preparar o dataset integrado para uso analítico aplicando regras explícitas, documentadas e reproduzíveis.",
          "inputs": [
            "integrated:student_semester",
            "regras de limpeza, padronização e enriquecimento"
          ],
          "process": [
            "padronizar nomes e tipos de colunas",
            "normalizar valores categóricos",
            "tratar strings vazias e valores ausentes",
            "remover duplicidades segundo chave definida",
            "derivar atributos de preparação quando necessário",
            "registrar cada regra e quantidade de registros afetados"
          ],
          "outputs": [
            "data/prepared/student_semester.csv",
            "cleaning_rules_register.json",
            "transformation_plan.json"
          ],
          "formats": [
            "CSV ou Parquet",
            "JSON"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "integrated:student_semester"
              ]
            },
            "produces": {
              "datasets": [
                "prepared:student_semester"
              ],
              "artifacts": [
                "cleaning_rules_register",
                "transformation_plan"
              ]
            }
          },
          "provenanceFields": [
            [
              "rule_id",
              "identificador da transformação"
            ],
            [
              "column",
              "atributo afetado"
            ],
            [
              "operation",
              "tipo de transformação"
            ],
            [
              "parameters",
              "parâmetros ou mapeamento"
            ],
            [
              "affected_rows",
              "quantidade de registros alterados"
            ],
            [
              "input_asset",
              "dataset de origem"
            ],
            [
              "output_asset",
              "dataset preparado"
            ]
          ],
          "provenanceExample": {
            "rule_id": "clean-idade-001",
            "column": "idade",
            "operation": "imputation",
            "method": "median",
            "value_used": 22,
            "affected_rows": 17
          },
          "exampleTitle": "Nada fica escondido",
          "example": [
            "Se idade ausente for preenchida com mediana, o valor usado e a quantidade de linhas afetadas ficam registrados.",
            "Feature analítica não deve ser criada silenciosamente aqui; features do modelo são tratadas formalmente no M14."
          ],
          "transversal": [
            [
              "M09",
              "atualiza schema e descrições do dataset preparado"
            ],
            [
              "M10",
              "verifica se transformações afetam minimização ou privacidade"
            ],
            [
              "M11",
              "registra regra por regra no lineage"
            ],
            [
              "M12",
              "versiona as regras de preparação"
            ],
            [
              "M15",
              "observa mudanças na taxa de ausentes e duplicidades"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m04.html",
          "primaryOutput": "Dataset preparado",
          "instance": {
            "inputSummary": "dataset integrado student_semester (6 × 15)",
            "outputSummary": "dataset preparado (6 × 18) com idade, faixa_etaria e target evadiu",
            "metrics": [
              {
                "label": "Linhas",
                "value": "6 → 6"
              },
              {
                "label": "Duplicatas removidas",
                "value": "0"
              },
              {
                "label": "Imputações",
                "value": "0"
              },
              {
                "label": "Atributos derivados",
                "value": "3"
              }
            ],
            "inputs": [
              {
                "id": "dataset:integrated:student_semester:v1",
                "name": "student_semester.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/integrated/student_semester.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/integrated/student_semester.csv",
                "role": "",
                "records": 6,
                "columns": 15
              }
            ],
            "outputs": [
              {
                "id": "dataset:prepared:student_semester:v1",
                "name": "student_semester_prepared.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/prepared/student_semester_prepared.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/prepared/student_semester_prepared.csv",
                "role": "",
                "records": 6,
                "columns": 18
              },
              {
                "id": "artifact:transformation_plan",
                "name": "transformation_plan.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m04/transformation_plan.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m04/transformation_plan.json",
                "role": ""
              },
              {
                "id": "artifact:cleaning_rules",
                "name": "cleaning_rules_register.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m04/cleaning_rules_register.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m04/cleaning_rules_register.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Padronizar",
                "input": "integrated",
                "operation": "trim/upper em categorias",
                "output": "categorias consistentes",
                "registers": "regras aplicadas",
                "events": [
                  "TRANSFORMATION_APPLIED"
                ],
                "transversal": [
                  "M11"
                ]
              },
              {
                "step": 2,
                "title": "Tratar qualidade básica",
                "input": "integrated",
                "operation": "verificar duplicatas/nulos; política de imputação",
                "output": "6 linhas preservadas",
                "registers": "affected_rows=0",
                "events": [
                  "TRANSFORMATION_APPLIED"
                ],
                "transversal": [
                  "M11",
                  "M15"
                ]
              },
              {
                "step": 3,
                "title": "Derivar idade",
                "input": "data_nascimento",
                "operation": "idade na data de referência 2026-11-18",
                "output": "idade",
                "registers": "fórmula + reference_date",
                "events": [
                  "FIELD_DERIVED"
                ],
                "transversal": [
                  "M09",
                  "M11"
                ]
              },
              {
                "step": 4,
                "title": "Criar target",
                "input": "situacao",
                "operation": "evadiu = 1 se EVADIDO",
                "output": "evadiu",
                "registers": "regra explícita",
                "events": [
                  "LABEL_DERIVED"
                ],
                "transversal": [
                  "M11",
                  "M12"
                ]
              }
            ],
            "contract": {
              "module_id": "M04",
              "requires": {
                "dataset": "dataset:integrated:student_semester:v1"
              },
              "produces": {
                "dataset": "dataset:prepared:student_semester:v1",
                "derived_fields": [
                  "idade",
                  "faixa_etaria",
                  "evadiu"
                ],
                "artifacts": [
                  "transformation_plan",
                  "cleaning_rules_register"
                ]
              },
              "next_operational_module": "M05"
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m04-idade",
                "activity": "FIELD_DERIVED",
                "used": [
                  "data_nascimento"
                ],
                "generated": [
                  "idade"
                ],
                "rule": "age_at(data_nascimento, 2026-11-18)"
              },
              {
                "event_id": "prov-m04-target",
                "activity": "LABEL_DERIVED",
                "used": [
                  "situacao"
                ],
                "generated": [
                  "evadiu"
                ],
                "rule": "1 if situacao == EVADIDO else 0"
              }
            ],
            "artifacts": [
              "data/prepared/student_semester_prepared.csv",
              "artifacts/m04/transformation_plan.json",
              "artifacts/m04/cleaning_rules_register.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "FIELD_DERIVED",
                  "LABEL_DERIVED"
                ],
                "action": "Atualiza dicionário com novos campos.",
                "stores": [
                  "metadata/catalog/dicionario_dados.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "TRANSFORMATION_APPLIED",
                  "FIELD_DERIVED",
                  "LABEL_DERIVED"
                ],
                "action": "Liga campos derivados às origens.",
                "stores": [
                  "metadata/lineage/registro_proveniencia.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "DATASET_CREATED"
                ],
                "action": "Versiona regras e dataset preparado.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "TRANSFORMATION_APPLIED"
                ],
                "action": "Observa volume e transformações anômalas.",
                "stores": [
                  "metadata/monitoring/baseline_current.json"
                ]
              }
            ],
            "example": {
              "title": "Dataset preparado",
              "type": "table",
              "headers": [
                "aluno_id",
                "semestre",
                "situacao",
                "media_nota",
                "total_faltas",
                "idade",
                "faixa_etaria",
                "evadiu"
              ],
              "rows": [
                [
                  1001,
                  "2026-1",
                  "ATIVO",
                  7.5,
                  10,
                  22,
                  "22-25",
                  0
                ],
                [
                  1002,
                  "2026-1",
                  "EVADIDO",
                  3.75,
                  38,
                  23,
                  "22-25",
                  1
                ],
                [
                  1003,
                  "2026-1",
                  "ATIVO",
                  8.75,
                  5,
                  21,
                  "18-21",
                  0
                ],
                [
                  1004,
                  "2026-1",
                  "ATIVO",
                  5.25,
                  26,
                  24,
                  "22-25",
                  0
                ],
                [
                  1005,
                  "2026-1",
                  "ATIVO",
                  6.75,
                  12,
                  21,
                  "18-21",
                  0
                ],
                [
                  1006,
                  "2026-1",
                  "EVADIDO",
                  2.5,
                  46,
                  23,
                  "22-25",
                  1
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "padronizar nomes e tipos de colunas",
                "concreteAction": "trim/upper em categorias",
                "input": "integrated",
                "result": "categorias consistentes",
                "registers": "regras aplicadas",
                "events": [
                  "TRANSFORMATION_APPLIED"
                ],
                "transversals": [
                  "M11"
                ],
                "evidence": [
                  "data/prepared/student_semester_prepared.csv",
                  "artifacts/m04/transformation_plan.json",
                  "artifacts/m04/cleaning_rules_register.json"
                ]
              },
              {
                "responsibility": "normalizar valores categóricos",
                "concreteAction": "verificar duplicatas/nulos; política de imputação",
                "input": "integrated",
                "result": "6 linhas preservadas",
                "registers": "affected_rows=0",
                "events": [
                  "TRANSFORMATION_APPLIED"
                ],
                "transversals": [
                  "M11",
                  "M15"
                ],
                "evidence": [
                  "data/prepared/student_semester_prepared.csv",
                  "artifacts/m04/transformation_plan.json",
                  "artifacts/m04/cleaning_rules_register.json"
                ]
              },
              {
                "responsibility": "tratar strings vazias e valores ausentes",
                "concreteAction": "idade na data de referência 2026-11-18",
                "input": "data_nascimento",
                "result": "idade",
                "registers": "fórmula + reference_date",
                "events": [
                  "FIELD_DERIVED"
                ],
                "transversals": [
                  "M09",
                  "M11"
                ],
                "evidence": [
                  "data/prepared/student_semester_prepared.csv",
                  "artifacts/m04/transformation_plan.json",
                  "artifacts/m04/cleaning_rules_register.json"
                ]
              },
              {
                "responsibility": "remover duplicidades segundo chave definida",
                "concreteAction": "evadiu = 1 se EVADIDO",
                "input": "situacao",
                "result": "evadiu",
                "registers": "regra explícita",
                "events": [
                  "LABEL_DERIVED"
                ],
                "transversals": [
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/prepared/student_semester_prepared.csv",
                  "artifacts/m04/transformation_plan.json",
                  "artifacts/m04/cleaning_rules_register.json"
                ]
              },
              {
                "responsibility": "derivar atributos de preparação quando necessário",
                "concreteAction": "evadiu = 1 se EVADIDO",
                "input": "situacao",
                "result": "evadiu",
                "registers": "regra explícita",
                "events": [
                  "LABEL_DERIVED"
                ],
                "transversals": [
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/prepared/student_semester_prepared.csv",
                  "artifacts/m04/transformation_plan.json",
                  "artifacts/m04/cleaning_rules_register.json"
                ]
              },
              {
                "responsibility": "registrar cada regra e quantidade de registros afetados",
                "concreteAction": "evadiu = 1 se EVADIDO",
                "input": "situacao",
                "result": "evadiu",
                "registers": "regra explícita",
                "events": [
                  "LABEL_DERIVED"
                ],
                "transversals": [
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/prepared/student_semester_prepared.csv",
                  "artifacts/m04/transformation_plan.json",
                  "artifacts/m04/cleaning_rules_register.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m04_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m04_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m04_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m04_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M05": {
          "kind": "operational",
          "name": "Qualidade e Validação de Dados",
          "objective": "Avaliar se o dataset preparado atende às expectativas de qualidade necessárias para continuar no pipeline.",
          "inputs": [
            "prepared:student_semester",
            "quality_rules.yml"
          ],
          "process": [
            "executar regras not_null, unique, range e accepted_values",
            "calcular completude e outras métricas",
            "classificar regras como críticas ou não críticas",
            "registrar violações e exceções",
            "aprovar, aprovar com alerta ou rejeitar o dataset"
          ],
          "outputs": [
            "data/validated/student_semester.csv",
            "quality_rules_executed.json",
            "quality_report.json",
            "quality_exceptions.json"
          ],
          "formats": [
            "CSV ou Parquet",
            "YAML",
            "JSON"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "prepared:student_semester"
              ],
              "config": [
                "quality_rules.yml"
              ]
            },
            "produces": {
              "datasets": [
                "validated:student_semester"
              ],
              "artifacts": [
                "quality_report",
                "quality_exceptions"
              ],
              "metrics": [
                "completeness",
                "failed_rules"
              ]
            }
          },
          "provenanceFields": [
            [
              "rule_id",
              "regra executada"
            ],
            [
              "dataset_version",
              "versão validada"
            ],
            [
              "result",
              "PASS, WARN ou FAIL"
            ],
            [
              "violating_rows",
              "linhas que violaram a regra"
            ],
            [
              "metric_value",
              "valor calculado"
            ],
            [
              "threshold",
              "limiar usado"
            ],
            [
              "validation_timestamp",
              "momento da validação"
            ]
          ],
          "provenanceExample": {
            "dataset": "prepared:student_semester:v1",
            "rules_executed": 12,
            "passed": 11,
            "failed": 1,
            "completeness": 0.987,
            "status": "WARNING"
          },
          "exampleTitle": "Exemplos de regras",
          "example": [
            "aluno_id: not_null = true",
            "media_nota: range entre 0 e 10",
            "total_faltas: mínimo 0",
            "situacao: ATIVO, EVADIDO ou CONCLUIDO"
          ],
          "transversal": [
            [
              "M09",
              "publica métricas e status de qualidade no catálogo"
            ],
            [
              "M10",
              "pode bloquear consumo se regra de conformidade falhar"
            ],
            [
              "M11",
              "liga validações ao dataset que foi avaliado"
            ],
            [
              "M12",
              "versiona regras e resultados"
            ],
            [
              "M15",
              "usa qualidade como indicador de saúde"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m05.html",
          "primaryOutput": "Dataset validado + relatório",
          "instance": {
            "inputSummary": "dataset preparado + 12 regras de qualidade",
            "outputSummary": "dataset validado (6 × 18) + quality_report: ACCEPTED_WITH_WARNING",
            "metrics": [
              {
                "label": "Regras",
                "value": "12"
              },
              {
                "label": "PASS",
                "value": "11"
              },
              {
                "label": "WARNING",
                "value": "1"
              },
              {
                "label": "Críticas falhas",
                "value": "0"
              }
            ],
            "inputs": [
              {
                "id": "dataset:prepared:student_semester:v1",
                "name": "student_semester_prepared.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/prepared/student_semester_prepared.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/prepared/student_semester_prepared.csv",
                "role": "",
                "records": 6,
                "columns": 18
              },
              {
                "id": "config:quality_rules",
                "name": "quality_rules.json",
                "kind": "rules",
                "format": "JSON",
                "path": "artifacts/m05/quality_rules.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m05/quality_rules.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "dataset:validated:student_semester:v1",
                "name": "student_semester_validated.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/validated/student_semester_validated.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/validated/student_semester_validated.csv",
                "role": "",
                "records": 6,
                "columns": 18
              },
              {
                "id": "artifact:quality_report",
                "name": "quality_report.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m05/quality_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m05/quality_report.json",
                "role": ""
              },
              {
                "id": "artifact:exceptions",
                "name": "exceptions_register.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m05/exceptions_register.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m05/exceptions_register.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Carregar regras",
                "input": "quality rules",
                "operation": "Validar tipos e severidades",
                "output": "12 regras ativas",
                "registers": "rule_id, column, type",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Executar validações",
                "input": "prepared dataset",
                "operation": "not_null, unique, range, accepted_values, pattern",
                "output": "11 PASS + 1 WARNING",
                "registers": "result por regra",
                "events": [
                  "QUALITY_CHECKED"
                ],
                "transversal": [
                  "M09",
                  "M11",
                  "M15"
                ]
              },
              {
                "step": 3,
                "title": "Decidir aceitação",
                "input": "resultados",
                "operation": "Falha crítica=0 → aceitar com warning",
                "output": "validated dataset",
                "registers": "decision + warnings",
                "events": [
                  "DATASET_VALIDATED"
                ],
                "transversal": [
                  "M10",
                  "M11",
                  "M12"
                ]
              }
            ],
            "contract": {
              "module_id": "M05",
              "requires": {
                "dataset": "dataset:prepared:student_semester:v1",
                "rules": 12
              },
              "produces": {
                "dataset": "dataset:validated:student_semester:v1",
                "quality_status": "ACCEPTED_WITH_WARNING",
                "artifacts": [
                  "quality_report",
                  "exceptions_register"
                ]
              },
              "next_operational_module": "M06"
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m05-001",
                "activity": "QUALITY_CHECK",
                "used": [
                  "dataset:prepared:student_semester:v1"
                ],
                "generated": [
                  "artifact:quality_report:v1"
                ],
                "rules_executed": 12,
                "passed": 11,
                "warnings": 1,
                "critical_failures": 0
              },
              {
                "event_id": "prov-m05-002",
                "activity": "DATASET_VALIDATED",
                "used": [
                  "dataset:prepared:student_semester:v1",
                  "artifact:quality_report:v1"
                ],
                "generated": [
                  "dataset:validated:student_semester:v1"
                ],
                "decision": "ACCEPTED_WITH_WARNING"
              }
            ],
            "artifacts": [
              "data/validated/student_semester_validated.csv",
              "artifacts/m05/quality_rules.json",
              "artifacts/m05/quality_report.json",
              "artifacts/m05/exceptions_register.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "QUALITY_CHECKED"
                ],
                "action": "Cataloga métricas e estado de qualidade.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "DATASET_VALIDATED"
                ],
                "action": "Permite publicação analítica apenas conforme política.",
                "stores": [
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "QUALITY_CHECKED",
                  "DATASET_VALIDATED"
                ],
                "action": "Registra que o validado deriva do preparado após 12 regras.",
                "stores": [
                  "metadata/lineage/registro_proveniencia.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "DATASET_VALIDATED"
                ],
                "action": "Versiona dataset e relatório de qualidade.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "QUALITY_CHECKED"
                ],
                "action": "Observa degradação de qualidade entre execuções.",
                "stores": [
                  "metadata/monitoring/alerts.json"
                ]
              }
            ],
            "example": {
              "title": "Resultado das regras de qualidade",
              "type": "table",
              "headers": [
                "rule_id",
                "coluna",
                "tipo",
                "status"
              ],
              "rows": [
                [
                  "Q01",
                  "aluno_id",
                  "not_null",
                  "PASS"
                ],
                [
                  "Q02",
                  "aluno_id+semestre",
                  "unique",
                  "PASS"
                ],
                [
                  "Q03",
                  "media_nota",
                  "range[0,10]",
                  "PASS"
                ],
                [
                  "Q04",
                  "total_faltas",
                  "range[0,+inf]",
                  "PASS"
                ],
                [
                  "Q05",
                  "situacao",
                  "accepted_values",
                  "PASS"
                ],
                [
                  "Q06",
                  "sexo",
                  "accepted_values[F,M]",
                  "PASS"
                ],
                [
                  "Q07",
                  "curso",
                  "not_null",
                  "PASS"
                ],
                [
                  "Q08",
                  "semestre",
                  "pattern",
                  "PASS"
                ],
                [
                  "Q09",
                  "data_nascimento",
                  "valid_date",
                  "PASS"
                ],
                [
                  "Q10",
                  "qtd_disciplinas",
                  "min>=1",
                  "PASS"
                ],
                [
                  "Q11",
                  "monitoria",
                  "accepted_values[SIM,NAO]",
                  "PASS"
                ],
                [
                  "Q12",
                  "cidade",
                  "completeness",
                  "WARNING"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "executar regras not_null, unique, range e accepted_values",
                "concreteAction": "Validar tipos e severidades",
                "input": "quality rules",
                "result": "12 regras ativas",
                "registers": "rule_id, column, type",
                "events": [],
                "transversals": [],
                "evidence": [
                  "data/validated/student_semester_validated.csv",
                  "artifacts/m05/quality_rules.json",
                  "artifacts/m05/quality_report.json"
                ]
              },
              {
                "responsibility": "calcular completude e outras métricas",
                "concreteAction": "not_null, unique, range, accepted_values, pattern",
                "input": "prepared dataset",
                "result": "11 PASS + 1 WARNING",
                "registers": "result por regra",
                "events": [
                  "QUALITY_CHECKED"
                ],
                "transversals": [
                  "M09",
                  "M11",
                  "M15"
                ],
                "evidence": [
                  "data/validated/student_semester_validated.csv",
                  "artifacts/m05/quality_rules.json",
                  "artifacts/m05/quality_report.json"
                ]
              },
              {
                "responsibility": "classificar regras como críticas ou não críticas",
                "concreteAction": "Falha crítica=0 → aceitar com warning",
                "input": "resultados",
                "result": "validated dataset",
                "registers": "decision + warnings",
                "events": [
                  "DATASET_VALIDATED"
                ],
                "transversals": [
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/validated/student_semester_validated.csv",
                  "artifacts/m05/quality_rules.json",
                  "artifacts/m05/quality_report.json"
                ]
              },
              {
                "responsibility": "registrar violações e exceções",
                "concreteAction": "Falha crítica=0 → aceitar com warning",
                "input": "resultados",
                "result": "validated dataset",
                "registers": "decision + warnings",
                "events": [
                  "DATASET_VALIDATED"
                ],
                "transversals": [
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/validated/student_semester_validated.csv",
                  "artifacts/m05/quality_rules.json",
                  "artifacts/m05/quality_report.json"
                ]
              },
              {
                "responsibility": "aprovar, aprovar com alerta ou rejeitar o dataset",
                "concreteAction": "Falha crítica=0 → aceitar com warning",
                "input": "resultados",
                "result": "validated dataset",
                "registers": "decision + warnings",
                "events": [
                  "DATASET_VALIDATED"
                ],
                "transversals": [
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/validated/student_semester_validated.csv",
                  "artifacts/m05/quality_rules.json",
                  "artifacts/m05/quality_report.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m05_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m05_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m05_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m05_execution.json",
                "role": "Registro completo da execução do módulo"
              },
              {
                "name": "evasao_rules.yml",
                "format": "YAML",
                "href": "data/educacao-evasao/configs/quality/evasao_rules.yml",
                "role": "Regras de qualidade da instância"
              }
            ]
          }
        },
        "M06": {
          "kind": "operational",
          "name": "Desbalanceamento, Vieses e Equidade",
          "objective": "Examinar distribuição de grupos e possíveis diferenças de tratamento ou resultado antes do uso analítico ou preditivo.",
          "inputs": [
            "validated:student_semester",
            "target = evadiu",
            "atributos protegidos declarados na configuração"
          ],
          "process": [
            "calcular distribuição por grupo",
            "calcular taxa da variável-alvo por grupo",
            "calcular métricas de fairness selecionadas",
            "comparar com limiares definidos",
            "registrar alertas sem inferir automaticamente discriminação",
            "propor medidas de investigação ou mitigação"
          ],
          "outputs": [
            "group_distribution_report.json",
            "fairness_report.json",
            "bias_mitigation_plan.json"
          ],
          "formats": [
            "JSON"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "validated:student_semester"
              ],
              "config": [
                "protected_attributes",
                "target"
              ]
            },
            "produces": {
              "artifacts": [
                "fairness_report",
                "bias_mitigation_plan"
              ],
              "metrics": [
                "fairness_alerts"
              ]
            }
          },
          "provenanceFields": [
            [
              "protected_attribute",
              "atributo analisado"
            ],
            [
              "metric",
              "métrica de fairness"
            ],
            [
              "groups",
              "grupos comparados"
            ],
            [
              "value",
              "resultado"
            ],
            [
              "threshold",
              "limiar de alerta"
            ],
            [
              "dataset_version",
              "dataset usado no cálculo"
            ]
          ],
          "provenanceExample": {
            "protected_attribute": "sexo",
            "target": "evadiu",
            "metric": "statistical_parity_difference",
            "result": "registrado_com_contexto",
            "note": "Exemplo didatico; interpretar com tamanho amostral e contexto institucional."
          },
          "exampleTitle": "Regra de interpretação",
          "example": [
            "O módulo registra diferença, razão, grupos, limiar e evidência.",
            "Uma diferença observada gera alerta para análise; não prova discriminação por si só."
          ],
          "transversal": [
            [
              "M09",
              "cataloga o relatório de fairness"
            ],
            [
              "M10",
              "associa decisões de governança e finalidade"
            ],
            [
              "M11",
              "liga as métricas ao dataset e configuração usados"
            ],
            [
              "M12",
              "versiona limiares e resultados"
            ],
            [
              "M15",
              "acompanha evolução das métricas entre execuções"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m06.html",
          "primaryOutput": "Relatório de fairness",
          "instance": {
            "inputSummary": "dataset validado + target evadiu + atributo protegido sexo",
            "outputSummary": "relatório de distribuição/fairness + alerta de diferença entre grupos + plano de mitigação",
            "metrics": [
              {
                "label": "F: evasão",
                "value": "0/3 = 0%"
              },
              {
                "label": "M: evasão",
                "value": "2/3 = 66,7%"
              },
              {
                "label": "SPD",
                "value": "0.667"
              },
              {
                "label": "Alertas",
                "value": "1"
              }
            ],
            "inputs": [
              {
                "id": "dataset:validated:student_semester:v1",
                "name": "student_semester_validated.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/validated/student_semester_validated.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/validated/student_semester_validated.csv",
                "role": "",
                "records": 6,
                "columns": 18
              }
            ],
            "outputs": [
              {
                "id": "artifact:group_distribution",
                "name": "group_distribution.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m06/group_distribution.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m06/group_distribution.json",
                "role": ""
              },
              {
                "id": "artifact:fairness_report",
                "name": "fairness_report.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m06/fairness_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m06/fairness_report.json",
                "role": ""
              },
              {
                "id": "artifact:mitigation_plan",
                "name": "bias_mitigation_plan.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m06/bias_mitigation_plan.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m06/bias_mitigation_plan.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Selecionar grupos",
                "input": "validated dataset",
                "operation": "Agrupar por sexo",
                "output": "F=3, M=3",
                "registers": "group size",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Calcular taxas",
                "input": "evadiu por grupo",
                "operation": "mean(target)",
                "output": "F=0%; M=66,7%",
                "registers": "group target rate",
                "events": [
                  "FAIRNESS_MEASURED"
                ],
                "transversal": [
                  "M09",
                  "M11"
                ]
              },
              {
                "step": 3,
                "title": "Comparar limiar",
                "input": "taxas",
                "operation": "|diferença| > 0.20",
                "output": "ALERT",
                "registers": "metric, value, threshold",
                "events": [
                  "FAIRNESS_ALERT"
                ],
                "transversal": [
                  "M10",
                  "M15"
                ]
              },
              {
                "step": 4,
                "title": "Gerar mitigação",
                "input": "alerta",
                "operation": "Recomendações de investigação e avaliação",
                "output": "plano de mitigação",
                "registers": "não inferir causalidade",
                "events": [],
                "transversal": []
              }
            ],
            "contract": {
              "module_id": "M06",
              "requires": {
                "dataset": "dataset:validated:student_semester:v1",
                "target": "evadiu",
                "protected_attributes": [
                  "sexo"
                ]
              },
              "produces": {
                "artifacts": [
                  "group_distribution",
                  "fairness_report",
                  "bias_mitigation_plan"
                ],
                "alerts": 1
              },
              "next_operational_module": "M07"
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m06-001",
                "activity": "FAIRNESS_MEASURED",
                "used": [
                  "dataset:validated:student_semester:v1",
                  "sexo",
                  "evadiu"
                ],
                "generated": [
                  "artifact:fairness_report:v1"
                ],
                "metrics": {
                  "F_rate": 0.0,
                  "M_rate": 0.6666666666666666,
                  "SPD_M_minus_F": 0.667
                }
              }
            ],
            "artifacts": [
              "artifacts/m06/group_distribution.json",
              "artifacts/m06/fairness_report.json",
              "artifacts/m06/bias_mitigation_plan.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "FAIRNESS_MEASURED"
                ],
                "action": "Cataloga o relatório e métricas.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "FAIRNESS_ALERT"
                ],
                "action": "Registra restrições e necessidade de revisão humana.",
                "stores": [
                  "metadata/governance/plano_conformidade.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "FAIRNESS_MEASURED"
                ],
                "action": "Liga relatório ao dataset validado.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "FAIRNESS_ALERT"
                ],
                "action": "Mantém alerta observável entre execuções.",
                "stores": [
                  "metadata/monitoring/alerts.json"
                ]
              }
            ],
            "example": {
              "title": "Distribuição e taxa do target por sexo",
              "type": "table",
              "headers": [
                "grupo",
                "n",
                "evadidos",
                "taxa"
              ],
              "rows": [
                [
                  "F",
                  3,
                  0,
                  "0%"
                ],
                [
                  "M",
                  3,
                  2,
                  "66,7%"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "calcular distribuição por grupo",
                "concreteAction": "Agrupar por sexo",
                "input": "validated dataset",
                "result": "F=3, M=3",
                "registers": "group size",
                "events": [],
                "transversals": [],
                "evidence": [
                  "artifacts/m06/group_distribution.json",
                  "artifacts/m06/fairness_report.json",
                  "artifacts/m06/bias_mitigation_plan.json"
                ]
              },
              {
                "responsibility": "calcular taxa da variável-alvo por grupo",
                "concreteAction": "mean(target)",
                "input": "evadiu por grupo",
                "result": "F=0%; M=66,7%",
                "registers": "group target rate",
                "events": [
                  "FAIRNESS_MEASURED"
                ],
                "transversals": [
                  "M09",
                  "M11"
                ],
                "evidence": [
                  "artifacts/m06/group_distribution.json",
                  "artifacts/m06/fairness_report.json",
                  "artifacts/m06/bias_mitigation_plan.json"
                ]
              },
              {
                "responsibility": "calcular métricas de fairness selecionadas",
                "concreteAction": "|diferença| > 0.20",
                "input": "taxas",
                "result": "ALERT",
                "registers": "metric, value, threshold",
                "events": [
                  "FAIRNESS_ALERT"
                ],
                "transversals": [
                  "M10",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m06/group_distribution.json",
                  "artifacts/m06/fairness_report.json",
                  "artifacts/m06/bias_mitigation_plan.json"
                ]
              },
              {
                "responsibility": "comparar com limiares definidos",
                "concreteAction": "Recomendações de investigação e avaliação",
                "input": "alerta",
                "result": "plano de mitigação",
                "registers": "não inferir causalidade",
                "events": [],
                "transversals": [],
                "evidence": [
                  "artifacts/m06/group_distribution.json",
                  "artifacts/m06/fairness_report.json",
                  "artifacts/m06/bias_mitigation_plan.json"
                ]
              },
              {
                "responsibility": "registrar alertas sem inferir automaticamente discriminação",
                "concreteAction": "Recomendações de investigação e avaliação",
                "input": "alerta",
                "result": "plano de mitigação",
                "registers": "não inferir causalidade",
                "events": [],
                "transversals": [],
                "evidence": [
                  "artifacts/m06/group_distribution.json",
                  "artifacts/m06/fairness_report.json",
                  "artifacts/m06/bias_mitigation_plan.json"
                ]
              },
              {
                "responsibility": "propor medidas de investigação ou mitigação",
                "concreteAction": "Recomendações de investigação e avaliação",
                "input": "alerta",
                "result": "plano de mitigação",
                "registers": "não inferir causalidade",
                "events": [],
                "transversals": [],
                "evidence": [
                  "artifacts/m06/group_distribution.json",
                  "artifacts/m06/fairness_report.json",
                  "artifacts/m06/bias_mitigation_plan.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m06_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m06_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m06_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m06_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M07": {
          "kind": "operational",
          "name": "Armazenamento Analítico",
          "objective": "Publicar o dataset aprovado como ativo analítico formal do pipeline, com identificação, finalidade, classificação e localização.",
          "inputs": [
            "validated:student_semester",
            "relatórios de qualidade e fairness",
            "políticas de publicação do ativo"
          ],
          "process": [
            "persistir dataset validado em camada analytical",
            "atribuir asset_id estável e versão",
            "registrar finalidade, granularidade, owner e sensibilidade",
            "publicar no catálogo de ativos",
            "registrar lineage validated → analytical"
          ],
          "outputs": [
            "data/analytical/student_risk.csv",
            "analytical_storage_model.json",
            "analytical_assets_catalog.json"
          ],
          "formats": [
            "CSV, Parquet ou DuckDB",
            "JSON"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "validated:student_semester"
              ]
            },
            "produces": {
              "datasets": [
                "analytical:student_risk"
              ],
              "artifacts": [
                "analytical_assets_catalog"
              ]
            }
          },
          "provenanceFields": [
            [
              "source_asset",
              "dataset validado de origem"
            ],
            [
              "published_asset",
              "ativo analítico gerado"
            ],
            [
              "storage_location",
              "local de persistência"
            ],
            [
              "published_at",
              "data/hora"
            ],
            [
              "purpose",
              "finalidade registrada"
            ],
            [
              "owner",
              "responsável"
            ],
            [
              "sensitivity",
              "classificação de acesso"
            ]
          ],
          "provenanceExample": {
            "asset_id": "dataset:analytical:student_risk:v1",
            "source_dataset": "dataset:validated:student_semester:v1",
            "status": "PUBLISHED",
            "purpose": "Analise de risco de evasao",
            "granularity": "student_semester",
            "sensitivity": "alta"
          },
          "exampleTitle": "Mudança de estado",
          "example": [
            "Antes de M07 existe um dataset validado.",
            "Depois de M07 existe um ativo analítico publicado e governado."
          ],
          "transversal": [
            [
              "M09",
              "registra o ativo oficial no catálogo"
            ],
            [
              "M10",
              "define papéis e restrições de acesso"
            ],
            [
              "M11",
              "liga validated → analytical"
            ],
            [
              "M12",
              "registra versão e checksum do ativo"
            ],
            [
              "M15",
              "passa a monitorar o ativo publicado"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m07.html",
          "primaryOutput": "Ativo analítico publicado",
          "instance": {
            "inputSummary": "dataset validado + decisão de qualidade + políticas de governança",
            "outputSummary": "ativo analítico publicado dataset:analytical:student_risk:v1 (6 × 15)",
            "metrics": [
              {
                "label": "Ativos publicados",
                "value": "1"
              },
              {
                "label": "Linhas",
                "value": "6"
              },
              {
                "label": "Colunas",
                "value": "15"
              },
              {
                "label": "Classificação",
                "value": "RESTRICTED"
              }
            ],
            "inputs": [
              {
                "id": "dataset:validated:student_semester:v1",
                "name": "validated dataset",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/validated/student_semester_validated.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/validated/student_semester_validated.csv",
                "role": "",
                "records": 6,
                "columns": 18
              },
              {
                "id": "artifact:quality_report",
                "name": "quality_report.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m05/quality_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m05/quality_report.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "dataset:analytical:student_risk:v1",
                "name": "student_risk.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/analytical/student_risk.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/analytical/student_risk.csv",
                "role": "Ativo analítico minimizado",
                "records": 6,
                "columns": 15
              },
              {
                "id": "artifact:storage_model",
                "name": "analytical_storage_model.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m07/analytical_storage_model.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m07/analytical_storage_model.json",
                "role": ""
              },
              {
                "id": "artifact:asset_catalog",
                "name": "analytical_assets_catalog.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m07/analytical_assets_catalog.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m07/analytical_assets_catalog.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Verificar elegibilidade",
                "input": "validated + quality",
                "operation": "status sem falha crítica",
                "output": "elegível",
                "registers": "quality_status",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Minimizar/publicar",
                "input": "validated",
                "operation": "Remover nome e data_nascimento do ativo analítico",
                "output": "6 × 15",
                "registers": "colunas publicadas",
                "events": [
                  "ANALYTICAL_ASSET_CREATED"
                ],
                "transversal": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ]
              },
              {
                "step": 3,
                "title": "Registrar ativo",
                "input": "student_risk.csv",
                "operation": "Asset ID + owner + granularidade + sensibilidade",
                "output": "dataset:analytical:student_risk:v1",
                "registers": "catalog ref",
                "events": [
                  "ASSET_PUBLISHED"
                ],
                "transversal": [
                  "M15"
                ]
              }
            ],
            "contract": {
              "module_id": "M07",
              "requires": {
                "dataset": "dataset:validated:student_semester:v1",
                "quality_status": "ACCEPTED_WITH_WARNING"
              },
              "produces": {
                "dataset": "dataset:analytical:student_risk:v1",
                "rows": 6,
                "columns": 15,
                "classification": "RESTRICTED"
              },
              "next_operational_module": "M08"
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m07-001",
                "activity": "PUBLISH_ANALYTICAL_ASSET",
                "used": [
                  "dataset:validated:student_semester:v1"
                ],
                "generated": [
                  "dataset:analytical:student_risk:v1"
                ],
                "minimized_fields_removed": [
                  "nome",
                  "data_nascimento"
                ],
                "classification": "RESTRICTED"
              }
            ],
            "artifacts": [
              "data/analytical/student_risk.csv",
              "artifacts/m07/analytical_storage_model.json",
              "artifacts/m07/analytical_assets_catalog.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "ANALYTICAL_ASSET_CREATED"
                ],
                "action": "Cataloga o ativo.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "ASSET_PUBLISHED"
                ],
                "action": "Aplica política RESTRICTED.",
                "stores": [
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "ANALYTICAL_ASSET_CREATED"
                ],
                "action": "Liga validated → analytical.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "ASSET_PUBLISHED"
                ],
                "action": "Versiona arquivo e especificação.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "ASSET_PUBLISHED"
                ],
                "action": "Passa a monitorar disponibilidade e drift.",
                "stores": [
                  "metadata/monitoring/asset_evolution_report.json"
                ]
              }
            ],
            "example": {
              "title": "Ativo analítico publicado",
              "type": "table",
              "headers": [
                "aluno_id",
                "sexo",
                "idade",
                "cidade",
                "curso",
                "ano_ingresso",
                "semestre",
                "situacao",
                "evadiu",
                "media_nota",
                "total_faltas",
                "qtd_disciplinas",
                "bolsa",
                "auxilio_permanencia",
                "monitoria"
              ],
              "rows": [
                [
                  1001,
                  "F",
                  22,
                  "Presidente Prudente",
                  "Computacao",
                  2023,
                  "2026-1",
                  "ATIVO",
                  0,
                  7.5,
                  10,
                  2,
                  "NAO",
                  "SIM",
                  "NAO"
                ],
                [
                  1002,
                  "M",
                  23,
                  "Presidente Prudente",
                  "Computacao",
                  2022,
                  "2026-1",
                  "EVADIDO",
                  1,
                  3.75,
                  38,
                  2,
                  "NAO",
                  "NAO",
                  "NAO"
                ],
                [
                  1003,
                  "F",
                  21,
                  "Assis",
                  "Computacao",
                  2024,
                  "2026-1",
                  "ATIVO",
                  0,
                  8.75,
                  5,
                  2,
                  "SIM",
                  "SIM",
                  "SIM"
                ],
                [
                  1004,
                  "M",
                  24,
                  "Bauru",
                  "Computacao",
                  2021,
                  "2026-1",
                  "ATIVO",
                  0,
                  5.25,
                  26,
                  2,
                  "NAO",
                  "NAO",
                  "SIM"
                ],
                [
                  1005,
                  "F",
                  21,
                  "Presidente Prudente",
                  "Computacao",
                  2023,
                  "2026-1",
                  "ATIVO",
                  0,
                  6.75,
                  12,
                  2,
                  "SIM",
                  "NAO",
                  "NAO"
                ],
                [
                  1006,
                  "M",
                  23,
                  "Marilia",
                  "Computacao",
                  2022,
                  "2026-1",
                  "EVADIDO",
                  1,
                  2.5,
                  46,
                  2,
                  "NAO",
                  "NAO",
                  "NAO"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "persistir dataset validado em camada analytical",
                "concreteAction": "status sem falha crítica",
                "input": "validated + quality",
                "result": "elegível",
                "registers": "quality_status",
                "events": [],
                "transversals": [],
                "evidence": [
                  "data/analytical/student_risk.csv",
                  "artifacts/m07/analytical_storage_model.json",
                  "artifacts/m07/analytical_assets_catalog.json"
                ]
              },
              {
                "responsibility": "atribuir asset_id estável e versão",
                "concreteAction": "Remover nome e data_nascimento do ativo analítico",
                "input": "validated",
                "result": "6 × 15",
                "registers": "colunas publicadas",
                "events": [
                  "ANALYTICAL_ASSET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/analytical/student_risk.csv",
                  "artifacts/m07/analytical_storage_model.json",
                  "artifacts/m07/analytical_assets_catalog.json"
                ]
              },
              {
                "responsibility": "registrar finalidade, granularidade, owner e sensibilidade",
                "concreteAction": "Asset ID + owner + granularidade + sensibilidade",
                "input": "student_risk.csv",
                "result": "dataset:analytical:student_risk:v1",
                "registers": "catalog ref",
                "events": [
                  "ASSET_PUBLISHED"
                ],
                "transversals": [
                  "M15"
                ],
                "evidence": [
                  "data/analytical/student_risk.csv",
                  "artifacts/m07/analytical_storage_model.json",
                  "artifacts/m07/analytical_assets_catalog.json"
                ]
              },
              {
                "responsibility": "publicar no catálogo de ativos",
                "concreteAction": "Asset ID + owner + granularidade + sensibilidade",
                "input": "student_risk.csv",
                "result": "dataset:analytical:student_risk:v1",
                "registers": "catalog ref",
                "events": [
                  "ASSET_PUBLISHED"
                ],
                "transversals": [
                  "M15"
                ],
                "evidence": [
                  "data/analytical/student_risk.csv",
                  "artifacts/m07/analytical_storage_model.json",
                  "artifacts/m07/analytical_assets_catalog.json"
                ]
              },
              {
                "responsibility": "registrar lineage validated → analytical",
                "concreteAction": "Asset ID + owner + granularidade + sensibilidade",
                "input": "student_risk.csv",
                "result": "dataset:analytical:student_risk:v1",
                "registers": "catalog ref",
                "events": [
                  "ASSET_PUBLISHED"
                ],
                "transversals": [
                  "M15"
                ],
                "evidence": [
                  "data/analytical/student_risk.csv",
                  "artifacts/m07/analytical_storage_model.json",
                  "artifacts/m07/analytical_assets_catalog.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m07_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m07_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m07_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m07_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M08": {
          "kind": "operational",
          "name": "Disponibilização e Consumo Analítico",
          "objective": "Transformar o ativo analítico em produtos de dados consumíveis por públicos autorizados, documentando finalidade e restrições.",
          "inputs": [
            "analytical:student_risk",
            "catálogo e políticas de acesso",
            "definição de públicos e produtos"
          ],
          "process": [
            "definir produto de dados",
            "gerar relatório analítico demonstrativo",
            "registrar possibilidade de API ou dashboard",
            "documentar público, finalidade, periodicidade e restrições",
            "ligar o produto aos ativos que o sustentam"
          ],
          "outputs": [
            "reports/relatorio_risco_evasao.md",
            "data_products.json",
            "data_api_spec.json",
            "data_product_card.json"
          ],
          "formats": [
            "Markdown",
            "JSON",
            "API/JSON quando implementada"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "analytical:student_risk"
              ]
            },
            "produces": {
              "products": [
                "DP-EDU-001"
              ],
              "artifacts": [
                "data_product_card",
                "analytical_report"
              ]
            }
          },
          "provenanceFields": [
            [
              "product_id",
              "identificador do produto"
            ],
            [
              "source_assets",
              "ativos que sustentam o produto"
            ],
            [
              "audience",
              "público autorizado"
            ],
            [
              "purpose",
              "finalidade"
            ],
            [
              "refresh_frequency",
              "frequência"
            ],
            [
              "access_policy",
              "política de acesso"
            ]
          ],
          "provenanceExample": {
            "product_id": "DP-EDU-001",
            "name": "Indicadores de Risco de Evasao",
            "source_assets": [
              "dataset:analytical:student_risk:v1"
            ],
            "audience": [
              "coordenador_curso"
            ],
            "refresh_frequency": "semanal",
            "access_policy": "restricted"
          },
          "exampleTitle": "Produto, não apenas gráfico",
          "example": [
            "O produto tem nome, dono, público, periodicidade, restrições e fontes.",
            "Dashboard, relatório e API são canais possíveis do mesmo produto de dados."
          ],
          "transversal": [
            [
              "M09",
              "cataloga o produto e seus ativos"
            ],
            [
              "M10",
              "controla quem pode consumir"
            ],
            [
              "M11",
              "liga produto → ativo → fontes originais"
            ],
            [
              "M12",
              "versiona a especificação do produto"
            ],
            [
              "M15",
              "monitora disponibilidade e atualidade"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m08.html",
          "primaryOutput": "Produto de dados para gestores",
          "instance": {
            "inputSummary": "ativo analítico publicado + metadados/governança",
            "outputSummary": "produto DP-EDU-001 com relatório, API proposta, ficha, público e política de acesso",
            "metrics": [
              {
                "label": "Produto",
                "value": "DP-EDU-001"
              },
              {
                "label": "Público",
                "value": "coordenador_curso"
              },
              {
                "label": "Atualização",
                "value": "semanal"
              },
              {
                "label": "Canais",
                "value": "3"
              }
            ],
            "inputs": [
              {
                "id": "dataset:analytical:student_risk:v1",
                "name": "student_risk.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/analytical/student_risk.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/analytical/student_risk.csv",
                "role": "",
                "records": 6,
                "columns": 15
              }
            ],
            "outputs": [
              {
                "id": "product:DP-EDU-001",
                "name": "Produto: Indicadores de Risco de Evasão",
                "kind": "data_product",
                "format": "JSON",
                "path": "artifacts/m08/product_sheet.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m08/product_sheet.json",
                "role": ""
              },
              {
                "id": "report:DP-EDU-001",
                "name": "relatorio_analitico.md",
                "kind": "report",
                "format": "Markdown",
                "path": "reports/relatorio_analitico.md",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/reports/relatorio_analitico.md",
                "role": ""
              },
              {
                "id": "artifact:data_api",
                "name": "data_api.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m08/data_api.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m08/data_api.json",
                "role": ""
              },
              {
                "id": "artifact:data_products",
                "name": "data_products.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m08/data_products.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m08/data_products.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Definir produto",
                "input": "analytical asset",
                "operation": "Definir finalidade, público, dono e periodicidade",
                "output": "DP-EDU-001",
                "registers": "product spec",
                "events": [
                  "PRODUCT_DEFINED"
                ],
                "transversal": [
                  "M09",
                  "M10"
                ]
              },
              {
                "step": 2,
                "title": "Gerar canais",
                "input": "produto",
                "operation": "Relatório + endpoint proposto + dashboard conceitual",
                "output": "3 canais",
                "registers": "channel metadata",
                "events": [
                  "PRODUCT_PUBLISHED"
                ],
                "transversal": [
                  "M11",
                  "M12",
                  "M15"
                ]
              }
            ],
            "contract": {
              "module_id": "M08",
              "requires": {
                "dataset": "dataset:analytical:student_risk:v1"
              },
              "produces": {
                "product": "product:DP-EDU-001",
                "channels": [
                  "report",
                  "api",
                  "dashboard"
                ],
                "access_policy": "restricted"
              },
              "next_operational_module": null
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m08-001",
                "activity": "PUBLISH_DATA_PRODUCT",
                "used": [
                  "dataset:analytical:student_risk:v1"
                ],
                "generated": [
                  "product:DP-EDU-001"
                ],
                "audience": [
                  "coordenador_curso"
                ],
                "access_policy": "restricted"
              }
            ],
            "artifacts": [
              "artifacts/m08/product_sheet.json",
              "artifacts/m08/data_products.json",
              "artifacts/m08/data_api.json",
              "reports/relatorio_analitico.md"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "PRODUCT_DEFINED",
                  "PRODUCT_PUBLISHED"
                ],
                "action": "Cataloga produto e canais.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "PRODUCT_DEFINED"
                ],
                "action": "Controla público e finalidade.",
                "stores": [
                  "metadata/governance/registro_finalidade_uso.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "PRODUCT_PUBLISHED"
                ],
                "action": "Liga produto ao ativo analítico.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "PRODUCT_PUBLISHED"
                ],
                "action": "Versiona ficha e relatório.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "PRODUCT_PUBLISHED"
                ],
                "action": "Monitora disponibilidade e atualidade.",
                "stores": [
                  "metadata/monitoring/asset_evolution_report.json"
                ]
              }
            ],
            "example": {
              "title": "Ficha do produto de dados",
              "type": "json",
              "data": {
                "product_id": "DP-EDU-001",
                "name": "Indicadores de Risco de Evasão",
                "description": "Produto de dados didático para acompanhamento acadêmico",
                "audience": [
                  "coordenador_curso"
                ],
                "source_assets": [
                  "dataset:analytical:student_risk:v1"
                ],
                "refresh_frequency": "semanal",
                "access_policy": "restricted",
                "channels": [
                  "dashboard",
                  "report",
                  "api"
                ],
                "owner": "Laboratório de Dados"
              }
            },
            "responsibilityEvidence": [
              {
                "responsibility": "definir produto de dados",
                "concreteAction": "Definir finalidade, público, dono e periodicidade",
                "input": "analytical asset",
                "result": "DP-EDU-001",
                "registers": "product spec",
                "events": [
                  "PRODUCT_DEFINED"
                ],
                "transversals": [
                  "M09",
                  "M10"
                ],
                "evidence": [
                  "artifacts/m08/product_sheet.json",
                  "artifacts/m08/data_products.json",
                  "artifacts/m08/data_api.json"
                ]
              },
              {
                "responsibility": "gerar relatório analítico demonstrativo",
                "concreteAction": "Relatório + endpoint proposto + dashboard conceitual",
                "input": "produto",
                "result": "3 canais",
                "registers": "channel metadata",
                "events": [
                  "PRODUCT_PUBLISHED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m08/product_sheet.json",
                  "artifacts/m08/data_products.json",
                  "artifacts/m08/data_api.json"
                ]
              },
              {
                "responsibility": "registrar possibilidade de API ou dashboard",
                "concreteAction": "Relatório + endpoint proposto + dashboard conceitual",
                "input": "produto",
                "result": "3 canais",
                "registers": "channel metadata",
                "events": [
                  "PRODUCT_PUBLISHED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m08/product_sheet.json",
                  "artifacts/m08/data_products.json",
                  "artifacts/m08/data_api.json"
                ]
              },
              {
                "responsibility": "documentar público, finalidade, periodicidade e restrições",
                "concreteAction": "Relatório + endpoint proposto + dashboard conceitual",
                "input": "produto",
                "result": "3 canais",
                "registers": "channel metadata",
                "events": [
                  "PRODUCT_PUBLISHED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m08/product_sheet.json",
                  "artifacts/m08/data_products.json",
                  "artifacts/m08/data_api.json"
                ]
              },
              {
                "responsibility": "ligar o produto aos ativos que o sustentam",
                "concreteAction": "Relatório + endpoint proposto + dashboard conceitual",
                "input": "produto",
                "result": "3 canais",
                "registers": "channel metadata",
                "events": [
                  "PRODUCT_PUBLISHED"
                ],
                "transversals": [
                  "M11",
                  "M12",
                  "M15"
                ],
                "evidence": [
                  "artifacts/m08/product_sheet.json",
                  "artifacts/m08/data_products.json",
                  "artifacts/m08/data_api.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m08_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m08_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m08_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m08_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M09": {
          "kind": "transversal",
          "name": "Metadados, Catálogo e Semântica dos Dados",
          "objective": "Manter uma visão catalogada e semanticamente compreensível de fontes, datasets, artefatos e produtos ao longo de toda a execução.",
          "inputs": [
            "eventos de registro de ativos emitidos pelos módulos",
            "schemas, owners, descrições, granularidades e classificações",
            "glossário e termos de negócio"
          ],
          "process": [
            "registrar fontes e datasets no catálogo",
            "atualizar schema e descrição a cada derivação",
            "gerar dicionário de dados",
            "associar termos de negócio",
            "preservar relações entre ativos"
          ],
          "outputs": [
            "metadata/catalog/catalogo_dados.json",
            "metadata/catalog/dicionario_dados.json",
            "metadata/catalog/glossario_negocio.json",
            "metadata/catalog/modelo_semantico.json"
          ],
          "formats": [
            "JSON"
          ],
          "contract": {
            "observes": [
              "ASSET_REGISTERED",
              "DATASET_CREATED",
              "PRODUCT_PUBLISHED"
            ],
            "produces": {
              "metadata": [
                "catalog_entry",
                "data_dictionary",
                "business_glossary"
              ]
            }
          },
          "provenanceFields": [
            [
              "asset_id",
              "ativo catalogado"
            ],
            [
              "source_module",
              "módulo que registrou o ativo"
            ],
            [
              "metadata_version",
              "versão dos metadados"
            ],
            [
              "cataloged_at",
              "data/hora"
            ],
            [
              "semantic_terms",
              "termos associados"
            ]
          ],
          "provenanceExample": {
            "asset_id": "dataset:integrated:student_semester:v1",
            "business_name": "Visao integrada aluno-semestre",
            "owner": "Laboratorio de Dados",
            "granularity": "student_semester",
            "description": "Integra cadastro, matricula, desempenho e apoio"
          },
          "exampleTitle": "Como atua transversalmente",
          "example": [
            "M01 cria a primeira ficha de cada fonte.",
            "M03 registra o dataset integrado.",
            "M07 registra o ativo analítico.",
            "M08 registra o produto de dados.",
            "M09 consolida tudo no mesmo catálogo."
          ],
          "transversal": [
            [
              "M01–M02",
              "fontes e datasets raw"
            ],
            [
              "M03–M06",
              "datasets derivados e relatórios"
            ],
            [
              "M07–M08",
              "ativos e produtos publicados"
            ],
            [
              "M11–M16",
              "metadados técnicos de lineage, versão, features e agentes"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m09.html",
          "primaryOutput": "Catálogo consolidado",
          "instance": {
            "inputSummary": "Eventos/ativos de M01–M08 e metadados técnicos de M11–M16",
            "outputSummary": "catálogo consolidado + dicionário + glossário + modelo semântico",
            "metrics": [
              {
                "label": "Entradas catálogo",
                "value": "10"
              },
              {
                "label": "Termos de negócio",
                "value": "3"
              },
              {
                "label": "Produto catalogado",
                "value": "1"
              },
              {
                "label": "Run",
                "value": "001"
              }
            ],
            "inputs": [
              {
                "id": "events:assets",
                "name": "Eventos de registro de ativos",
                "kind": "events",
                "format": "JSON/event bus",
                "path": "metadata/lineage/registro_proveniencia.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/registro_proveniencia.json",
                "role": ""
              },
              {
                "id": "dataset:analytical:student_risk:v1",
                "name": "Ativo analítico",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/analytical/student_risk.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/analytical/student_risk.csv",
                "role": "",
                "records": 6,
                "columns": 15
              }
            ],
            "outputs": [
              {
                "id": "metadata:catalog",
                "name": "catalogo_dados.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/catalog/catalogo_dados.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/catalog/catalogo_dados.json",
                "role": ""
              },
              {
                "id": "metadata:dictionary",
                "name": "dicionario_dados.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/catalog/dicionario_dados.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/catalog/dicionario_dados.json",
                "role": ""
              },
              {
                "id": "metadata:glossary",
                "name": "glossario_negocio.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/catalog/glossario_negocio.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/catalog/glossario_negocio.json",
                "role": ""
              },
              {
                "id": "metadata:semantic",
                "name": "modelo_semantico.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/catalog/modelo_semantico.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/catalog/modelo_semantico.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Consumir eventos",
                "input": "asset events",
                "operation": "Normalizar asset_id, owner, schema, granularidade",
                "output": "catalog entries",
                "registers": "metadata version",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Atualizar catálogo",
                "input": "entries",
                "operation": "Upsert por asset_id/version",
                "output": "catálogo consolidado",
                "registers": "cataloged_at",
                "events": [],
                "transversal": []
              },
              {
                "step": 3,
                "title": "Associar semântica",
                "input": "schemas + termos",
                "operation": "Dicionário/glossário/relacionamentos",
                "output": "modelo semântico",
                "registers": "semantic terms",
                "events": [],
                "transversal": []
              }
            ],
            "contract": {
              "module_id": "M09",
              "observes": [
                "SOURCE_REGISTERED",
                "DATASET_CREATED",
                "ANALYTICAL_ASSET_CREATED",
                "PRODUCT_PUBLISHED"
              ],
              "produces": [
                "catalogo_dados",
                "dicionario_dados",
                "glossario_negocio",
                "modelo_semantico"
              ]
            },
            "provenanceRecords": [
              {
                "event_id": "meta-m09-001",
                "activity": "CATALOG_UPSERT",
                "used": [
                  "dataset:analytical:student_risk:v1"
                ],
                "generated": [
                  "catalog_entry:dataset:analytical:student_risk:v1"
                ],
                "metadata_version": "1.0"
              }
            ],
            "artifacts": [
              "metadata/catalog/catalogo_dados.json",
              "metadata/catalog/dicionario_dados.json",
              "metadata/catalog/glossario_negocio.json",
              "metadata/catalog/modelo_semantico.json"
            ],
            "transversals": [
              {
                "id": "M01–M08",
                "consumes": [
                  "asset events"
                ],
                "action": "Recebe registros de fontes, datasets e produtos.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "lineage refs"
                ],
                "action": "Associa dependências ao catálogo.",
                "stores": [
                  "metadata/catalog/modelo_semantico.json"
                ]
              }
            ],
            "example": {
              "title": "Entradas do catálogo nesta execução",
              "type": "table",
              "headers": [
                "asset_id",
                "type",
                "layer/name"
              ],
              "rows": [
                [
                  "source:alunos_csv",
                  "source",
                  "Cadastro complementar de alunos"
                ],
                [
                  "source:matriculas_pg",
                  "source",
                  "Matrículas do Sistema Acadêmico"
                ],
                [
                  "source:notas_pg",
                  "source",
                  "Notas e faltas do Sistema Acadêmico"
                ],
                [
                  "source:apoio_api",
                  "source",
                  "Benefícios e apoio estudantil"
                ],
                [
                  "dataset:raw:alunos:v1",
                  "dataset",
                  "raw"
                ],
                [
                  "dataset:integrated:student_semester:v1",
                  "dataset",
                  "integrated"
                ],
                [
                  "dataset:prepared:student_semester:v1",
                  "dataset",
                  "prepared"
                ],
                [
                  "dataset:validated:student_semester:v1",
                  "dataset",
                  "validated"
                ],
                [
                  "dataset:analytical:student_risk:v1",
                  "dataset",
                  "analytical"
                ],
                [
                  "product:DP-EDU-001",
                  "data_product",
                  "Indicadores de Risco de Evasão"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "registrar fontes e datasets no catálogo",
                "concreteAction": "Normalizar asset_id, owner, schema, granularidade",
                "input": "asset events",
                "result": "catalog entries",
                "registers": "metadata version",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/catalog/catalogo_dados.json",
                  "metadata/catalog/dicionario_dados.json",
                  "metadata/catalog/glossario_negocio.json"
                ]
              },
              {
                "responsibility": "atualizar schema e descrição a cada derivação",
                "concreteAction": "Upsert por asset_id/version",
                "input": "entries",
                "result": "catálogo consolidado",
                "registers": "cataloged_at",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/catalog/catalogo_dados.json",
                  "metadata/catalog/dicionario_dados.json",
                  "metadata/catalog/glossario_negocio.json"
                ]
              },
              {
                "responsibility": "gerar dicionário de dados",
                "concreteAction": "Dicionário/glossário/relacionamentos",
                "input": "schemas + termos",
                "result": "modelo semântico",
                "registers": "semantic terms",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/catalog/catalogo_dados.json",
                  "metadata/catalog/dicionario_dados.json",
                  "metadata/catalog/glossario_negocio.json"
                ]
              },
              {
                "responsibility": "associar termos de negócio",
                "concreteAction": "Dicionário/glossário/relacionamentos",
                "input": "schemas + termos",
                "result": "modelo semântico",
                "registers": "semantic terms",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/catalog/catalogo_dados.json",
                  "metadata/catalog/dicionario_dados.json",
                  "metadata/catalog/glossario_negocio.json"
                ]
              },
              {
                "responsibility": "preservar relações entre ativos",
                "concreteAction": "Dicionário/glossário/relacionamentos",
                "input": "schemas + termos",
                "result": "modelo semântico",
                "registers": "semantic terms",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/catalog/catalogo_dados.json",
                  "metadata/catalog/dicionario_dados.json",
                  "metadata/catalog/glossario_negocio.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m09_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m09_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m09_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m09_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M10": {
          "kind": "transversal",
          "name": "Governança, Segurança, Privacidade e Conformidade",
          "objective": "Aplicar políticas de responsabilidade, acesso, finalidade, privacidade e conformidade aos ativos produzidos pelo pipeline.",
          "inputs": [
            "classificação de sensibilidade",
            "owners e finalidades de uso",
            "papéis e permissões",
            "ativos registrados no catálogo"
          ],
          "process": [
            "classificar ativos e dados pessoais",
            "definir papéis e permissões",
            "registrar finalidade de uso",
            "definir restrições de compartilhamento",
            "registrar decisões de conformidade e controles"
          ],
          "outputs": [
            "metadata/governance/modelo_governanca.json",
            "metadata/governance/matriz_permissoes.json",
            "metadata/governance/politica_acesso.json",
            "metadata/governance/registro_finalidade_uso.json",
            "metadata/governance/plano_conformidade.json"
          ],
          "formats": [
            "JSON"
          ],
          "contract": {
            "observes": [
              "SOURCE_REGISTERED",
              "DATASET_CREATED",
              "ASSET_PUBLISHED",
              "PRODUCT_PUBLISHED"
            ],
            "produces": {
              "governance": [
                "access_decision",
                "purpose_record",
                "compliance_record"
              ]
            }
          },
          "provenanceFields": [
            [
              "asset_id",
              "ativo afetado pela decisão"
            ],
            [
              "policy_id",
              "política aplicada"
            ],
            [
              "decision",
              "ALLOW, RESTRICT ou DENY"
            ],
            [
              "roles",
              "papéis envolvidos"
            ],
            [
              "purpose",
              "finalidade autorizada"
            ],
            [
              "decided_at",
              "momento da decisão"
            ]
          ],
          "provenanceExample": {
            "asset_id": "dataset:analytical:student_risk:v1",
            "classification": "RESTRICTED",
            "allowed_roles": [
              "researcher",
              "academic_manager"
            ],
            "external_sharing": false,
            "contains_personal_data": true
          },
          "exampleTitle": "Governança acompanha o ativo",
          "example": [
            "A classificação nasce no inventário e acompanha as derivações.",
            "Um produto final não pode perder as restrições definidas nas fontes."
          ],
          "transversal": [
            [
              "M01",
              "sensibilidade e owner"
            ],
            [
              "M03–M07",
              "classificação de datasets derivados"
            ],
            [
              "M08",
              "controle de consumo"
            ],
            [
              "M16",
              "limites de acesso do agente às evidências"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m10.html",
          "primaryOutput": "Políticas e decisões de acesso",
          "instance": {
            "inputSummary": "classificações de M01 + ativos derivados/publicados + papéis e finalidade",
            "outputSummary": "modelo de governança + matriz de permissões + política de acesso + finalidade + conformidade",
            "metrics": [
              {
                "label": "Política",
                "value": "GOV-EDU-001"
              },
              {
                "label": "Classificação",
                "value": "RESTRICTED"
              },
              {
                "label": "Papéis",
                "value": "4"
              },
              {
                "label": "Compart. externo",
                "value": "não"
              }
            ],
            "inputs": [
              {
                "id": "artifact:source_classification",
                "name": "source_classification.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m01/source_classification.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m01/source_classification.json",
                "role": ""
              },
              {
                "id": "metadata:catalog",
                "name": "catalogo_dados.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/catalog/catalogo_dados.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/catalog/catalogo_dados.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "metadata:governance",
                "name": "modelo_governanca.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/governance/modelo_governanca.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/governance/modelo_governanca.json",
                "role": ""
              },
              {
                "id": "metadata:permissions",
                "name": "matriz_permissoes.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/governance/matriz_permissoes.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/governance/matriz_permissoes.json",
                "role": ""
              },
              {
                "id": "metadata:access",
                "name": "politica_acesso.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/governance/politica_acesso.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/governance/politica_acesso.json",
                "role": ""
              },
              {
                "id": "metadata:purpose",
                "name": "registro_finalidade_uso.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/governance/registro_finalidade_uso.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/governance/registro_finalidade_uso.json",
                "role": ""
              },
              {
                "id": "metadata:compliance",
                "name": "plano_conformidade.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/governance/plano_conformidade.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/governance/plano_conformidade.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Classificar",
                "input": "source/asset metadata",
                "operation": "Propagar sensibilidade e dados pessoais",
                "output": "classificação por ativo",
                "registers": "policy decision",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Autorizar",
                "input": "role + purpose + asset",
                "operation": "Aplicar menor privilégio",
                "output": "matriz de permissões",
                "registers": "ALLOW/RESTRICT/DENY",
                "events": [],
                "transversal": []
              },
              {
                "step": 3,
                "title": "Registrar finalidade",
                "input": "produto/consulta",
                "operation": "Vincular uso permitido",
                "output": "purpose record",
                "registers": "purpose_id",
                "events": [],
                "transversal": []
              }
            ],
            "contract": {
              "module_id": "M10",
              "observes": [
                "SOURCE_CLASSIFIED",
                "DATASET_CREATED",
                "ASSET_PUBLISHED",
                "PRODUCT_PUBLISHED"
              ],
              "produces": [
                "access_decision",
                "purpose_record",
                "compliance_record"
              ]
            },
            "provenanceRecords": [
              {
                "event_id": "gov-m10-001",
                "activity": "ACCESS_POLICY_APPLIED",
                "asset_id": "dataset:analytical:student_risk:v1",
                "policy_id": "GOV-EDU-001",
                "decision": "RESTRICT",
                "allowed_roles": [
                  "pesquisador_autorizado",
                  "gestor_academico"
                ]
              }
            ],
            "artifacts": [
              "metadata/governance/modelo_governanca.json",
              "metadata/governance/matriz_permissoes.json",
              "metadata/governance/politica_acesso.json",
              "metadata/governance/registro_finalidade_uso.json",
              "metadata/governance/plano_conformidade.json"
            ],
            "transversals": [
              {
                "id": "M01",
                "consumes": [
                  "SOURCE_CLASSIFIED"
                ],
                "action": "Recebe sensibilidade original.",
                "stores": [
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "id": "M07–M08",
                "consumes": [
                  "ASSET_PUBLISHED",
                  "PRODUCT_PUBLISHED"
                ],
                "action": "Controla publicação e consumo.",
                "stores": [
                  "metadata/governance/matriz_permissoes.json"
                ]
              },
              {
                "id": "M16",
                "consumes": [
                  "AGENT_QUERY"
                ],
                "action": "Restringe evidências acessíveis.",
                "stores": [
                  "metadata/agents/agent_governance_plan.json"
                ]
              }
            ],
            "example": {
              "title": "Permissões resumidas",
              "type": "table",
              "headers": [
                "ativo",
                "engenheiro_dados",
                "pesquisador",
                "gestor"
              ],
              "rows": [
                [
                  "raw/*",
                  "RW",
                  "R",
                  "NONE"
                ],
                [
                  "analytical/student_risk",
                  "RW",
                  "R",
                  "R_AGGREGATED"
                ],
                [
                  "product:DP-EDU-001",
                  "—",
                  "—",
                  "R"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "classificar ativos e dados pessoais",
                "concreteAction": "Propagar sensibilidade e dados pessoais",
                "input": "source/asset metadata",
                "result": "classificação por ativo",
                "registers": "policy decision",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/governance/modelo_governanca.json",
                  "metadata/governance/matriz_permissoes.json",
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "responsibility": "definir papéis e permissões",
                "concreteAction": "Aplicar menor privilégio",
                "input": "role + purpose + asset",
                "result": "matriz de permissões",
                "registers": "ALLOW/RESTRICT/DENY",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/governance/modelo_governanca.json",
                  "metadata/governance/matriz_permissoes.json",
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "responsibility": "registrar finalidade de uso",
                "concreteAction": "Vincular uso permitido",
                "input": "produto/consulta",
                "result": "purpose record",
                "registers": "purpose_id",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/governance/modelo_governanca.json",
                  "metadata/governance/matriz_permissoes.json",
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "responsibility": "definir restrições de compartilhamento",
                "concreteAction": "Vincular uso permitido",
                "input": "produto/consulta",
                "result": "purpose record",
                "registers": "purpose_id",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/governance/modelo_governanca.json",
                  "metadata/governance/matriz_permissoes.json",
                  "metadata/governance/politica_acesso.json"
                ]
              },
              {
                "responsibility": "registrar decisões de conformidade e controles",
                "concreteAction": "Vincular uso permitido",
                "input": "produto/consulta",
                "result": "purpose record",
                "registers": "purpose_id",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/governance/modelo_governanca.json",
                  "metadata/governance/matriz_permissoes.json",
                  "metadata/governance/politica_acesso.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m10_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m10_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m10_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m10_execution.json",
                "role": "Registro completo da execução do módulo"
              },
              {
                "name": "policies.yml",
                "format": "YAML",
                "href": "data/educacao-evasao/configs/governance/policies.yml",
                "role": "Políticas de governança da instância"
              }
            ]
          }
        },
        "M11": {
          "kind": "transversal",
          "name": "Proveniência, Linhagem e Rastreabilidade",
          "objective": "Consolidar os eventos emitidos por todos os módulos em um grafo que explica de onde cada dado veio, como foi transformado e quais produtos gerou.",
          "inputs": [
            "provenance events de M01–M16",
            "asset_ids e versões",
            "regras, transformações, joins, validações e publicações"
          ],
          "process": [
            "normalizar eventos de proveniência",
            "criar nós para fontes, datasets, artefatos, features e produtos",
            "criar arestas para uso, geração e derivação",
            "preservar operação e módulo em cada aresta",
            "gerar mapa de dependências e relatório de impacto"
          ],
          "outputs": [
            "metadata/lineage/grafo_linhagem.json",
            "metadata/lineage/registro_proveniencia.json",
            "metadata/lineage/mapa_dependencias.json",
            "metadata/lineage/relatorio_impacto.json"
          ],
          "formats": [
            "JSON",
            "grafo lógico"
          ],
          "contract": {
            "observes": [
              "PROVENANCE_EVENT"
            ],
            "produces": {
              "lineage": [
                "nodes",
                "edges",
                "impact_report"
              ]
            }
          },
          "provenanceFields": [
            [
              "event_id",
              "evento original"
            ],
            [
              "used",
              "entidades consumidas"
            ],
            [
              "generated",
              "entidades geradas"
            ],
            [
              "activity",
              "atividade executada"
            ],
            [
              "module_id",
              "módulo responsável"
            ],
            [
              "rule_or_operation",
              "regra, join, cálculo ou publicação"
            ],
            [
              "timestamp",
              "momento do evento"
            ]
          ],
          "provenanceExample": {
            "from": "dataset:raw:notas:v1",
            "to": "dataset:integrated:student_semester:v1",
            "activity": "AGGREGATION",
            "module": "M03",
            "rule": {
              "group_by": [
                "aluno_id",
                "semestre"
              ],
              "nota": "mean",
              "faltas": "sum"
            }
          },
          "exampleTitle": "Pergunta que o lineage deve responder",
          "example": [
            "De onde veio media_nota?",
            "Resposta: notas.nota → agregação média por aluno/semestre em M03 → integrated.media_nota.",
            "O mesmo caminho deve continuar até features e produtos finais."
          ],
          "transversal": [
            [
              "M01",
              "origem"
            ],
            [
              "M02",
              "ingestão"
            ],
            [
              "M03–M06",
              "transformação e validação"
            ],
            [
              "M07–M08",
              "publicação e consumo"
            ],
            [
              "M14",
              "derivação das features"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m11.html",
          "primaryOutput": "Grafo completo de linhagem",
          "instance": {
            "inputSummary": "eventos de proveniência emitidos ao longo de M01–M16",
            "outputSummary": "grafo de linhagem + registro de proveniência + dependências + impacto",
            "metrics": [
              {
                "label": "Nós",
                "value": "14"
              },
              {
                "label": "Arestas",
                "value": "13"
              },
              {
                "label": "Fontes raiz",
                "value": "4"
              },
              {
                "label": "Produto final",
                "value": "1"
              }
            ],
            "inputs": [
              {
                "id": "events:provenance",
                "name": "Provenance events",
                "kind": "events",
                "format": "JSON",
                "path": "metadata/lineage/registro_proveniencia.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/registro_proveniencia.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "lineage:graph",
                "name": "grafo_linhagem.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/lineage/grafo_linhagem.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/grafo_linhagem.json",
                "role": ""
              },
              {
                "id": "lineage:prov",
                "name": "registro_proveniencia.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/lineage/registro_proveniencia.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/registro_proveniencia.json",
                "role": ""
              },
              {
                "id": "lineage:deps",
                "name": "mapa_dependencias.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/lineage/mapa_dependencias.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/mapa_dependencias.json",
                "role": ""
              },
              {
                "id": "lineage:impact",
                "name": "relatorio_impacto.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/lineage/relatorio_impacto.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/relatorio_impacto.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Normalizar eventos",
                "input": "M01–M16 events",
                "operation": "Mapear used/generated/activity/module",
                "output": "eventos normalizados",
                "registers": "event_id",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Construir grafo",
                "input": "eventos",
                "operation": "Criar nós e arestas",
                "output": "lineage graph",
                "registers": "from/to/activity",
                "events": [],
                "transversal": []
              },
              {
                "step": 3,
                "title": "Calcular impacto",
                "input": "grafo",
                "operation": "Percorrer dependências downstream",
                "output": "impact report",
                "registers": "affected assets",
                "events": [],
                "transversal": []
              }
            ],
            "contract": {
              "module_id": "M11",
              "observes": [
                "PROVENANCE_EVENT"
              ],
              "produces": [
                "nodes",
                "edges",
                "dependency_map",
                "impact_report"
              ]
            },
            "provenanceRecords": [
              {
                "event_id": "lineage-m11-001",
                "from": "dataset:raw:notas:v1",
                "to": "dataset:integrated:student_semester:v1",
                "activity": "AGGREGATION+INTEGRATION",
                "module": "M03"
              },
              {
                "event_id": "lineage-m11-002",
                "from": "dataset:analytical:student_risk:v1",
                "to": "product:DP-EDU-001",
                "activity": "PUBLISH_DATA_PRODUCT",
                "module": "M08"
              }
            ],
            "artifacts": [
              "metadata/lineage/grafo_linhagem.json",
              "metadata/lineage/registro_proveniencia.json",
              "metadata/lineage/mapa_dependencias.json",
              "metadata/lineage/relatorio_impacto.json"
            ],
            "transversals": [
              {
                "id": "M01–M08",
                "consumes": [
                  "PROVENANCE_EVENT"
                ],
                "action": "Recebe eventos de origem, ingestão, integração, transformação, validação e publicação.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M14",
                "consumes": [
                  "FEATURE_DERIVED"
                ],
                "action": "Liga features às colunas de origem.",
                "stores": [
                  "metadata/lineage/registro_proveniencia.json"
                ]
              }
            ],
            "example": {
              "title": "Caminho de media_nota",
              "type": "flow",
              "items": [
                "source:notas_pg",
                "dataset:raw:notas:v1",
                "M03 aggregate mean(nota)",
                "dataset:integrated:student_semester:v1.media_nota",
                "dataset:analytical:student_risk:v1.media_nota",
                "feature_set:student_risk:v1.media_nota",
                "product:DP-EDU-001"
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "normalizar eventos de proveniência",
                "concreteAction": "Mapear used/generated/activity/module",
                "input": "M01–M16 events",
                "result": "eventos normalizados",
                "registers": "event_id",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/lineage/grafo_linhagem.json",
                  "metadata/lineage/registro_proveniencia.json",
                  "metadata/lineage/mapa_dependencias.json"
                ]
              },
              {
                "responsibility": "criar nós para fontes, datasets, artefatos, features e produtos",
                "concreteAction": "Criar nós e arestas",
                "input": "eventos",
                "result": "lineage graph",
                "registers": "from/to/activity",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/lineage/grafo_linhagem.json",
                  "metadata/lineage/registro_proveniencia.json",
                  "metadata/lineage/mapa_dependencias.json"
                ]
              },
              {
                "responsibility": "criar arestas para uso, geração e derivação",
                "concreteAction": "Percorrer dependências downstream",
                "input": "grafo",
                "result": "impact report",
                "registers": "affected assets",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/lineage/grafo_linhagem.json",
                  "metadata/lineage/registro_proveniencia.json",
                  "metadata/lineage/mapa_dependencias.json"
                ]
              },
              {
                "responsibility": "preservar operação e módulo em cada aresta",
                "concreteAction": "Percorrer dependências downstream",
                "input": "grafo",
                "result": "impact report",
                "registers": "affected assets",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/lineage/grafo_linhagem.json",
                  "metadata/lineage/registro_proveniencia.json",
                  "metadata/lineage/mapa_dependencias.json"
                ]
              },
              {
                "responsibility": "gerar mapa de dependências e relatório de impacto",
                "concreteAction": "Percorrer dependências downstream",
                "input": "grafo",
                "result": "impact report",
                "registers": "affected assets",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/lineage/grafo_linhagem.json",
                  "metadata/lineage/registro_proveniencia.json",
                  "metadata/lineage/mapa_dependencias.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m11_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m11_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m11_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m11_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M12": {
          "kind": "transversal",
          "name": "Versionamento e Reprodutibilidade",
          "objective": "Garantir que uma execução possa ser identificada, auditada e reproduzida com os mesmos dados, configuração, regras, código e ambiente.",
          "inputs": [
            "manifesto da execução",
            "checksums dos ativos",
            "configuração e regras",
            "versão do código e ambiente"
          ],
          "process": [
            "registrar versões dos artefatos",
            "calcular ou consolidar checksums",
            "registrar commit ou versão do código",
            "registrar dependências e ambiente",
            "montar pacote de reprodutibilidade"
          ],
          "outputs": [
            "metadata/versions/registro_versoes.json",
            "metadata/versions/manifesto_execucao.json",
            "metadata/versions/ambiente_reprodutivel.json",
            "metadata/versions/pacote_reprodutibilidade.json"
          ],
          "formats": [
            "JSON"
          ],
          "contract": {
            "observes": [
              "ASSET_CREATED",
              "CONFIG_USED",
              "RULE_USED"
            ],
            "produces": {
              "versions": [
                "execution_manifest",
                "artifact_versions",
                "environment_manifest"
              ]
            }
          },
          "provenanceFields": [
            [
              "run_id",
              "execução"
            ],
            [
              "pipeline_version",
              "versão da instância"
            ],
            [
              "code_version",
              "commit/tag do código"
            ],
            [
              "config_checksum",
              "hash da configuração"
            ],
            [
              "asset_checksums",
              "hashes de entradas e saídas"
            ],
            [
              "environment",
              "Python e dependências"
            ]
          ],
          "provenanceExample": {
            "run_id": "run-edu-2026-11-18-001",
            "pipeline_version": "1.1.0",
            "code_version": "git:5ad91c2",
            "python": "3.12",
            "config_checksum": "ae88...",
            "input_assets": {
              "alunos": "842e...",
              "notas": "9ca1..."
            }
          },
          "exampleTitle": "Critério de reprodução",
          "example": [
            "Não basta saber qual CSV foi usado.",
            "Precisamos saber versão do pipeline, regras, código, ambiente e checksums."
          ],
          "transversal": [
            [
              "Todos os módulos",
              "cada artefato produzido recebe versão, checksum e run_id"
            ],
            [
              "M15",
              "baselines precisam apontar para versões específicas"
            ],
            [
              "M16",
              "respostas do agente devem indicar evidências versionadas"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m12.html",
          "primaryOutput": "Manifesto reproduzível",
          "instance": {
            "inputSummary": "configuração, checksums/fingerprints, artefatos, versão de código e ambiente",
            "outputSummary": "registro de versões + manifesto de execução + ambiente + pacote de reprodutibilidade",
            "metrics": [
              {
                "label": "Run",
                "value": "run-...001"
              },
              {
                "label": "Pipeline",
                "value": "1.2.0"
              },
              {
                "label": "Commit",
                "value": "demo-5ad91c2"
              },
              {
                "label": "Módulos",
                "value": "16 SUCCESS"
              }
            ],
            "inputs": [
              {
                "id": "config:pipeline",
                "name": "pipeline.yml",
                "kind": "config",
                "format": "YAML",
                "path": "pipeline.yml",
                "href": "data/educacao-evasao/pipeline.yml",
                "role": ""
              },
              {
                "id": "manifest:assets",
                "name": "Ativos da execução",
                "kind": "metadata",
                "format": "JSON",
                "path": "manifest.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/manifest.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "versions:registry",
                "name": "registro_versoes.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/versions/registro_versoes.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/versions/registro_versoes.json",
                "role": ""
              },
              {
                "id": "versions:manifest",
                "name": "manifesto_execucao.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/versions/manifesto_execucao.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/versions/manifesto_execucao.json",
                "role": ""
              },
              {
                "id": "versions:env",
                "name": "ambiente_reprodutivel.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/versions/ambiente_reprodutivel.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/versions/ambiente_reprodutivel.json",
                "role": ""
              },
              {
                "id": "versions:package",
                "name": "pacote_reprodutibilidade.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/versions/pacote_reprodutibilidade.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/versions/pacote_reprodutibilidade.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Coletar versões",
                "input": "artefatos/config",
                "operation": "SHA-256 e IDs",
                "output": "version registry",
                "registers": "path + checksum",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Registrar código",
                "input": "execução",
                "operation": "commit + pipeline version",
                "output": "execution manifest",
                "registers": "git_commit",
                "events": [],
                "transversal": []
              },
              {
                "step": 3,
                "title": "Registrar ambiente",
                "input": "runtime",
                "operation": "Python e dependências",
                "output": "environment manifest",
                "registers": "package versions",
                "events": [],
                "transversal": []
              },
              {
                "step": 4,
                "title": "Empacotar referências",
                "input": "registros",
                "operation": "Gerar pacote reprodutível lógico",
                "output": "reproducibility package",
                "registers": "includes",
                "events": [],
                "transversal": []
              }
            ],
            "contract": {
              "module_id": "M12",
              "observes": [
                "ASSET_CREATED",
                "CONFIG_USED",
                "RULE_USED",
                "SOURCE_VERSION_OBSERVED"
              ],
              "produces": [
                "artifact_versions",
                "execution_manifest",
                "environment_manifest",
                "reproducibility_package"
              ]
            },
            "provenanceRecords": [
              {
                "event_id": "version-m12-001",
                "activity": "EXECUTION_VERSIONED",
                "run_id": "run-edu-2026-11-18-001",
                "pipeline_version": "1.2.0",
                "git_commit": "demo-5ad91c2"
              }
            ],
            "artifacts": [
              "metadata/versions/registro_versoes.json",
              "metadata/versions/manifesto_execucao.json",
              "metadata/versions/ambiente_reprodutivel.json",
              "metadata/versions/pacote_reprodutibilidade.json"
            ],
            "transversals": [
              {
                "id": "M01–M16",
                "consumes": [
                  "versionable assets/events"
                ],
                "action": "Versiona tudo que influencia a reprodução da execução.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              }
            ],
            "example": {
              "title": "Manifesto resumido",
              "type": "json",
              "data": {
                "run_id": "run-edu-2026-11-18-001",
                "pipeline_version": "1.2.0",
                "git_commit": "demo-5ad91c2",
                "modules": "M01–M16 SUCCESS"
              }
            },
            "responsibilityEvidence": [
              {
                "responsibility": "registrar versões dos artefatos",
                "concreteAction": "SHA-256 e IDs",
                "input": "artefatos/config",
                "result": "version registry",
                "registers": "path + checksum",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/versions/registro_versoes.json",
                  "metadata/versions/manifesto_execucao.json",
                  "metadata/versions/ambiente_reprodutivel.json"
                ]
              },
              {
                "responsibility": "calcular ou consolidar checksums",
                "concreteAction": "commit + pipeline version",
                "input": "execução",
                "result": "execution manifest",
                "registers": "git_commit",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/versions/registro_versoes.json",
                  "metadata/versions/manifesto_execucao.json",
                  "metadata/versions/ambiente_reprodutivel.json"
                ]
              },
              {
                "responsibility": "registrar commit ou versão do código",
                "concreteAction": "Python e dependências",
                "input": "runtime",
                "result": "environment manifest",
                "registers": "package versions",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/versions/registro_versoes.json",
                  "metadata/versions/manifesto_execucao.json",
                  "metadata/versions/ambiente_reprodutivel.json"
                ]
              },
              {
                "responsibility": "registrar dependências e ambiente",
                "concreteAction": "Gerar pacote reprodutível lógico",
                "input": "registros",
                "result": "reproducibility package",
                "registers": "includes",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/versions/registro_versoes.json",
                  "metadata/versions/manifesto_execucao.json",
                  "metadata/versions/ambiente_reprodutivel.json"
                ]
              },
              {
                "responsibility": "montar pacote de reprodutibilidade",
                "concreteAction": "Gerar pacote reprodutível lógico",
                "input": "registros",
                "result": "reproducibility package",
                "registers": "includes",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/versions/registro_versoes.json",
                  "metadata/versions/manifesto_execucao.json",
                  "metadata/versions/ambiente_reprodutivel.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m12_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m12_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m12_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m12_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M13": {
          "kind": "transversal",
          "name": "Representações Analíticas",
          "objective": "Gerar representações adequadas à análise mantendo explícita a relação com o ativo analítico de origem.",
          "inputs": [
            "analytical:student_risk",
            "objetivo analítico",
            "configuração das representações"
          ],
          "process": [
            "gerar matriz tabular aluno × atributos",
            "gerar visão temporal aluno × semestre",
            "gerar representação em grafo quando pertinente",
            "registrar regras de derivação e identificadores"
          ],
          "outputs": [
            "data/analytical/matriz_unidade_atributo.csv",
            "data/analytical/graph_nodes.json",
            "data/analytical/graph_edges.json",
            "representation_manifest.json"
          ],
          "formats": [
            "CSV/Parquet",
            "JSON",
            "grafo"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "analytical:student_risk"
              ]
            },
            "produces": {
              "representations": [
                "tabular",
                "temporal",
                "graph"
              ]
            }
          },
          "provenanceFields": [
            [
              "source_asset",
              "ativo analítico de origem"
            ],
            [
              "representation_id",
              "identificador da representação"
            ],
            [
              "representation_type",
              "tabular, temporal ou grafo"
            ],
            [
              "derivation_rules",
              "regras aplicadas"
            ],
            [
              "generated_assets",
              "arquivos produzidos"
            ]
          ],
          "provenanceExample": {
            "representation_id": "repr:student-semester:tabular:v1",
            "source_asset": "dataset:analytical:student_risk:v1",
            "representation_type": "tabular",
            "entity_key": [
              "aluno_id",
              "semestre"
            ]
          },
          "exampleTitle": "Uma fonte, várias representações",
          "example": [
            "Tabular: aluno × atributos.",
            "Temporal: aluno × semestre × indicadores.",
            "Grafo: aluno → curso, disciplina e apoio."
          ],
          "transversal": [
            [
              "M09",
              "cataloga cada representação"
            ],
            [
              "M11",
              "liga representação ao ativo de origem"
            ],
            [
              "M12",
              "versiona representação e regra de derivação"
            ],
            [
              "M14",
              "pode selecionar a representação mais adequada para criar features"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m13.html",
          "primaryOutput": "Representações derivadas",
          "instance": {
            "inputSummary": "ativo analítico student_risk + objetivo analítico",
            "outputSummary": "representação tabular unidade×atributo + representação em grafo estudante→curso/status",
            "metrics": [
              {
                "label": "Matriz",
                "value": "6 × 5"
              },
              {
                "label": "Nós grafo",
                "value": "9"
              },
              {
                "label": "Arestas",
                "value": "12"
              },
              {
                "label": "Representações",
                "value": "2"
              }
            ],
            "inputs": [
              {
                "id": "dataset:analytical:student_risk:v1",
                "name": "student_risk.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/analytical/student_risk.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/analytical/student_risk.csv",
                "role": "",
                "records": 6,
                "columns": 15
              }
            ],
            "outputs": [
              {
                "id": "representation:matrix",
                "name": "matriz_unidade_atributo.csv",
                "kind": "representation",
                "format": "CSV",
                "path": "data/analytical/matriz_unidade_atributo.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/analytical/matriz_unidade_atributo.csv",
                "role": "",
                "records": 6,
                "columns": 5
              },
              {
                "id": "representation:graph",
                "name": "nodes_edges.json",
                "kind": "representation",
                "format": "JSON",
                "path": "artifacts/m13/nodes_edges.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m13/nodes_edges.json",
                "role": ""
              },
              {
                "id": "artifact:repr_manifest",
                "name": "representation_manifest.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m13/representation_manifest.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m13/representation_manifest.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Selecionar representação",
                "input": "analytical asset",
                "operation": "Escolher tabular e grafo",
                "output": "2 representações",
                "registers": "representation_id",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Materializar matriz",
                "input": "student_risk",
                "operation": "Selecionar id + atributos numéricos + target",
                "output": "6 × 5",
                "registers": "schema",
                "events": [],
                "transversal": []
              },
              {
                "step": 3,
                "title": "Materializar grafo",
                "input": "student_risk",
                "operation": "Criar student/course/status nodes e edges",
                "output": "9 nós / 12 arestas",
                "registers": "node/edge types",
                "events": [
                  "REPRESENTATION_CREATED"
                ],
                "transversal": [
                  "M09",
                  "M11",
                  "M12"
                ]
              }
            ],
            "contract": {
              "module_id": "M13",
              "requires": {
                "dataset": "dataset:analytical:student_risk:v1"
              },
              "produces": {
                "representations": [
                  "tabular_matrix",
                  "graph"
                ]
              },
              "events": [
                "REPRESENTATION_CREATED"
              ]
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m13-001",
                "activity": "REPRESENTATION_CREATED",
                "used": [
                  "dataset:analytical:student_risk:v1"
                ],
                "generated": [
                  "representation:matrix",
                  "representation:graph"
                ]
              }
            ],
            "artifacts": [
              "data/analytical/matriz_unidade_atributo.csv",
              "artifacts/m13/nodes_edges.json",
              "artifacts/m13/representation_manifest.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "REPRESENTATION_CREATED"
                ],
                "action": "Cataloga representações.",
                "stores": [
                  "metadata/catalog/catalogo_dados.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "REPRESENTATION_CREATED"
                ],
                "action": "Liga representações ao ativo original.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "REPRESENTATION_CREATED"
                ],
                "action": "Versiona representações.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              }
            ],
            "example": {
              "title": "Matriz unidade × atributo",
              "type": "table",
              "headers": [
                "aluno_id",
                "media_nota",
                "total_faltas",
                "qtd_disciplinas",
                "evadiu"
              ],
              "rows": [
                [
                  1001,
                  7.5,
                  10,
                  2,
                  0
                ],
                [
                  1002,
                  3.75,
                  38,
                  2,
                  1
                ],
                [
                  1003,
                  8.75,
                  5,
                  2,
                  0
                ],
                [
                  1004,
                  5.25,
                  26,
                  2,
                  0
                ],
                [
                  1005,
                  6.75,
                  12,
                  2,
                  0
                ],
                [
                  1006,
                  2.5,
                  46,
                  2,
                  1
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "gerar matriz tabular aluno × atributos",
                "concreteAction": "Escolher tabular e grafo",
                "input": "analytical asset",
                "result": "2 representações",
                "registers": "representation_id",
                "events": [],
                "transversals": [],
                "evidence": [
                  "data/analytical/matriz_unidade_atributo.csv",
                  "artifacts/m13/nodes_edges.json",
                  "artifacts/m13/representation_manifest.json"
                ]
              },
              {
                "responsibility": "gerar visão temporal aluno × semestre",
                "concreteAction": "Selecionar id + atributos numéricos + target",
                "input": "student_risk",
                "result": "6 × 5",
                "registers": "schema",
                "events": [],
                "transversals": [],
                "evidence": [
                  "data/analytical/matriz_unidade_atributo.csv",
                  "artifacts/m13/nodes_edges.json",
                  "artifacts/m13/representation_manifest.json"
                ]
              },
              {
                "responsibility": "gerar representação em grafo quando pertinente",
                "concreteAction": "Criar student/course/status nodes e edges",
                "input": "student_risk",
                "result": "9 nós / 12 arestas",
                "registers": "node/edge types",
                "events": [
                  "REPRESENTATION_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/analytical/matriz_unidade_atributo.csv",
                  "artifacts/m13/nodes_edges.json",
                  "artifacts/m13/representation_manifest.json"
                ]
              },
              {
                "responsibility": "registrar regras de derivação e identificadores",
                "concreteAction": "Criar student/course/status nodes e edges",
                "input": "student_risk",
                "result": "9 nós / 12 arestas",
                "registers": "node/edge types",
                "events": [
                  "REPRESENTATION_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/analytical/matriz_unidade_atributo.csv",
                  "artifacts/m13/nodes_edges.json",
                  "artifacts/m13/representation_manifest.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m13_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m13_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m13_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m13_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M14": {
          "kind": "transversal",
          "name": "Feature Engineering e Feature Store",
          "objective": "Criar e catalogar atributos analíticos derivados com fórmula, origem, versão e significado explícitos.",
          "inputs": [
            "analytical:student_risk e/ou representações de M13",
            "catálogo de features desejadas"
          ],
          "process": [
            "selecionar atributos de origem",
            "calcular features derivadas",
            "registrar fórmula e janela temporal",
            "associar cada feature às colunas e ativos de origem",
            "persistir feature set e catálogo"
          ],
          "outputs": [
            "data/features/feature_set.csv",
            "feature_catalog.json",
            "feature_store.json",
            "feature_rules.json"
          ],
          "formats": [
            "CSV/Parquet",
            "JSON"
          ],
          "contract": {
            "requires": {
              "datasets": [
                "analytical:student_risk"
              ]
            },
            "produces": {
              "datasets": [
                "features:student_risk"
              ],
              "artifacts": [
                "feature_catalog",
                "feature_rules"
              ]
            }
          },
          "provenanceFields": [
            [
              "feature_id",
              "identificador estável"
            ],
            [
              "name",
              "nome"
            ],
            [
              "formula",
              "regra de cálculo"
            ],
            [
              "source_columns",
              "atributos de origem"
            ],
            [
              "source_assets",
              "ativos de origem"
            ],
            [
              "window",
              "janela temporal quando aplicável"
            ],
            [
              "version",
              "versão da feature"
            ]
          ],
          "provenanceExample": {
            "feature_id": "FT-014",
            "name": "taxa_reprovacao",
            "formula": "disciplinas_reprovadas / disciplinas_cursadas",
            "source_columns": [
              "nota",
              "disciplina_id"
            ],
            "source_assets": [
              "dataset:analytical:student_risk:v1"
            ],
            "version": "1.0"
          },
          "exampleTitle": "Features da instância",
          "example": [
            "media_2_semestres",
            "qtd_reprovacoes",
            "percentual_faltas",
            "tendencia_notas",
            "taxa_reprovacao",
            "recebe_auxilio"
          ],
          "transversal": [
            [
              "M09",
              "cataloga features e significado"
            ],
            [
              "M10",
              "aplica política sobre features sensíveis"
            ],
            [
              "M11",
              "preserva lineage coluna → feature"
            ],
            [
              "M12",
              "versiona fórmula e dataset de origem"
            ],
            [
              "M15",
              "monitora distribuição e drift das features"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m14.html",
          "primaryOutput": "Feature set rastreável",
          "instance": {
            "inputSummary": "ativo analítico + catálogo de colunas + regras de feature engineering",
            "outputSummary": "feature_set de 6 estudantes-semestre + catálogo de 4 features/regras",
            "metrics": [
              {
                "label": "Registros",
                "value": "6"
              },
              {
                "label": "Features centrais",
                "value": "4"
              },
              {
                "label": "Risco ALTO",
                "value": "2"
              },
              {
                "label": "Target incluído",
                "value": "sim"
              }
            ],
            "inputs": [
              {
                "id": "dataset:analytical:student_risk:v1",
                "name": "student_risk.csv",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/analytical/student_risk.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/analytical/student_risk.csv",
                "role": "",
                "records": 6,
                "columns": 15
              }
            ],
            "outputs": [
              {
                "id": "feature_set:student_risk:v1",
                "name": "feature_set.csv",
                "kind": "feature_set",
                "format": "CSV",
                "path": "data/features/feature_set.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/features/feature_set.csv",
                "role": "",
                "records": 6,
                "columns": 8
              },
              {
                "id": "artifact:feature_catalog",
                "name": "feature_catalog.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m14/feature_catalog.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m14/feature_catalog.json",
                "role": ""
              },
              {
                "id": "artifact:feature_store",
                "name": "feature_store.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m14/feature_store.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m14/feature_store.json",
                "role": ""
              },
              {
                "id": "artifact:feature_rules",
                "name": "feature_rules.json",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m14/feature_rules.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m14/feature_rules.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Selecionar campos",
                "input": "analytical asset",
                "operation": "media_nota, faltas, apoio, target",
                "output": "base de features",
                "registers": "source columns",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Derivar recebe_apoio",
                "input": "bolsa/auxílio/monitoria",
                "operation": "OR lógico",
                "output": "recebe_apoio",
                "registers": "formula",
                "events": [
                  "FEATURE_DERIVED"
                ],
                "transversal": [
                  "M09",
                  "M11"
                ]
              },
              {
                "step": 3,
                "title": "Derivar risco simples",
                "input": "media_nota + total_faltas",
                "operation": "Heurística didática explícita",
                "output": "risco_academico_simples",
                "registers": "rule + warning:not_model",
                "events": [
                  "FEATURE_DERIVED"
                ],
                "transversal": [
                  "M10",
                  "M11",
                  "M12"
                ]
              },
              {
                "step": 4,
                "title": "Persistir feature set",
                "input": "features",
                "operation": "Salvar conjunto + catálogo",
                "output": "feature_set:student_risk:v1",
                "registers": "feature ids",
                "events": [
                  "FEATURE_SET_CREATED"
                ],
                "transversal": [
                  "M09",
                  "M15"
                ]
              }
            ],
            "contract": {
              "module_id": "M14",
              "requires": {
                "dataset": "dataset:analytical:student_risk:v1"
              },
              "produces": {
                "feature_set": "feature_set:student_risk:v1",
                "features": [
                  "media_nota",
                  "total_faltas",
                  "recebe_apoio",
                  "risco_academico_simples"
                ],
                "target": "evadiu"
              }
            },
            "provenanceRecords": [
              {
                "event_id": "prov-m14-001",
                "activity": "FEATURE_DERIVED",
                "used": [
                  "media_nota",
                  "total_faltas"
                ],
                "generated": [
                  "risco_academico_simples"
                ],
                "rule": "ALTO if media<5 or faltas>30; MEDIO if media<7 or faltas>15; else BAIXO",
                "note": "heurística didática; não modelo preditivo"
              }
            ],
            "artifacts": [
              "data/features/feature_set.csv",
              "artifacts/m14/feature_catalog.json",
              "artifacts/m14/feature_store.json",
              "artifacts/m14/feature_rules.json"
            ],
            "transversals": [
              {
                "id": "M09",
                "consumes": [
                  "FEATURE_DERIVED",
                  "FEATURE_SET_CREATED"
                ],
                "action": "Cataloga features e definições.",
                "stores": [
                  "metadata/catalog/dicionario_dados.json"
                ]
              },
              {
                "id": "M10",
                "consumes": [
                  "FEATURE_DERIVED"
                ],
                "action": "Avalia uso de atributos sensíveis/protegidos.",
                "stores": [
                  "metadata/governance/plano_conformidade.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "FEATURE_DERIVED"
                ],
                "action": "Rastreia feature até colunas de origem.",
                "stores": [
                  "metadata/lineage/grafo_linhagem.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "FEATURE_SET_CREATED"
                ],
                "action": "Versiona feature set e regras.",
                "stores": [
                  "metadata/versions/registro_versoes.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "FEATURE_SET_CREATED"
                ],
                "action": "Monitora distribuição de features.",
                "stores": [
                  "metadata/monitoring/baseline_current.json"
                ]
              }
            ],
            "example": {
              "title": "Feature set",
              "type": "table",
              "headers": [
                "aluno_id",
                "semestre",
                "media_nota",
                "total_faltas",
                "qtd_disciplinas",
                "recebe_apoio",
                "risco_academico_simples",
                "evadiu"
              ],
              "rows": [
                [
                  1001,
                  "2026-1",
                  7.5,
                  10,
                  2,
                  1,
                  "BAIXO",
                  0
                ],
                [
                  1002,
                  "2026-1",
                  3.75,
                  38,
                  2,
                  0,
                  "ALTO",
                  1
                ],
                [
                  1003,
                  "2026-1",
                  8.75,
                  5,
                  2,
                  1,
                  "BAIXO",
                  0
                ],
                [
                  1004,
                  "2026-1",
                  5.25,
                  26,
                  2,
                  1,
                  "MEDIO",
                  0
                ],
                [
                  1005,
                  "2026-1",
                  6.75,
                  12,
                  2,
                  1,
                  "MEDIO",
                  0
                ],
                [
                  1006,
                  "2026-1",
                  2.5,
                  46,
                  2,
                  0,
                  "ALTO",
                  1
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "selecionar atributos de origem",
                "concreteAction": "media_nota, faltas, apoio, target",
                "input": "analytical asset",
                "result": "base de features",
                "registers": "source columns",
                "events": [],
                "transversals": [],
                "evidence": [
                  "data/features/feature_set.csv",
                  "artifacts/m14/feature_catalog.json",
                  "artifacts/m14/feature_store.json"
                ]
              },
              {
                "responsibility": "calcular features derivadas",
                "concreteAction": "OR lógico",
                "input": "bolsa/auxílio/monitoria",
                "result": "recebe_apoio",
                "registers": "formula",
                "events": [
                  "FEATURE_DERIVED"
                ],
                "transversals": [
                  "M09",
                  "M11"
                ],
                "evidence": [
                  "data/features/feature_set.csv",
                  "artifacts/m14/feature_catalog.json",
                  "artifacts/m14/feature_store.json"
                ]
              },
              {
                "responsibility": "registrar fórmula e janela temporal",
                "concreteAction": "Heurística didática explícita",
                "input": "media_nota + total_faltas",
                "result": "risco_academico_simples",
                "registers": "rule + warning:not_model",
                "events": [
                  "FEATURE_DERIVED"
                ],
                "transversals": [
                  "M10",
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "data/features/feature_set.csv",
                  "artifacts/m14/feature_catalog.json",
                  "artifacts/m14/feature_store.json"
                ]
              },
              {
                "responsibility": "associar cada feature às colunas e ativos de origem",
                "concreteAction": "Salvar conjunto + catálogo",
                "input": "features",
                "result": "feature_set:student_risk:v1",
                "registers": "feature ids",
                "events": [
                  "FEATURE_SET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M15"
                ],
                "evidence": [
                  "data/features/feature_set.csv",
                  "artifacts/m14/feature_catalog.json",
                  "artifacts/m14/feature_store.json"
                ]
              },
              {
                "responsibility": "persistir feature set e catálogo",
                "concreteAction": "Salvar conjunto + catálogo",
                "input": "features",
                "result": "feature_set:student_risk:v1",
                "registers": "feature ids",
                "events": [
                  "FEATURE_SET_CREATED"
                ],
                "transversals": [
                  "M09",
                  "M15"
                ],
                "evidence": [
                  "data/features/feature_set.csv",
                  "artifacts/m14/feature_catalog.json",
                  "artifacts/m14/feature_store.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m14_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m14_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m14_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m14_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M15": {
          "kind": "transversal",
          "name": "Monitoramento, Drift e Evolução dos Ativos",
          "objective": "Comparar execuções ao longo do tempo e detectar mudanças de schema, dados, qualidade e comportamento dos ativos.",
          "inputs": [
            "datasets e métricas da execução corrente",
            "baseline de execução anterior",
            "schemas e features versionados"
          ],
          "process": [
            "criar baseline da execução atual",
            "comparar schema atual com referência",
            "comparar distribuições e métricas",
            "detectar data drift e schema drift",
            "registrar alertas e evolução"
          ],
          "outputs": [
            "metadata/monitoring/baseline_current.json",
            "metadata/monitoring/baseline_reference.json",
            "metadata/monitoring/data_drift_report.json",
            "metadata/monitoring/alerts.json",
            "metadata/monitoring/assets_evolution.json"
          ],
          "formats": [
            "JSON"
          ],
          "contract": {
            "observes": [
              "METRIC_RECORDED",
              "SCHEMA_REGISTERED",
              "ASSET_PUBLISHED"
            ],
            "produces": {
              "monitoring": [
                "baseline",
                "drift_report",
                "alerts"
              ]
            }
          },
          "provenanceFields": [
            [
              "current_run",
              "execução corrente"
            ],
            [
              "reference_run",
              "execução de referência"
            ],
            [
              "asset_id",
              "ativo monitorado"
            ],
            [
              "metric_or_schema",
              "elemento comparado"
            ],
            [
              "change",
              "mudança detectada"
            ],
            [
              "severity",
              "severidade"
            ],
            [
              "detected_at",
              "data/hora"
            ]
          ],
          "provenanceExample": {
            "asset_id": "dataset:analytical:student_risk:v2",
            "reference": "dataset:analytical:student_risk:v1",
            "change_type": "SCHEMA_DRIFT",
            "removed_column": "nota",
            "added_column": "nota_final",
            "severity": "HIGH"
          },
          "exampleTitle": "Exemplo entre dois semestres",
          "example": [
            "Execução anterior: média de notas 7,1.",
            "Execução atual: média de notas 6,4.",
            "O módulo registra a mudança e decide se ultrapassa o limiar de alerta."
          ],
          "transversal": [
            [
              "M02",
              "volume e falhas de ingestão"
            ],
            [
              "M05",
              "qualidade"
            ],
            [
              "M06",
              "fairness"
            ],
            [
              "M07",
              "saúde do ativo analítico"
            ],
            [
              "M14",
              "distribuição das features"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m15.html",
          "primaryOutput": "Baselines + alertas",
          "instance": {
            "inputSummary": "dataset/feature set atuais + baseline de execução anterior + schemas",
            "outputSummary": "baseline atual + comparação de drift + 2 alertas + evolução dos ativos",
            "metrics": [
              {
                "label": "Schema drift",
                "value": "não"
              },
              {
                "label": "Data drift alerts",
                "value": "2"
              },
              {
                "label": "Disponibilidade",
                "value": "OK"
              },
              {
                "label": "Run referência",
                "value": "2026-10"
              }
            ],
            "inputs": [
              {
                "id": "dataset:validated:student_semester:v1",
                "name": "validated dataset",
                "kind": "dataset",
                "format": "CSV",
                "path": "data/validated/student_semester_validated.csv",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/data/validated/student_semester_validated.csv",
                "role": "",
                "records": 6,
                "columns": 18
              },
              {
                "id": "baseline:reference",
                "name": "baseline_reference.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/monitoring/baseline_reference.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/monitoring/baseline_reference.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "monitoring:current",
                "name": "baseline_current.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/monitoring/baseline_current.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/monitoring/baseline_current.json",
                "role": ""
              },
              {
                "id": "monitoring:drift",
                "name": "data_drift_report.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/monitoring/data_drift_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/monitoring/data_drift_report.json",
                "role": ""
              },
              {
                "id": "monitoring:alerts",
                "name": "alerts.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/monitoring/alerts.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/monitoring/alerts.json",
                "role": ""
              },
              {
                "id": "monitoring:evolution",
                "name": "asset_evolution_report.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/monitoring/asset_evolution_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/monitoring/asset_evolution_report.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Calcular baseline atual",
                "input": "validated",
                "operation": "estatísticas + schema",
                "output": "current baseline",
                "registers": "means/rates/schema",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Comparar referência",
                "input": "current + reference",
                "operation": "diferenças e limiares",
                "output": "drift report",
                "registers": "metric deltas",
                "events": [
                  "DRIFT_CHECKED"
                ],
                "transversal": [
                  "M09",
                  "M11"
                ]
              },
              {
                "step": 3,
                "title": "Emitir alertas",
                "input": "drift report",
                "operation": "criar alertas operacionais",
                "output": "2 alerts",
                "registers": "severity + field",
                "events": [
                  "MONITORING_ALERT"
                ],
                "transversal": [
                  "M10",
                  "M16"
                ]
              }
            ],
            "contract": {
              "module_id": "M15",
              "requires": {
                "current": "dataset:validated:student_semester:v1",
                "reference": "baseline previous run"
              },
              "produces": {
                "baseline": "current",
                "drift_report": "2 alerts",
                "schema_drift": false
              }
            },
            "provenanceRecords": [
              {
                "event_id": "mon-m15-001",
                "activity": "DRIFT_CHECKED",
                "used": [
                  "run:2026-10",
                  "run:2026-11"
                ],
                "generated": [
                  "metadata:drift_report:v1"
                ],
                "alerts": [
                  "AL-001",
                  "AL-002"
                ]
              }
            ],
            "artifacts": [
              "metadata/monitoring/baseline_current.json",
              "metadata/monitoring/baseline_reference.json",
              "metadata/monitoring/data_drift_report.json",
              "metadata/monitoring/alerts.json",
              "metadata/monitoring/asset_evolution_report.json"
            ],
            "transversals": [
              {
                "id": "M01–M08",
                "consumes": [
                  "profiles/metrics"
                ],
                "action": "Acompanha schema, volume, qualidade e ativos ao longo do pipeline.",
                "stores": [
                  "metadata/monitoring/baseline_current.json"
                ]
              },
              {
                "id": "M16",
                "consumes": [
                  "MONITORING_ALERT"
                ],
                "action": "Disponibiliza alertas como evidências consultáveis.",
                "stores": [
                  "metadata/agents/evidence_base.json"
                ]
              }
            ],
            "example": {
              "title": "Comparação de drift",
              "type": "table",
              "headers": [
                "métrica",
                "referência",
                "atual",
                "status"
              ],
              "rows": [
                [
                  "media_nota_mean",
                  6.8,
                  5.75,
                  "OK"
                ],
                [
                  "total_faltas_mean",
                  14.0,
                  22.833,
                  "ALERT"
                ],
                [
                  "evadiu_rate",
                  0.167,
                  0.333,
                  "ALERT"
                ]
              ]
            },
            "responsibilityEvidence": [
              {
                "responsibility": "criar baseline da execução atual",
                "concreteAction": "estatísticas + schema",
                "input": "validated",
                "result": "current baseline",
                "registers": "means/rates/schema",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/monitoring/baseline_current.json",
                  "metadata/monitoring/baseline_reference.json",
                  "metadata/monitoring/data_drift_report.json"
                ]
              },
              {
                "responsibility": "comparar schema atual com referência",
                "concreteAction": "diferenças e limiares",
                "input": "current + reference",
                "result": "drift report",
                "registers": "metric deltas",
                "events": [
                  "DRIFT_CHECKED"
                ],
                "transversals": [
                  "M09",
                  "M11"
                ],
                "evidence": [
                  "metadata/monitoring/baseline_current.json",
                  "metadata/monitoring/baseline_reference.json",
                  "metadata/monitoring/data_drift_report.json"
                ]
              },
              {
                "responsibility": "comparar distribuições e métricas",
                "concreteAction": "criar alertas operacionais",
                "input": "drift report",
                "result": "2 alerts",
                "registers": "severity + field",
                "events": [
                  "MONITORING_ALERT"
                ],
                "transversals": [
                  "M10",
                  "M16"
                ],
                "evidence": [
                  "metadata/monitoring/baseline_current.json",
                  "metadata/monitoring/baseline_reference.json",
                  "metadata/monitoring/data_drift_report.json"
                ]
              },
              {
                "responsibility": "detectar data drift e schema drift",
                "concreteAction": "criar alertas operacionais",
                "input": "drift report",
                "result": "2 alerts",
                "registers": "severity + field",
                "events": [
                  "MONITORING_ALERT"
                ],
                "transversals": [
                  "M10",
                  "M16"
                ],
                "evidence": [
                  "metadata/monitoring/baseline_current.json",
                  "metadata/monitoring/baseline_reference.json",
                  "metadata/monitoring/data_drift_report.json"
                ]
              },
              {
                "responsibility": "registrar alertas e evolução",
                "concreteAction": "criar alertas operacionais",
                "input": "drift report",
                "result": "2 alerts",
                "registers": "severity + field",
                "events": [
                  "MONITORING_ALERT"
                ],
                "transversals": [
                  "M10",
                  "M16"
                ],
                "evidence": [
                  "metadata/monitoring/baseline_current.json",
                  "metadata/monitoring/baseline_reference.json",
                  "metadata/monitoring/data_drift_report.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m15_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m15_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m15_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m15_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        },
        "M16": {
          "kind": "transversal",
          "name": "Agentes Inteligentes de Apoio ao Pipeline",
          "objective": "Permitir consultas sobre o pipeline usando evidências governadas e rastreáveis produzidas pelos próprios módulos.",
          "inputs": [
            "artefatos, relatórios e metadados autorizados",
            "catálogo, lineage e versões",
            "perguntas livres ou estruturadas"
          ],
          "process": [
            "indexar dinamicamente evidências permitidas em trechos rastreáveis",
            "associar cada trecho ao artefato e versão de origem",
            "recuperar e ranquear evidências relevantes para a pergunta",
            "responder com evidências explícitas ou abster-se quando o suporte for insuficiente",
            "registrar consulta, evidências recuperadas, modo e status"
          ],
          "outputs": [
            "metadata/agents/evidence_base.json",
            "metadata/agents/agent_model.json",
            "metadata/agents/query_register.json",
            "metadata/agents/agent_governance_plan.json"
          ],
          "formats": [
            "JSON",
            "texto"
          ],
          "contract": {
            "requires": {
              "evidence": [
                "catalog",
                "quality_report",
                "lineage",
                "version_manifest",
                "monitoring"
              ]
            },
            "produces": {
              "agent": [
                "answer",
                "evidence_refs",
                "query_record"
              ]
            }
          },
          "provenanceFields": [
            [
              "query_id",
              "identificador da consulta"
            ],
            [
              "question",
              "pergunta"
            ],
            [
              "evidence_ids",
              "evidências recuperadas"
            ],
            [
              "evidence_versions",
              "versões consultadas"
            ],
            [
              "answer_id",
              "resposta gerada"
            ],
            [
              "access_context",
              "papel/permissão do solicitante"
            ]
          ],
          "provenanceExample": {
            "query_id": "q-edu-001",
            "question": "Qual foi a qualidade do dataset usado no indicador de evasao?",
            "evidence_ids": [
              "quality_report:M05:v1",
              "asset:M07:v1",
              "lineage:M11:v1",
              "manifest:M12:v1"
            ],
            "answer_status": "SUPPORTED_BY_EVIDENCE"
          },
          "exampleTitle": "Resposta rastreável",
          "example": [
            "O agente informa que foram executadas 12 regras, 11 aprovadas e 1 com alerta.",
            "A resposta aponta explicitamente para o relatório de M05 e a versão do ativo usado.",
            "M16 não deve contornar as políticas de M10."
          ],
          "transversal": [
            [
              "M09",
              "usa catálogo para encontrar ativos"
            ],
            [
              "M10",
              "respeita permissões e finalidade"
            ],
            [
              "M11",
              "usa lineage para explicar origem"
            ],
            [
              "M12",
              "usa versões para citar evidências corretas"
            ],
            [
              "M15",
              "pode explicar alertas correntes"
            ]
          ],
          "conceptualUrl": "https://ronaldocmc.github.io/UnespDataLens-RM/modulos/m16.html",
          "primaryOutput": "Consultas apoiadas por evidências",
          "instance": {
            "inputSummary": "pergunta + artefatos/metadados/contratos/relatórios autorizados, filtrados por M10",
            "outputSummary": "resposta suportada por evidências ou abstenção + evidence refs + registro exportável da consulta",
            "metrics": [
              {
                "label": "Índice",
                "value": "dinâmico"
              },
              {
                "label": "Máx. evidências",
                "value": "6"
              },
              {
                "label": "Status",
                "value": "SUPPORTED/ABSTAIN"
              },
              {
                "label": "Dados brutos",
                "value": "bloqueados"
              }
            ],
            "inputs": [
              {
                "id": "metadata:catalog",
                "name": "catálogo",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/catalog/catalogo_dados.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/catalog/catalogo_dados.json",
                "role": ""
              },
              {
                "id": "artifact:quality_report",
                "name": "quality report",
                "kind": "artifact",
                "format": "JSON",
                "path": "artifacts/m05/quality_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/artifacts/m05/quality_report.json",
                "role": ""
              },
              {
                "id": "lineage:graph",
                "name": "lineage",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/lineage/grafo_linhagem.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/lineage/grafo_linhagem.json",
                "role": ""
              },
              {
                "id": "versions:manifest",
                "name": "manifest",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/versions/manifesto_execucao.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/versions/manifesto_execucao.json",
                "role": ""
              },
              {
                "id": "monitoring:drift",
                "name": "drift",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/monitoring/data_drift_report.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/monitoring/data_drift_report.json",
                "role": ""
              }
            ],
            "outputs": [
              {
                "id": "agent:evidence",
                "name": "evidence_base.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/agents/evidence_base.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/agents/evidence_base.json",
                "role": ""
              },
              {
                "id": "agent:model",
                "name": "agent_model.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/agents/agent_model.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/agents/agent_model.json",
                "role": ""
              },
              {
                "id": "agent:queries",
                "name": "query_register.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/agents/query_register.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/agents/query_register.json",
                "role": ""
              },
              {
                "id": "agent:governance",
                "name": "agent_governance_plan.json",
                "kind": "metadata",
                "format": "JSON",
                "path": "metadata/agents/agent_governance_plan.json",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/agents/agent_governance_plan.json",
                "role": ""
              }
            ],
            "processTrace": [
              {
                "step": 1,
                "title": "Indexar evidências",
                "input": "artefatos permitidos",
                "operation": "Criar evidence_id + path + run_id",
                "output": "índice dinâmico de evidências autorizadas",
                "registers": "evidence metadata",
                "events": [],
                "transversal": []
              },
              {
                "step": 2,
                "title": "Aplicar governança",
                "input": "query context",
                "operation": "Filtrar fontes conforme M10",
                "output": "evidências autorizadas",
                "registers": "access context",
                "events": [
                  "EVIDENCE_FILTERED"
                ],
                "transversal": [
                  "M10"
                ]
              },
              {
                "step": 3,
                "title": "Recuperar",
                "input": "pergunta",
                "operation": "Buscar evidências relevantes",
                "output": "até 6 evidence refs",
                "registers": "evidence_ids",
                "events": [
                  "EVIDENCE_RETRIEVED"
                ],
                "transversal": [
                  "M11",
                  "M12"
                ]
              },
              {
                "step": 4,
                "title": "Responder e registrar",
                "input": "evidence refs",
                "operation": "Compor resposta com suporte explícito",
                "output": "SUPPORTED_BY_EVIDENCE",
                "registers": "query_id + answer + evidence_ids",
                "events": [
                  "AGENT_QUERY_COMPLETED"
                ],
                "transversal": [
                  "M09",
                  "M15"
                ]
              }
            ],
            "contract": {
              "module_id": "M16",
              "requires": {
                "evidence": [
                  "catalog",
                  "quality",
                  "lineage",
                  "versions",
                  "monitoring"
                ],
                "governance": "M10"
              },
              "produces": {
                "answer": "with evidence refs",
                "query_record": "Q-001",
                "evidence_base": "dynamic_governed_index"
              }
            },
            "provenanceRecords": [
              {
                "query_id": "Q-001",
                "question": "Qual foi a qualidade do dataset usado no indicador de evasão?",
                "evidence_ids": [
                  "EV-M05-QUALITY",
                  "EV-M07-ASSET",
                  "EV-M11-LINEAGE",
                  "EV-M12-MANIFEST"
                ],
                "answer_status": "SUPPORTED_BY_EVIDENCE"
              }
            ],
            "artifacts": [
              "metadata/agents/evidence_base.json",
              "metadata/agents/agent_model.json",
              "metadata/agents/query_register.json",
              "metadata/agents/agent_governance_plan.json"
            ],
            "transversals": [
              {
                "id": "M10",
                "consumes": [
                  "query access context"
                ],
                "action": "Define quais evidências podem ser consultadas.",
                "stores": [
                  "metadata/agents/agent_governance_plan.json"
                ]
              },
              {
                "id": "M11",
                "consumes": [
                  "lineage"
                ],
                "action": "Permite explicar origem das evidências.",
                "stores": [
                  "metadata/agents/evidence_base.json"
                ]
              },
              {
                "id": "M12",
                "consumes": [
                  "versions"
                ],
                "action": "Garante que a resposta cite a versão certa.",
                "stores": [
                  "metadata/agents/query_register.json"
                ]
              },
              {
                "id": "M15",
                "consumes": [
                  "alerts"
                ],
                "action": "Inclui alertas atuais nas evidências.",
                "stores": [
                  "metadata/agents/evidence_base.json"
                ]
              }
            ],
            "example": {
              "title": "Consulta rastreável",
              "type": "json",
              "data": {
                "question": "Qual foi a qualidade do dataset usado no indicador de evasão?",
                "answer": "A execução foi aceita com warning: 12 regras, 11 PASS e 1 WARNING não crítico.",
                "evidence_ids": [
                  "EV-M05-QUALITY",
                  "EV-M07-ASSET",
                  "EV-M11-LINEAGE",
                  "EV-M12-MANIFEST"
                ]
              }
            },
            "responsibilityEvidence": [
              {
                "responsibility": "indexar evidências permitidas",
                "concreteAction": "Criar evidence_id + path + run_id",
                "input": "artefatos permitidos",
                "result": "6 evidence items",
                "registers": "evidence metadata",
                "events": [],
                "transversals": [],
                "evidence": [
                  "metadata/agents/evidence_base.json",
                  "metadata/agents/agent_model.json",
                  "metadata/agents/query_register.json"
                ]
              },
              {
                "responsibility": "associar cada trecho ao artefato e versão de origem",
                "concreteAction": "Filtrar fontes conforme M10",
                "input": "query context",
                "result": "evidências autorizadas",
                "registers": "access context",
                "events": [
                  "EVIDENCE_FILTERED"
                ],
                "transversals": [
                  "M10"
                ],
                "evidence": [
                  "metadata/agents/evidence_base.json",
                  "metadata/agents/agent_model.json",
                  "metadata/agents/query_register.json"
                ]
              },
              {
                "responsibility": "recuperar evidências relevantes para a pergunta",
                "concreteAction": "Buscar evidências relevantes",
                "input": "pergunta",
                "result": "4 evidence refs",
                "registers": "evidence_ids",
                "events": [
                  "EVIDENCE_RETRIEVED"
                ],
                "transversals": [
                  "M11",
                  "M12"
                ],
                "evidence": [
                  "metadata/agents/evidence_base.json",
                  "metadata/agents/agent_model.json",
                  "metadata/agents/query_register.json"
                ]
              },
              {
                "responsibility": "responder indicando as evidências usadas",
                "concreteAction": "Compor resposta com suporte explícito",
                "input": "evidence refs",
                "result": "SUPPORTED_BY_EVIDENCE",
                "registers": "query_id + answer + evidence_ids",
                "events": [
                  "AGENT_QUERY_COMPLETED"
                ],
                "transversals": [
                  "M09",
                  "M15"
                ],
                "evidence": [
                  "metadata/agents/evidence_base.json",
                  "metadata/agents/agent_model.json",
                  "metadata/agents/query_register.json"
                ]
              },
              {
                "responsibility": "registrar consulta, fontes recuperadas e contexto",
                "concreteAction": "Compor resposta com suporte explícito",
                "input": "evidence refs",
                "result": "SUPPORTED_BY_EVIDENCE",
                "registers": "query_id + answer + evidence_ids",
                "events": [
                  "AGENT_QUERY_COMPLETED"
                ],
                "transversals": [
                  "M09",
                  "M15"
                ],
                "evidence": [
                  "metadata/agents/evidence_base.json",
                  "metadata/agents/agent_model.json",
                  "metadata/agents/query_register.json"
                ]
              }
            ],
            "extraFiles": [
              {
                "name": "m16_contract.json",
                "format": "JSON",
                "href": "data/educacao-evasao/contracts/m16_contract.json",
                "role": "Contrato concreto da instância"
              },
              {
                "name": "m16_execution.json",
                "format": "JSON",
                "href": "data/educacao-evasao/run/run-edu-2026-11-18-001/metadata/execution/modules/m16_execution.json",
                "role": "Registro completo da execução do módulo"
              }
            ]
          }
        }
      }
    }
  }
};
})();