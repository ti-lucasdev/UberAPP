import type { CSSProperties } from 'react'

export function DriverIllustration() {
  return <div className="driver-illustration" aria-hidden="true">
    <img src="/assets/driver-illustration.png" alt="" />
    <div className="hero-particles">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{
      '--x': `${8 + (index * 29) % 86}%`,
      '--y': `${10 + (index * 37) % 78}%`,
      '--size': `${3 + index % 4}px`,
      '--delay': `${-index * 0.7}s`,
      '--duration': `${5 + index % 5}s`,
    } as CSSProperties} />)}</div>
  </div>
}
