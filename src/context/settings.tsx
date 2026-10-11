// =====================================================================
// تنظیمات سراسری: زبان و تم.
// با Context، هر کامپوننتی در هر عمقی می‌تواند به زبان/تم دسترسی داشته
// باشد، بدون اینکه آن را دست‌به‌دست از والد به فرزند پاس بدهیم.
// =====================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Dict } from '../i18n/en'
import { fa } from '../i18n/fa'

export type Lang = 'en' | 'fa'
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'dashboard-settings'
const dictionaries: Record<Lang, Dict> = { en, fa }

/** مسیرهای مجاز مثل "nav.orders" — تایپ‌اسکریپت اشتباه تایپی را می‌گیرد */
export type TKey = { [K in keyof Dict]: `${K & string}.${keyof Dict[K] & string}` }[keyof Dict]

interface SettingsValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  theme: Theme
  setLang: (l: Lang) => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  /** ترجمه: t('nav.orders') یا t('common.showing', { from: 1, to: 10, total: 50 }) */
  t: (key: TKey, vars?: Record<string, string | number>) => string
  /** نام محلی‌شده: برای فیلدهایی که هم en دارند هم fa */
  local: (v: { en: string; fa: string }) => string
}

const SettingsContext = createContext<SettingsValue | null>(null)

function readStored(): Partial<{ lang: Lang; theme: Theme }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const stored = readStored()
  const [lang, setLang] = useState<Lang>(stored.lang ?? 'en')
  const [theme, setTheme] = useState<Theme>(
    stored.theme ?? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  )
  const dir = lang === 'fa' ? 'rtl' : 'ltr'

  // هر بار زبان یا تم عوض شد: روی <html> اعمال و ذخیره کن
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    root.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, theme }))
    } catch {
      /* حالت خصوصی مرورگر: ذخیره نمی‌شود، مشکلی نیست */
    }
  }, [lang, theme, dir])

  const t = useCallback<SettingsValue['t']>(
    (key, vars) => {
      const [group, name] = key.split('.') as [keyof Dict, string]
      let text = (dictionaries[lang][group] as Record<string, string>)[name] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, String(v))
      }
      return text
    },
    [lang],
  )

  const value = useMemo<SettingsValue>(
    () => ({
      lang,
      dir,
      theme,
      setLang,
      setTheme,
      toggleTheme: () => setTheme((x) => (x === 'dark' ? 'light' : 'dark')),
      t,
      local: (v) => v[lang],
    }),
    [lang, dir, theme, t],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}
