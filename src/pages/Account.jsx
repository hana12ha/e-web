import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, Settings, LogOut, ShoppingBag, MapPin, CreditCard, Bell, Camera } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useCartStore } from '../store/useCartStore'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Saved Items', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const mockOrders = [
  { id: '#LX-2024-001', date: 'Jan 15, 2026', status: 'Delivered', total: 289, items: 1 },
  { id: '#LX-2024-002', date: 'Feb 3, 2026', status: 'In Transit', total: 630, items: 2 },
  { id: '#LX-2024-003', date: 'Mar 10, 2026', status: 'Processing', total: 450, items: 1 },
]

function StatusBadge({ status }) {
  const map = {
    Delivered: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  }
  return <span className={`badge ${map[status] || 'badge-primary'}`}>{status}</span>
}

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, logout } = useAuthStore()
  const { items: wishlistItems } = useWishlistStore()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-white dark:bg-dark-900">
        <div className="text-center">
          <p className="text-dark-500 mb-4">Please sign in to view your account</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    toast('See you soon!', { icon: '👋' })
    navigate('/')
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative group">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>
                <h2 className="font-semibold text-dark-900 dark:text-white mt-3">{user.name}</h2>
                <p className="text-xs text-dark-400">{user.email}</p>
                <span className="badge badge-primary mt-2 text-[10px]">Premium Member</span>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-dark-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                      <span className="ml-auto badge badge-primary text-[10px]">{wishlistItems.length}</span>
                    )}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all mt-4"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="card p-6 md:p-8"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-6">My Profile</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'First Name', value: user.name.split(' ')[0] },
                      { label: 'Last Name', value: user.name.split(' ')[1] || '' },
                      { label: 'Email', value: user.email },
                      { label: 'Phone', value: '+1 (555) 000-0000' },
                    ].map((f) => (
                      <div key={f.label} className={f.label === 'Email' ? 'col-span-2' : ''}>
                        <label className="block text-xs font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-1.5">{f.label}</label>
                        <input type="text" defaultValue={f.value} className="input-field" />
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary mt-6">Save Changes</button>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-6">My Orders</h2>
                  {mockOrders.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingBag size={40} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-dark-500">No orders yet</p>
                      <Link to="/shop" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="p-4 bg-gray-50 dark:bg-dark-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-dark-900 dark:text-white text-sm">{order.id}</p>
                            <p className="text-xs text-dark-400 mt-0.5">{order.date} · {order.items} item{order.items !== 1 ? 's' : ''}</p>
                          </div>
                          <StatusBadge status={order.status} />
                          <div className="text-right">
                            <p className="font-bold text-dark-900 dark:text-white">${order.total}</p>
                            <button className="text-xs text-primary-600 hover:underline mt-0.5">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-6">Saved Items</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart size={40} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-dark-500 mb-4">Nothing saved yet</p>
                      <Link to="/shop" className="btn-primary inline-flex">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlistItems.map((p) => (
                        <Link key={p.id} to={`/product/${p.id}`} className="group">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-700">
                            <img src={p.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = `https://picsum.photos/seed/${p.id}/200/267` }} />
                          </div>
                          <p className="text-xs font-medium text-dark-700 dark:text-dark-200 mt-2 line-clamp-2">{p.name}</p>
                          <p className="text-xs font-bold text-dark-900 dark:text-white mt-0.5">${p.price}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-dark-900 dark:text-white mb-6">Settings</h2>
                  <div className="space-y-6">
                    {[
                      { icon: Bell, title: 'Notifications', desc: 'Email notifications for new arrivals and sale alerts' },
                      { icon: MapPin, title: 'Saved Addresses', desc: 'Manage your delivery addresses' },
                      { icon: CreditCard, title: 'Payment Methods', desc: 'Manage saved cards and payment options' },
                    ].map((s) => (
                      <div key={s.title} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                            <s.icon size={18} className="text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-dark-800 dark:text-dark-100">{s.title}</p>
                            <p className="text-xs text-dark-400">{s.desc}</p>
                          </div>
                        </div>
                        <button className="text-xs text-primary-600 hover:underline">Manage</button>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
                      <button className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-2">
                        <LogOut size={15} /> Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
