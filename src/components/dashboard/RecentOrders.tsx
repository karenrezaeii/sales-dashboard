import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { customerById, orders, products } from '../../data/mock'
import { useSettings } from '../../context/settings'
import { useFormat } from '../../lib/format'
import StatusBadge from '../ui/StatusBadge'

const productById = new Map(products.map((p) => [p.id, p]))
const recent = orders.slice(0, 6)

export default function RecentOrders() {
  const { t, local } = useSettings()
  const f = useFormat()

  return (
    <div className="card overflow-hidden lg:col-span-2">
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="font-semibold">{t('dashboard.recentOrders')}</h2>
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
          {t('common.viewAll')}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-start text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3 text-start font-medium">{t('orders.id')}</th>
              <th className="px-5 py-3 text-start font-medium">{t('orders.customer')}</th>
              <th className="px-5 py-3 text-start font-medium">{t('orders.product')}</th>
              <th className="px-5 py-3 text-start font-medium">{t('orders.status')}</th>
              <th className="px-5 py-3 text-end font-medium">{t('orders.total')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-900 dark:text-white">
                  <span dir="ltr">{o.id}</span>
                </td>
                <td className="px-5 py-3">{local(customerById.get(o.customerId)!.name)}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{local(productById.get(o.productId)!.name)}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="tabular px-5 py-3 text-end font-medium">{f.moneyExact(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
