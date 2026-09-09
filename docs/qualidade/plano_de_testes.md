# Plano de testes futuros

**Não executado:** não existe código ou teste implementado nesta etapa.

| ID | Requisito | Cenário | Resultado esperado | Nível |
| --- | --- | --- | --- | --- |
| CT01 | RF05 | Exemplo de R$ 300, R$ 100, 200 km e 8 horas úteis | Resultado 200; receita/km 1,50; custo/km 0,50; resultado/km 1; resultado/hora 25 | Unitário |
| CT02 | RF05 | Período sem jornadas e sem despesas | Totais zero, razões sem dados | Unitário |
| CT03 | RF05 | Jornada com zero km ou resumo com zero horas | Razão correspondente sem dados; sem exceção | Unitário |
| CT04 | RF05 | Despesa maior que receita | Resultado negativo preservado | Unitário |
| CT05 | RF02 | Hodômetro regressivo, pausa excessiva ou horários inválidos | Rejeitar e explicar erro | Unitário/widget |
| CT06 | RF03 | Uma jornada com Uber e 99 | Somar receitas; contar km e tempo uma única vez | Unitário |
| CT07 | RF05 | Muitos valores com centavos e arredondamento de razões | Soma exata e regra de apresentação documentada | Unitário |
| CT08 | RF06 | Virada do mês, semana e jornada atravessando meia-noite | Aplicar data de referência e limites do período | Unitário |
| CT09 | RF04 | Combustível lançado como despesa | Somar uma vez; não adicionar estimativa automática | Unitário |
| CT10 | RF01/RF07 | Salvar veículo, jornada e despesa, reabrir offline | Dados preservados | Integração Android |
| CT11 | RF02/RF03 | Falha ao salvar receitas de uma jornada | Transação desfeita sem gravação parcial | Integração Android |
| CT12 | RF02/RF04 | Editar e excluir lançamento | Totais atualizados e confirmação de exclusão | Widget/integração |
| CT13 | RF01 | Arquivar veículo com histórico | Histórico preservado | Integração Android |
| CT14 | RNF02 | Fonte ampliada, formulário inválido e período vazio | Conteúdo acessível e mensagens legíveis | Widget/manual |
| CT15 | RF02 | Jornadas com intervalos sobrepostos | Impedir duplicação de tempo trabalhado | Unitário/integração |
| CT16 | RF07 | Atualização do esquema do banco | Migração preserva lançamentos existentes | Integração Android |

Registrar evidências reais de execução, ambiente, data e defeitos no incremento correspondente. Não declarar aprovação com base apenas na existência destes cenários.
