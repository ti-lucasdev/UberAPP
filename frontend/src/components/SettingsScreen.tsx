import { CarFront, Check, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatBRL, maskCurrency, parseDecimal } from '../utils/calculations'

export function SettingsScreen({ weeklyRental, onSave }: { weeklyRental: number; onSave: (value: number) => void }) {
  const [rental, setRental] = useState(weeklyRental > 0 ? weeklyRental.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setRental(weeklyRental > 0 ? weeklyRental.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '')
  }, [weeklyRental])

  return <section className="secondary-page settings-page">
    <header className="secondary-heading"><div><p className="eyebrow">CONFIGURAÇÕES</p><h1>Seu custo fixo,<br /><em>no cálculo certo.</em></h1><p>Informe o valor semanal pago pelo aluguel do carro.</p></div><span className="settings-badge"><ShieldCheck size={18} /> Salvo neste aparelho</span></header>
    <section className="settings-layout rental-settings-layout">
      <article className="vehicle-preview rental-preview"><span className="vehicle-icon"><CarFront size={28} /></span><p>ALUGUEL SEMANAL</p><h2>{formatBRL(weeklyRental)}</h2><div><span>O relatório divide esse valor pelos dias rodados de cada semana.</span></div></article>
      <form className="settings-form rental-settings-form" onSubmit={(event) => { event.preventDefault(); onSave(parseDecimal(rental)); setSaved(true) }}>
        <div className="settings-form-head"><span><CarFront size={19} /></span><div><h2>Aluguel do carro</h2><p>Valor total cobrado por semana.</p></div></div>
        <label>Valor semanal<div className="rental-input"><i>R$</i><input inputMode="decimal" placeholder="0,00" value={rental} onChange={(event) => { setRental(maskCurrency(event.target.value)); setSaved(false) }} /><b>/ semana</b></div></label>
        <p className="rental-help">Exemplo: se o aluguel é R$ 700 e você rodou 5 dias na semana, o relatório considera R$ 140 por dia rodado.</p>
        <button className="save-settings" type="submit"><Check size={17} /> {saved ? 'Valor salvo' : 'Salvar aluguel'}</button>
      </form>
    </section>
  </section>
}
