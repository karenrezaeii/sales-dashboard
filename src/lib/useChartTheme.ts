import { useSettings } from '../context/settings'

/** رنگ‌های محور و خطوط نمودار بر اساس تم روشن/تاریک */
export function useChartTheme() {
  const { theme, dir } = useSettings()
  const dark = theme === 'dark'
  return {
    rtl: dir === 'rtl',
    grid: dark ? '#1e293b' : '#eef2f7',
    axis: dark ? '#64748b' : '#94a3b8',
    tooltipBg: dark ? '#0f172a' : '#ffffff',
    tooltipBorder: dark ? '#334155' : '#e2e8f0',
    brand: '#6366f1',
    secondary: dark ? '#475569' : '#cbd5e1',
  }
}
