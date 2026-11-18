# UnespDataLens-RM — Instâncias Interativas V8

A V8.3 foi construída diretamente sobre a V7 e preserva todos os dados, módulos, contratos, artefatos, eventos, metadados e evidências da instância educacional.

## Novidades de layout

- **Três áreas preservadas:** Módulos, Visão da Execução e Inspector.
- **Menu Módulos recolhível por completo:** ao ocultar, não permanece coluna residual.
- **Visão da Execução maximizada:** botão `⛶` no painel central ocupa toda a área útil abaixo do cabeçalho.
- **Inspector maximizado:** botão `⛶` no Inspector oferece leitura ampla para JSON, YAML, CSV, contratos e logs.
- **Restaurar layout:** recupera as três áreas e as larguras padrão.
- **Divisor Módulos ↔ Centro:** arraste horizontalmente para alterar a largura do menu.
- **Divisor Centro ↔ Inspector:** arraste horizontalmente para privilegiar a execução ou o conteúdo inspecionado.
- **Persistência:** visibilidade do menu, larguras e modo de visualização são salvos no `localStorage`.
- **Navegação sincronizada:** os blocos do centro continuam abrindo a aba correspondente no Inspector.
- **Preservação integral da V7:** nenhuma funcionalidade de módulos, entradas, saídas, contratos, proveniência, exemplos, integração ou navegador de arquivos foi removida.

## Como abrir

Abra:

```text
instancias/explorar.html?id=educacao-evasao&module=M01
```

A aplicação continua preparada para uso via `file:///` no Windows.

## Modos da V8

| Modo | Menu esquerdo | Área central | Inspector |
|---|---|---|---|
| Normal | Visível | Visível | Visível |
| Menu recolhido | Oculto | Ampliada | Ampliado |
| Central maximizada | Oculto | Tela inteira abaixo do cabeçalho | Oculto |
| Inspector maximizado | Oculto | Oculta | Tela inteira abaixo do cabeçalho |
| Restaurar | Visível | Visível | Visível |

## Controles

- **Módulos:** mostra/oculta o explorador à esquerda.
- **Restaurar layout:** restaura menu, centro, Inspector e larguras padrão.
- **⛶ no centro:** maximiza/restaura a Visão da Execução.
- **⛶ no Inspector:** maximiza/restaura o Inspector.
- **Divisores verticais:** arraste para redimensionar; também aceitam as teclas ← e → quando recebem foco.


## V8.3 — indicadores explicáveis

- Os cartões de métricas da área central passaram a ser clicáveis.
- Cada indicador mostra uma composição resumida diretamente no cartão.
- Ao clicar em **Ver composição**, o Inspector mostra os elementos que formam o valor e os arquivos/evidências relacionados.
- No M01, `Fontes = 4` explicita `alunos_csv`, `matriculas_pg`, `notas_pg` e `apoio_api`; `Registros observados = 30` explicita `6 + 6 + 12 + 6`; e `Conectores = 3 tipos` explicita Arquivo, PostgreSQL e REST API.
- O mesmo mecanismo de inspeção de métricas é disponibilizado para M02–M16, usando os ativos, passos e evidências ligados a cada módulo.

## Correções da V8.3

- Corrigido o Inspector de "Todos os arquivos": os itens embutidos usam `path` e agora são convertidos corretamente para o identificador navegável usado pelo Inspector.
- Todos os arquivos textuais embutidos (YAML, JSON, CSV, Markdown, TXT e LOG) passam a exibir seu conteúdo ao serem selecionados.
- Eliminada a mensagem incorreta `Conteúdo não embutido nesta versão.` para arquivos que já possuíam conteúdo embutido.
- Corrigida a contagem/listagem de arquivos que podia reduzir 124 itens para 122 por falta do caminho usado como chave de unicidade.
- No fluxo central, `responsabilidades executadas` foi simplificado para `ações executadas`, evitando quebra visual e deixando o painel mais objetivo.
