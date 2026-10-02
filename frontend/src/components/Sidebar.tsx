import { BarChart3, History, Home, LogOut, Settings, X } from 'lucide-react'
import { AppLogo } from './AppLogo'

type SidebarProps = {
  activeNav: string
  isOpen: boolean
  onNavigate: (item: string) => void
  onClose: () => void
  onSignOut: () => void
  email: string
  historyCount: number
}

const menuItems = [
  { label: 'Nova jornada', icon: Home },
  { label: 'Resumo', icon: BarChart3 },
  { label: 'Histórico', icon: History },
]

export function Sidebar({ activeNav, isOpen, onNavigate, onClose, onSignOut, email, historyCount }: SidebarProps) {
  return <>
    <div className={isOpen ? 'menu-backdrop visible' : 'menu-backdrop'} onClick={onClose} />
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-visual" aria-hidden="true"><img src="/assets/sidebar-car.png" alt="" /></div>
      <button className="close-menu" onClick={onClose} aria-label="Fechar menu"><X size={20} /></button>
      <AppLogo />
      <nav className="sidebar-nav" aria-label="Navegação principal">
        {menuItems.map(({ label, icon: Icon }) => <button
          key={label}
          className={activeNav === label ? 'side-link active' : 'side-link'}
          onClick={() => onNavigate(label)}
        >
          <Icon size={19} strokeWidth={2.1} />
          <span>{label}</span>
          {label === 'Histórico' && historyCount > 0 && <b className="history-count">{historyCount}</b>}
        </button>)}
      </nav>
      <div className="sidebar-footer">
        <p className="account-email" title={email}>{email}</p>
        <button className={activeNav === 'Configurações' ? 'side-link active' : 'side-link'} onClick={() => onNavigate('Configurações')}>
          <Settings size={19} strokeWidth={2.1} /><span>Configurações</span>
        </button>
        <button className="side-link signout-link" onClick={onSignOut}><LogOut size={19} strokeWidth={2.1} /><span>Sair</span></button>
      </div>
    </aside>
  </>
}
