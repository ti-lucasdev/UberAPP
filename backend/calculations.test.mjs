import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateRide, validateRideInput } from './calculations.mjs'

test('calcula o exemplo completo da planilha', () => {
  assert.deepEqual(calculateRide({
    uber: 200,
    ninetyNine: 100,
    particular: 0,
    inDriver: 0,
    kmRodado: 150,
    valorCombustivel: 3.5,
    mediaVeiculo: 7.5,
  }), {
    valorBruto: 300,
    valorKm: 2,
    litrosConsumidos: 20,
    valorCombustivelGasto: 70,
    valorLiquido: 230,
    lucroPercentual: 76.67,
  })
})

test('soma todas as quatro fontes de receita', () => {
  const result = calculateRide({
    uber: 100,
    ninetyNine: 50,
    particular: 25,
    inDriver: 75,
    kmRodado: 100,
    valorCombustivel: 5,
    mediaVeiculo: 10,
  })
  assert.equal(result.valorBruto, 250)
  assert.equal(result.valorLiquido, 200)
})

test('retorna zero nas divisões quando os divisores são zero', () => {
  const result = calculateRide({
    uber: 0,
    ninetyNine: 0,
    particular: 0,
    inDriver: 0,
    kmRodado: 0,
    valorCombustivel: 5,
    mediaVeiculo: 0,
  })
  assert.equal(result.valorKm, 0)
  assert.equal(result.valorCombustivelGasto, 0)
  assert.equal(result.lucroPercentual, 0)
})

test('rejeita números negativos', () => {
  const error = validateRideInput({
    uber: -1,
    ninetyNine: 0,
    particular: 0,
    inDriver: 0,
    kmRodado: 0,
    valorCombustivel: 0,
    mediaVeiculo: 0,
  })
  assert.match(error, /não pode ser negativo/)
})
