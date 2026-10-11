// فرم افزودن/ویرایش محصول با اعتبارسنجی ساده.
// «کنترل‌شده» (controlled): مقدار هر فیلد در state نگه داشته می‌شود.
import { useState, type FormEvent } from 'react'
import { CATEGORIES, type Category, type Product } from '../../data/types'
import { useSettings, type TKey } from '../../context/settings'
import Modal from '../ui/Modal'

interface Props {
  open: boolean
  product: Product | null // null یعنی محصول جدید
  onClose: () => void
  onSave: (p: Product) => void
}

type Values = { nameEn: string; nameFa: string; category: Category; price: string; stock: string }
type Errors = Partial<Record<keyof Values, TKey>>

const toValues = (p: Product | null): Values => ({
  nameEn: p?.name.en ?? '',
  nameFa: p?.name.fa ?? '',
  category: p?.category ?? 'electronics',
  price: p ? String(p.price) : '',
  stock: p ? String(p.stock) : '',
})

/** قوانین اعتبارسنجی: برمی‌گرداند کدام فیلدها خطا دارند */
function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.nameEn.trim()) e.nameEn = 'products.required'
  if (!v.nameFa.trim()) e.nameFa = 'products.required'
  if (v.price === '' || !(Number(v.price) > 0)) e.price = 'products.positive'
  if (v.stock === '' || Number(v.stock) < 0 || !Number.isInteger(Number(v.stock))) e.stock = 'products.positive'
  return e
}

export default function ProductForm(props: Props) {
  // key باعث می‌شود با هر بار باز شدن، فرم از نو و با مقادیر درست ساخته شود
  return props.open ? <FormBody key={props.product?.id ?? 'new'} {...props} /> : null
}

function FormBody({ open, product, onClose, onSave }: Props) {
  const { t } = useSettings()
  const [values, setValues] = useState<Values>(() => toValues(product))
  const [errors, setErrors] = useState<Errors>({})

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSave({
      id: product?.id ?? `P-${Date.now().toString().slice(-5)}`,
      name: { en: values.nameEn.trim(), fa: values.nameFa.trim() },
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      sold: product?.sold ?? 0,
      rating: product?.rating ?? 0,
    })
  }

  const field = (key: keyof Values, label: TKey, input: React.ReactNode) => (
    <div>
      <label htmlFor={key} className="mb-1.5 block text-sm font-medium">{t(label)}</label>
      {input}
      {errors[key] && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{t(errors[key]!)}</p>}
    </div>
  )
  const invalid = (key: keyof Values) => (errors[key] ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : '')

  return (
    <Modal
      open={open}
      title={t(product ? 'products.editTitle' : 'products.addTitle')}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" type="button" onClick={onClose}>{t('common.cancel')}</button>
          <button className="btn btn-primary" type="submit" form="product-form">{t('common.save')}</button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {field('nameEn', 'products.nameEn',
          <input id="nameEn" dir="ltr" className={`input ${invalid('nameEn')}`} value={values.nameEn} onChange={(e) => set('nameEn', e.target.value)} autoFocus />)}
        {field('nameFa', 'products.nameFa',
          <input id="nameFa" dir="rtl" className={`input ${invalid('nameFa')}`} value={values.nameFa} onChange={(e) => set('nameFa', e.target.value)} />)}
        {field('category', 'products.category',
          <select id="category" className="input" value={values.category} onChange={(e) => set('category', e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{t(`category.${c}`)}</option>)}
          </select>)}
        {field('price', 'products.price',
          <input id="price" type="number" min="0" step="0.01" dir="ltr" className={`input ${invalid('price')}`} value={values.price} onChange={(e) => set('price', e.target.value)} />)}
        {field('stock', 'products.stock',
          <input id="stock" type="number" min="0" step="1" dir="ltr" className={`input ${invalid('stock')}`} value={values.stock} onChange={(e) => set('stock', e.target.value)} />)}
      </form>
    </Modal>
  )
}
