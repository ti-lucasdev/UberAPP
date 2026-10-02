import type { CalculationInput, CalculationResult } from '../types'

export function parseDecimal(value: string): number {
  const normalized = value.replace(/R\$|\s/g, '').replace(/\./g, '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return (Number(digits) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function calculateDriverProfit(input: CalculationInput): CalculationResult {
  const grossRevenue = input.uber + input.ninetyNine + input.particular + input.inDriver
  const estimatedLiters = input.vehicleAverage > 0 ? input.kilometers / input.vehicleAverage : 0
  const fuelCost = estimatedLiters * input.fuelPrice
  const valuePerKilometer = input.kilometers > 0 ? grossRevenue / input.kilometers : 0

  return { grossRevenue, kilometers: input.kilometers, estimatedLiters, fuelCost, valuePerKilometer, netValue: grossRevenue - fuelCost }
}
