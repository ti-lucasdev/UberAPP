# Ambiente e dependências previstas

**Nada instalado nesta etapa.** Esta é a lista da base proposta, não um manifesto executável. Versões serão resolvidas e registradas na inicialização para compatibilidade com o Flutter escolhido; não usar versões imaginadas, `any` ou “latest” como restrição permanente.

## Ferramentas

| Ferramenta | Finalidade | Momento |
| --- | --- | --- |
| Flutter SDK, canal estável | Framework e ferramentas; inclui Dart SDK | Inicialização |
| Android Studio, Android SDK e JDK compatível | Compilar e executar no Android | Inicialização |
| Emulador Android ou aparelho físico | Validar app e SQLite reais | Implementação |
| VS Code ou Android Studio | Edição e depuração | Implementação |
| Git | Histórico e comparação entre incrementos PSP | Inicialização |
| macOS e Xcode | Compilar e validar eventual versão iOS | Evolução iOS |

Consultar a [instalação oficial do Flutter](https://docs.flutter.dev/install) e a [configuração Android](https://docs.flutter.dev/platform-integration/android/setup) na inicialização. O ambiente atual não foi validado como ambiente Flutter.

## Dependências diretas do aplicativo

| Dependência | Origem | Uso e localização |
| --- | --- | --- |
| flutter | Flutter SDK | Interface, Material, estado com ChangeNotifier e navegação |
| flutter_localizations | Flutter SDK | Componentes e datas em português do Brasil |
| [intl](https://pub.dev/packages/intl) | pub.dev | Formatação de datas, BRL e números na apresentação |
| [sqflite](https://pub.dev/packages/sqflite) | pub.dev | SQLite local em `lib/data/local/` |
| [path](https://pub.dev/packages/path) | pub.dev | Construção do caminho do banco local |

`intl` deverá respeitar a versão exigida por `flutter_localizations`. `sqflite` fornece acesso à localização de banco: `path_provider` não é necessário para este escopo. A execução inicial terá Android como alvo; não presumir suporte do mesmo driver SQLite ao app desktop Windows.

## Dependências de desenvolvimento

| Dependência | Origem | Uso |
| --- | --- | --- |
| flutter_test | Flutter SDK | Testes unitários e de widgets |
| integration_test | Flutter SDK | Fluxos completos com persistência no emulador/aparelho |
| [flutter_lints](https://pub.dev/packages/flutter_lints) | pub.dev | Regras de análise estática |

Contratos de repositório permitirão dublês simples nos testes sem biblioteca de mocking. Testes do banco real ficarão no ambiente Android de integração.

## Arquivos que serão gerados na implementação

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `pubspec.yaml` | Nome técnico, versão do app, restrições de SDK, dependências e assets |
| `pubspec.lock` | Versões efetivamente resolvidas; versionar por se tratar de aplicativo |
| `analysis_options.yaml` | Configuração de análise estática |
| `.metadata` | Metadados gerenciados pelo Flutter |
| `android/` | Projeto nativo, manifesto, build Gradle e configurações Android |
| `ios/` | Projeto nativo somente se esse destino for incluído |

Não gerar diretamente por cima dos arquivos reservados sem comparar as saídas. Na inicialização, gerar o esqueleto oficial em pasta temporária, revisar e incorporar os arquivos necessários, preenchendo os placeholders de forma deliberada. Não manter a tela nem o teste demonstrativo do contador.

Verificar o ambiente, resolver dependências, registrar versões efetivas aqui e validar análise, testes e build Android. Nenhuma dessas verificações foi executada nesta fase documental.

## Dependências adiadas

GPS, mapas, HTTP, login, nuvem, gráficos, exportação e monitoramento remoto só serão avaliados se entrarem no escopo. Não são necessários para os cálculos e lançamentos manuais do MVP.
