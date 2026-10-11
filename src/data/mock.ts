// =====================================================================
// داده‌های نمونه.
// چون بک‌اند نداریم، داده‌ها اینجا ساخته می‌شوند. از یک «عدد تصادفی
// با بذر ثابت» (seeded random) استفاده می‌کنیم تا هر بار که صفحه
// باز می‌شود همان داده‌ها ساخته شوند، نه داده‌های جدید و متفاوت.
// بعداً می‌شود این فایل را با فراخوانی یک API واقعی عوض کرد.
// =====================================================================
import type { Customer, Order, OrderStatus, PaymentMethod, Product } from './types'

/** تولیدکننده عدد تصادفی قابل تکرار (الگوریتم mulberry32) */
function seeded(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = seeded(2026)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const between = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

// ---------- محصولات ----------
export const products: Product[] = [
  { id: 'P-101', name: { en: 'Wireless Headphones', fa: 'هدفون بی‌سیم' }, category: 'electronics', price: 129, stock: 42, sold: 318, rating: 4.6 },
  { id: 'P-102', name: { en: 'Smart Watch Pro', fa: 'ساعت هوشمند پرو' }, category: 'electronics', price: 249, stock: 18, sold: 204, rating: 4.4 },
  { id: 'P-103', name: { en: 'Mechanical Keyboard', fa: 'کیبورد مکانیکی' }, category: 'electronics', price: 89, stock: 65, sold: 187, rating: 4.7 },
  { id: 'P-104', name: { en: 'Leather Jacket', fa: 'کاپشن چرم' }, category: 'fashion', price: 199, stock: 12, sold: 96, rating: 4.3 },
  { id: 'P-105', name: { en: 'Running Sneakers', fa: 'کفش دویدن' }, category: 'sports', price: 110, stock: 54, sold: 265, rating: 4.5 },
  { id: 'P-106', name: { en: 'Yoga Mat', fa: 'زیرانداز یوگا' }, category: 'sports', price: 35, stock: 120, sold: 341, rating: 4.8 },
  { id: 'P-107', name: { en: 'Ceramic Coffee Set', fa: 'سرویس قهوه سرامیکی' }, category: 'home', price: 58, stock: 7, sold: 143, rating: 4.2 },
  { id: 'P-108', name: { en: 'Desk Lamp', fa: 'چراغ مطالعه' }, category: 'home', price: 45, stock: 0, sold: 178, rating: 4.1 },
  { id: 'P-109', name: { en: 'Design Patterns Book', fa: 'کتاب الگوهای طراحی' }, category: 'books', price: 39, stock: 80, sold: 122, rating: 4.9 },
  { id: 'P-110', name: { en: 'Skincare Kit', fa: 'پک مراقبت پوست' }, category: 'beauty', price: 72, stock: 33, sold: 158, rating: 4.4 },
  { id: 'P-111', name: { en: 'Cotton T-Shirt', fa: 'تی‌شرت نخی' }, category: 'fashion', price: 25, stock: 210, sold: 402, rating: 4.0 },
  { id: 'P-112', name: { en: 'Bluetooth Speaker', fa: 'اسپیکر بلوتوثی' }, category: 'electronics', price: 69, stock: 9, sold: 233, rating: 4.3 },
]

// ---------- مشتریان ----------
const people: [string, string][] = [
  ['Sara Ahmadi', 'سارا احمدی'], ['Ali Rezaei', 'علی رضایی'], ['Maryam Karimi', 'مریم کریمی'],
  ['Reza Mohammadi', 'رضا محمدی'], ['Negar Hosseini', 'نگار حسینی'], ['Amir Jafari', 'امیر جعفری'],
  ['Nazanin Moradi', 'نازنین مرادی'], ['Hamid Sadeghi', 'حمید صادقی'], ['Leila Rahimi', 'لیلا رحیمی'],
  ['Omid Kazemi', 'امید کاظمی'], ['Parisa Ebrahimi', 'پریسا ابراهیمی'], ['Saeed Ghasemi', 'سعید قاسمی'],
  ['Mina Bagheri', 'مینا باقری'], ['Kaveh Najafi', 'کاوه نجفی'], ['Elham Shams', 'الهام شمس'],
  ['Babak Taheri', 'بابک طاهری'], ['Shirin Zand', 'شیرین زند'], ['Arash Nouri', 'آرش نوری'],
]
const cities: [string, string][] = [
  ['Tehran', 'تهران'], ['Isfahan', 'اصفهان'], ['Shiraz', 'شیراز'], ['Tabriz', 'تبریز'], ['Mashhad', 'مشهد'], ['Rasht', 'رشت'],
]

const DAY = 86_400_000
const today = new Date()
today.setHours(12, 0, 0, 0)

export const customers: Customer[] = people.map(([en, fa], i) => {
  const [cityEn, cityFa] = pick(cities)
  return {
    id: `C-${2001 + i}`,
    name: { en, fa },
    email: `${en.split(' ')[0].toLowerCase()}.${en.split(' ')[1][0].toLowerCase()}@example.com`,
    city: { en: cityEn, fa: cityFa },
    joinedAt: new Date(today.getTime() - between(1, 420) * DAY).toISOString(),
  }
})

// ---------- سفارش‌ها (۱۲ ماه گذشته، با رشد تدریجی) ----------
const statusWeights: [OrderStatus, number][] = [
  ['delivered', 55], ['shipped', 15], ['processing', 12], ['pending', 10], ['cancelled', 8],
]
function weightedStatus(daysAgo: number): OrderStatus {
  // سفارش‌های قدیمی معمولاً تحویل شده‌اند
  if (daysAgo > 20) return rand() < 0.9 ? 'delivered' : 'cancelled'
  let r = rand() * 100
  for (const [s, w] of statusWeights) {
    if ((r -= w) < 0) return s
  }
  return 'delivered'
}
const payments: PaymentMethod[] = ['card', 'card', 'card', 'paypal', 'cash']

export const orders: Order[] = Array.from({ length: 640 }, () => {
  // توزیع بیشتر سفارش‌ها در ماه‌های اخیر (نمایش رشد)
  const daysAgo = Math.floor(Math.pow(rand(), 1.25) * 365)
  const product = pick(products)
  const quantity = rand() < 0.75 ? 1 : between(2, 4)
  return {
    id: '',
    customerId: pick(customers).id,
    productId: product.id,
    quantity,
    total: Math.round(product.price * quantity * 100) / 100,
    status: weightedStatus(daysAgo),
    payment: pick(payments),
    date: new Date(today.getTime() - daysAgo * DAY - between(0, 10) * 3_600_000).toISOString(),
  }
})
  .sort((a, b) => b.date.localeCompare(a.date))
  // شماره سفارش به ترتیب زمان: جدیدترین، بزرگ‌ترین شماره
  .map((o, i, all) => ({ ...o, id: `ORD-${10500 + all.length - i}` }))

export const customerById = new Map(customers.map((c) => [c.id, c]))
