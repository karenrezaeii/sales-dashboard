import { Link } from 'react-router-dom'
import { useSettings } from '../../context/settings'

export default function Logo() {
  const { t } = useSettings()
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
          <path d="M5 17v-4M10 17V8M15 17v-6M20 17V5" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-base font-bold">{t('app.name')}</span>
        <span className="block text-xs text-slate-500 dark:text-slate-400">{t('app.tagline')}</span>
      </span>
    </Link>
  )
}
