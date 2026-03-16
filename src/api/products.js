// ============================================================
//  PRODUCTS API — Backend Connection Point
// ============================================================
//
//  Currently uses mock data from src/data/products.js
//
//  To connect your own backend, replace each function body:
//
//  REST API example:
//    export const getProducts = async () => {
//      const res = await fetch('https://your-api.com/products')
//      return res.json()
//    }
//
//  Supabase example:
//    import { supabase } from '../lib/supabase'
//    export const getProducts = async () => {
//      const { data } = await supabase.from('products').select('*')
//      return data
//    }
//
//  Firebase example:
//    import { getDocs, collection } from 'firebase/firestore'
//    export const getProducts = async () => {
//      const snap = await getDocs(collection(db, 'products'))
//      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
//    }
//
// ============================================================

import { products } from '../data/products'

export const getProducts = async () => products

export const getProduct = async (id) =>
  products.find((p) => p.id === id) || null

export const createProduct = async (data) => ({
  ...data,
  id: Date.now(),
  rating: 0,
  reviews: 0,
  sold: 0,
})

export const updateProduct = async (id, data) => ({ id, ...data })

export const deleteProduct = async (id) => ({ success: true })
