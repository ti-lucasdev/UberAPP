# Escopo e requisitos do MVP

## Objetivo

Permitir que o motorista registre sua atividade e visualize receita recebida, despesas registradas, resultado operacional e distância trabalhada por período.

## Premissas propostas

- Um usuário e um veículo ativo; histórico preserva o veículo associado a cada jornada.
- Jornada é o resumo de um turno de trabalho, incluindo todas as plataformas utilizadas.
- Receitas serão informadas separadamente por plataforma dentro da jornada; tempo e distância pertencem à jornada inteira.
- Entrada manual, operação sem internet, idioma português do Brasil e moeda BRL.
- Sem integração automática com Uber/99, GPS, conta de usuário, nuvem ou pagamentos no MVP.

## Requisitos funcionais

| ID | Requisito | Critério de aceitação |
| --- | --- | --- |
| RF01 | Cadastrar e editar veículo | Nome identificador obrigatório; edição mantém o histórico vinculado |
| RF02 | Registrar, editar e excluir jornada | Veículo, data, horários, pausa e hodômetros validados antes de salvar |
| RF03 | Informar receitas por plataforma | Uber, 99 e outras; múltiplas receitas por jornada sem duplicar quilômetros |
| RF04 | Registrar, editar e excluir despesa | Valor positivo, data, categoria e veículo obrigatórios |
| RF05 | Calcular indicadores | Receita, despesas, resultado, km, receita/km, custo/km, resultado/km e resultado/hora |
| RF06 | Consultar período | Visões diária, semanal e mensal; lista de lançamentos e totais coerentes |
| RF07 | Persistir dados no aparelho | Dados disponíveis após fechar e reabrir o app, sem conexão |

## Requisitos de qualidade

| ID | Requisito | Verificação futura |
| --- | --- | --- |
| RNF01 | Cálculo monetário consistente | Valores persistidos em centavos inteiros e arredondamento definido |
| RNF02 | Interface legível | Rótulos claros, contraste, ampliação de fonte e feedback de validação |
| RNF03 | Persistência íntegra | Jornada e suas receitas salvas em transação; falha não deixa dados parciais |
| RNF04 | Uso offline | Fluxo completo em modo avião |
| RNF05 | Controle de exclusões | Confirmação de exclusão de lançamentos e proteção dos vínculos históricos |
| RNF06 | Manutenibilidade | Regras de cálculo independentes da interface e do banco |

## Evoluções fora do MVP

Backup/exportação, múltiplos veículos ativos, metas, gráficos, abastecimentos com litros/consumo, custos estimados por km, GPS e sincronização. Cada evolução terá seu próprio planejamento PSP e revisão de dependências.
