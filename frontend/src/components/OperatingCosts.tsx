import type { ReactNode } from 'react'
import { Fuel, Gauge, Route } from 'lucide-react'

type OperatingCostsProps = {
  kilometers: string
  fuelPrice: string
  vehicleAverage: string
  onKilometersChange: (value: string) => void
  onFuelPriceChange: (value: string) => void
  onAverageChange: (value: string) => void
}

export function OperatingCosts({ kilometers, fuelPrice, vehicleAverage, onKilometersChange, onFuelPriceChange, onAverageChange }: OperatingCostsProps) {
  const numericChange = (callback: (value: string) => void) => (value: string) => callback(value.replace(/[^0-9,]/g, ''))

  return <section>
    <div className="step-heading"><span className="step-number cost-step">⛽</span><div><h2>Custos da operação</h2></div><small>Passo 2 de 2</small></div>
    <div className="cost-grid">
      <Field label="KM rodado" icon={<Route size={18} />}><input value={kilometers} inputMode="decimal" onChange={(event) => numericChange(onKilometersChange)(event.target.value)} /><span>km</span></Field>
      <Field label="Valor do combustível" icon={<Fuel size={18} />}><i>R$</i><input value={fuelPrice} inputMode="numeric" onChange={(event) => onFuelPriceChange(event.target.value)} /><span>/ litro</span></Field>
      <Field label="Média do veículo" icon={<Gauge size={18} />} className="average-field"><input value={vehicleAverage} inputMode="decimal" onChange={(event) => numericChange(onAverageChange)(event.target.value)} /><span>km/L</span></Field>
    </div>
  </section>
}

function Field({ label, icon, className = '', children }: { label: string; icon: ReactNode; className?: string; children: ReactNode }) {
  return <label className={`cost-field ${className}`}><span className="cost-label">{label}</span><span className="cost-control"><b className="cost-icon">{icon}</b>{children}</span></label>
}
