import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'
import { useAuthStore } from './store/useAuthStore'
import { useProductStore } from './store/useProductStore'
import { useOrderStore } from './store/useOrderStore'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartDrawer from './components/layout/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Account from './pages/Account'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import { useAdminStore } from './store/useAdminStore'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-900 transition-colors duration-300">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

function NoLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
      <CartDrawer />
      {children}
    </div>
  )
}

export default function App() {
  const { init } = useThemeStore()
  const { init: initAuth } = useAuthStore()
  const { init: initAdmin } = useAdminStore()
  const { fetchProducts } = useProductStore()
  const { fetchOrders } = useOrderStore()

  useEffect(() => {
    init()
    initAuth()
    initAdmin()
    fetchProducts()
    fetchOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg, #1a1a1a)',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
      <Routes>
        {/* Full layout with header + footer */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/account" element={<Layout><Account /></Layout>} />

        {/* Auth pages (no footer) */}
        <Route path="/login" element={<NoLayout><Login /></NoLayout>} />

        {/* Admin routes (no store header/footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <Layout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20">
              <div className="text-8xl mb-6 font-display font-bold text-gradient">404</div>
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Page Not Found</h2>
              <p className="text-dark-400 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">Back to Home</a>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}
