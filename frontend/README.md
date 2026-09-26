# Giro Certo Frontend

Protótipo web responsivo em React + TypeScript para controle de corridas.

## Executar

```bash
npm install
npm run dev
```

O comando inicia o frontend em `http://localhost:5173` e a API de cálculos em
`http://localhost:3001`. O Vite encaminha automaticamente as requisições
`/api` do navegador para o backend.

## Verificar

```bash
npm test
npm run build
```

A rota `POST /api/calculos` recebe as quatro receitas, quilometragem, preço do
combustível e média do veículo. Ela devolve valor bruto, valor por km, litros
consumidos, combustível gasto, valor líquido e lucro percentual.

O protótipo inclui lançamento de corrida, cálculo de valores, resumo, histórico e configurações.
