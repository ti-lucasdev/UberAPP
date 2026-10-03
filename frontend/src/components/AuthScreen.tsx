import { useState, type FormEvent } from 'react'
import { LockKeyhole } from 'lucide-react'
import { AppLogo } from './AppLogo'
import { AmbientBackground } from './AmbientBackground'
import { supabase, supabaseConfigured } from '../lib/supabase'

export function AuthScreen({ onDemoLogin }: { onDemoLogin: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')

    if (email.trim().toLowerCase() === 'demo@girocerto.local' && password === '123456') {
      onDemoLogin(email.trim().toLowerCase())
      setPending(false)
      return
    }

    if (!supabaseConfigured) {
      setError('Use o acesso de demonstração: demo@girocerto.local / 123456.')
      setPending(false)
      return
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) setError('Não foi possível entrar. Confira o e-mail, a senha e sua conexão.')
    } catch {
      setError('Não foi possível entrar. Confira o e-mail, a senha e sua conexão.')
    } finally {
      setPending(false)
    }
  }

  return <main className="auth-shell">
    <AmbientBackground />
    <section className="auth-card">
      <div className="auth-brand">
        <span className="auth-brand-glow" aria-hidden="true" />
        <AppLogo />
        <p>Controle seu giro.<br /><strong>Veja seu lucro.</strong></p>
      </div>
      <div className="auth-content">
        <span className="auth-icon"><LockKeyhole size={24} /></span>
        <p className="eyebrow">ACESSO AOS TESTADORES</p>
        <h1>Bem-vindo<br /><em>ao seu giro.</em></h1>
        <p className="auth-description">Entre com a conta de motorista criada para você.</p>
        <form onSubmit={signIn} className="auth-form">
          <label htmlFor="login-email">E-mail<input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} required /></label>
          <label htmlFor="login-password">Senha<input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={pending}>{pending ? 'Entrando...' : 'Entrar'}</button>
        </form>
        {!supabaseConfigured && <p className="demo-hint">demo@girocerto.local<br /><b>senha: 123456</b></p>}
        <small>O cadastro é fechado nesta fase de testes.</small>
      </div>
    </section>
  </main>
}
