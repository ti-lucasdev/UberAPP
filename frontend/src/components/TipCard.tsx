import { Fuel, Lightbulb } from 'lucide-react'

export function TipCard() {
  return <aside className="tip-card"><span className="bulb"><Lightbulb size={21} /></span><div><h3>Dica do giro certo!</h3><p>Registre o combustível e o KM para um cálculo mais preciso do seu lucro.</p></div><Fuel className="tip-fuel" size={48} /></aside>
}
