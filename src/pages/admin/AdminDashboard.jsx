import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, Star, ArrowRight } from 'lucide-react'
import { useProductStore } from '../../store/useProductStore'
import { useOrderStore } from '../../store/useOrderStore'
import { getCustomers } from '../../api/auth'

const STATUS_COLORS = {
  Delivered: 'bg-green-100 text-green-700',
  'In Transit': 'bg-blue-100 text-blue-700',
  Shipped: 'bg-cyan-100 text-cyan-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-slate-600 font-medium text-sm">{label}</p>
      {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { products } = useProductStore()
  const { orders } = useOrderStore()
  const customerCount = getCustomers().length

  const stats = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.sold || 0), 0)
    const lowStock = products.filter((p) => p.stock < 5).length
    const avgRating = products.length
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length
      : 0
    const activeOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length
    return { totalRevenue, lowStock, avgRating, activeOrders }
  }, [products, orders])

  const categoryMap = useMemo(() => {
    const map = {}
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [products])

  const recentProducts = [...products].slice(-5).reverse()
  const recentOrders = orders.slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back — here's what's happening in your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          sub={`${stats.lowStock} low stock`}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}k`}
          sub="All-time sales value"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Active Orders"
          value={stats.activeOrders}
          sub={`${orders.length} orders total`}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={customerCount}
          sub="Registered accounts"
          color="bg-orange-100 text-orange-600"
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-purple-600 text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 mt-0.5 truncate">{order.customer.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Category breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">By Category</h2>
            <div className="space-y-3">
              {categoryMap.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-slate-600 font-medium">{cat}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(count / products.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock alert */}
          {stats.lowStock > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-amber-500" />
                <span className="font-semibold text-amber-800 text-sm">Low Stock Alert</span>
              </div>
              {products
                .filter((p) => p.stock < 5)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-amber-100 last:border-0">
                    <span className="text-xs text-amber-700 truncate pr-2">{p.name}</span>
                    <span className="text-xs font-bold text-amber-700 flex-shrink-0">{p.stock} left</span>
                  </div>
                ))}
              <Link
                to="/admin/products"
                className="block text-center mt-3 text-xs font-medium text-amber-700 hover:text-amber-900"
              >
                Manage inventory →
              </Link>
            </div>
          )}

          {/* Avg Rating */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Star size={22} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.avgRating.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Avg product rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
