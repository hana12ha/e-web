import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, selectedColor, selectedSize, qty = 1) => {
        const key = `${product.id}-${selectedColor}-${selectedSize}`
        const existing = get().items.find((i) => i.key === key)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + qty } : i
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              { ...product, key, selectedColor, selectedSize, qty },
            ],
          })
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => i.key !== key) }),

      updateQty: (key, qty) => {
        if (qty < 1) {
          get().removeItem(key)
          return
        }
        set({ items: get().items.map((i) => (i.key === key ? { ...i, qty } : i)) })
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0)
      },
    }),
    { name: 'luxe-cart' }
  )
)
