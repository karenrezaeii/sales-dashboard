import { useMemo, useState } from 'react'
import { Mail, MapPin, Search } from 'lucide-react'
import { customers, orders } from '../data/mock'
import { useSettings } from '../context/settings'
import { useFormat } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'

// آمار خرید هر مشتری یک بار محاسبه می‌شود
const stats = new Map<string, { count: number; spent: number }>()
for (const o of orders) {
  const s = stats.get(o.customerId) ?? { count: 0, spent: 0 }
  s.count++
  if (o.status !== 'cancelled') s.spent += o.total
  stats.set(o.customerId, s)
}

const gradients = ['from-indigo-500 to-violet-500', 'from-sky-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-pink-500 to-rose-500']

export default function CustomersPage() {
  const { t, local } = useSettings()
  const f = useFormat()
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return customers
      .map((c) => ({ ...c, ...(stats.get(c.id) ?? { count: 0, spent: 0 }) }))
      .filter((c) => !q || [c.name.en, c.name.fa, c.email, c.city.en, c.city.fa].join(' ').toLowerCase().includes(q))
      .sort((a, b) => b.spent - a.spent)
  }, [query])

  return (
    <>
      <PageHeader
        title={t('customers.title')}
        subtitle={t('customers.subtitle')}
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input type="search" className="input w-64 ps-9" placeholder={t('topbar.search')} aria-label={t('topbar.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        }
      />

      {list.length === 0 ? (
        <div className="card"><EmptyState onClear={() => setQuery('')} /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c, i) => (
            <article key={c.id} className="card p-5">
              <div className="flex items-center gap-3">
                <span className={`grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-lg font-semibold text-white ${gradients[i % gradients.length]}`}>
                  {local(c.name).slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{local(c.name)}</h3>
                  <p className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="size-3.5 shrink-0" />
                    <span dir="ltr" className="truncate">{c.email}</span>
                  </p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/50">
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{t('customers.orders')}</dt>
                  <dd className="tabular mt-0.5 font-semibold">{f.number(c.count)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{t('customers.spent')}</dt>
                  <dd className="tabular mt-0.5 font-semibold">{f.money(c.spent)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{t('customers.city')}</dt>
                  <dd className="mt-0.5 flex items-center justify-center gap-1 font-semibold"><MapPin className="size-3.5 text-slate-400" />{local(c.city)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('customers.joined')}: {f.date(c.joinedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
