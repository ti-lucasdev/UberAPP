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
    <span className="ambient-grid" />
    <span className="ambient-glow ambient-glow-mint" />
    <span className="ambient-glow ambient-glow-blue" />
    <span className="ambient-glow ambient-glow-warm" />
    <span className="ambient-contour ambient-contour-one" />
    <span className="ambient-contour ambient-contour-two" />
    <span className="ambient-orb ambient-orb-one" />
    <span className="ambient-orb ambient-orb-two" />
    <span className="ambient-orb ambient-orb-three" />
  </div>
}
