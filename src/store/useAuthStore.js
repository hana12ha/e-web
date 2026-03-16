import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginUser, registerUser, updateUserProfile } from '../api/auth'

// ============================================================
//  AUTH STORE
//  Uses localStorage-based mock auth (via src/api/auth.js).
//
//  To connect a real auth system (Supabase, Firebase, REST API),
//  replace login / register / logout with async calls and update
//  the persist strategy as needed.
// ============================================================

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        try {
          const user = loginUser(email, password)
          set({ user, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          return { success: false, message: err.message }
        }
      },

      register: (name, email, password) => {
        try {
          const user = registerUser(name, email, password)
          set({ user, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          return { success: false, message: err.message }
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: (data) => {
        const { user } = get()
        if (!user) return
        updateUserProfile(user.id, data)
        set({ user: { ...user, ...data } })
      },
    }),
    { name: 'luxe-auth' }
  )
)
