import type { ReactNode } from 'react'
import { Info, Moon, RotateCcw, Sun } from 'lucide-react'
import { useSettings, type Lang, type Theme } from '../context/settings'
import { useProducts } from '../context/products'
import { useToast } from '../context/toast'
import PageHeader from '../components/ui/PageHeader'

/** دکمه‌های گروهی (segmented control) برای انتخاب یک گزینه از چند گزینه */
function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition ${
            value === o.value ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Row({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { t, lang, setLang, theme, setTheme } = useSettings()
  const { dispatch } = useProducts()
  const toast = useToast()

  return (
    <>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card px-5 lg:col-span-2">
          <h2 className="border-b border-slate-100 py-4 font-semibold dark:border-slate-800">{t('settings.appearance')}</h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <Row title={t('settings.language')} hint={t('settings.languageHint')}>
              <Segmented<Lang> label={t('settings.language')} value={lang} onChange={setLang} options={[{ value: 'en', label: 'English' }, { value: 'fa', label: 'فارسی' }]} />
            </Row>
            <Row title={t('settings.theme')} hint={t('settings.themeHint')}>
              <Segmented<Theme>
                label={t('settings.theme')}
                value={theme}
                onChange={setTheme}
                options={[
                  { value: 'light', label: <><Sun className="size-4" />{t('settings.light')}</> },
                  { value: 'dark', label: <><Moon className="size-4" />{t('settings.dark')}</> },
                ]}
              />
            </Row>
            <Row title={t('settings.reset')} hint={t('settings.resetHint')}>
              <button className="btn btn-ghost" onClick={() => { dispatch({ type: 'reset' }); toast(t('settings.resetDone')) }}>
                <RotateCcw className="size-4" />
                {t('settings.reset')}
              </button>
            </Row>
          </div>
        </section>

        <section className="card h-fit p-5">
          <div className="flex items-center gap-2 font-semibold">
            <Info className="size-5 text-brand-600" />
            {t('settings.about')}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t('settings.aboutText')}</p>
          <div className="mt-4 flex flex-wrap gap-2" dir="ltr">
            {['React 19', 'TypeScript', 'Tailwind CSS 4', 'React Router', 'Recharts', 'TanStack Table', 'Vite'].map((x) => (
              <span key={x} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{x}</span>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
