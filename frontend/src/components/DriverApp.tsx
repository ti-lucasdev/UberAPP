import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, FileChartColumn, History, Home, Menu, Settings, Trash2 } from 'lucide-react'
import { OperatingCosts } from './OperatingCosts'
import { ResultCard } from './ResultCard'
import { RevenueSection } from './RevenueSection'
import { Sidebar } from './Sidebar'
import { TipCard } from './TipCard'
import { DriverIllustration } from './DriverIllustration'
import { AmbientBackground } from './AmbientBackground'
import { SummaryScreen } from './SummaryScreen'
import { HistoryScreen } from './HistoryScreen'
import { SettingsScreen } from './SettingsScreen'
import { ReportScreen } from './ReportScreen'
import { LogoMark } from './AppLogo'
import { supabase } from '../lib/supabase'
import type { Ride } from '../lib/rides'
import { calculateDriverProfit, maskCurrency, parseDecimal } from '../utils/calculations'
import type { CalculationInput, RevenueValues } from '../types'

const emptyRevenues: RevenueValues = { uber: '', ninetyNine: '', particular: '', inDriver: '' }
const navigationByHash: Record<string, string> = { '#resumo': 'Resumo', '#relatorio': 'Relatório', '#historico': 'Histórico', '#configuracoes': 'Configurações' }

function navigationFromHash() {
  return navigationByHash[window.location.hash] ?? 'Nova jornada'
}

export function DriverApp({ userId, email, demoMode = false, onDemoLogout }: { userId: string; email: string; demoMode?: boolean; onDemoLogout?: () => void }) {
  const viewportRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [resultHighlight, setResultHighlight] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState(navigationFromHash)
  const [revenues, setRevenues] = useState<RevenueValues>(emptyRevenues)
  const [kilometers, setKilometers] = useState('')
  const [fuelPrice, setFuelPrice] = useState('')
  const [vehicleAverage, setVehicleAverage] = useState('')
  const [rides, setRides] = useState<Ride[]>([])
  const [ridesLoading, setRidesLoading] = useState(true)
  const [ridesError, setRidesError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [savedFingerprint, setSavedFingerprint] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState('')
  const accountName = email.includes('@') ? email.split('@')[0] : 'Motorista'
  const accountInitials = accountName.split(/[ ._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'GC'
  const rentalStorageKey = `giro-certo:weekly-rental:${userId}`
  const [weeklyRental, setWeeklyRental] = useState(() => {
    const stored = Number(window.localStorage.getItem(rentalStorageKey))
    return Number.isFinite(stored) && stored >= 0 ? stored : 0
  })

  const input = useMemo<CalculationInput>(() => ({
    uber: parseDecimal(revenues.uber), ninetyNine: parseDecimal(revenues.ninetyNine), particular: parseDecimal(revenues.particular), inDriver: parseDecimal(revenues.inDriver),
    kilometers: parseDecimal(kilometers), fuelPrice: parseDecimal(fuelPrice), vehicleAverage: parseDecimal(vehicleAverage),
  }), [revenues, kilometers, fuelPrice, vehicleAverage])
  const inputFingerprint = JSON.stringify(input)
  const result = useMemo(() => calculateDriverProfit(input), [input])
  const revenueSource = [input.uber > 0 && 'Uber', input.ninetyNine > 0 && '99', input.particular > 0 && 'Particular', input.inDriver > 0 && 'InDriver'].filter(Boolean).join(' + ') || 'Sem receitas'

  const loadRides = useCallback(async () => {
    setRidesLoading(true)
    setRidesError('')
    if (demoMode) {
      try {
        const stored = window.localStorage.getItem('giro-certo-demo-rides')
        setRides(stored ? JSON.parse(stored) as Ride[] : [])
      } catch {
        setRides([])
      } finally {
        setRidesLoading(false)
      }
      return
    }
    try {
      const { data, error } = await supabase.from('rides')
        .select('id,user_id,created_at,uber,ninety_nine,particular,in_driver,kilometers,fuel_price,vehicle_average')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1000)
      if (error) throw error
      setRides((data ?? []) as Ride[])
    } catch {
      setRidesError('Não foi possível carregar o histórico. Tente atualizar.')
    } finally {
      setRidesLoading(false)
    }
  }, [demoMode, userId])

  useEffect(() => { void loadRides() }, [loadRides])
  useEffect(() => {
    setSaveMessage('')
    setSaveError('')
    setSavedFingerprint(null)
  }, [inputFingerprint])

  const updateRevenue = (key: keyof RevenueValues, value: string) => setRevenues((current) => ({ ...current, [key]: maskCurrency(value) }))
  const clearFields = () => { setRevenues(emptyRevenues); setKilometers(''); setFuelPrice(''); setVehicleAverage(''); setSavedFingerprint(null) }
  const calculateAndSave = () => {
    setResultHighlight((value) => value + 1)
    document.querySelector('.result-column')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' })
    void saveRide()
  }
  const navigate = (item: string) => {
    const hash = Object.entries(navigationByHash).find(([, label]) => label === item)?.[0] ?? '#nova-jornada'
    window.location.hash = hash
    setActiveNav(item)
    setMenuOpen(false)
  }

  const saveWeeklyRental = (value: number) => {
    const safeValue = Number.isFinite(value) && value >= 0 ? value : 0
    setWeeklyRental(safeValue)
    window.localStorage.setItem(rentalStorageKey, String(safeValue))
  }

  async function saveRide() {
    if (saving || ridesLoading || savedFingerprint === inputFingerprint) return
    setSaveError('')
    setSaveMessage('')
    if (result.grossRevenue <= 0 || input.kilometers <= 0 || input.vehicleAverage <= 0) {
      setSaveError('Informe alguma receita, os quilômetros e a média do veículo antes de salvar.')
      return
    }

    setSaving(true)
    if (demoMode) {
      const demoRide: Ride = {
        id: `demo-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        uber: input.uber,
        ninety_nine: input.ninetyNine,
        particular: input.particular,
        in_driver: input.inDriver,
        kilometers: input.kilometers,
        fuel_price: input.fuelPrice,
        vehicle_average: input.vehicleAverage,
      }
      const nextRides = [demoRide, ...rides]
      window.localStorage.setItem('giro-certo-demo-rides', JSON.stringify(nextRides))
      setRides(nextRides)
      setSavedFingerprint(inputFingerprint)
      setSaveMessage('Jornada salva neste navegador (modo demonstração).')
      setSaving(false)
      return
    }
    try {
      const { data, error } = await supabase.from('rides').insert({
        uber: input.uber,
        ninety_nine: input.ninetyNine,
        particular: input.particular,
        in_driver: input.inDriver,
        kilometers: input.kilometers,
        fuel_price: input.fuelPrice,
        vehicle_average: input.vehicleAverage,
      }).select('id,user_id,created_at,uber,ninety_nine,particular,in_driver,kilometers,fuel_price,vehicle_average').single()
      if (error || !data) throw error ?? new Error('Jornada não retornada pelo banco.')
      setRides((current) => [data as Ride, ...current])
      setSavedFingerprint(inputFingerprint)
      setSaveMessage('Jornada salva no seu histórico.')
    } catch {
      setSaveError('Não foi possível salvar. Confira sua conexão e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function signOut() {
    if (demoMode) {
      onDemoLogout?.()
      return
    }
    setSessionError('')
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
    } catch {
      setSessionError('Não foi possível sair. Tente novamente.')
    }
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
    <Sidebar activeNav={activeNav} isOpen={menuOpen} onNavigate={navigate} onClose={() => setMenuOpen(false)} onSignOut={() => { void signOut() }} historyCount={rides.length} />
    <main className="main-content" id="conteudo" ref={viewportRef}>
      <div className="viewport-content" ref={stageRef}>
      <header className="workspace-header">
        <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen}><Menu size={21} /><LogoMark className="mobile-logo-mark" /><span>giro <b>certo!</b></span></button>
        <span className="workspace-label">SEU CONTROLE DE JORNADAS</span>
        <span className="workspace-status"><i /> Tudo pronto para o seu giro</span>
        <span className="workspace-user"><span className="workspace-avatar" aria-hidden="true">{accountInitials}</span><span><strong>{accountName}</strong><small><i /> online</small></span></span>
      </header>
      <div className="page-view" key={activeNav}>
      {sessionError && <p className="session-error" role="alert">{sessionError}</p>}
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
            <div className="form-actions"><button className="clear-action" type="button" onClick={clearFields}><Trash2 size={16} />Limpar</button><button className="calculate-button" type="button" disabled={saving || ridesLoading || savedFingerprint === inputFingerprint} onClick={calculateAndSave}>{saving ? 'Calculando e salvando...' : savedFingerprint === inputFingerprint ? 'Jornada salva' : 'Calcular lucro'} <span>›</span></button></div>
            <div className="save-ride-area">
              {saveMessage && <p className="save-feedback success" role="status">{saveMessage}</p>}
              {saveError && <p className="save-feedback error" role="alert">{saveError}</p>}
            </div>
          </div>
          <div className="result-column"><div key={resultHighlight} className={resultHighlight ? 'result-feedback' : ''}><ResultCard result={result} source={revenueSource} kilometers={input.kilometers} /></div><TipCard /></div>
        </section>
      </> : activeNav === 'Resumo' ? <SummaryScreen result={result} /> : activeNav === 'Relatório' ? <ReportScreen rides={rides} loading={ridesLoading} error={ridesError} weeklyRental={weeklyRental} /> : activeNav === 'Histórico' ? <HistoryScreen rides={rides} loading={ridesLoading} error={ridesError} onRefresh={() => { void loadRides() }} /> : <SettingsScreen weeklyRental={weeklyRental} onSave={saveWeeklyRental} />}
      </div>
      <footer className="page-footer"><LogoMark className="footer-mark" /><span>Menos contas na cabeça. Mais foco no caminho.</span></footer>
      </div>
    </main>
    <nav className="bottom-nav" aria-label="Navegação no celular">
      {[{ label: 'Nova jornada', short: 'Jornada', icon: Home }, { label: 'Resumo', short: 'Resumo', icon: BarChart3 }, { label: 'Relatório', short: 'Relatório', icon: FileChartColumn }, { label: 'Histórico', short: 'Histórico', icon: History }, { label: 'Configurações', short: 'Ajustes', icon: Settings }].map(({ label, short, icon: Icon }) => <button key={label} onClick={() => navigate(label)} className={activeNav === label ? 'active' : ''} aria-current={activeNav === label ? 'page' : undefined}><Icon size={20} /><span>{short}</span></button>)}
    </nav>
  </div>
}
