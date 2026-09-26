import { useEffect, useMemo, useState } from 'react'
import { Menu, Trash2 } from 'lucide-react'
import { OperatingCosts } from './components/OperatingCosts'
import { ResultCard } from './components/ResultCard'
import { RevenueSection } from './components/RevenueSection'
import { Sidebar } from './components/Sidebar'
import { TipCard } from './components/TipCard'
import { DriverIllustration } from './components/DriverIllustration'
import { SummaryScreen } from './components/SummaryScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { LogoMark } from './components/AppLogo'
import { calculateDriverProfit, maskCurrency, parseDecimal } from './utils/calculations'
import type { CalculationInput, RevenueValues } from './types'

const defaultRevenues: RevenueValues = { uber: '99,00', ninetyNine: '0,00', particular: '23,00', inDriver: '0,00' }
const navigationByHash: Record<string, string> = { '#resumo': 'Resumo', '#historico': 'Histórico', '#configuracoes': 'Configurações' }

function navigationFromHash() {
  return navigationByHash[window.location.hash] ?? 'Nova jornada'
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState(navigationFromHash)
  const [revenues, setRevenues] = useState<RevenueValues>(defaultRevenues)
  const [kilometers, setKilometers] = useState('42')
  const [fuelPrice, setFuelPrice] = useState('5,89')
  const [vehicleAverage, setVehicleAverage] = useState('11')

  const input = useMemo<CalculationInput>(() => ({
    uber: parseDecimal(revenues.uber), ninetyNine: parseDecimal(revenues.ninetyNine), particular: parseDecimal(revenues.particular), inDriver: parseDecimal(revenues.inDriver),
    kilometers: parseDecimal(kilometers), fuelPrice: parseDecimal(fuelPrice), vehicleAverage: parseDecimal(vehicleAverage),
  }), [revenues, kilometers, fuelPrice, vehicleAverage])
  const result = useMemo(() => calculateDriverProfit(input), [input])
  const revenueSource = [input.uber > 0 && 'Uber', input.ninetyNine > 0 && '99', input.particular > 0 && 'Particular', input.inDriver > 0 && 'InDriver'].filter(Boolean).join(' + ') || 'Sem receitas'

  const updateRevenue = (key: keyof RevenueValues, value: string) => setRevenues((current) => ({ ...current, [key]: maskCurrency(value) }))
  const clearFields = () => { setRevenues({ uber: '', ninetyNine: '', particular: '', inDriver: '' }); setKilometers(''); setFuelPrice(''); setVehicleAverage('') }
  const calculate = () => document.querySelector('.result-column')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  const navigate = (item: string) => {
    const hash = Object.entries(navigationByHash).find(([, label]) => label === item)?.[0] ?? '#nova-jornada'
    window.location.hash = hash
    setActiveNav(item)
    setMenuOpen(false)
  }

  useEffect(() => {
    const syncNavigation = () => setActiveNav(navigationFromHash())
    window.addEventListener('hashchange', syncNavigation)
    return () => window.removeEventListener('hashchange', syncNavigation)
  }, [])

  return <div className="app-shell">
    <Sidebar activeNav={activeNav} isOpen={menuOpen} onNavigate={navigate} onClose={() => setMenuOpen(false)} />
    <main className="main-content">
      <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={21} /><LogoMark className="mobile-logo-mark" /><span>giro <b>certo!</b></span></button>
      {activeNav === 'Nova jornada' ? <>
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow">NOVA JORNADA</p><h1>Quanto caiu<br /> <em>no bolso?</em></h1><p className="hero-description">Informe as receitas e os custos da jornada.<br />O resultado mostra o lucro líquido estimado.</p></div>
          <DriverIllustration />
          <div className="utility-bar"><span><i />Cálculo atualizado<br /><b>agora mesmo</b></span><strong>GC</strong></div>
        </section>
        <section className="calculation-layout" aria-label="Calculadora de ganhos">
          <div className="form-card">
            <RevenueSection values={revenues} onChange={updateRevenue} />
            <div className="section-divider" />
            <OperatingCosts kilometers={kilometers} fuelPrice={fuelPrice} vehicleAverage={vehicleAverage} onKilometersChange={setKilometers} onFuelPriceChange={(value) => setFuelPrice(maskCurrency(value))} onAverageChange={setVehicleAverage} />
            <div className="form-actions"><button className="clear-action" type="button" onClick={clearFields}><Trash2 size={16} />Limpar</button><button className="calculate-button" type="button" onClick={calculate}>Calcular lucro <span>›</span></button></div>
          </div>
          <div className="result-column"><ResultCard result={result} source={revenueSource} kilometers={input.kilometers} /><TipCard /></div>
        </section>
      </> : activeNav === 'Resumo' ? <SummaryScreen result={result} /> : activeNav === 'Histórico' ? <HistoryScreen /> : <SettingsScreen />}
    </main>
  </div>
}
