import { useSettings } from '../../context/settings'
import { categoryMeta } from '../../lib/categories'
import { useFormat } from '../../lib/format'
import { getSalesByCategory } from '../../lib/stats'

const sales = getSalesByCategory()

/** فروش هر دسته‌بندی به‌صورت نوار پیشرفت (ساده‌تر و خواناتر از نمودار دایره‌ای) */
export default function CategoryBreakdown() {
  const { t } = useSettings()
  const f = useFormat()

  return (
    <div className="card p-5">
      <h2 className="font-semibold">{t('dashboard.salesByCategory')}</h2>
      <ul className="mt-5 space-y-4">
        {sales.map(({ category, value, share }) => {
          const meta = categoryMeta[category]
          const Icon = meta.icon
          return (
            <li key={category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={`grid size-7 place-items-center rounded-lg ${meta.soft}`}>
                    <Icon className="size-4" />
                  </span>
                  {t(`category.${category}`)}
                </span>
                <span className="tabular font-medium">{f.money(value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full" style={{ width: `${(share * 100).toFixed(1)}%`, background: meta.color }} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
