// =====================================================================
// پیام‌های کوتاه (Toast) مثل «محصول ذخیره شد».
// =====================================================================
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext<(message: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])

  const show = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { id, message }])
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 2800)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed bottom-4 end-4 z-50 flex flex-col gap-2" role="status" aria-live="polite">
        {toasts.map((x) => (
          <div
            key={x.id}
            className="flex animate-[toast-in_.25s_ease-out] items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-white dark:text-slate-900"
          >
            <CheckCircle2 className="size-4 text-emerald-400 dark:text-emerald-600" />
            {x.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
