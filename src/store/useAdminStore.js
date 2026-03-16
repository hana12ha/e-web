import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      login: (email, password) => {
        if (email === 'admin@luxe.com' && password === 'admin123') {
          set({ isAuthenticated: true, admin: { name: 'Admin', email } })
          return { success: true }
        }
        return { success: false, message: 'Invalid credentials.' }
      },
      logout: () => set({ isAuthenticated: false, admin: null }),
    }),
    { name: 'luxe-admin' }
  )
)
