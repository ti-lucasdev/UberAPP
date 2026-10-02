import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, History, Home, Menu, Settings, Trash2 } from 'lucide-react'
import { OperatingCosts } from './components/OperatingCosts'
import { ResultCard } from './components/ResultCard'
import { RevenueSection } from './components/RevenueSection'
import { Sidebar } from './components/Sidebar'
import { TipCard } from './components/TipCard'
import { DriverIllustration } from './components/DriverIllustration'
import { AmbientBackground } from './components/AmbientBackground'
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
  const viewportRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [resultHighlight, setResultHighlight] = useState(0)
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
  const calculate = () => {
    setResultHighlight((value) => value + 1)
    document.querySelector('.result-column')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' })
  }
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

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const stage = stageRef.current
    if (!viewport || !stage) return
    let frame = 0
    const fit = () => {
      if (!window.matchMedia('(min-width: 760px)').matches) {
        stage.style.removeProperty('width')
        stage.style.removeProperty('zoom')
        return
      }
      // Keep the two-column composition and fit its natural height, without clipping.
      const width = Math.max(960, viewport.clientWidth)
      stage.style.width = `${width}px`
      const scale = Math.min(1, viewport.clientWidth / width, (viewport.clientHeight - 2) / stage.scrollHeight)
      stage.style.zoom = `${scale}`
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit) }
    const observer = new ResizeObserver(schedule)
    observer.observe(viewport)
    observer.observe(stage)
    window.addEventListener('resize', schedule)
    document.fonts.ready.then(schedule)
    fit()
    return () => { observer.disconnect(); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [activeNav])

  return <div className="app-shell">
    <AmbientBackground />
    <Sidebar activeNav={activeNav} isOpen={menuOpen} onNavigate={navigate} onClose={() => setMenuOpen(false)} />
    <main className="main-content" id="conteudo" ref={viewportRef}>
      <div className="viewport-content" ref={stageRef}>
      <header className="workspace-header">
        <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen}><Menu size={21} /><LogoMark className="mobile-logo-mark" /><span>giro <b>certo!</b></span></button>
        <span className="workspace-label">SEU CONTROLE DE JORNADAS</span>
        <span className="workspace-status"><i /> Tudo pronto para o seu giro</span>
        <span className="workspace-avatar" aria-label="Giro Certo">GC</span>
      </header>
      <div className="page-view" key={activeNav}>
      {activeNav === 'Nova jornada' ? <>
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow">NOVA JORNADA</p><h1>Quanto caiu<br /> <em>no bolso?</em></h1><p className="hero-description">Informe as receitas e os custos da jornada.<br />O resultado mostra o lucro líquido estimado.</p></div>
          <DriverIllustration />
        </section>
        <section className="calculation-layout" aria-label="Calculadora de ganhos">
          <div className="form-card">
            <RevenueSection values={revenues} onChange={updateRevenue} />
            <div className="section-divider" />
            <OperatingCosts kilometers={kilometers} fuelPrice={fuelPrice} vehicleAverage={vehicleAverage} onKilometersChange={setKilometers} onFuelPriceChange={(value) => setFuelPrice(maskCurrency(value))} onAverageChange={setVehicleAverage} />
            <div className="form-actions"><button className="clear-action" type="button" onClick={clearFields}><Trash2 size={16} />Limpar</button><button className="calculate-button" type="button" onClick={calculate}>Calcular lucro <span>›</span></button></div>
          </div>
          <div className="result-column"><div key={resultHighlight} className={resultHighlight ? 'result-feedback' : ''}><ResultCard result={result} source={revenueSource} kilometers={input.kilometers} /></div><TipCard /></div>
        </section>
      </> : activeNav === 'Resumo' ? <SummaryScreen result={result} /> : activeNav === 'Histórico' ? <HistoryScreen /> : <SettingsScreen />}
      </div>
      <footer className="page-footer"><LogoMark className="footer-mark" /><span>Menos contas na cabeça. Mais foco no caminho.</span></footer>
      </div>
    </main>
    <nav className="bottom-nav" aria-label="Navegação no celular">
      {[{ label: 'Nova jornada', short: 'Jornada', icon: Home }, { label: 'Resumo', short: 'Resumo', icon: BarChart3 }, { label: 'Histórico', short: 'Histórico', icon: History }, { label: 'Configurações', short: 'Ajustes', icon: Settings }].map(({ label, short, icon: Icon }) => <button key={label} onClick={() => navigate(label)} className={activeNav === label ? 'active' : ''} aria-current={activeNav === label ? 'page' : undefined}><Icon size={20} /><span>{short}</span></button>)}
    </nav>
  </div>
}
