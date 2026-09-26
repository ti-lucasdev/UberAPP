import { createServer } from 'node:http'
import { calculateRide, validateRideInput } from './calculations.mjs'

const port = Number(process.env.PORT) || 3001

const sendJson = (response, status, payload) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  })
  response.end(JSON.stringify(payload))
}

const server = createServer((request, response) => {
  if (request.method === 'OPTIONS') {
    return sendJson(response, 204, {})
  }

  if (request.method === 'GET' && request.url === '/api/health') {
    return sendJson(response, 200, { status: 'ok' })
  }

  if (request.method === 'POST' && request.url === '/api/calculos') {
    let rawBody = ''

    request.on('data', (chunk) => {
      rawBody += chunk
      if (rawBody.length > 1_000_000) request.destroy()
    })

    request.on('end', () => {
      try {
        const input = JSON.parse(rawBody || '{}')
        const validationError = validateRideInput(input)
        if (validationError) return sendJson(response, 400, { error: validationError })
        return sendJson(response, 200, calculateRide(input))
      } catch {
        return sendJson(response, 400, { error: 'JSON inválido.' })
      }
    })
    return
  }

  return sendJson(response, 404, { error: 'Rota não encontrada.' })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`API de cálculos disponível em http://localhost:${port}`)
})
