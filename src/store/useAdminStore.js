import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAdminStore = create((set) => ({
  isAuthenticated: false,
  admin: null,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', session.user.id)
      .single()
    if (profile?.role === 'admin') {
      set({ isAuthenticated: true, admin: { name: profile.name, email: session.user.email } })
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', data.user.id)
      .single()
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      return { success: false, message: 'Access denied. Not an admin account.' }
    }
    set({ isAuthenticated: true, admin: { name: profile.name, email: data.user.email } })
    return { success: true }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ isAuthenticated: false, admin: null })
  },
}))
