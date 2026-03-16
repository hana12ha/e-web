import { useState } from 'react'
import { Search, ChevronDown, ShoppingCart, Trash2, AlertCircle } from 'lucide-react'
import { useOrderStore } from '../../store/useOrderStore'
import toast from 'react-hot-toast'

const STATUSES = ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled']

const STATUS_STYLES = {
  Delivered:   'bg-green-100 text-green-700',
  'In Transit':'bg-blue-100 text-blue-700',
  Shipped:     'bg-cyan-100 text-cyan-700',
  Processing:  'bg-yellow-100 text-yellow-700',
  Cancelled:   'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const { orders, updateStatus, deleteOrder } = useOrderStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState(null)

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleStatusChange = (id, status) => {
    updateStatus(id, status)
    toast.success(`Order ${id} marked as ${status}.`)
  }

  const handleDelete = (id) => {
    deleteOrder(id)
    toast.success('Order removed.')
    setDeleteId(null)
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-0.5">{orders.length} orders total</p>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Order ID</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Customer</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Items</th>
                <th className="text-right px-4 py-3.5 font-semibold text-slate-600">Total</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Date</th>
                <th className="text-center px-4 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-center px-6 py-3.5 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 text-slate-300" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">{order.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{order.customer.name}</p>
                      <p className="text-xs text-slate-400">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-xs text-slate-600">
                            {item.qty}× {item.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{order.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`appearance-none pr-6 pl-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setDeleteId(order.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove order"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Remove Order?</h3>
                <p className="text-sm text-slate-500">Order {deleteId} will be removed.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
