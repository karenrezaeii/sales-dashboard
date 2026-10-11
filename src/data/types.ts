// =====================================================================
// تعریف «شکل» داده‌ها با TypeScript.
// هر جای برنامه که از این نوع‌ها استفاده کند، اگر فیلدی جا بیفتد یا
// اشتباه نوشته شود، TypeScript قبل از اجرا خطا می‌دهد.
// =====================================================================

/** متنی که هم نسخه انگلیسی دارد هم فارسی */
export type Localized = { en: string; fa: string }

export type Category = 'electronics' | 'fashion' | 'home' | 'sports' | 'books' | 'beauty'

export const CATEGORIES: Category[] = ['electronics', 'fashion', 'home', 'sports', 'books', 'beauty']

export interface Product {
  id: string
  name: Localized
  category: Category
  price: number // دلار
  stock: number
  sold: number
  rating: number // ۱ تا ۵
}

export interface Customer {
  id: string
  name: Localized
  email: string
  city: Localized
  joinedAt: string // ISO date
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export type PaymentMethod = 'card' | 'paypal' | 'cash'

export interface Order {
  id: string
  customerId: string
  productId: string
  quantity: number
  total: number
  status: OrderStatus
  payment: PaymentMethod
  date: string // ISO date
}
