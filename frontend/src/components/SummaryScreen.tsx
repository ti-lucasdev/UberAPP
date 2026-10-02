import { ArrowUpRight, CarFront, CircleDollarSign, Fuel, Route, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import type { CalculationResult } from '../types'
import { formatBRL } from '../utils/calculations'

export function SummaryScreen({ result }: { result: CalculationResult }) {
  return <section className="secondary-page summary-page">
    <header className="secondary-heading"><div><p className="eyebrow">RESUMO</p><h1>Seu lucro<br /><em>em perspectiva.</em></h1><p>Uma visão simples do resultado que sua jornada trouxe.</p></div><span className="period-pill">Esta jornada <ArrowUpRight size={15} /></span></header>
    <div className="summary-layout">
      <article className="profit-hero"><div><span className="card-label">LUCRO LÍQUIDO ESTIMADO</span><strong>{formatBRL(result.netValue)}</strong><p><TrendingUp size={16} /> {result.grossRevenue > 0 ? Math.round((result.netValue / result.grossRevenue) * 100) : 0}% da receita ficou no bolso</p></div><img src="/assets/money-illustration.png" alt="Notas e moedas" /></article>
      <article className="journey-card"><span className="card-label">JORNADA ATUAL</span><h2>Você rodou com<br />resultado positivo.</h2><div className="journey-route"><i /><span>Saída</span><b>{result.estimatedLiters.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}L usados</b><span>Chegada</span><i /></div></article>
    </div>
    <section className="summary-metrics">
      <Metric icon={<CircleDollarSign />} label="Receita bruta" value={formatBRL(result.grossRevenue)} />
      <Metric icon={<Fuel />} label="Combustível" value={formatBRL(result.fuelCost)} />
      <Metric icon={<Route />} label="Valor por km" value={`${formatBRL(result.valuePerKilometer)}/km`} />
      <Metric icon={<CarFront />} label="Distância" value={`${result.kilometers.toLocaleString('pt-BR')} km`} />
    </section>
  </section>
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article className="summary-metric"><span>{icon}</span><p>{label}</p><strong>{value}</strong></article>
}
