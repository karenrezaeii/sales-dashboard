import { SearchX } from 'lucide-react'
import { useSettings } from '../../context/settings'

/** وقتی جستجو/فیلتر نتیجه‌ای ندارد */
export default function EmptyState({ onClear }: { onClear?: () => void }) {
  const { t } = useSettings()
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <SearchX className="size-6" />
      </div>
      <p className="mt-4 font-semibold">{t('common.noResults')}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('common.noResultsHint')}</p>
      {onClear && (
        <button className="btn btn-ghost mt-4" onClick={onClear}>
          {t('common.clear')}
        </button>
      )}
    </div>
  )
}
