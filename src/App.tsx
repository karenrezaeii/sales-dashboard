// مسیرهای برنامه: هر آدرس کدام صفحه را نشان دهد.
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'

// «بارگذاری تنبل» (lazy loading): کد هر صفحه فقط وقتی دانلود می‌شود که
// کاربر به آن صفحه برود. نتیجه: بارگذاری اولیه سریع‌تر.
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const CustomersPage = lazy(() => import('./pages/CustomersPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

/** نمایش موقت تا وقتی کد صفحه دانلود شود */
function PageLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <span className="size-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* همه صفحه‌ها داخل قالب مشترک (منو + نوار بالا) نمایش داده می‌شوند */}
      <Route element={<AppLayout />}>
        <Route index element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
        <Route path="orders" element={<Suspense fallback={<PageLoader />}><OrdersPage /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<PageLoader />}><ProductsPage /></Suspense>} />
        <Route path="customers" element={<Suspense fallback={<PageLoader />}><CustomersPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>} />
      </Route>
    </Routes>
  )
}
