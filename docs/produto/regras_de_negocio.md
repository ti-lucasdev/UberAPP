# Regras de negócio propostas

Estas regras são uma especificação inicial para revisão antes da implementação.

## Registro

- RN01: registrar como receita o valor efetivamente destinado ao motorista, já descontada a taxa da plataforma. Gorjetas e bônus entram nesse mesmo valor; não devem ser lançados duas vezes.
- RN02: uma jornada pode conter receitas de várias plataformas. A distância total inclui deslocamentos sem passageiro durante o trabalho e é registrada uma única vez, pelos hodômetros.
- RN03: hodômetro final deve ser maior ou igual ao inicial. Guardar distâncias em metros inteiros e converter para km na exibição.
- RN04: guardar horários completos de início e fim, com deslocamento UTC, e data local de referência. O fim deve ser posterior ao início; a pausa deve ser não negativa e menor que a duração total.
- RN05: receita pode ser zero; despesas devem ser positivas. Não aceitar valores ausentes, negativos ou inválidos. Estornos e reembolsos ficam fora da primeira versão.
- RN06: despesas usam categorias combustível, manutenção, pedágio, estacionamento, aluguel e outros. Não estimar combustível a partir de km nesta versão: somar somente os gastos registrados.
- RN07: a jornada atravessando a meia-noite pertence à data local de início. A despesa pertence à sua própria data de pagamento. Essa convenção deve aparecer na ajuda dos relatórios.
- RN08: edição recalcula indicadores; excluir jornada exclui suas receitas na mesma transação, preservando despesas independentes. Veículo com histórico deve ser arquivado, sem apagar o histórico.
- RN09: o mesmo usuário não pode registrar jornadas sobrepostas. Receita por plataforma não implica tempo ou km por plataforma; esses indicadores só existem no total da jornada.

## Indicadores por período e veículo

| Indicador | Regra |
| --- | --- |
| Receita recebida | Soma das receitas das jornadas incluídas |
| Despesas registradas | Soma das despesas pagas no período |
| Resultado operacional registrado | Receita recebida menos despesas registradas |
| Distância trabalhada | Soma de hodômetro final menos inicial das jornadas |
| Horas trabalhadas | Soma de duração menos pausas, convertida para horas |
| Receita por km | Receita recebida dividida pela distância trabalhada |
| Custo por km | Despesas registradas divididas pela distância trabalhada |
| Resultado por km | Resultado operacional registrado dividido pela distância |
| Resultado por hora | Resultado operacional registrado dividido pelas horas trabalhadas |

Se o denominador for zero, mostrar “Sem dados” para a razão. Nunca dividir por zero. Um resultado negativo é válido e deve aparecer como prejuízo. Período vazio mostra totais zero e razões sem dados.

Valores monetários de entrada têm no máximo duas casas decimais e são armazenados em centavos. Somar valores exatos antes de calcular razões; arredondar apenas a apresentação para duas casas, usando metade para longe de zero. Não reutilizar números formatados em cálculos.

O resultado considera somente os lançamentos do usuário, pelo critério de pagamento. Não representa lucro contábil completo: custos ainda não registrados e depreciação não são estimados. Abastecimentos pagos no período podem corresponder a uso em outros períodos.

Períodos usam datas locais inclusivas para o usuário. A consulta interna deve considerar início inclusivo e início do dia seguinte ao fim exclusivo. Semana começa na segunda-feira; mês segue o calendário.

## Exemplo de aceite

Jornada com R$ 300,00 de receita, R$ 100,00 de despesas, 200 km, duração de 9 horas e 1 hora de pausa: resultado de R$ 200,00; receita/km de R$ 1,50; custo/km de R$ 0,50; resultado/km de R$ 1,00 e resultado/hora de R$ 25,00.
