# Catálogo de classes e arquivos previstos

Todos os arquivos abaixo estão vazios. Os nomes indicam tipos futuros; nenhuma classe, enum, função, importação ou assinatura foi implementada.

Os contratos de repositório serão abstratos. Os modelos de apresentação usarão ChangeNotifier do Flutter; detalhes de membros e assinaturas serão definidos no projeto de cada incremento.

| Arquivo | Tipo previsto | Responsabilidade |
| --- | --- | --- |
| [lib/main.dart](../../lib/main.dart) | Ponto de entrada | Inicialização futura do aplicativo. |
| [lib/app/driver_app.dart](../../lib/app/driver_app.dart) | DriverApp | Aplicativo raiz e navegação entre as telas. |
| [lib/app/app_dependencies.dart](../../lib/app/app_dependencies.dart) | AppDependencies | Compor banco, repositórios, serviço e modelos de apresentação. |
| [lib/app/app_theme.dart](../../lib/app/app_theme.dart) | AppTheme | Definir tema visual e estilos acessíveis. |
| [lib/domain/models/vehicle.dart](../../lib/domain/models/vehicle.dart) | Vehicle | Identificação e situação do veículo. |
| [lib/domain/models/work_session.dart](../../lib/domain/models/work_session.dart) | WorkSession | Jornada com veículo, horários, pausa, hodômetros e receitas. |
| [lib/domain/models/platform_earning.dart](../../lib/domain/models/platform_earning.dart) | PlatformEarning | Receita recebida de uma plataforma dentro da jornada. |
| [lib/domain/models/driving_platform.dart](../../lib/domain/models/driving_platform.dart) | DrivingPlatform (enum) | Códigos estáveis para Uber, 99 e outras. |
| [lib/domain/models/expense.dart](../../lib/domain/models/expense.dart) | Expense | Gasto por veículo, data, categoria e valor. |
| [lib/domain/models/expense_category.dart](../../lib/domain/models/expense_category.dart) | ExpenseCategory (enum) | Categorias de despesa do MVP. |
| [lib/domain/models/money.dart](../../lib/domain/models/money.dart) | Money | Valor monetário em centavos, sem formatação de interface. |
| [lib/domain/models/financial_summary.dart](../../lib/domain/models/financial_summary.dart) | FinancialSummary | Resultado derivado, totais e razões por período. |
| [lib/domain/repositories/vehicle_repository.dart](../../lib/domain/repositories/vehicle_repository.dart) | VehicleRepository (contrato) | Consultar, salvar e arquivar veículos preservando histórico. |
| [lib/domain/repositories/work_session_repository.dart](../../lib/domain/repositories/work_session_repository.dart) | WorkSessionRepository (contrato) | Consultar jornadas por período e salvar ou excluir jornada e receitas atomicamente. |
| [lib/domain/repositories/expense_repository.dart](../../lib/domain/repositories/expense_repository.dart) | ExpenseRepository (contrato) | Consultar por período, salvar e excluir despesas. |
| [lib/domain/services/earnings_calculator.dart](../../lib/domain/services/earnings_calculator.dart) | EarningsCalculator | Calcular indicadores a partir dos lançamentos, sem acesso ao banco ou à interface. |
| [lib/data/local/app_database.dart](../../lib/data/local/app_database.dart) | AppDatabase | Conexão SQLite, versão de esquema e gestão de transações. |
| [lib/data/repositories/local_vehicle_repository.dart](../../lib/data/repositories/local_vehicle_repository.dart) | LocalVehicleRepository | Implementar VehicleRepository com SQLite e conversão de registros. |
| [lib/data/repositories/local_work_session_repository.dart](../../lib/data/repositories/local_work_session_repository.dart) | LocalWorkSessionRepository | Implementar WorkSessionRepository e persistir receitas associadas. |
| [lib/data/repositories/local_expense_repository.dart](../../lib/data/repositories/local_expense_repository.dart) | LocalExpenseRepository | Implementar ExpenseRepository com consultas de período. |
| [lib/presentation/view_models/vehicle_view_model.dart](../../lib/presentation/view_models/vehicle_view_model.dart) | VehicleViewModel | Estado e ações do cadastro de veículo. |
| [lib/presentation/view_models/work_session_view_model.dart](../../lib/presentation/view_models/work_session_view_model.dart) | WorkSessionViewModel | Estado, formulário e ações das jornadas e receitas. |
| [lib/presentation/view_models/expense_view_model.dart](../../lib/presentation/view_models/expense_view_model.dart) | ExpenseViewModel | Estado, formulário e ações das despesas. |
| [lib/presentation/view_models/dashboard_view_model.dart](../../lib/presentation/view_models/dashboard_view_model.dart) | DashboardViewModel | Selecionar período, consultar repositórios e solicitar resumo ao calculador. |
| [lib/presentation/screens/vehicle_screen.dart](../../lib/presentation/screens/vehicle_screen.dart) | VehicleScreen | Exibir e editar veículo. |
| [lib/presentation/screens/work_sessions_screen.dart](../../lib/presentation/screens/work_sessions_screen.dart) | WorkSessionsScreen | Listar, cadastrar, editar e excluir jornadas e suas receitas. |
| [lib/presentation/screens/expenses_screen.dart](../../lib/presentation/screens/expenses_screen.dart) | ExpensesScreen | Listar, cadastrar, editar e excluir despesas. |
| [lib/presentation/screens/dashboard_screen.dart](../../lib/presentation/screens/dashboard_screen.dart) | DashboardScreen | Exibir indicadores e selecionar período. |
