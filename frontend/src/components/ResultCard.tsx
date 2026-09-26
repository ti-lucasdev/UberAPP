import { BarChart3, Fuel, Info, Route } from 'lucide-react'
import type { CalculationResult } from '../types'
import { formatBRL } from '../utils/calculations'

export function ResultCard({ result, source, kilometers }: { result: CalculationResult; source: string; kilometers: number }) {
  return <aside className="result-card">
    <div className="result-top"><span className="result-kicker"><BarChart3 size={18} /> Resumo da jornada</span></div>
    <div className="gross-value"><h2>{source}</h2><strong>{formatBRL(result.grossRevenue)}</strong><span>valor bruto</span><img src="/assets/money-illustration.png" alt="Notas e moedas" /></div>
    <div className="result-rows">
      <div className="result-row"><span><i><Fuel size={17} /></i>Gasto com combustível</span><b>− {formatBRL(result.fuelCost)}</b></div>
      <div className="result-row"><span><i><Route size={17} /></i>Distância percorrida</span><b>{kilometers.toLocaleString('pt-BR')} km</b></div>
      <div className="result-row"><span><i><Route size={17} /></i>Custo por km</span><b>{formatBRL(result.costPerKilometer)} <small>/ km</small></b></div>
    </div>
    <div className="result-divider" />
    <div className="net-value"><span>Valor líquido</span><strong>{formatBRL(result.netValue)}</strong></div>
    <p className="liters-note"><Info size={15} /> {result.estimatedLiters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} litros estimados.</p>
  </aside>
}
