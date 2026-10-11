// =====================================================================
// قالب‌بندی عدد، پول و تاریخ با Intl (ابزار داخلی مرورگر).
// برای فارسی، Intl خودش ارقام فارسی و تقویم شمسی را می‌دهد؛
// نیازی به هیچ کتابخانه اضافه‌ای نیست.
// =====================================================================
import { useMemo } from 'react'
import { useSettings, type Lang } from '../context/settings'

const locales: Record<Lang, string> = { en: 'en-US', fa: 'fa-IR' }

export function makeFormatters(lang: Lang) {
  const locale = locales[lang]
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const moneyExact = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
  const compact = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })
  const number = new Intl.NumberFormat(locale)
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' })
  const date = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' })
  const month = new Intl.DateTimeFormat(locale, { month: 'short' })

  return {
    money: (n: number) => money.format(n),
    moneyExact: (n: number) => moneyExact.format(n),
    compactMoney: (n: number) => compact.format(n),
    number: (n: number) => number.format(n),
    percent: (n: number) => percent.format(n),
    date: (iso: string) => date.format(new Date(iso)),
    month: (d: Date) => month.format(d),
  }
}

export type Formatters = ReturnType<typeof makeFormatters>

/** هوک: فرمت‌کننده‌ها بر اساس زبان فعلی */
export function useFormat(): Formatters {
  const { lang } = useSettings()
  return useMemo(() => makeFormatters(lang), [lang])
}
