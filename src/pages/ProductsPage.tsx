import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { CATEGORIES, type Category, type Product } from '../data/types'
import { useSettings } from '../context/settings'
import { useProducts } from '../context/products'
import { useToast } from '../context/toast'
import { categoryMeta } from '../lib/categories'
import { useFormat } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import ProductForm from '../components/products/ProductForm'

function stockLevel(stock: number) {
  if (stock === 0) return { key: 'products.outOfStock', cls: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' } as const
  if (stock < 15) return { key: 'products.lowStock', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' } as const
  return { key: 'products.inStock', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' } as const
}

export default function ProductsPage() {
  const { t, local } = useSettings()
  const f = useFormat()
  const toast = useToast()
  const { products, dispatch } = useProducts()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [editing, setEditing] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || p.name.en.toLowerCase().includes(q) || p.name.fa.includes(q) || p.id.toLowerCase().includes(q)),
    )
  }, [products, query, category])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const save = (p: Product) => {
    dispatch({ type: editing ? 'update' : 'add', product: p })
    setFormOpen(false)
    toast(t('products.saved'))
  }

  const confirmDelete = () => {
    if (!deleting) return
    dispatch({ type: 'delete', id: deleting.id })
    setDeleting(null)
    toast(t('products.deleted'))
  }

  return (
    <>
      <PageHeader
        title={t('products.title')}
        subtitle={t('products.subtitle')}
        actions={
          <button className="btn btn-primary" onClick={openNew}>
            <Plus className="size-4" />
            {t('products.add')}
          </button>
        }
      />

      {/* جستجو و فیلتر دسته‌بندی */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input type="search" className="input ps-9" placeholder={t('topbar.search')} aria-label={t('topbar.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input sm:w-48" value={category} onChange={(e) => setCategory(e.target.value as Category | 'all')} aria-label={t('products.category')}>
          <option value="all">{t('common.all')}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(`category.${c}`)}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="card">
          <EmptyState onClear={() => { setQuery(''); setCategory('all') }} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {visible.map((p) => {
            const meta = categoryMeta[p.category]
            const Icon = meta.icon
            const level = stockLevel(p.stock)
            return (
              <article key={p.id} className="card group flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                {/* تصویر محصول (فعلاً آیکون دسته‌بندی روی پس‌زمینه رنگی) */}
                <div className="relative grid h-36 place-items-center overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${meta.color}1f, ${meta.color}0a)` }}>
                  <Icon className="size-14 transition duration-300 group-hover:scale-110" style={{ color: meta.color }} strokeWidth={1.5} />
                  <span className={`absolute start-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium ${level.cls}`}>{t(level.key)}</span>
                  {/* دکمه‌های ویرایش/حذف — با هاور (و همیشه در موبایل) دیده می‌شوند */}
                  <div className="absolute end-2 top-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button className="grid size-8 place-items-center rounded-lg bg-white/90 text-slate-700 shadow-sm hover:text-brand-600 dark:bg-slate-900/90 dark:text-slate-200" onClick={() => { setEditing(p); setFormOpen(true) }} aria-label={`${t('common.edit')} ${local(p.name)}`}>
                      <Pencil className="size-4" />
                    </button>
                    <button className="grid size-8 place-items-center rounded-lg bg-white/90 text-slate-700 shadow-sm hover:text-rose-600 dark:bg-slate-900/90 dark:text-slate-200" onClick={() => setDeleting(p)} aria-label={`${t('common.delete')} ${local(p.name)}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t(`category.${p.category}`)} · <span dir="ltr">{p.id}</span></p>
                  <h3 className="mt-1 font-semibold">{local(p.name)}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span className="tabular">{p.rating ? f.number(p.rating) : '—'}</span>
                    <span className="mx-1">·</span>
                    <span>{t('dashboard.unitsSold', { count: f.number(p.sold) })}</span>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <p className="tabular text-lg font-bold">{f.moneyExact(p.price)}</p>
                    <p className="tabular text-sm text-slate-500 dark:text-slate-400">{t('products.stock')}: {f.number(p.stock)}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <ProductForm open={formOpen} product={editing} onClose={() => setFormOpen(false)} onSave={save} />

      {/* تأیید حذف */}
      <Modal
        open={!!deleting}
        size="sm"
        title={t('products.deleteTitle')}
        onClose={() => setDeleting(null)}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleting(null)}>{t('common.cancel')}</button>
            <button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={confirmDelete}>
              <Trash2 className="size-4" />
              {t('common.delete')}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">{deleting && t('products.deleteText', { name: local(deleting.name) })}</p>
      </Modal>
    </>
  )
}
