import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Languages, Menu, Moon, Search, Sun } from 'lucide-react'
import { useSettings } from '../../context/settings'

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, lang, setLang, theme, toggleTheme } = useSettings()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  // جستجو در نوار بالا → رفتن به صفحه سفارش‌ها با عبارت جستجو در آدرس
  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/orders?q=${encodeURIComponent(q.trim())}` : '/orders')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button className="icon-btn lg:hidden" onClick={onMenu} aria-label={t('nav.openMenu')}>
          <Menu className="size-5" />
        </button>

        <form onSubmit={onSearch} className="relative max-w-md flex-1" role="search">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('topbar.search')}
            aria-label={t('topbar.search')}
            className="input ps-9"
          />
        </form>

        <div className="ms-auto flex items-center gap-1">
          <button
            className="btn btn-ghost hidden px-3 sm:inline-flex"
            onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
            aria-label={t('topbar.switchLangLabel')}
          >
            <Languages className="size-4" />
            {t('topbar.switchLang')}
          </button>
          <button
            className="icon-btn sm:hidden"
            onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
            aria-label={t('topbar.switchLangLabel')}
          >
            <Languages className="size-5" />
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label={t('topbar.toggleTheme')}>
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <button className="icon-btn relative" aria-label={t('topbar.notifications')}>
            <Bell className="size-5" />
            <span className="absolute end-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </button>

          <div className="ms-2 hidden items-center gap-3 border-s border-slate-200 ps-3 dark:border-slate-800 md:flex">
            <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-semibold text-white">
              KR
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{lang === 'fa' ? 'کارن رضایی' : 'Karen Rezaei'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('topbar.role')}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
