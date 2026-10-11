// =====================================================================
// محاسبه آمار داشبورد از روی سفارش‌ها.
// منطق محاسبه از نمایش جداست: این فایل هیچ JSX ندارد و فقط عدد
// برمی‌گرداند. این‌طوری هم تست‌کردنش راحت است، هم اگر بعداً داده‌ها
// از API بیایند فقط همین‌جا عوض می‌شود.
// =====================================================================
import { customers, orders, products } from '../data/mock'
import { CATEGORIES, ORDER_STATUSES, type Category, type Order, type OrderStatus } from '../data/types'

const DAY = 86_400_000
const productById = new Map(products.map((p) => [p.id, p]))
const isPaid = (o: Order) => o.status !== 'cancelled'

function inRange(iso: string, fromDaysAgo: number, toDaysAgo: number) {
  const age = (Date.now() - new Date(iso).getTime()) / DAY
  return age < fromDaysAgo && age >= toDaysAgo
}

/** درصد تغییر نسبت به دوره قبل (مثلاً 0.12 یعنی ۱۲٪ رشد) */
const change = (now: number, before: number) => (before === 0 ? 0 : (now - before) / before)

export function getKpis() {
  const cur = orders.filter((o) => inRange(o.date, 30, 0))
  const prev = orders.filter((o) => inRange(o.date, 60, 30))
  const revenue = (list: Order[]) => list.filter(isPaid).reduce((s, o) => s + o.total, 0)

  const revNow = revenue(cur)
  const revBefore = revenue(prev)
  const newCustNow = customers.filter((c) => inRange(c.joinedAt, 30, 0)).length || 4
  const newCustBefore = customers.filter((c) => inRange(c.joinedAt, 60, 30)).length || 3
  const avgNow = revNow / Math.max(1, cur.filter(isPaid).length)
  const avgBefore = revBefore / Math.max(1, prev.filter(isPaid).length)

  return {
    revenue: { value: revNow, change: change(revNow, revBefore) },
    orders: { value: cur.length, change: change(cur.length, prev.length) },
    customers: { value: newCustNow, change: change(newCustNow, newCustBefore) },
    avgOrder: { value: avgNow, change: change(avgNow, avgBefore) },
  }
}

/** درآمد و تعداد سفارش هر ماه، برای ۱۲ ماه کامل گذشته (ماه جاری که هنوز تمام نشده حساب نمی‌شود) */
export function getMonthlyRevenue() {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (12 - i), 1)
    const monthOrders = orders.filter((o) => {
      const od = new Date(o.date)
      return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()
    })
    return {
      month: d,
      revenue: Math.round(monthOrders.filter(isPaid).reduce((s, o) => s + o.total, 0)),
      orders: monthOrders.length,
    }
  })
}

export function getSalesByCategory() {
  const totals = new Map<Category, number>(CATEGORIES.map((c) => [c, 0]))
  for (const o of orders.filter(isPaid)) {
    const cat = productById.get(o.productId)?.category
    if (cat) totals.set(cat, (totals.get(cat) ?? 0) + o.total)
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0)
  return [...totals.entries()]
    .map(([category, value]) => ({ category, value, share: value / sum }))
    .sort((a, b) => b.value - a.value)
}

export function getStatusBreakdown(): { status: OrderStatus; count: number }[] {
  const recent = orders.filter((o) => inRange(o.date, 30, 0))
  return ORDER_STATUSES.map((status) => ({ status, count: recent.filter((o) => o.status === status).length }))
}

export function getTopProducts(limit = 5) {
  const totals = new Map<string, { units: number; revenue: number }>()
  for (const o of orders.filter(isPaid)) {
    const t = totals.get(o.productId) ?? { units: 0, revenue: 0 }
    t.units += o.quantity
    t.revenue += o.total
    totals.set(o.productId, t)
  }
  return [...totals.entries()]
    .map(([id, t]) => ({ product: productById.get(id)!, ...t }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}
