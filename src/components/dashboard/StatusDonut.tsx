import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useSettings } from '../../context/settings'
import { useFormat } from '../../lib/format'
import { getStatusBreakdown } from '../../lib/stats'
import { useChartTheme } from '../../lib/useChartTheme'
import { statusStyles } from '../ui/StatusBadge'

const breakdown = getStatusBreakdown()
const total = breakdown.reduce((s, b) => s + b.count, 0)

export default function StatusDonut() {
  const { t } = useSettings()
  const f = useFormat()
  const c = useChartTheme()
  const data = breakdown.map((b) => ({ ...b, name: t(`status.${b.status}`) }))

  return (
    <div className="card p-5">
      <h2 className="font-semibold">{t('dashboard.orderStatus')}</h2>
      <div className="relative mx-auto mt-2 h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="name" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.status} fill={statusStyles[d.status].chart} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, fontSize: 13 }}
              formatter={(v: number) => f.number(v)}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <p className="tabular text-2xl font-bold">{f.number(total)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.orders')}</p>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {data.map((d) => (
          <li key={d.status} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className={`size-2.5 rounded-full ${statusStyles[d.status].dot}`} />
              {d.name}
            </span>
            <span className="tabular font-medium">{f.number(d.count)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
