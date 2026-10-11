// قالب اصلی: منوی کناری + نوار بالا + محتوای صفحه (Outlet)
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // با رفتن به صفحه دیگر، منوی موبایل بسته شود و صفحه به بالا برود
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-screen lg:ps-64">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-h-screen flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* اینجا صفحه فعلی (بر اساس آدرس) نمایش داده می‌شود */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
