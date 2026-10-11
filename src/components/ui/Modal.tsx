// پنجره بازشو (Modal) با رعایت دسترس‌پذیری:
// - با Escape بسته می‌شود
// - کلیک روی پس‌زمینه آن را می‌بندد
// - هنگام باز بودن، اسکرول صفحه پشتی قفل می‌شود
import { useEffect, useId, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useSettings } from '../../context/settings'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md'
}

export default function Modal({ open, title, onClose, children, footer, size = 'md' }: Props) {
  const { t } = useSettings()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 animate-[fade-in_.2s] bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`card relative w-full animate-[pop-in_.22s_ease-out] ${size === 'sm' ? 'max-w-sm' : 'max-w-lg'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 id={titleId} className="text-base font-semibold">{title}</h2>
          <button className="icon-btn -me-2" onClick={onClose} aria-label={t('common.close')}>
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  )
}
