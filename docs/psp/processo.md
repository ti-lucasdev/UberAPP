# Processo pessoal de software — PSP adaptado

Baseado no [PSP do Software Engineering Institute](https://www.sei.cmu.edu/library/the-personal-software-process-psp/). O método organiza planejamento, medição e melhoria do trabalho individual; sua aplicação independe da linguagem e do desenho técnico escolhidos.

Esta estrutura é uma adaptação prática, não uma declaração de certificação ou adoção integral de um nível formal PSP. Começar por tempo, defeitos, tamanho e melhorias; construir histórico antes de usar estimativas estatísticas. As revisões estão previstas desde o primeiro incremento.

## Roteiro por incremento

| Fase | Atividade | Evidência |
| --- | --- | --- |
| Planejamento | Selecionar requisitos, decompor trabalho e estimar tamanho/tempo | Plano e tarefas |
| Projeto | Especificar dados, responsabilidades e regras | Arquitetura e critérios de aceite |
| RevisaoProjeto | Conferir cenários, cálculos e contratos | Checklist e defeitos |
| Implementacao | Implementar somente o incremento planejado | Arquivos e log de tempo |
| RevisaoCodigo | Revisar alteração e corrigir problemas | Checklist e defeitos |
| Compilacao | Formatar, analisar e compilar | Resultado das ferramentas e defeitos |
| Testes | Executar verificações pertinentes | Evidências e defeitos |
| PosAnalise | Comparar plano/realizado e propor melhoria | Resumo e PIP |

## Uso dos formulários

Copiar `templates/plano_incremento.md`, `templates/checklists.md` e `templates/pos_analise.md` para uma subpasta de `incrementos/` identificada por E01, E02 etc. Preencher requisitos e estimativas antes de implementar. Os registros em `registros/` recebem linhas com o identificador do incremento.

Manter estimativa original; revisões recebem data e motivo. Registrar tempo real por fase e interrupções. Registrar defeitos ao descobri-los, inclusive os de requisitos e projeto, com fase de origem e remoção. Não fabricar duração, tamanho ou resultados retroativamente.

Formulários vazios significam “a preencher”, nunca zero medido. Os arquivos reservados atuais têm zero conteúdo de código; não contam como produtividade de implementação.

O desenvolvedor é responsável pelos seus próprios registros. Se houver mais participantes no futuro, cada um mantém dados pessoais antes de qualquer consolidação.

## Evolução das estimativas

Na ausência de histórico, usar decomposição das tarefas e faixas justificadas. Após acumular incrementos comparáveis, usar tamanho, esforço e defeitos observados para calibrar novos planos. Registrar a base e a incerteza; adiar PROBE/regressão até existir amostra adequada e comparável.

As [referências de conhecimento PSP do SEI](https://www.sei.cmu.edu/library/the-personal-software-process-psp-body-of-knowledge-version-20/) orientam o processo; formulários e critérios locais abaixo são adaptações para este projeto.
