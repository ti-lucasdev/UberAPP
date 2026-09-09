# Modelo conceitual de dados

Não há SQL ou migrações implementados. Os campos abaixo orientam a futura persistência.

| Entidade / tabela prevista | Dados essenciais | Relações |
| --- | --- | --- |
| Vehicle / vehicles | ID inteiro local, nome, placa opcional, ativo, criação e atualização | Um veículo possui muitas jornadas e despesas |
| WorkSession / work_sessions | ID, veículo, data local, início/fim com offset, pausa em segundos, hodômetros em metros, observação | Pertence a um veículo; possui receitas |
| PlatformEarning / platform_earnings | ID, jornada, plataforma, valor em centavos | Pertence a uma jornada |
| Expense / expenses | ID, veículo, data local de pagamento, categoria, valor em centavos, observação | Pertence a um veículo; independente de jornada |
| FinancialSummary | Período, receitas, despesas, resultado, distância, tempo e razões | Derivado em memória, sem tabela própria |
| Money | Valor em centavos, moeda BRL fixa no MVP | Objeto de valor, sem tabela própria |

Plataforma: Uber, 99 ou outras. Categoria: combustível, manutenção, pedágio, estacionamento, aluguel ou outros. Guardar códigos estáveis, independentes dos rótulos traduzidos.

## Integridade prevista

- Chaves estrangeiras habilitadas; exclusão de veículo referenciado bloqueada, permitindo arquivamento.
- Jornada e receitas gravadas atomicamente; receitas removidas ao excluir a jornada.
- Índices previstos em veículo/data de jornada e despesa; receitas indexadas por jornada.
- Validar intervalos, valores e sobreposição de jornadas antes de persistir.
- Datas locais de referência preservadas para não alterar relatórios quando o aparelho muda de fuso.
- Incluir controle de versão do esquema e migrações que preservem dados na futura inicialização.
- Banco e dados reais não entram no repositório. Dados de testes serão fictícios.
