export type CalculationInput = {
  uber: number
  ninetyNine: number
  particular: number
  inDriver: number
  kmRodado: number
  valorCombustivel: number
  mediaVeiculo: number
}

export type CalculationResult = {
  valorBruto: number
  valorKm: number
  litrosConsumidos: number
  valorCombustivelGasto: number
  valorLiquido: number
  lucroPercentual: number
}

export const emptyCalculation: CalculationResult = {
  valorBruto: 0,
  valorKm: 0,
  litrosConsumidos: 0,
  valorCombustivelGasto: 0,
  valorLiquido: 0,
  lucroPercentual: 0,
}

export async function requestCalculation(input: CalculationInput, signal?: AbortSignal) {
  const response = await fetch('/api/calculos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Falha ao calcular.' }))
    throw new Error(body.error || 'Falha ao calcular.')
  }

  return response.json() as Promise<CalculationResult>
}
