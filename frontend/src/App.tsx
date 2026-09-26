import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
import { emptyCalculation, requestCalculation, type CalculationInput, type CalculationResult } from './api'

type Screen = 'launch' | 'summary' | 'history' | 'settings'
type RevenueKey = 'uber' | 'ninetyNine' | 'particular' | 'inDriver'
type RevenueForm = Record<RevenueKey, string>
type Ride = CalculationResult & { sources: string; distance: number; date: string }

const revenueOptions: { key: RevenueKey; label: string; dotClass: string }[] = [
  { key: 'uber', label: 'Uber', dotClass: 'uber' },
  { key: 'ninetyNine', label: '99', dotClass: 'ninety-nine' },
  { key: 'particular', label: 'Particular', dotClass: 'particular' },
  { key: 'inDriver', label: 'InDriver', dotClass: 'indriver' },
]

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const decimal = (value: string) => {
  const normalized = value.trim().replace(/R\$|\s/g, '')
  const parsed = normalized.includes(',')
    ? Number(normalized.replace(/\./g, '').replace(',', '.'))
    : Number(normalized)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function App() {
  const [screen, setScreen] = useState<Screen>('launch')
  const [revenues, setRevenues] = useState<RevenueForm>({ uber: '99,00', ninetyNine: '', particular: '', inDriver: '' })
  const [distance, setDistance] = useState('42')
  const [fuelPrice, setFuelPrice] = useState('5,89')
  const [efficiency, setEfficiency] = useState('11')
  const [calculation, setCalculation] = useState<CalculationResult>(emptyCalculation)
  const [calculationError, setCalculationError] = useState('')
  const [isCalculating, setIsCalculating] = useState(true)
  const [savedRides, setSavedRides] = useState<Ride[]>([])
  const [vehicleName, setVehicleName] = useState('Honda Civic 2020')
  const [defaultFuel, setDefaultFuel] = useState('5,89')
  const [defaultEfficiency, setDefaultEfficiency] = useState('11')
  const [notifications, setNotifications] = useState(true)

  const input = useMemo<CalculationInput>(() => ({
    uber: decimal(revenues.uber),
    ninetyNine: decimal(revenues.ninetyNine),
    particular: decimal(revenues.particular),
    inDriver: decimal(revenues.inDriver),
    kmRodado: decimal(distance),
    valorCombustivel: decimal(fuelPrice),
    mediaVeiculo: decimal(efficiency),
  }), [revenues, distance, fuelPrice, efficiency])

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsCalculating(true)
      try {
        setCalculation(await requestCalculation(input, controller.signal))
        setCalculationError('')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setCalculationError(error instanceof Error ? error.message : 'Não foi possível calcular.')
      } finally {
        if (!controller.signal.aborted) setIsCalculating(false)
      }
    }, 120)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [input])

  const sources = revenueOptions.filter(({ key }) => input[key] > 0).map(({ label }) => label).join(' + ') || 'Sem receita'

  const setRevenue = (key: RevenueKey, value: string) => {
    setRevenues((current) => ({ ...current, [key]: value }))
  }

  const saveRide = () => {
    if (calculationError || isCalculating) return
    setSavedRides((rides) => [{
      ...calculation,
      sources,
      distance: input.kmRodado,
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    }, ...rides])
    setScreen('summary')
  }

  const clearForm = () => {
    setRevenues({ uber: '', ninetyNine: '', particular: '', inDriver: '' })
    setDistance('')
    setFuelPrice('')
    setEfficiency('')
  }

  const saveSettings = () => {
    setFuelPrice(defaultFuel)
    setEfficiency(defaultEfficiency)
    setScreen('launch')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Route size={18} /></div><div><strong>giro</strong> certo<span>!</span><small>CONTA DE VERDADE</small></div></div>
        <nav className="nav-list" aria-label="Navegação principal">
          <button className={screen === 'launch' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('launch')}><LayoutDashboard size={18} /> Nova jornada</button>
          <button className={screen === 'summary' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('summary')}><TrendingUp size={18} /> Resumo</button>
          <button className={screen === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('history')}><History size={18} /> Histórico <span className="nav-count">{savedRides.length}</span></button>
        </nav>
        <div className="sidebar-bottom"><button className={screen === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => setScreen('settings')}><Settings2 size={18} /> Configurações</button><div className="sidebar-tip"><span>CONTROLE</span><p>Seu resultado,<br /><b>sem complicação.</b></p></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="eyebrow">GIRO CERTO <span>/</span> CONTROLE DIÁRIO</div><div className="topbar-right"><span className={calculationError ? 'status-dot error' : 'status-dot'} /> <span>{calculationError ? 'API desconectada' : isCalculating ? 'calculando...' : 'cálculo atualizado'}</span><div className="avatar">GC</div></div></header>
        {screen === 'launch' && <LaunchScreen {...{ revenues, setRevenue, distance, setDistance, fuelPrice, setFuelPrice, efficiency, setEfficiency, calculation, calculationError, isCalculating, sources, clearForm, saveRide }} />}
        {screen === 'summary' && <SummaryScreen {...{ sources, calculation, km: input.kmRodado, setScreen }} />}
        {screen === 'history' && <HistoryScreen rides={savedRides} setScreen={setScreen} />}
        {screen === 'settings' && <SettingsScreen {...{ vehicleName, setVehicleName, defaultFuel, setDefaultFuel, defaultEfficiency, setDefaultEfficiency, notifications, setNotifications, saveSettings }} />}
      </main>
    </div>
  )
}

type LaunchProps = {
  revenues: RevenueForm
  setRevenue: (key: RevenueKey, value: string) => void
  distance: string
  setDistance: (value: string) => void
  fuelPrice: string
  setFuelPrice: (value: string) => void
  efficiency: string
  setEfficiency: (value: string) => void
  calculation: CalculationResult
  calculationError: string
  isCalculating: boolean
  sources: string
  clearForm: () => void
  saveRide: () => void
}

function LaunchScreen({ revenues, setRevenue, distance, setDistance, fuelPrice, setFuelPrice, efficiency, setEfficiency, calculation, calculationError, isCalculating, sources, clearForm, saveRide }: LaunchProps) {
  return <section className="page-wrap"><div className="page-heading"><div><p className="section-kicker">NOVA JORNADA <span className="live-pill">● agora</span></p><h1>Quanto caiu<br /><em>no bolso?</em></h1><p className="heading-copy">Informe todas as receitas do período.<br />O resultado é calculado pelo servidor.</p></div><div className="heading-date">CÁLCULO<br /><b>AUTOMÁTICO</b></div></div>
    <div className="form-layout"><div className="card form-card"><div className="card-heading"><div><span className="overline">PASSO 01</span><h2>Receitas de transporte</h2></div><span className="progress">1 <i>/</i> 2</span></div><div className="revenue-grid">{revenueOptions.map((item) => <div className="field revenue-field" key={item.key}><label htmlFor={item.key}><span className={`platform-dot ${item.dotClass}`} />{item.label}</label><div className="input-wrap"><span>R$</span><input id={item.key} inputMode="decimal" placeholder="0,00" value={revenues[item.key]} onChange={(event) => setRevenue(item.key, event.target.value)} /></div></div>)}</div><div className="card-heading second"><div><span className="overline">PASSO 02</span><h2>Custos da operação</h2></div></div><div className="fields-row"><div className="field"><label htmlFor="distance">Km rodado</label><div className="input-wrap"><input id="distance" inputMode="decimal" placeholder="0" value={distance} onChange={(event) => setDistance(event.target.value)} /><span>km</span></div></div><div className="field"><label htmlFor="fuel">Valor do combustível</label><div className="input-wrap"><span>R$</span><input id="fuel" inputMode="decimal" placeholder="0,00" value={fuelPrice} onChange={(event) => setFuelPrice(event.target.value)} /><span>/ litro</span></div></div></div><div className="field"><label htmlFor="efficiency">Média do veículo <span className="label-hint">km por litro</span></label><div className="input-wrap"><input id="efficiency" inputMode="decimal" placeholder="0" value={efficiency} onChange={(event) => setEfficiency(event.target.value)} /><span>km/L</span></div></div>{calculationError && <p className="calculation-error"><Info size={14} /> {calculationError}</p>}<div className="form-actions"><button className="clear-button" onClick={clearForm}><X size={15} /> limpar</button><button className="primary-button" disabled={Boolean(calculationError) || isCalculating} onClick={saveRide}>Salvar jornada <ArrowRight size={17} /></button></div></div>
      <aside className="live-card"><div className="live-label"><span className="pulse" /> {isCalculating ? 'CALCULANDO' : 'ESTIMATIVA DA API'}</div><div className="live-head"><p>{sources}</p><span>AGORA</span></div><div className="live-total">{currency(calculation.valorBruto)}<small>valor bruto</small></div><div className="live-line"><span><CarFront size={15} /> combustível</span><b>- {currency(calculation.valorCombustivelGasto)}</b></div><div className="live-line"><span><Route size={15} /> {distance || '0'} km</span><b>{currency(calculation.valorKm)}<small>/ km</small></b></div><div className="live-divider" /><div className="live-net"><span>valor líquido</span><b>{currency(calculation.valorLiquido)}</b></div><p className="tip"><Info size={14} /> {calculation.litrosConsumidos.toLocaleString('pt-BR')} litros estimados.</p></aside></div></section>
}

function SummaryScreen({ sources, calculation, km, setScreen }: { sources: string; calculation: CalculationResult; km: number; setScreen: (screen: Screen) => void }) {
  return <section className="page-wrap summary-page"><button className="back-button" onClick={() => setScreen('launch')}><ChevronLeft size={17} /> voltar para o lançamento</button><div className="page-heading"><div><p className="section-kicker">FECHAMENTO DA JORNADA</p><h1>Agora faz<br /><em>sentido.</em></h1><p className="heading-copy">O número que interessa está aqui:<br />o que sobrou depois de rodar.</p></div><div className="summary-badge"><Check size={15} /> calculado</div></div><div className="summary-grid"><div className="card highlight-card"><div className="summary-top"><span className="summary-icon"><Wallet size={19} /></span><span className="platform-tag">{sources}</span></div><p>DEU NO BOLSO</p><strong>{currency(calculation.valorLiquido)}</strong><div className="growth"><TrendingUp size={14} /> {calculation.lucroPercentual.toLocaleString('pt-BR')}% limpo</div></div><div className="metrics-card card"><Metric icon={<CircleDollarSign />} label="Valor bruto" value={currency(calculation.valorBruto)} /><Metric icon={<Route />} label="Valor por km" value={currency(calculation.valorKm)} /><Metric icon={<CarFront />} label="Combustível gasto" value={currency(calculation.valorCombustivelGasto)} /><Metric icon={<Percent />} label="Lucro" value={`${calculation.lucroPercentual.toLocaleString('pt-BR')}%`} positive /></div></div><div className="bottom-note"><div><span className="note-icon"><Info size={16} /></span><div><b>Você rodou {km.toLocaleString('pt-BR')} km</b><p>Consumo estimado de {calculation.litrosConsumidos.toLocaleString('pt-BR')} L, custando {currency(calculation.valorCombustivelGasto)}.</p></div></div><button className="outline-button" onClick={() => setScreen('launch')}><Plus size={16} /> outra jornada</button></div></section>
}

function HistoryScreen({ rides, setScreen }: { rides: Ride[]; setScreen: (screen: Screen) => void }) {
  return <section className="page-wrap history-page"><div className="history-heading"><div><p className="section-kicker">ATIVIDADE RECENTE</p><h1>Seu histórico<br /><em>de ganhos.</em></h1></div><button className="primary-button small" onClick={() => setScreen('launch')}><Plus size={16} /> Nova jornada</button></div>{rides.length === 0 ? <div className="empty-state card"><span className="empty-icon"><Clock3 size={22} /></span><h2>Nenhuma jornada salva ainda</h2><p>Registre seus ganhos para acompanhar os resultados por aqui.</p><button className="outline-button" onClick={() => setScreen('launch')}>Começar agora <ArrowRight size={16} /></button></div> : <div className="history-list">{rides.map((ride, index) => <div className="history-row card" key={`${ride.date}-${index}`}><div className="history-platform"><span className="platform-dot uber" /><div><b>{ride.sources}</b><small>{ride.date} · {ride.distance.toLocaleString('pt-BR')} km</small></div></div><div className="history-values"><span><small>bruto</small>{currency(ride.valorBruto)}</span><strong><small>líquido</small>{currency(ride.valorLiquido)}</strong><Check size={16} /></div></div>)}</div>}</section>
}

type SettingsProps = { vehicleName: string; setVehicleName: (value: string) => void; defaultFuel: string; setDefaultFuel: (value: string) => void; defaultEfficiency: string; setDefaultEfficiency: (value: string) => void; notifications: boolean; setNotifications: (value: boolean) => void; saveSettings: () => void }
function SettingsScreen({ vehicleName, setVehicleName, defaultFuel, setDefaultFuel, defaultEfficiency, setDefaultEfficiency, notifications, setNotifications, saveSettings }: SettingsProps) {
  return <section className="page-wrap settings-page"><div className="page-heading"><div><p className="section-kicker">PREFERÊNCIAS</p><h1>Deixe do<br /><em>seu jeito.</em></h1><p className="heading-copy">Ajuste os padrões para gastar menos tempo<br />preenchendo cada jornada.</p></div><div className="settings-mark"><Settings2 size={21} /></div></div><div className="settings-layout"><div className="settings-main"><section className="settings-section card"><div className="settings-title"><span className="settings-icon"><CarFront size={17} /></span><div><h2>Meu veículo</h2><p>Usamos esses dados nos cálculos automáticos.</p></div></div><div className="settings-fields"><div className="field"><label htmlFor="vehicle">Nome do veículo</label><div className="input-wrap"><input id="vehicle" value={vehicleName} onChange={(event) => setVehicleName(event.target.value)} /></div></div><div className="field"><label htmlFor="default-fuel">Preço padrão do combustível</label><div className="input-wrap"><span>R$</span><input id="default-fuel" inputMode="decimal" value={defaultFuel} onChange={(event) => setDefaultFuel(event.target.value)} /><span>/ litro</span></div></div><div className="field"><label htmlFor="default-efficiency">Média de consumo</label><div className="input-wrap"><input id="default-efficiency" inputMode="decimal" value={defaultEfficiency} onChange={(event) => setDefaultEfficiency(event.target.value)} /><span>km/L</span></div></div></div><button className="save-settings" onClick={saveSettings}><Check size={15} /> Usar estes valores</button></section><section className="settings-section card"><div className="settings-title"><span className="settings-icon"><Wallet size={17} /></span><div><h2>Preferências gerais</h2><p>Escolha como o Giro Certo se comporta.</p></div></div><div className="setting-toggle"><div><b>Lembrete de fechamento</b><p>Avise quando houver jornadas não revisadas.</p></div><button className={notifications ? 'switch on' : 'switch'} aria-label="Ativar lembretes" onClick={() => setNotifications(!notifications)}><span /></button></div></section></div><aside className="settings-aside"><div className="settings-summary"><span className="summary-icon"><Gauge size={19} /></span><p>CONFIGURAÇÃO ATIVA</p><strong>{vehicleName}</strong><div><span>consumo médio</span><b>{defaultEfficiency} km/L</b></div><div><span>combustível</span><b>R$ {defaultFuel}/L</b></div></div><div className="settings-note"><Info size={16} /><p>Os valores são aplicados ao formulário desta sessão.</p></div></aside></div></section>
}

function Metric({ icon, label, value, positive = false }: { icon: ReactNode; label: string; value: string; positive?: boolean }) {
  return <div className="metric"><span className="metric-icon">{icon}</span><div><p>{label}</p><strong className={positive ? 'positive' : ''}>{value}</strong></div></div>
}

export default App
