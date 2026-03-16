import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as initialProducts } from '../data/products'

// ============================================================
//  PRODUCT STORE
//  Currently uses static mock data from src/data/products.js
//  and persists admin changes to localStorage.
//
//  To connect a real backend, replace addProduct / updateProduct /
//  deleteProduct with async API calls (see src/api/products.js).
// ============================================================

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,

      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now(),
          rating: product.rating ?? 0,
          reviews: product.reviews ?? 0,
          sold: product.sold ?? 0,
        }
        set((s) => ({ products: [...s.products, newProduct] }))
        return newProduct.id
      },

      updateProduct: (id, data) => {
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }))
      },

      deleteProduct: (id) => {
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
      },

      resetProducts: () => set({ products: initialProducts }),
    }),
    { name: 'luxe-products' }
  )
)
