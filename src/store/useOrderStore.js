import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_ORDERS } from '../api/orders'

// ============================================================
//  ORDER STORE
//  Uses mock orders from src/api/orders.js as initial data.
//  Changes are persisted to localStorage.
//
//  To connect a real backend, replace updateStatus / deleteOrder
//  with async API calls and remove the persist middleware if
//  orders are fetched fresh on each load.
// ============================================================

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: MOCK_ORDERS,

      updateStatus: (id, status) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }))
      },

      deleteOrder: (id) => {
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) }))
      },

      resetOrders: () => set({ orders: MOCK_ORDERS }),
    }),
    { name: 'luxe-orders' }
  )
)
