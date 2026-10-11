import { BookOpen, Dumbbell, Home, Laptop, Shirt, Sparkles, type LucideIcon } from 'lucide-react'
import type { Category } from '../data/types'

/** آیکون و رنگ هر دسته‌بندی — یک‌جا تعریف شده تا همه‌جا یکسان باشد */
export const categoryMeta: Record<Category, { icon: LucideIcon; color: string; soft: string }> = {
  electronics: { icon: Laptop, color: '#6366f1', soft: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' },
  fashion: { icon: Shirt, color: '#ec4899', soft: 'bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300' },
  home: { icon: Home, color: '#f59e0b', soft: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' },
  sports: { icon: Dumbbell, color: '#10b981', soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300' },
  books: { icon: BookOpen, color: '#0ea5e9', soft: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300' },
  beauty: { icon: Sparkles, color: '#a855f7', soft: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300' },
}
