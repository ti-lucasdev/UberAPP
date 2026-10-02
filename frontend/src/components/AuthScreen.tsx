import { useState, type FormEvent } from 'react'
import { LockKeyhole } from 'lucide-react'
import { AppLogo } from './AppLogo'
import { supabase } from '../lib/supabase'

export function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')

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
    <section className="auth-card">
      <div className="auth-brand"><AppLogo /></div>
      <div className="auth-content">
        <span className="auth-icon"><LockKeyhole size={24} /></span>
        <p className="eyebrow">ACESSO AOS TESTADORES</p>
        <h1>Bem-vindo<br /><em>ao seu giro.</em></h1>
        <p className="auth-description">Entre com a conta de motorista criada para você.</p>
        <form onSubmit={signIn} className="auth-form">
          <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
          <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={pending}>{pending ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <small>O cadastro é fechado nesta fase de testes.</small>
      </div>
    </section>
  </main>
}
