import { useState } from 'react'
import {
  ArrowRight,
  CarFront,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  Gauge,
  History,
  Info,
  LayoutDashboard,
  Percent,
  Plus,
  Route,
  Settings2,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'

type Screen = 'launch' | 'summary' | 'history' | 'settings'
type Ride = { platform: string; gross: number; net: number; distance: number; date: string }

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function App() {
  const [screen, setScreen] = useState<Screen>('launch')
  const [platform, setPlatform] = useState('Uber')
  const [grossValue, setGrossValue] = useState('99,00')
  const [distance, setDistance] = useState('42')
  const [fuelPrice, setFuelPrice] = useState('5,89')
  const [efficiency, setEfficiency] = useState('11')
  const [savedRides, setSavedRides] = useState<Ride[]>([])
  const [vehicleName, setVehicleName] = useState('Honda Civic 2020')
  const [defaultFuel, setDefaultFuel] = useState('5,89')
  const [defaultEfficiency, setDefaultEfficiency] = useState('11')
  const [notifications, setNotifications] = useState(true)

  const gross = Number(grossValue.replace(',', '.')) || 0
  const km = Number(distance.replace(',', '.')) || 0
  const fuel = Number(fuelPrice.replace(',', '.')) || 0
  const average = Number(efficiency.replace(',', '.')) || 1
  const fuelCost = (km / average) * fuel
  const net = gross - fuelCost
  const kmValue = km ? gross / km : 0
  const profit = gross ? (net / gross) * 100 : 0

  const saveRide = () => {
    setSavedRides((rides) => [{ platform, gross, net, distance: km, date: 'Hoje, 14:32' }, ...rides])
    setScreen('summary')
  }

  const clearForm = () => {
    setGrossValue('')
    setDistance('')
    setFuelPrice('')
    setEfficiency('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Route size={18} /></div><div><strong>giro</strong> certo<span>!</span><small>CONTA DE VERDADE</small></div></div>
        <nav className="nav-list" aria-label="Navegação principal">
          <button className={screen === 'launch' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('launch')}><LayoutDashboard size={18} /> Nova corrida</button>
          <button className={screen === 'summary' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('summary')}><TrendingUp size={18} /> Resumo</button>
          <button className={screen === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('history')}><History size={18} /> Histórico <span className="nav-count">{savedRides.length}</span></button>
        </nav>
        <div className="sidebar-bottom"><button className={screen === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('settings')}><Settings2 size={18} /> Configurações</button><div className="sidebar-tip"><span>PROTÓTIPO</span><p>Seu controle,<br /><b>sem complicação.</b></p></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="eyebrow">GIRO CERTO <span>/</span> TERÇA, 24 JUN</div><div className="topbar-right"><span className="status-dot" /> <span>salvo no aparelho</span><div className="avatar">MC</div></div></header>
        {screen === 'launch' && <LaunchScreen {...{ platform, setPlatform, grossValue, setGrossValue, distance, setDistance, fuelPrice, setFuelPrice, efficiency, setEfficiency, gross, km, fuelCost, net, kmValue, clearForm, saveRide }} />}
        {screen === 'summary' && <SummaryScreen {...{ platform, gross, net, km, fuelCost, kmValue, profit, setScreen }} />}
        {screen === 'history' && <HistoryScreen rides={savedRides} setScreen={setScreen} />}
        {screen === 'settings' && <SettingsScreen {...{ vehicleName, setVehicleName, defaultFuel, setDefaultFuel, defaultEfficiency, setDefaultEfficiency, notifications, setNotifications, setScreen }} />}
      </main>
    </div>
  )
}

type LaunchProps = { platform: string; setPlatform: (value: string) => void; grossValue: string; setGrossValue: (value: string) => void; distance: string; setDistance: (value: string) => void; fuelPrice: string; setFuelPrice: (value: string) => void; efficiency: string; setEfficiency: (value: string) => void; gross: number; km: number; fuelCost: number; net: number; kmValue: number; clearForm: () => void; saveRide: () => void }

function LaunchScreen(props: LaunchProps) {
  const { platform, setPlatform, grossValue, setGrossValue, distance, setDistance, fuelPrice, setFuelPrice, efficiency, setEfficiency, gross, km, fuelCost, net, kmValue, clearForm, saveRide } = props
  return <section className="page-wrap"><div className="page-heading"><div><p className="section-kicker">NOVA CORRIDA <span className="live-pill">● agora</span></p><h1>Quanto caiu<br /><em>no bolso?</em></h1><p className="heading-copy">Anota rapidinho. Depois a gente mostra<br />o que realmente valeu a pena.</p></div><div className="heading-date">TERÇA-FEIRA<br /><b>24 JUN 2025</b></div></div>
    <div className="form-layout"><div className="card form-card"><div className="card-heading"><div><span className="overline">PASSO 01</span><h2>Origem do ganho</h2></div><span className="progress">1 <i>/</i> 2</span></div><div className="platform-grid">{['Uber', '99', 'Particular', 'Indriver'].map((item) => <button key={item} className={platform === item ? 'platform selected' : 'platform'} onClick={() => setPlatform(item)}><span className={`platform-dot ${item === '99' ? 'ninety-nine' : item.toLowerCase()}`} />{item}{platform === item && <Check className="check" size={14} />}</button>)}</div><div className="field"><label htmlFor="gross">Valor bruto recebido</label><div className="input-wrap currency-input"><span>R$</span><input id="gross" placeholder="0,00" value={grossValue} onChange={(e) => setGrossValue(e.target.value)} /><small>BRL</small></div></div><div className="card-heading second"><div><span className="overline">PASSO 02</span><h2>Custos da operação</h2></div></div><div className="fields-row"><div className="field"><label htmlFor="distance">Km rodado</label><div className="input-wrap"><input id="distance" placeholder="0" value={distance} onChange={(e) => setDistance(e.target.value)} /><span>km</span></div></div><div className="field"><label htmlFor="fuel">Combustível</label><div className="input-wrap"><span>R$</span><input id="fuel" placeholder="0,00" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} /><span>/ litro</span></div></div></div><div className="field"><label htmlFor="efficiency">Média do veículo <span className="label-hint">km por litro</span></label><div className="input-wrap"><input id="efficiency" placeholder="0" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} /><span>km/L</span></div></div><div className="form-actions"><button className="clear-button" onClick={clearForm}><X size={15} /> limpar</button><button className="primary-button" onClick={saveRide}>Salvar corrida <ArrowRight size={17} /></button></div></div>
      <aside className="live-card"><div className="live-label"><span className="pulse" /> ESTIMATIVA</div><div className="live-head"><p>{platform}</p><span>AGORA</span></div><div className="live-total">{currency(gross)}<small>valor bruto</small></div><div className="live-line"><span><CarFront size={15} /> combustível</span><b>- {currency(fuelCost)}</b></div><div className="live-line"><span><Route size={15} /> {distance || '0'} km</span><b>{currency(kmValue)}<small>/ km</small></b></div><div className="live-divider" /><div className="live-net"><span>valor líquido</span><b>{currency(net)}</b></div><p className="tip"><Info size={14} /> Atualizado conforme você preenche.</p></aside></div></section>
}

type SummaryProps = { platform: string; gross: number; net: number; km: number; fuelCost: number; kmValue: number; profit: number; setScreen: (screen: Screen) => void }
function SummaryScreen({ platform, gross, net, km, fuelCost, kmValue, profit, setScreen }: SummaryProps) {
  return <section className="page-wrap summary-page"><button className="back-button" onClick={() => setScreen('launch')}><ChevronLeft size={17} /> voltar para o lançamento</button><div className="page-heading"><div><p className="section-kicker">FECHAMENTO DA CORRIDA</p><h1>Agora faz<br /><em>sentido.</em></h1><p className="heading-copy">O número que interessa está aqui:<br />o que sobrou depois de rodar.</p></div><div className="summary-badge"><Check size={15} /> anotado</div></div><div className="summary-grid"><div className="card highlight-card"><div className="summary-top"><span className="summary-icon"><Wallet size={19} /></span><span className="platform-tag">{platform}</span></div><p>DEU NO BOLSO</p><strong>{currency(net)}</strong><div className="growth"><TrendingUp size={14} /> {profit.toFixed(1).replace('.', ',')}% limpo</div></div><div className="metrics-card card"><Metric icon={<CircleDollarSign />} label="Entrou" value={currency(gross)} /><Metric icon={<Route />} label="Rendeu por km" value={currency(kmValue)} /><Metric icon={<CarFront />} label="Foi para o tanque" value={currency(fuelCost)} /><Metric icon={<Percent />} label="Sobrou em %" value={`${profit.toFixed(1).replace('.', ',')}%`} positive /></div></div><div className="bottom-note"><div><span className="note-icon"><Info size={16} /></span><div><b>Você rodou {km} km</b><p>O combustível levou {currency(fuelCost)} desta corrida.</p></div></div><button className="outline-button" onClick={() => setScreen('launch')}><Plus size={16} /> outra corrida</button></div></section>
}

function HistoryScreen({ rides, setScreen }: { rides: Ride[]; setScreen: (screen: Screen) => void }) {
  return <section className="page-wrap history-page"><div className="history-heading"><div><p className="section-kicker">ATIVIDADE RECENTE</p><h1>Seu histórico<br /><em>de ganhos.</em></h1></div><button className="primary-button small" onClick={() => setScreen('launch')}><Plus size={16} /> Nova corrida</button></div>{rides.length === 0 ? <div className="empty-state card"><span className="empty-icon"><Clock3 size={22} /></span><h2>Nenhuma corrida salva ainda</h2><p>Registre sua primeira corrida para acompanhar seus ganhos por aqui.</p><button className="outline-button" onClick={() => setScreen('launch')}>Começar agora <ArrowRight size={16} /></button></div> : <div className="history-list">{rides.map((ride, index) => <div className="history-row card" key={`${ride.date}-${index}`}><div className="history-platform"><span className={`platform-dot ${ride.platform === '99' ? 'ninety-nine' : ride.platform.toLowerCase()}`} /><div><b>{ride.platform}</b><small>{ride.date} · {ride.distance} km</small></div></div><div className="history-values"><span><small>bruto</small>{currency(ride.gross)}</span><strong><small>líquido</small>{currency(ride.net)}</strong><Check size={16} /></div></div>)}</div>}</section>
}

type SettingsProps = { vehicleName: string; setVehicleName: (value: string) => void; defaultFuel: string; setDefaultFuel: (value: string) => void; defaultEfficiency: string; setDefaultEfficiency: (value: string) => void; notifications: boolean; setNotifications: (value: boolean) => void; setScreen: (screen: Screen) => void }
function SettingsScreen({ vehicleName, setVehicleName, defaultFuel, setDefaultFuel, defaultEfficiency, setDefaultEfficiency, notifications, setNotifications, setScreen }: SettingsProps) {
  return <section className="page-wrap settings-page"><div className="page-heading"><div><p className="section-kicker">PREFERÊNCIAS</p><h1>Deixe do<br /><em>seu jeito.</em></h1><p className="heading-copy">Ajuste os padrões para gastar menos tempo<br />preenchendo cada corrida.</p></div><div className="settings-mark"><Settings2 size={21} /></div></div><div className="settings-layout"><div className="settings-main"><section className="settings-section card"><div className="settings-title"><span className="settings-icon"><CarFront size={17} /></span><div><h2>Meu veículo</h2><p>Usamos esses dados nos cálculos automáticos.</p></div></div><div className="settings-fields"><div className="field"><label htmlFor="vehicle">Nome do veículo</label><div className="input-wrap"><input id="vehicle" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} /></div></div><div className="field"><label htmlFor="default-fuel">Preço padrão do combustível</label><div className="input-wrap"><span>R$</span><input id="default-fuel" value={defaultFuel} onChange={(e) => setDefaultFuel(e.target.value)} /><span>/ litro</span></div></div><div className="field"><label htmlFor="default-efficiency">Média de consumo</label><div className="input-wrap"><input id="default-efficiency" value={defaultEfficiency} onChange={(e) => setDefaultEfficiency(e.target.value)} /><span>km/L</span></div></div></div><button className="save-settings" onClick={() => setScreen('launch')}><Check size={15} /> Salvo neste dispositivo</button></section><section className="settings-section card"><div className="settings-title"><span className="settings-icon"><Wallet size={17} /></span><div><h2>Preferências gerais</h2><p>Escolha como o Rota Pop se comporta.</p></div></div><div className="setting-toggle"><div><b>Lembrete de fechamento</b><p>Avise quando houver corridas não revisadas.</p></div><button className={notifications ? 'switch on' : 'switch'} aria-label="Ativar lembretes" onClick={() => setNotifications(!notifications)}><span /></button></div></section></div><aside className="settings-aside"><div className="settings-summary"><span className="summary-icon"><Gauge size={19} /></span><p>CONFIGURAÇÃO ATIVA</p><strong>{vehicleName}</strong><div><span>consumo médio</span><b>{defaultEfficiency} km/L</b></div><div><span>combustível</span><b>R$ {defaultFuel}/L</b></div></div><div className="settings-note"><Info size={16} /><p>As configurações ficam salvas apenas neste navegador enquanto o protótipo estiver aberto.</p></div></aside></div></section>
}

function Metric({ icon, label, value, positive = false }: { icon: React.ReactNode; label: string; value: string; positive?: boolean }) { return <div className="metric"><span className="metric-icon">{icon}</span><div><p>{label}</p><strong className={positive ? 'positive' : ''}>{value}</strong></div></div> }
export default App
