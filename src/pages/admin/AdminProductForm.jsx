import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Save, Plus, X } from 'lucide-react'
import { useProductStore } from '../../store/useProductStore'
import toast from 'react-hot-toast'

const CATEGORIES = ['women', 'men', 'accessories', 'shoes', 'bags']

const EMPTY_FORM = {
  name: '',
  category: 'women',
  price: '',
  originalPrice: '',
  stock: '',
  isNew: false,
  isBestSeller: false,
  description: '',
  features: '',
  colors: '',
  sizes: '',
  images: '',
  tags: '',
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()
  const { products, addProduct, updateProduct } = useProductStore()
  const [form, setForm] = useState(EMPTY_FORM)
  const [colorInput, setColorInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      const product = products.find((p) => p.id === parseInt(id))
      if (!product) { toast.error('Product not found.'); navigate('/admin/products'); return }
      setForm({
        name: product.name,
        category: product.category,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        stock: String(product.stock),
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        description: product.description,
        features: product.features?.join('\n') || '',
        colors: product.colors?.join(', ') || '',
        sizes: product.sizes?.join(', ') || '',
        images: product.images?.join('\n') || '',
        tags: product.tags?.join(', ') || '',
      })
    }
  }, [id, isEditing, products, navigate])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required.')
    if (!form.price || isNaN(Number(form.price))) return toast.error('Valid price is required.')
    if (!form.stock || isNaN(Number(form.stock))) return toast.error('Valid stock is required.')

    setSaving(true)

    const data = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      isNew: form.isNew,
      isBestSeller: form.isBestSeller,
      description: form.description.trim(),
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      rating: isEditing ? undefined : 0,
      reviews: isEditing ? undefined : 0,
      sold: isEditing ? undefined : 0,
    }

    if (isEditing) {
      updateProduct(parseInt(id), data)
      toast.success('Product updated!')
    } else {
      addProduct(data)
      toast.success('Product added!')
    }

    setSaving(false)
    navigate('/admin/products')
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
  const textareaCls = `${inputCls} resize-none`

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{isEditing ? 'Update product details.' : 'Add a new item to your catalog.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Basic Info</h2>

              <Field label="Product Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Silk Draped Evening Gown"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price ($)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="289"
                    className={inputCls}
                  />
                </Field>
                <Field label="Original Price ($)" hint="Leave blank if no discount">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) => set('originalPrice', e.target.value)}
                    placeholder="420"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the product..."
                  className={textareaCls}
                />
              </Field>

              <Field label="Features" hint="One feature per line">
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => set('features', e.target.value)}
                  placeholder={"100% Pure Silk\nHand-finished seams\nMade in Italy"}
                  className={textareaCls}
                />
              </Field>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Images</h2>
              <Field label="Image URLs" hint="One URL per line (up to 3 recommended)">
                <textarea
                  rows={3}
                  value={form.images}
                  onChange={(e) => set('images', e.target.value)}
                  placeholder={"https://images.unsplash.com/photo-xxx\nhttps://..."}
                  className={textareaCls}
                />
              </Field>
              {/* Preview */}
              {form.images && (
                <div className="flex gap-3 flex-wrap">
                  {form.images.split('\n').filter(Boolean).map((url, i) => (
                    <img
                      key={i}
                      src={url.trim()}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-slate-100"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side fields */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Details</h2>

              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </Field>

              <Field label="Stock">
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  placeholder="12"
                  className={inputCls}
                />
              </Field>

              <Field label="Sizes" hint="Comma-separated">
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => set('sizes', e.target.value)}
                  placeholder="XS, S, M, L, XL"
                  className={inputCls}
                />
              </Field>

              <Field label="Colors" hint="Comma-separated hex codes">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => set('colors', e.target.value)}
                    placeholder="#1a1a1a, #c8a882"
                    className={`${inputCls} flex-1`}
                  />
                </div>
                {/* Color previews */}
                {form.colors && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {form.colors.split(',').map((c) => c.trim()).filter(Boolean).map((hex, i) => (
                      <div
                        key={i}
                        title={hex}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Tags" hint="Comma-separated">
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="luxury, formal, silk"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Badges</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.isNew ? 'bg-purple-600' : 'bg-slate-200'}`}
                  onClick={() => set('isNew', !form.isNew)}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isNew ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Mark as New</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.isBestSeller ? 'bg-purple-600' : 'bg-slate-200'}`}
                  onClick={() => set('isBestSeller', !form.isBestSeller)}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isBestSeller ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Best Seller</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save size={16} /> {isEditing ? 'Save Changes' : 'Add Product'}</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
