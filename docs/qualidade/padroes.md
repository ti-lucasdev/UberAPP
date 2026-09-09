# Padrões para a futura implementação

- Documentação e textos da interface em português; identificadores técnicos em inglês.
- Arquivos em `snake_case`, tipos em `PascalCase`, membros em `lowerCamelCase`.
- Entidades e cálculos independentes da interface; acesso ao banco somente na camada de dados.
- Valores em centavos e distâncias em metros; não usar ponto flutuante para armazenar dinheiro.
- Data, fuso, unidades e arredondamento explícitos nas interfaces entre camadas.
- Erros de entrada junto aos campos; falhas de persistência comunicadas sem perder o formulário.
- Sem dados pessoais reais em fixtures ou logs; sem segredos e bancos locais no versionamento.
- Excluir código gerado, dependências externas, linhas em branco e comentários da medição de LOC de produção. Medir testes separadamente.
- Aplicar formatador Dart e análise estática após a implementação. Não adicionar abstrações sem uso concreto.

## Conclusão de um incremento

Requisitos atendidos, revisão de projeto e de código registrada, verificações pertinentes aprovadas, defeitos conhecidos classificados, documentação atualizada e pós-análise PSP preenchida. Arquivo vazio não conta como classe implementada ou teste concluído.
