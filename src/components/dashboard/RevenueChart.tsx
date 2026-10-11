import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSettings } from '../../context/settings'
import { useFormat } from '../../lib/format'
import { getMonthlyRevenue } from '../../lib/stats'
import { useChartTheme } from '../../lib/useChartTheme'

const monthly = getMonthlyRevenue()

export default function RevenueChart() {
  const { t } = useSettings()
  const f = useFormat()
  const c = useChartTheme()
  const data = monthly.map((m) => ({ ...m, label: f.month(m.month) }))
  const total = monthly.reduce((s, m) => s + m.revenue, 0)

  return (
    <div className="card p-5 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{t('dashboard.revenueOverview')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.last12Months')}</p>
        </div>
        <p className="tabular text-2xl font-bold">{f.money(total)}</p>
      </div>

      <div className="mt-4 h-72" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.brand} stopOpacity={0.3} />
                <stop offset="100%" stopColor={c.brand} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={c.grid} />
            {/* در حالت فارسی، محور زمان از راست به چپ است */}
            <XAxis dataKey="label" reversed={c.rtl} tickLine={false} axisLine={false} tick={{ fill: c.axis, fontSize: 12 }} dy={8} />
            <YAxis
              orientation={c.rtl ? 'right' : 'left'}
              tickLine={false}
              axisLine={false}
              width={64}
              tick={{ fill: c.axis, fontSize: 12 }}
              tickFormatter={(v: number) => f.compactMoney(v)}
            />
            <Tooltip
              cursor={{ stroke: c.axis, strokeDasharray: '4 4' }}
              contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, fontSize: 13 }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              formatter={(v: number) => [f.money(v), t('dashboard.revenue')]}
            />
            <Area type="monotone" dataKey="revenue" stroke={c.brand} strokeWidth={2.5} fill="url(#rev)" activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
