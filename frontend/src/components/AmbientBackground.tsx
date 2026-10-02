import { useEffect, useRef } from 'react'

export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => {
      if (ref.current) ref.current.dataset.paused = String(document.hidden)
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  return <div ref={ref} className="ambient-background" aria-hidden="true">
    <span className="ambient-glow ambient-glow-mint" />
    <span className="ambient-glow ambient-glow-blue" />
    <span className="ambient-glow ambient-glow-warm" />
    <span className="floating-shape floating-coins" />
    <span className="floating-shape floating-navigation" />
    <span className="floating-shape floating-growth" />
    <span className="floating-shape floating-ring" />
  </div>
}
