import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthScreen } from './components/AuthScreen'
import { DriverApp } from './components/DriverApp'
import { supabase } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!authReady) return <main className="auth-shell auth-loading">Carregando Giro Certo...</main>
  if (!session) return <AuthScreen />

  return <DriverApp key={session.user.id} userId={session.user.id} email={session.user.email ?? ''} />
}
