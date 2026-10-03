import { RefreshCw, Route, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Ride } from '../lib/rides'
import { rideToInput } from '../lib/rides'
import { calculateDriverProfit, formatBRL } from '../utils/calculations'

type HistoryScreenProps = {
  rides: Ride[]
  loading: boolean
  error: string
  onRefresh: () => void
  onClear: () => Promise<boolean>
  clearing: boolean
  clearStatus: { type: 'success' | 'error'; message: string } | null
}

export function HistoryScreen({ rides, loading, error, onRefresh, onClear, clearing, clearStatus }: HistoryScreenProps) {
  const [confirmingClear, setConfirmingClear] = useState(false)
  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - 6)

  const weeklyRides = rides.filter((ride) => new Date(ride.created_at) >= weekStart)
  const weeklyProfit = weeklyRides.reduce((sum, ride) => sum + calculateDriverProfit(rideToInput(ride)).netValue, 0)
  const dailyProfit = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart)
    day.setDate(day.getDate() + index)
    return weeklyRides.reduce((sum, ride) => {
      const rideDay = new Date(ride.created_at)
      return rideDay.toDateString() === day.toDateString()
        ? sum + calculateDriverProfit(rideToInput(ride)).netValue
        : sum
    }, 0)
  })
  const highestDay = Math.max(1, ...dailyProfit.map((value) => Math.max(0, value)))

  return <section className="secondary-page history-page">
    <header className="secondary-heading"><div><p className="eyebrow">HISTÓRICO</p><h1>Suas jornadas,<br /><em>seus resultados.</em></h1><p>Confira o que cada dia deixou no seu bolso.</p></div><button className="history-filter" onClick={onRefresh} disabled={loading || clearing}><RefreshCw size={17} /> Atualizar</button></header>
    <section className="history-overview"><article><span>Lucro nos últimos 7 dias</span><strong>{formatBRL(weeklyProfit)}</strong><p>{weeklyRides.length} {weeklyRides.length === 1 ? 'jornada salva' : 'jornadas salvas'} nesse período</p></article><div className="mini-bars" aria-label="Lucro dos últimos 7 dias">{dailyProfit.map((value, index) => <i key={index} className={value > 0 ? 'active' : ''} style={{ height: `${Math.max(12, Math.max(0, value) / highestDay * 100)}%` }} />)}</div></section>
    <section className="history-list" aria-label="Lista de jornadas">
      <div className="history-list-head"><span>JORNADA</span><span>RECEITA</span><span>LUCRO LÍQUIDO</span><span /></div>
      {loading ? <div className="history-message">Carregando jornadas...</div> : error ? <div className="history-message error" role="alert">{error}</div> : rides.length === 0 ? <div className="history-message">Nenhuma jornada salva ainda. Faça um cálculo e toque em “Salvar jornada”.</div> : rides.map((ride) => {
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
    <section className="history-clear" aria-label="Apagar histórico">
      <div><strong>Zerar meu histórico</strong><p>Apaga todas as jornadas salvas nesta conta, sem afetar outros motoristas.</p></div>
      <button type="button" className="history-clear-button" disabled={loading || clearing || rides.length === 0} onClick={() => setConfirmingClear(true)}><Trash2 size={16} /> Zerar histórico</button>
    </section>
    {confirmingClear && <div className="history-confirm" role="group" aria-labelledby="history-confirm-title" aria-describedby="history-confirm-description">
      <strong id="history-confirm-title">Apagar todas as suas jornadas?</strong>
      <p id="history-confirm-description">Esta ação é permanente e não pode ser desfeita. Somente o histórico da sua conta será apagado.</p>
      <div className="history-confirm-actions">
        <button type="button" disabled={clearing} onClick={() => setConfirmingClear(false)}>Cancelar</button>
        <button type="button" className="history-confirm-delete" disabled={clearing} onClick={() => { void onClear().then((cleared) => { if (cleared) setConfirmingClear(false) }) }}>{clearing ? 'Apagando...' : 'Sim, apagar tudo'}</button>
      </div>
    </div>}
    {clearStatus && <p className={`history-clear-status ${clearStatus.type}`} role={clearStatus.type === 'error' ? 'alert' : 'status'}>{clearStatus.message}</p>}
  </section>
}
