# Convenções de medição

| Medida | Convenção do projeto |
| --- | --- |
| Tempo líquido | Minutos entre início e fim menos interrupções; incluir correções na fase em que ocorreram |
| Desvio de esforço | (Tempo real menos planejado) dividido pelo planejado, em percentual |
| Tamanho | Linhas físicas de código Dart de produção, excluindo branco, comentários e código gerado; testes medidos separadamente |
| Tamanho final | Base menos removidas mais adicionadas; modificadas já pertencem à base e não são somadas novamente |
| Tamanho novo/alterado | Adicionadas mais modificadas; classificação sem sobreposição |
| Produtividade | LOC novas/alteradas de produção por hora líquida do incremento |
| Densidade de defeitos | Defeitos atribuídos ao código novo/alterado por mil LOC novas/alteradas |
| Remoção antecipada local | Defeitos removidos antes da fase Testes divididos por todos os removidos no incremento |

Se o denominador for zero ou não houver medição, registrar “não aplicável”. Defeitos de documentação e projeto entram no registro geral e são analisados separadamente da densidade do código. Não somar tempo de correção novamente ao esforço: ele já aparece no log de tempo.

Linhas apenas movidas ou reformatadas não contam como trabalho funcional adicionado/modificado. Registrar ferramenta e critério usado na medição; não comparar séries que usam critérios diferentes. Na dúvida, documentar a exceção no pós-análise.

## Classificação local de defeitos

Requisitos, projeto, calculo, dados, interface, sintaxe, integracao, testes e documentacao. Essa taxonomia é uma simplificação local, não a tabela oficial completa do PSP. Severidade: bloqueante, alta, media ou baixa.

Fases seguem os nomes de `processo.md`. Origem desconhecida deve ser marcada como desconhecida; não adivinhar. Defeito introduzido por uma correção recebe referência ao defeito original. Atualizar indicadores se defeitos escapados forem encontrados após a entrega.
