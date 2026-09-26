type LogoMarkProps = { className?: string }

export function LogoMark({ className = '' }: LogoMarkProps) {
  return <span className={`logo-symbol ${className}`} aria-hidden="true"><i /><i /><i /></span>
}

export function AppLogo() {
  return <div className="app-logo" aria-label="Giro Certo">
    <LogoMark />
    <div className="logo-copy"><strong>giro certo<b>!</b></strong><small>lucro real na direção</small></div>
  </div>
}
