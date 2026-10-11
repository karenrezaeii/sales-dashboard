import { DollarSign, Receipt, ShoppingBag, UserPlus } from 'lucide-react'
import { useSettings } from '../context/settings'
import { useFormat } from '../lib/format'
import { getKpis, getMonthlyRevenue } from '../lib/stats'
import PageHeader from '../components/ui/PageHeader'
import KpiCard from '../components/dashboard/KpiCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown'
import StatusDonut from '../components/dashboard/StatusDonut'
import RecentOrders from '../components/dashboard/RecentOrders'
import TopProducts from '../components/dashboard/TopProducts'

// محاسبات یک بار انجام می‌شوند (داده‌ها ثابت‌اند)
const kpis = getKpis()
const monthly = getMonthlyRevenue()

export default function DashboardPage() {
  const { t } = useSettings()
  const f = useFormat()

  return (
    <>
      <PageHeader title={t('dashboard.greeting')} subtitle={t('dashboard.subtitle')} />

      {/* ردیف ۱: کارت‌های آمار — در موبایل ۱ ستون، تبلت ۲، دسکتاپ ۴ */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={t('dashboard.revenue')} value={f.money(kpis.revenue.value)} change={kpis.revenue.change} icon={DollarSign} color="#6366f1" trend={monthly.map((m) => m.revenue)} />
        <KpiCard label={t('dashboard.orders')} value={f.number(kpis.orders.value)} change={kpis.orders.change} icon={ShoppingBag} color="#0ea5e9" trend={monthly.map((m) => m.orders)} />
        <KpiCard label={t('dashboard.customers')} value={f.number(kpis.customers.value)} change={kpis.customers.change} icon={UserPlus} color="#10b981" trend={[3, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9]} />
        <KpiCard label={t('dashboard.avgOrder')} value={f.moneyExact(kpis.avgOrder.value)} change={kpis.avgOrder.change} icon={Receipt} color="#f59e0b" trend={monthly.map((m) => (m.orders ? m.revenue / m.orders : 0))} />
      </section>

      {/* ردیف ۲: نمودار درآمد + فروش دسته‌بندی */}
      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <CategoryBreakdown />
      </section>

      {/* ردیف ۳: آخرین سفارش‌ها + وضعیت و پرفروش‌ها */}
      <section className="mt-4 grid items-start gap-4 lg:grid-cols-3">
        <RecentOrders />
        <div className="grid gap-4">
          <StatusDonut />
          <TopProducts />
        </div>
      </section>
    </>
  )
}
