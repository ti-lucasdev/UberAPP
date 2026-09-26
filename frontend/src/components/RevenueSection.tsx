import { UserRound } from 'lucide-react'
import type { RevenueKey, RevenueValues } from '../types'
import { RevenueInput } from './RevenueInput'

type RevenueSectionProps = {
  values: RevenueValues
  onChange: (key: RevenueKey, value: string) => void
}

export function RevenueSection({ values, onChange }: RevenueSectionProps) {
  return <section>
    <div className="step-heading"><span className="step-number">$</span><div><h2>Receitas da jornada</h2></div><small>Passo 1 de 2</small></div>
    <div className="revenue-grid">
      <RevenueInput id="uber" label="Uber" value={values.uber} onChange={onChange} logo={<b>Uber</b>} />
      <RevenueInput id="ninetyNine" label="99" value={values.ninetyNine} onChange={onChange} logo={<b>99</b>} />
      <RevenueInput id="particular" label="Particular" value={values.particular} onChange={onChange} logo={<UserRound size={21} />} />
      <RevenueInput id="inDriver" label="InDriver" value={values.inDriver} onChange={onChange} logo={<b>iD</b>} />
    </div>
  </section>
}
