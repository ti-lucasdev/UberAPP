import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthScreen } from './components/AuthScreen'
import { DriverApp } from './components/DriverApp'
import { supabase, supabaseConfigured } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [demoEmail, setDemoEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseConfigured) {
      setAuthReady(true)
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!authReady) return <main className="auth-shell auth-loading">Carregando Giro Certo...</main>
  if (demoEmail) return <DriverApp key={demoEmail} demoMode userId="local-demo-user" email={demoEmail} onDemoLogout={() => setDemoEmail(null)} />
  if (!session) return <AuthScreen onDemoLogin={setDemoEmail} />

  return <DriverApp key={session.user.id} userId={session.user.id} email={session.user.email ?? ''} />
}
