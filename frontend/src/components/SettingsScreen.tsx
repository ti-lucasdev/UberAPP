import { Bell, Car, Check, Fuel, Gauge, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

export function SettingsScreen() {
  const [vehicle, setVehicle] = useState('Meu veículo')
  const [fuel, setFuel] = useState('5,89')
  const [average, setAverage] = useState('11')
  const [saved, setSaved] = useState(false)

  return <section className="secondary-page settings-page">
    <header className="secondary-heading"><div><p className="eyebrow">CONFIGURAÇÕES</p><h1>Do seu jeito,<br /><em>do seu giro.</em></h1><p>Prévia dos dados do veículo para uma próxima etapa.</p></div><span className="settings-badge"><ShieldCheck size={18} /> Prévia nesta tela</span></header>
    <section className="settings-layout">
      <article className="vehicle-preview"><span className="vehicle-icon"><Car size={28} /></span><p>VEÍCULO ATIVO</p><h2>{vehicle || 'Meu veículo'}</h2><div><span><Fuel size={16} /> Combustível <small className="mobile-preview-value">R$ {fuel}/L</small></span><b>R$ {fuel}/L</b></div><div><span><Gauge size={16} /> Consumo médio <small className="mobile-preview-value">{average} km/L</small></span><b>{average} km/L</b></div></article>
      <form className="settings-form" onSubmit={(event) => { event.preventDefault(); setSaved(true) }}>
        <div className="settings-form-head"><span><Car size={19} /></span><div><h2>Dados do veículo</h2><p>Esses dados ainda não são salvos no banco.</p></div></div>
        <label>Nome do veículo<input value={vehicle} onChange={(event) => { setVehicle(event.target.value); setSaved(false) }} /></label>
        <div className="settings-fields"><label>Preço do combustível<div><i>R$</i><input value={fuel} onChange={(event) => { setFuel(event.target.value); setSaved(false) }} /><b>/ litro</b></div></label><label>Média do veículo<div><input value={average} onChange={(event) => { setAverage(event.target.value); setSaved(false) }} /><b>km/L</b></div></label></div>
        <div className="notification-row"><span><Bell size={18} /></span><div><strong>Lembrete de jornada</strong><p>Receba um lembrete para calcular seu lucro.</p></div><button type="button" className="toggle on" aria-label="Lembrete ativo"><i /></button></div>
        <button className="save-settings" type="submit"><Check size={17} /> {saved ? 'Prévia atualizada' : 'Atualizar prévia'}</button>
      </form>
    </section>
  </section>
}
