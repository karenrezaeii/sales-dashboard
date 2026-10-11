import type { OrderStatus } from '../../data/types'
import { useSettings } from '../../context/settings'

// هر وضعیت یک رنگ دارد؛ رنگ‌ها یک‌جا تعریف شده‌اند تا همه‌جا یکسان باشند
export const statusStyles: Record<OrderStatus, { badge: string; dot: string; chart: string }> = {
  pending: { badge: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300', dot: 'bg-amber-500', chart: '#f59e0b' },
  processing: { badge: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300', dot: 'bg-sky-500', chart: '#0ea5e9' },
  shipped: { badge: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-300', dot: 'bg-violet-500', chart: '#8b5cf6' },
  delivered: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300', dot: 'bg-emerald-500', chart: '#10b981' },
  cancelled: { badge: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300', dot: 'bg-rose-500', chart: '#f43f5e' },
}

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useSettings()
  const s = statusStyles[status]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.badge}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {t(`status.${status}`)}
    </span>
  )
}
