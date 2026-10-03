# Giro Certo Frontend

Aplicativo React + TypeScript, empacotado para Android com Capacitor.

## Supabase

O login usa contas criadas manualmente em Authentication > Users. O cadastro
público permanece desativado durante o piloto. Execute uma vez o arquivo
`../supabase/01_jornadas_piloto.sql` no projeto de teste antes de usar o app.

Copie `.env.example` para `.env.local` e preencha a URL do projeto e a chave
**publishable**. Nunca coloque `secret key` ou `service_role` no aplicativo.
O `.env.local` não é versionado. As jornadas são salvas na tabela `rides`,
protegida por políticas que permitem a cada motorista acessar apenas as
próprias linhas.

## Executar

```bash
npm install
npm run dev
```

O comando inicia o frontend em `http://localhost:5173` e a API de cálculos em
`http://localhost:3001`. A calculadora da interface usa a função local;
o backend Node continua disponível para testes e uso futuro.

## Verificar

```bash
npm test
npm run build
```

A rota `POST /api/calculos` recebe as quatro receitas, quilometragem, preço do
combustível e média do veículo. Ela devolve valor bruto, valor por km, litros
consumidos, combustível gasto, valor líquido e lucro percentual.

O app inclui login, cálculo, salvamento de jornadas e histórico real. A tela
de configurações do veículo ainda é uma prévia e não persiste no Supabase.
