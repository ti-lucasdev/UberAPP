import { ArrowUpRight, CalendarDays, ChevronRight, Route } from 'lucide-react'
import { formatBRL } from '../utils/calculations'

const rides = [
  { day: 'Hoje, 10:42', apps: 'Uber + Particular', km: '42 km', gross: 122, net: 99.51, status: 'Melhor resultado' },
  { day: 'Ontem, 18:16', apps: 'Uber + 99', km: '68 km', gross: 184, net: 142.2, status: 'Concluída' },
  { day: '21 de mai, 12:08', apps: '99 + InDriver', km: '51 km', gross: 151, net: 113.9, status: 'Concluída' },
]

export function HistoryScreen() {
  return <section className="secondary-page history-page">
    <header className="secondary-heading"><div><p className="eyebrow">HISTÓRICO</p><h1>Suas jornadas,<br /><em>seus resultados.</em></h1><p>Confira o que cada dia deixou no seu bolso.</p></div><button className="history-filter"><CalendarDays size={17} /> Últimos 7 dias</button></header>
    <section className="history-overview"><article><span>Lucro nos últimos 7 dias</span><strong>R$ 356,11</strong><p><ArrowUpRight size={15} /> 12% maior que a semana anterior</p></article><div className="mini-bars" aria-label="Gráfico de lucro semanal"><i /><i /><i /><i /><i className="active" /><i className="active" /><i className="active" /></div></section>
    <section className="history-list" aria-label="Lista de jornadas">
      <div className="history-list-head"><span>JORNADA</span><span>RECEITA</span><span>LUCRO LÍQUIDO</span><span /></div>
      {rides.map((ride) => <article className="history-row" key={ride.day}>
        <div className="ride-main"><span className="ride-icon"><Route size={19} /></span><div><strong>{ride.apps}</strong><small>{ride.day} · {ride.km}<b className="mobile-ride-profit"> · {formatBRL(ride.net)}</b></small></div></div>
        <span className="ride-gross">{formatBRL(ride.gross)}</span>
        <strong className="ride-net">{formatBRL(ride.net)} <small>{ride.status}</small></strong>
        <ChevronRight size={19} />
      </article>)}
    </section>
  </section>
}
