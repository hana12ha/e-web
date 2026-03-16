import { useState, useEffect } from 'react'
import { Search, Users, Trash2, AlertCircle, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [viewCustomer, setViewCustomer] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar, created_at')
      .order('created_at', { ascending: false })
    if (!error) setCustomers(data || [])
    setLoading(false)
  }

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    // Deleting from auth.users cascades to profiles (via FK)
    const { error } = await supabase.auth.admin.deleteUser(id).catch(() => ({ error: true }))
    // If admin API not available with anon key, just remove from profiles table
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', id)
    if (!profileError) {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
      toast.success('Customer removed.')
    } else {
      toast.error('Could not delete customer.')
    }
    setDeleteId(null)
    if (viewCustomer?.id === id) setViewCustomer(null)
  }

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
    catch { return iso }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-slate-500 text-sm mt-0.5">{customers.length} registered accounts</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <span className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No customers yet.</p>
            <p className="text-sm mt-1">Customers appear here once they register on the storefront.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">User ID</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Joined</th>
                  <th className="text-center px-6 py-3.5 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400">No customers match your search.</td>
                  </tr>
                ) : (
                  filtered.map((customer) => (
                    <tr key={customer.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} className="w-9 h-9 rounded-full object-cover bg-slate-100" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                              {customer.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <span className="font-medium text-slate-900">{customer.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-slate-400">{customer.id.slice(0, 8)}…</span>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs">{formatDate(customer.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewCustomer(customer)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setDeleteId(customer.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
        )}
      </div>

      {/* View modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-start justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Customer Details</h3>
              <button onClick={() => setViewCustomer(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              {viewCustomer.avatar ? (
                <img src={viewCustomer.avatar} alt={viewCustomer.name} className="w-16 h-16 rounded-full object-cover border-2 border-purple-100" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                  {viewCustomer.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-lg">{viewCustomer.name || '—'}</p>
                <p className="text-slate-400 text-xs font-mono">{viewCustomer.id.slice(0, 16)}…</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Joined</span>
                <span className="text-slate-700">{formatDate(viewCustomer.created_at)}</span>
              </div>
            </div>
            <button
              onClick={() => setViewCustomer(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Delete Customer?</h3>
                <p className="text-sm text-slate-500">Their profile data will be removed.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
