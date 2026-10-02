import { useCallback, useEffect, useMemo, useState } from 'react'
import { Menu, Save, Trash2 } from 'lucide-react'
import { OperatingCosts } from './OperatingCosts'
import { ResultCard } from './ResultCard'
import { RevenueSection } from './RevenueSection'
import { Sidebar } from './Sidebar'
import { TipCard } from './TipCard'
import { DriverIllustration } from './DriverIllustration'
import { SummaryScreen } from './SummaryScreen'
import { HistoryScreen } from './HistoryScreen'
import { SettingsScreen } from './SettingsScreen'
import { LogoMark } from './AppLogo'
import { supabase } from '../lib/supabase'
import type { Ride } from '../lib/rides'
import { calculateDriverProfit, maskCurrency, parseDecimal } from '../utils/calculations'
import type { CalculationInput, RevenueValues } from '../types'

const emptyRevenues: RevenueValues = { uber: '', ninetyNine: '', particular: '', inDriver: '' }
const navigationByHash: Record<string, string> = { '#resumo': 'Resumo', '#historico': 'Histórico', '#configuracoes': 'Configurações' }

function navigationFromHash() {
  return navigationByHash[window.location.hash] ?? 'Nova jornada'
}

export function DriverApp({ userId, email }: { userId: string; email: string }) {
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
    try {
      const { data, error } = await supabase.from('rides')
        .select('id,user_id,created_at,uber,ninety_nine,particular,in_driver,kilometers,fuel_price,vehicle_average')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(200)
      if (error) throw error
      setRides((data ?? []) as Ride[])
    } catch {
      setRidesError('Não foi possível carregar o histórico. Tente atualizar.')
    } finally {
      setRidesLoading(false)
    }
  }, [userId])

  useEffect(() => { void loadRides() }, [loadRides])
  useEffect(() => {
    setSaveMessage('')
    setSaveError('')
    setSavedFingerprint(null)
  }, [inputFingerprint])

  const updateRevenue = (key: keyof RevenueValues, value: string) => setRevenues((current) => ({ ...current, [key]: maskCurrency(value) }))
  const clearFields = () => { setRevenues(emptyRevenues); setKilometers(''); setFuelPrice(''); setVehicleAverage(''); setSavedFingerprint(null) }
  const calculate = () => document.querySelector('.result-column')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  const navigate = (item: string) => {
    const hash = Object.entries(navigationByHash).find(([, label]) => label === item)?.[0] ?? '#nova-jornada'
    window.location.hash = hash
    setActiveNav(item)
    setMenuOpen(false)
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

  return <div className="app-shell">
    <Sidebar activeNav={activeNav} isOpen={menuOpen} onNavigate={navigate} onClose={() => setMenuOpen(false)} onSignOut={() => { void signOut() }} email={email} historyCount={rides.length} />
    <main className="main-content">
      <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={21} /><LogoMark className="mobile-logo-mark" /><span>giro <b>certo!</b></span></button>
      {sessionError && <p className="session-error" role="alert">{sessionError}</p>}
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
            <div className="save-ride-area">
              <button className="save-ride-button" type="button" disabled={saving || ridesLoading || savedFingerprint === inputFingerprint} onClick={() => { void saveRide() }}><Save size={17} />{saving ? 'Salvando...' : savedFingerprint === inputFingerprint ? 'Jornada salva' : 'Salvar jornada'}</button>
              {saveMessage && <p className="save-feedback success" role="status">{saveMessage}</p>}
              {saveError && <p className="save-feedback error" role="alert">{saveError}</p>}
            </div>
          </div>
          <div className="result-column"><ResultCard result={result} source={revenueSource} kilometers={input.kilometers} /><TipCard /></div>
        </section>
      </> : activeNav === 'Resumo' ? <SummaryScreen result={result} /> : activeNav === 'Histórico' ? <HistoryScreen rides={rides} loading={ridesLoading} error={ridesError} onRefresh={() => { void loadRides() }} /> : <SettingsScreen />}
    </main>
  </div>
}
