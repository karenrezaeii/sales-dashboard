import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Settings, ShoppingCart, Users, X } from 'lucide-react'
import { useSettings, type TKey } from '../../context/settings'
import Logo from '../ui/Logo'

const links: { to: string; label: TKey; icon: typeof LayoutDashboard }[] = [
  { to: '/', label: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'nav.orders', icon: ShoppingCart },
  { to: '/products', label: 'nav.products', icon: Package },
  { to: '/customers', label: 'nav.customers', icon: Users },
  { to: '/settings', label: 'nav.settings', icon: Settings },
]

interface Props {
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const { t, dir } = useSettings()
  // در حالت بسته (موبایل)، منو بیرون از صفحه است: در LTR سمت چپ، در RTL سمت راست
  const hidden = dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'

  return (
    <>
      {/* پس‌زمینه تیره پشت منو در موبایل */}
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : hidden
        }`}
        aria-label={t('nav.menu')}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button className="icon-btn lg:hidden" onClick={onClose} aria-label={t('nav.closeMenu')}>
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('nav.menu')}</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              <Icon className="size-5 shrink-0" />
              {t(label)}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white">
          <p className="text-sm font-semibold">{t('settings.about')}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/80">React · TypeScript · Tailwind</p>
        </div>
      </aside>
    </>
  )
}
