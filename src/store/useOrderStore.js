import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) {
      set({ orders: (data || []).map(fromDb), loading: false })
    } else {
      set({ loading: false })
    }
  },

  updateStatus: async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      set((s) => ({
        orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }))
    }
  },

  deleteOrder: async (id) => {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (!error) {
      set((s) => ({ orders: s.orders.filter((o) => o.id !== id) }))
    }
  },
}))

// ── Mapper ────────────────────────────────────────────────────

function fromDb(o) {
  return {
    id: o.id,
    customer: { name: o.customer_name, email: o.customer_email },
    items: o.items || [],
    total: Number(o.total),
    status: o.status,
    date: o.date,
    address: o.address,
  }
}
