import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSettings } from '../../context/settings'
import { useFormat } from '../../lib/format'

interface Props {
  page: number // از ۰ شروع می‌شود
  pageSize: number
  total: number
  onPage: (p: number) => void
  onPageSize: (n: number) => void
}

export default function Pagination({ page, pageSize, total, onPage, onPageSize }: Props) {
  const { t } = useSettings()
  const f = useFormat()
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-sm dark:border-slate-800">
      <p className="text-slate-500 dark:text-slate-400">
        {t('common.showing', { from: f.number(from), to: f.number(to), total: f.number(total) })}
      </p>
      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 text-slate-500 sm:flex dark:text-slate-400">
          {t('common.rowsPerPage')}
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{f.number(n)}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button className="icon-btn disabled:pointer-events-none disabled:opacity-40" onClick={() => onPage(page - 1)} disabled={page === 0} aria-label={t('common.previous')}>
            {/* در RTL «قبلی» به سمت راست اشاره می‌کند */}
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          <span className="tabular min-w-16 text-center text-slate-600 dark:text-slate-300">
            {f.number(page + 1)} / {f.number(pages)}
          </span>
          <button className="icon-btn disabled:pointer-events-none disabled:opacity-40" onClick={() => onPage(page + 1)} disabled={page >= pages - 1} aria-label={t('common.next')}>
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}
