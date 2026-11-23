# UnespDataLens-Ins

Ambiente interativo de instâncias do **UnespDataLens-RM**.

## Versão atual

**V8.7 — Instância Educacional: Risco de Evasão**

A aplicação permite explorar os módulos M01–M16 e inspecionar entradas, processamento, saídas, contratos, proveniência, evidências, módulos transversais e arquivos produzidos pela execução.

### Destaques da V8.7

- seção **Por que o UnespDataLens-RM?**;
- **Pergunte ao Pipeline** com respostas estruturadas baseadas em evidências;
- campo de perguntas livres destacado e catálogo ampliado de sugestões por tema;
- perguntas e respostas estruturadas sobre armazenamento, técnicas empregadas e versionamento de fontes/datasets;
- **M16 Evidence-RAG** para perguntas livres;
- índice dinâmico de artefatos autorizados;
- bloqueio de dados pessoais brutos na demonstração pública;
- evidências com path, módulo, score e conteúdo;
- abstenção quando não há suporte suficiente;
- registro local/exportável da consulta;
- adaptador pronto para backend LLM sem expor chave no GitHub Pages.

## Abrir

GitHub Pages:

https://ronaldocmc.github.io/UnespDataLens-Ins/

Entrada direta:

`instancias/explorar.html?id=educacao-evasao&module=M01`

## Backend LLM/RAG

O contrato para conexão futura com um backend seguro está documentado em:

`docs/M16_RAG_BACKEND.md`