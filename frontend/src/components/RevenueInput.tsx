import type { ReactNode } from 'react'
import type { RevenueKey } from '../types'

type RevenueInputProps = {
  id: RevenueKey
  label: string
  logo: ReactNode
  value: string
  onChange: (key: RevenueKey, value: string) => void
}

export function RevenueInput({ id, label, logo, value, onChange }: RevenueInputProps) {
  return <div className="revenue-input">
    <span className={`service-icon ${id}`}>{logo}</span>
    <label htmlFor={id}>
      <span>{label}</span>
      <div className="money-field"><i>R$</i><input id={id} value={value} inputMode="numeric" placeholder="0,00" onChange={(event) => onChange(id, event.target.value)} /></div>
    </label>
  </div>
}
