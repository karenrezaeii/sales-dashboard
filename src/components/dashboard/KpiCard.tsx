import { useId } from 'react'
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useSettings } from '../../context/settings'
import { useFormat } from '../../lib/format'

interface Props {
  label: string
  value: string
  change: number
  icon: LucideIcon
  trend: number[]
  color: string
}

/** کارت آمار: عدد اصلی + درصد تغییر + نمودار کوچک روند (sparkline) */
export default function KpiCard({ label, value, change, icon: Icon, trend, color }: Props) {
  const { t, dir } = useSettings()
  const f = useFormat()
  const up = change >= 0
  const gid = 'spark' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const data = (dir === 'rtl' ? [...trend].reverse() : trend).map((v) => ({ v }))

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="tabular mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl" style={{ background: `${color}1a`, color }}>
          <Icon className="size-5" />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-semibold ${
              up ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
            }`}
          >
            {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            <span dir="ltr">{f.percent(change)}</span>
          </span>
          <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">{t('dashboard.vsLastMonth')}</span>
        </p>
        <div className="h-9 w-20 shrink-0" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
