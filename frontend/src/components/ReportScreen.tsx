import { BarChart3, CalendarDays, CarFront, Fuel, Route, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Ride } from '../lib/rides'
import { formatBRL } from '../utils/calculations'
import { buildDriverReport } from '../utils/reports'
import type { ReportPeriod } from '../utils/reports'

type ReportScreenProps = {
  rides: Ride[]
  loading: boolean
  error: string
  weeklyRental: number
}

export function ReportScreen({ rides, loading, error, weeklyRental }: ReportScreenProps) {
  const [period, setPeriod] = useState<ReportPeriod>('weekly')
  const report = useMemo(() => buildDriverReport(rides, weeklyRental, period), [rides, weeklyRental, period])

  return <section className="secondary-page report-page">
    <header className="secondary-heading report-heading">
      <div><p className="eyebrow">RELATÓRIO</p><h1>Seus números,<br /><em>sem complicação.</em></h1><p>Receitas, custos e lucro real com o aluguel do carro já rateado.</p></div>
      <div className="report-period" role="group" aria-label="Período do relatório">
        <button className={period === 'weekly' ? 'active' : ''} onClick={() => setPeriod('weekly')}>Semanal</button>
        <button className={period === 'monthly' ? 'active' : ''} onClick={() => setPeriod('monthly')}>Mensal</button>
      </div>
    </header>

    {loading ? <div className="report-state">Carregando relatório...</div> : error ? <div className="report-state error" role="alert">{error}</div> : <>
      <section className="report-hero">
        <div><span>LUCRO LÍQUIDO DO PERÍODO</span><strong>{formatBRL(report.netValue)}</strong><p>{report.periodLabel} · {report.workedDays} {report.workedDays === 1 ? 'dia rodado' : 'dias rodados'}</p></div>
        <div className="report-hero-side"><CalendarDays size={21} /><span>Média por dia rodado</span><b>{formatBRL(report.averagePerWorkedDay)}</b></div>
      </section>

      <section className="report-metrics">
        <ReportMetric icon={<WalletCards />} label="Receita bruta" value={formatBRL(report.grossRevenue)} />
        <ReportMetric icon={<Fuel />} label="Combustível" value={`− ${formatBRL(report.fuelCost)}`} />
        <ReportMetric icon={<CarFront />} label="Aluguel rateado" value={`− ${formatBRL(report.rentalCost)}`} />
        <ReportMetric icon={<Route />} label="Distância" value={`${report.kilometers.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`} />
      </section>

      {weeklyRental <= 0 && <p className="report-rental-warning"><CarFront size={17} /> Defina o aluguel semanal em Configurações para incluí-lo no lucro líquido.</p>}

      <section className="report-days" aria-label="Resultados por dia">
        <div className="report-days-title"><div><BarChart3 size={20} /><span><strong>Resultado por dia</strong><small>O aluguel semanal é dividido somente entre os dias rodados.</small></span></div><b>{report.rides} {report.rides === 1 ? 'jornada' : 'jornadas'}</b></div>
        {report.days.length === 0 ? <div className="report-empty">Nenhuma jornada salva neste período.</div> : report.days.map((day) => <article className="report-day-row" key={day.key}>
          <div><strong>{day.date.toLocaleDateString('pt-BR', { weekday: 'long' })}</strong><small>{day.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} · {day.rides} {day.rides === 1 ? 'jornada' : 'jornadas'}</small></div>
          <span><small>Receita</small><b>{formatBRL(day.grossRevenue)}</b></span>
          <span><small>Aluguel/dia</small><b>− {formatBRL(day.rentalCost)}</b></span>
          <span className="report-day-net"><small>Líquido</small><b>{formatBRL(day.netValue)}</b></span>
        </article>)}
      </section>
    </>}
  </section>
}

function ReportMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article><span>{icon}</span><p>{label}</p><strong>{value}</strong></article>
}
