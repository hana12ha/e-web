import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Call once on app mount — restores session & listens for changes
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const profile = await fetchProfile(session.user.id)
      set({
        user: buildUser(session.user, profile),
        isAuthenticated: true,
        loading: false,
      })
    } else {
      set({ loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        set({ user: buildUser(session.user, profile), isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    })
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    return { success: true }
  },

  register: async (name, email, password) => {
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c13def&color=fff&size=128`
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, avatar } },
    })
    if (error) return { success: false, message: error.message }
    // Note: if email confirmation is ON in Supabase, user won't be logged in yet.
    // To disable: Supabase Dashboard → Authentication → Providers → Email → "Confirm email" OFF
    return { success: true }
  },

  logout: async () => {
    await supabase.auth.signOut()
  },

  updateProfile: async (data) => {
    const { user } = get()
    if (!user) return
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id)
    if (!error) set({ user: { ...user, ...data } })
  },
}))

// ── Helpers ──────────────────────────────────────────────────

async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('name, avatar, role')
    .eq('id', userId)
    .single()
  return data
}

function buildUser(authUser, profile) {
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile?.name || authUser.user_metadata?.name || '',
    avatar: profile?.avatar || authUser.user_metadata?.avatar || '',
    joinedAt: authUser.created_at,
    orders: [],
  }
}
