import { Link } from 'react-router-dom'
import { useSettings } from '../context/settings'

export default function NotFoundPage() {
  const { t } = useSettings()
  return (
    <div className="grid min-h-[60vh] place-content-center text-center">
      <p className="bg-gradient-to-br from-brand-500 to-violet-500 bg-clip-text text-7xl font-extrabold text-transparent">404</p>
      <h1 className="mt-4 text-xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{t('notFound.text')}</p>
      <Link to="/" className="btn btn-primary mx-auto mt-6">{t('notFound.back')}</Link>
    </div>
  )
}
