// ============================================================
//  AUTH API — Backend Connection Point
// ============================================================
//
//  Currently stores users in localStorage (demo only).
//  Passwords are NOT hashed — do not use in production as-is.
//
//  To connect a real auth system, replace the functions below:
//
//  REST API example:
//    export const loginUser = async (email, password) => {
//      const res = await fetch('/api/auth/login', {
//        method: 'POST',
//        body: JSON.stringify({ email, password }),
//        headers: { 'Content-Type': 'application/json' },
//      })
//      if (!res.ok) throw new Error('Invalid credentials')
//      return res.json() // { user, token }
//    }
//
//  Supabase example:
//    import { supabase } from '../lib/supabase'
//    export const loginUser = async (email, password) => {
//      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
//      if (error) throw new Error(error.message)
//      return data.user
//    }
//
// ============================================================

const USERS_KEY = 'store-users'

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users))

export const loginUser = (email, password) => {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password.')
  const { password: _, ...safeUser } = user
  return safeUser
}

export const registerUser = (name, email, password) => {
  const users = getUsers()
  if (users.find((u) => u.email === email)) throw new Error('Email already in use.')
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // ⚠️  Hash this in production (e.g. with bcrypt on the server)
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c13def&color=fff&size=128`,
    joinedAt: new Date().toISOString(),
    orders: [],
  }
  saveUsers([...users, newUser])
  const { password: _, ...safeUser } = newUser
  return safeUser
}

export const updateUserProfile = (id, data) => {
  const users = getUsers()
  const updated = users.map((u) => (u.id === id ? { ...u, ...data } : u))
  saveUsers(updated)
}

export const getCustomers = () =>
  getUsers().map(({ password: _, ...u }) => u)
