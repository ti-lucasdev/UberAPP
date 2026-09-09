# Arquitetura proposta

O PSP define como planejar, medir e melhorar o trabalho pessoal. A separação em camadas é uma decisão técnica deste projeto, não uma estrutura de pastas imposta pelo PSP.

## Responsabilidades e dependências

| Camada | Responsabilidade | Pode depender de |
| --- | --- | --- |
| `domain/models` | Entidades e valores do negócio | Dart e outros modelos do domínio |
| `domain/repositories` | Contratos de consulta e persistência | Modelos do domínio |
| `domain/services` | Cálculos e consolidação de indicadores | Modelos do domínio |
| `data/local` | Conexão, migrações e acesso SQLite | SDK e bibliotecas de persistência |
| `data/repositories` | Implementação dos contratos e mapeamento dos registros | Domínio e banco local |
| `presentation/view_models` | Estado, validação de entrada e coordenação das ações | Flutter, contratos e serviços do domínio |
| `presentation/screens` | Entrada e exibição de dados | Flutter e modelos de apresentação |
| `app` | Montagem das dependências, navegação e tema | Camadas necessárias à composição |

As telas recebem os modelos de apresentação; estes recebem repositórios e serviços por construtor. Implementações concretas são escolhidas na composição do app. Domínio não importa Flutter, SQLite nem telas. Apresentação não acessa o banco diretamente.

## Escolhas para manter o MVP simples

- `ChangeNotifier` e recursos do próprio Flutter para estado e navegação; sem biblioteca adicional de estado, injeção ou rotas neste momento.
- Serviço de cálculos puro; consultas aos repositórios coordenadas pelo modelo de apresentação do painel.
- SQLite local; mapeamento entre tabelas e entidades dentro dos repositórios concretos inicialmente.
- Sem backend, chamadas HTTP, geração de código, camada de casos de uso por operação ou autenticação.
- Widgets compartilhados serão extraídos quando existir reutilização concreta; `presentation/widgets` está reservado.

## Fontes

A separação entre apresentação e dados, com repositórios, foi informada pelo [guia oficial de arquitetura Flutter](https://docs.flutter.dev/app-architecture/guide) e suas [recomendações](https://docs.flutter.dev/app-architecture/recommendations). Os nomes de classes e o recorte de domínio são propostas próprias para este app.
