# UnespDataLens-Ins

Ambiente interativo de instâncias do **UnespDataLens-RM**.

## Versão atual

**V9.2 — Instância Educacional: Risco de Evasão**

A aplicação permite explorar os módulos M01–M16 e inspecionar entradas, processamento, saídas, contratos, proveniência, evidências, módulos transversais e arquivos produzidos pela execução.

### Destaques da V9.2

- **Pergunte ao Pipeline** com respostas estruturadas baseadas em evidências;
- campo de perguntas livres destacado e catálogo ampliado de sugestões por tema;
- perguntas e respostas estruturadas sobre armazenamento, técnicas empregadas e versionamento de fontes/datasets;
- visão própria **Objetivos e Contribuições** no menu lateral, alinhada ao documento-base do UnespDataLens-RM e organizada em problema de pesquisa, pressupostos gerais, hipótese central (HC), hipóteses de avaliação H1–H8, objetivos, instanciação em DSR, refinamentos, contribuições, avaliação e síntese de pipeline verificável;
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