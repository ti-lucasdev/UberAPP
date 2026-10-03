import { BarChart3, History, Home, LogOut, Settings, X } from 'lucide-react'
import { AppLogo } from './AppLogo'
import { useEffect, useRef, useState } from 'react'

type SidebarProps = {
  activeNav: string
  isOpen: boolean
  onNavigate: (item: string) => void
  onClose: () => void
  onSignOut: () => void
  historyCount: number
}

const menuItems = [
  { label: 'Nova jornada', icon: Home },
  { label: 'Resumo', icon: BarChart3 },
  { label: 'Histórico', icon: History },
]

export function Sidebar({ activeNav, isOpen, onNavigate, onClose, onSignOut, historyCount }: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null)
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 900px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const sync = () => setCompact(media.matches)
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  useEffect(() => {
    if (!isOpen || !compact) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    sidebarRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const buttons = sidebarRef.current?.querySelectorAll<HTMLButtonElement>('button')
      if (!buttons?.length) return
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', handleKey)
      previous?.focus()
    }
  }, [isOpen, compact, onClose])
  return <>
    <div className={isOpen ? 'menu-backdrop visible' : 'menu-backdrop'} onClick={onClose} />
    <aside ref={sidebarRef} className={isOpen ? 'sidebar open' : 'sidebar'} inert={compact && !isOpen} role={compact ? 'dialog' : undefined} aria-modal={compact && isOpen ? true : undefined} aria-label="Menu principal">
      <div className="sidebar-visual" aria-hidden="true"><img src="/assets/sidebar-car.png" alt="" /></div>
      <button className="close-menu" onClick={onClose} aria-label="Fechar menu"><X size={20} /></button>
      <AppLogo />
      <nav className="sidebar-nav" aria-label="Navegação principal">
        {menuItems.map(({ label, icon: Icon }) => <button
          key={label}
          className={activeNav === label ? 'side-link active' : 'side-link'}
          aria-current={activeNav === label ? 'page' : undefined}
          onClick={() => onNavigate(label)}
        >
          <Icon size={19} strokeWidth={2.1} />
          <span>{label}</span>
          {label === 'Histórico' && historyCount > 0 && <b className="history-count">{historyCount}</b>}
        </button>)}
      </nav>
      <div className="sidebar-footer">
        <button aria-current={activeNav === 'Configurações' ? 'page' : undefined} className={activeNav === 'Configurações' ? 'side-link active' : 'side-link'} onClick={() => onNavigate('Configurações')}>
          <Settings size={19} strokeWidth={2.1} /><span>Configurações</span>
        </button>
        <button className="side-link signout-link" onClick={onSignOut}><LogOut size={19} strokeWidth={2.1} /><span>Sair</span></button>
      </div>
    </aside>
  </>
}
