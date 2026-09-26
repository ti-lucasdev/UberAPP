export type RevenueKey = 'uber' | 'ninetyNine' | 'particular' | 'inDriver'

export type RevenueValues = Record<RevenueKey, string>

export type CalculationInput = {
  uber: number
  ninetyNine: number
  particular: number
  inDriver: number
  kilometers: number
  fuelPrice: number
  vehicleAverage: number
}

export type CalculationResult = {
  grossRevenue: number
  estimatedLiters: number
  fuelCost: number
  costPerKilometer: number
  netValue: number
}
