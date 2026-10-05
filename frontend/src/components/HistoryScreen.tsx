import { CalendarSearch, RefreshCw, Route, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Ride } from '../lib/rides'
import { rideToInput } from '../lib/rides'
import { calculateDriverProfit, formatBRL } from '../utils/calculations'

type HistoryScreenProps = {
  rides: Ride[]
  loading: boolean
  error: string
  onRefresh: () => void
}

function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function timeInMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes()
}

function inputTimeInMinutes(value: string) {
  const [hours = '0', minutes = '0'] = value.split(':')
  return Number(hours) * 60 + Number(minutes)
}

export function HistoryScreen({ rides, loading, error, onRefresh }: HistoryScreenProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const filteredRides = useMemo(() => rides.filter((ride) => {
    const date = new Date(ride.created_at)
    const dateKey = localDateKey(date)
    const minutes = timeInMinutes(date)
    if (startDate && dateKey < startDate) return false
    if (endDate && dateKey > endDate) return false
    if (startTime && minutes < inputTimeInMinutes(startTime)) return false
    if (endTime && minutes > inputTimeInMinutes(endTime)) return false
    return true
  }), [rides, startDate, endDate, startTime, endTime])

  const totals = useMemo(() => filteredRides.reduce((sum, ride) => {
    const result = calculateDriverProfit(rideToInput(ride))
    return { gross: sum.gross + result.grossRevenue, net: sum.net + result.netValue }
  }, { gross: 0, net: 0 }), [filteredRides])

  const hasFilters = Boolean(startDate || endDate || startTime || endTime)
  const clearFilters = () => { setStartDate(''); setEndDate(''); setStartTime(''); setEndTime('') }

  return <section className="secondary-page history-page">
    <header className="secondary-heading"><div><p className="eyebrow">HISTÓRICO</p><h1>Suas jornadas,<br /><em>seus resultados.</em></h1><p>Pesquise por data e horário para conferir períodos anteriores.</p></div><button className="history-filter" onClick={onRefresh} disabled={loading}><RefreshCw size={17} /> Atualizar</button></header>

    <section className="history-search" aria-label="Filtrar histórico por data e horário">
      <div className="history-search-title"><CalendarSearch size={20} /><div><strong>Pesquisar período</strong><small>Preencha apenas os campos necessários.</small></div></div>
      <div className="history-search-fields">
        <label>Data inicial<input type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} /></label>
        <label>Hora inicial<input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label>
        <label>Data final<input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} /></label>
        <label>Hora final<input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label>
      </div>
      {hasFilters && <button className="history-clear-filters" type="button" onClick={clearFilters}><X size={15} /> Limpar filtros</button>}
    </section>

    <section className="history-overview">
      <article><span>{hasFilters ? 'Lucro no período pesquisado' : 'Lucro de todo o histórico'}</span><strong>{formatBRL(totals.net)}</strong><p>{filteredRides.length} {filteredRides.length === 1 ? 'jornada encontrada' : 'jornadas encontradas'}</p></article>
      <article className="history-gross-total"><span>Receita bruta</span><strong>{formatBRL(totals.gross)}</strong></article>
    </section>

    <section className="history-list" aria-label="Lista de jornadas">
      <div className="history-list-head"><span>JORNADA</span><span>RECEITA</span><span>LUCRO LÍQUIDO</span><span /></div>
      {loading ? <div className="history-message">Carregando jornadas...</div> : error ? <div className="history-message error" role="alert">{error}</div> : rides.length === 0 ? <div className="history-message">Nenhuma jornada salva ainda. Faça um cálculo para registrar sua primeira jornada.</div> : filteredRides.length === 0 ? <div className="history-message">Nenhuma jornada encontrada nesse período.</div> : filteredRides.map((ride) => {
        const input = rideToInput(ride)
        const result = calculateDriverProfit(input)
        const source = [input.uber > 0 && 'Uber', input.ninetyNine > 0 && '99', input.particular > 0 && 'Particular', input.inDriver > 0 && 'InDriver'].filter(Boolean).join(' + ') || 'Sem receitas'
        const day = new Date(ride.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        const km = input.kilometers.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
        return <article className="history-row" key={ride.id}>
          <div className="ride-main"><span className="ride-icon"><Route size={19} /></span><div><strong>{source}</strong><small>{day} · {km} km<b className="mobile-ride-profit"> · {formatBRL(result.netValue)}</b></small></div></div>
          <span className="ride-gross">{formatBRL(result.grossRevenue)}</span>
          <strong className="ride-net">{formatBRL(result.netValue)}</strong>
          <span aria-hidden="true" />
        </article>
      })}
    </section>
  </section>
}
