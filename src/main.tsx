// نقطه شروع برنامه: React را به <div id="root"> وصل می‌کند.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/vazirmatn'
import './index.css'
import App from './App'
import { SettingsProvider } from './context/settings'
import { ProductsProvider } from './context/products'
import { ToastProvider } from './context/toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Providerها مثل لایه‌هایی دور برنامه‌اند: هر چیزی داخلشان باشد به آن‌ها دسترسی دارد */}
    <BrowserRouter>
      <SettingsProvider>
        <ToastProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </ToastProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
