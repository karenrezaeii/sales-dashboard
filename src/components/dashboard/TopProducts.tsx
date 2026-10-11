import { useSettings } from '../../context/settings'
import { categoryMeta } from '../../lib/categories'
import { useFormat } from '../../lib/format'
import { getTopProducts } from '../../lib/stats'

const top = getTopProducts(5)

export default function TopProducts() {
  const { t, local } = useSettings()
  const f = useFormat()

  return (
    <div className="card p-5">
      <h2 className="font-semibold">{t('dashboard.topProducts')}</h2>
      <ul className="mt-4 space-y-3">
        {top.map(({ product, units, revenue }, i) => {
          const meta = categoryMeta[product.category]
          const Icon = meta.icon
          return (
            <li key={product.id} className="flex items-center gap-3">
              <span className={`relative grid size-10 shrink-0 place-items-center rounded-xl ${meta.soft}`}>
                <Icon className="size-5" />
                <span className="absolute -end-1 -top-1 grid size-4 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                  {f.number(i + 1)}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{local(product.name)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.unitsSold', { count: f.number(units) })}</p>
              </div>
              <p className="tabular text-sm font-semibold">{f.money(revenue)}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
