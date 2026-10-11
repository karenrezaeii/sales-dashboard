// =====================================================================
// «انبار» محصولات با useReducer.
// reducer تابعی است که می‌گوید با هر «اکشن» (افزودن، ویرایش، حذف)
// وضعیت چطور تغییر کند. این الگو همان ایده‌ی Redux است، ولی بدون
// نصب کتابخانه اضافه. تغییرات در localStorage ذخیره می‌شوند تا با
// رفرش صفحه از بین نروند.
// =====================================================================
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { products as seedProducts } from '../data/mock'
import type { Product } from '../data/types'

const STORAGE_KEY = 'dashboard-products'

type Action =
  | { type: 'add'; product: Product }
  | { type: 'update'; product: Product }
  | { type: 'delete'; id: string }
  | { type: 'reset' }

function reducer(state: Product[], action: Action): Product[] {
  switch (action.type) {
    case 'add':
      return [action.product, ...state]
    case 'update':
      return state.map((p) => (p.id === action.product.id ? action.product : p))
    case 'delete':
      return state.filter((p) => p.id !== action.id)
    case 'reset':
      return seedProducts
  }
}

function load(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Product[]
  } catch {
    /* داده خراب یا دسترسی نداریم: از داده اولیه استفاده کن */
  }
  return seedProducts
}

const ProductsContext = createContext<{ products: Product[]; dispatch: (a: Action) => void } | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {
      /* نادیده بگیر */
    }
  }, [products])

  return <ProductsContext.Provider value={{ products, dispatch }}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used inside <ProductsProvider>')
  return ctx
}
