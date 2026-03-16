import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, AlertCircle, Package } from 'lucide-react'
import { useProductStore } from '../../store/useProductStore'
import toast from 'react-hot-toast'

const CATEGORY_OPTIONS = ['all', 'women', 'men', 'accessories', 'shoes', 'bags']

function StockBadge({ stock }) {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>
  if (stock < 5) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{stock} left</span>
  if (stock < 10) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">{stock} left</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{stock} in stock</span>
}

export default function AdminProducts() {
  const { products, deleteProduct } = useProductStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [deleteId, setDeleteId] = useState(null)

  const filtered = products.filter((p) => {
    const matchCat = category === 'all' || p.category === category
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const confirmDelete = (id) => {
    deleteProduct(id)
    toast.success('Product deleted.')
    setDeleteId(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} items in catalog</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors
                ${category === cat ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600 w-14">#</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Product</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600">Category</th>
                <th className="text-right px-4 py-3.5 font-semibold text-slate-600">Price</th>
                <th className="text-center px-4 py-3.5 font-semibold text-slate-600">Stock</th>
                <th className="text-center px-4 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-center px-6 py-3.5 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <Package size={32} className="mx-auto mb-2 text-slate-300" />
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{product.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate max-w-[200px]">{product.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {product.isNew && (
                              <span className="px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600 font-medium">NEW</span>
                            )}
                            {product.isBestSeller && (
                              <span className="px-1.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-600 font-medium">BEST SELLER</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-semibold text-slate-900">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-slate-400 line-through">${product.originalPrice}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-xs text-slate-500">{product.stock > 0 ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Delete Product?</h3>
                <p className="text-sm text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
