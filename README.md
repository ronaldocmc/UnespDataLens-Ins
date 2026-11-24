# UnespDataLens-Ins

Ambiente interativo de instâncias do **UnespDataLens-RM**.

## Versão atual

**V9.5 — Instância Educacional: Risco de Evasão**

A aplicação permite explorar os módulos M01–M16 e inspecionar entradas, processamento, saídas, contratos, proveniência, evidências, módulos transversais e arquivos produzidos pela execução.

### Destaques da V9.5

- menu superior sem rolagem horizontal, com quebra automática de linha e espaçamento compacto;
- navegação lateral simplificada para **Navegação da instância**, sem textos e agrupamentos redundantes;

- navegação global unificada com o UnespDataLens-RM, com **Instâncias** como área oficial do ecossistema e links absolutos para a documentação conceitual;

- **Pergunte ao Pipeline** com respostas estruturadas baseadas em evidências;
- campo de perguntas livres destacado e catálogo ampliado de sugestões por tema;
- perguntas e respostas estruturadas sobre armazenamento, técnicas empregadas e versionamento de fontes/datasets;
- visão própria **Objetivos e Contribuições** no menu lateral, alinhada ao documento-base do UnespDataLens-RM e organizada em problema de pesquisa, proposição de pesquisa, hipótese central (HC), hipóteses específicas H1–H8, objetivos, instanciação em DSR, refinamentos, contribuições, avaliação e síntese de pipeline verificável;
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