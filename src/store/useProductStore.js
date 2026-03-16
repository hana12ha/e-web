import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useProductStore = create((set) => ({
  products: [],
  loading: true,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id')
    if (error) {
      set({ error: error.message, loading: false })
    } else {
      set({ products: (data || []).map(fromDb), loading: false })
    }
  },

  addProduct: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert([toDb(product)])
      .select()
      .single()
    if (error) { console.error(error); return null }
    const newProduct = fromDb(data)
    set((s) => ({ products: [...s.products, newProduct] }))
    return newProduct.id
  },

  updateProduct: async (id, product) => {
    const { error } = await supabase
      .from('products')
      .update(toDb(product))
      .eq('id', id)
    if (!error) {
      set((s) => ({
        products: s.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
      }))
    }
    return !error
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
    }
    return !error
  },

  resetProducts: () => set({ products: [], loading: false, error: null }),
}))

// ── Mappers ───────────────────────────────────────────────────

// DB row (snake_case) → app object (camelCase)
function fromDb(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : null,
    rating: Number(p.rating),
    reviews: p.reviews,
    sold: p.sold,
    stock: p.stock,
    isNew: p.is_new,
    isBestSeller: p.is_best_seller,
    colors: p.colors || [],
    sizes: p.sizes || [],
    description: p.description || '',
    features: p.features || [],
    images: p.images || [],
    tags: p.tags || [],
  }
}

// App object (camelCase) → DB row (snake_case), only defined keys
function toDb(p) {
  const row = {}
  if (p.name !== undefined)          row.name = p.name
  if (p.category !== undefined)      row.category = p.category
  if (p.price !== undefined)         row.price = p.price
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice
  if (p.rating !== undefined)        row.rating = p.rating
  if (p.reviews !== undefined)       row.reviews = p.reviews
  if (p.sold !== undefined)          row.sold = p.sold
  if (p.stock !== undefined)         row.stock = p.stock
  if (p.isNew !== undefined)         row.is_new = p.isNew
  if (p.isBestSeller !== undefined)  row.is_best_seller = p.isBestSeller
  if (p.colors !== undefined)        row.colors = p.colors
  if (p.sizes !== undefined)         row.sizes = p.sizes
  if (p.description !== undefined)   row.description = p.description
  if (p.features !== undefined)      row.features = p.features
  if (p.images !== undefined)        row.images = p.images
  if (p.tags !== undefined)          row.tags = p.tags
  return row
}
