# App para motoristas — estrutura inicial

Organização para um aplicativo simples de controle de ganhos, despesas e quilômetros trabalhados por motoristas de Uber, 99 e outras plataformas. Nome comercial ainda não definido.

**Estado: planejamento e estrutura, sem implementação.** Todos os arquivos `.dart` estão vazios: reservam os locais das futuras classes e dos testes. O projeto ainda não executa, não compila e não possui dependências instaladas.

## Base proposta

- Flutter/Dart; Android como primeiro destino. Uma eventual versão iOS exigirá ambiente macOS/Xcode para compilação e validação.
- Uso individual, lançamentos manuais, valores em reais e armazenamento local SQLite.
- Separação entre apresentação, domínio e dados, com complexidade adequada ao MVP.
- PSP adaptado ao trabalho individual, com planejamento, medição, revisões e melhoria contínua.

Estas são premissas de organização, ajustáveis antes da implementação; não representam escolhas já confirmadas pelo usuário.

## Pastas

| Caminho | Conteúdo |
| --- | --- |
| `docs/produto/` | Escopo, requisitos, regras e sequência de entregas |
| `docs/arquitetura/` | Camadas, catálogo de classes e modelo de dados |
| `docs/ambiente/` | Ferramentas e dependências previstas |
| `docs/qualidade/` | Padrões e cenários de teste |
| `docs/psp/` | Processo, formulários e registros pessoais |
| `lib/app/` | Composição e aparência do aplicativo |
| `lib/domain/` | Entidades, contratos e regras de cálculo |
| `lib/data/` | Banco local e implementação dos repositórios |
| `lib/presentation/` | Telas e modelos de apresentação |
| `assets/` | Espaços para imagens e ícones próprios |
| `test/` | Espaços para testes unitários e de interface |
| `integration_test/` | Espaço para testes do fluxo completo |

## Ordem de leitura

1. [Escopo e requisitos](docs/produto/escopo.md).
2. [Regras de cálculo](docs/produto/regras_de_negocio.md).
3. [Arquitetura](docs/arquitetura/arquitetura.md) e [classes previstas](docs/arquitetura/classes.md).
4. [Ambiente e dependências](docs/ambiente/dependencias.md).
5. [Processo PSP](docs/psp/processo.md) e [entregas](docs/produto/backlog.md).

## Próxima etapa

Revisar as premissas, estimar a primeira entrega e então inicializar o projeto Flutter preservando esta organização. O SDK deverá gerar os arquivos nativos, o manifesto `pubspec.yaml`, as configurações de análise e os arquivos de build. Não foram criados manifestos vazios nem executados geradores nesta etapa, para respeitar o pedido de não escrever código.
