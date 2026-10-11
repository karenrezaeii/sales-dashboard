import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite: ابزار ساخت و سرور توسعه (خیلی سریع)
// plugin-react: پشتیبانی از JSX/TSX و Fast Refresh
// tailwindcss: کامپایل کلاس‌های Tailwind
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
