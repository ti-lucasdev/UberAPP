const round = (value, precision = 2) => {
  const factor = 10 ** precision
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function calculateRide(input) {
  const uber = input.uber
  const ninetyNine = input.ninetyNine
  const particular = input.particular
  const inDriver = input.inDriver
  const kmRodado = input.kmRodado
  const valorCombustivel = input.valorCombustivel
  const mediaVeiculo = input.mediaVeiculo

  const valorBrutoRaw = uber + ninetyNine + particular + inDriver
  const valorKmRaw = kmRodado === 0 ? 0 : valorBrutoRaw / kmRodado
  const litrosConsumidosRaw = mediaVeiculo === 0 ? 0 : kmRodado / mediaVeiculo
  const valorCombustivelGastoRaw = litrosConsumidosRaw * valorCombustivel
  const valorLiquidoRaw = valorBrutoRaw - valorCombustivelGastoRaw
  const lucroPercentualRaw = valorBrutoRaw === 0 ? 0 : (valorLiquidoRaw / valorBrutoRaw) * 100

  return {
    valorBruto: round(valorBrutoRaw),
    valorKm: round(valorKmRaw),
    litrosConsumidos: round(litrosConsumidosRaw),
    valorCombustivelGasto: round(valorCombustivelGastoRaw),
    valorLiquido: round(valorLiquidoRaw),
    lucroPercentual: round(lucroPercentualRaw),
  }
}

export function validateRideInput(input) {
  const fields = ['uber', 'ninetyNine', 'particular', 'inDriver', 'kmRodado', 'valorCombustivel', 'mediaVeiculo']

  if (!input || typeof input !== 'object') {
    return 'O corpo da requisição deve ser um objeto JSON.'
  }

  for (const field of fields) {
    if (typeof input[field] !== 'number' || !Number.isFinite(input[field])) {
      return `O campo "${field}" deve ser um número válido.`
    }
    if (input[field] < 0) {
      return `O campo "${field}" não pode ser negativo.`
    }
  }

  return null
}
