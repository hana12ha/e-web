# LUXE — Premium Fashion Store Template

A production-ready React e-commerce template built for luxury and fashion brands. Fully frontend — no backend required out of the box.

---

## Features

- **Full storefront** — Home, Shop, Product Detail, Wishlist, Checkout, Account
- **Admin panel** at `/admin` — Products CRUD, Orders management, Customers
- **Dark mode** — System preference aware, user-toggleable
- **Responsive** — Mobile-first design, works on all devices
- **Animated** — Smooth transitions via Framer Motion
- **Cart & Wishlist** — Persisted to localStorage via Zustand
- **Search** — Live product search in the header
- **Filtering & Sorting** — By category, price, rating, sale, new arrivals
- **Easy customization** — Edit `src/config.js` to rebrand in minutes

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Zustand + persist | State management (localStorage) |
| Tailwind CSS v3 | Utility-first styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Customization

### 1. Rebrand the store

Edit **`src/config.js`** — all values propagate automatically throughout the app:

```js
export const config = {
  storeName: 'YOUR BRAND',
  storeTagline: 'Your tagline here',
  currency: '$',
  adminEmail: 'admin@yourdomain.com',
  adminPassword: 'change-me-before-launch',
  contact: {
    email: 'hello@yourdomain.com',
    phone: '+1 (555) 000-0000',
    address: '123 Your Street, City, Country',
  },
  social: {
    instagram: 'https://instagram.com/yourbrand',
    twitter: 'https://twitter.com/yourbrand',
  },
}
```

### 2. Update products

Edit **`src/data/products.js`** to replace the mock catalog with your real products. Each product follows this shape:

```js
{
  id: 1,
  name: 'Product Name',
  category: 'women', // women | men | accessories | shoes | bags
  price: 299,
  originalPrice: 420, // optional — shows a strikethrough price
  rating: 4.8,
  reviews: 124,
  sold: 89,
  stock: 12,
  isNew: true,
  isBestSeller: false,
  colors: ['#1a1a1a', '#c8a882'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  description: 'Product description...',
  features: ['Feature 1', 'Feature 2'],
  images: ['https://...', 'https://...'],
  tags: ['luxury', 'formal'],
}
```

---

## Connecting a Real Backend

The template ships with placeholder API layers in `src/api/`. Replace the function bodies to connect your backend.

### Option A — REST API

```js
// src/api/products.js
export const getProducts = async () => {
  const res = await fetch('https://your-api.com/products', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
```

### Option B — Supabase

```bash
npm install @supabase/supabase-js
```

```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// src/api/products.js
import { supabase } from '../lib/supabase'
export const getProducts = async () => {
  const { data } = await supabase.from('products').select('*')
  return data
}
```

### Option C — Firebase

```bash
npm install firebase
```

```js
// src/api/products.js
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../lib/firebase'
export const getProducts = async () => {
  const snap = await getDocs(collection(db, 'products'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
```

---

## Store Customization

Once you've connected a backend, update the Zustand stores (`src/store/`) to call your API functions and remove `persist` middleware if data is fetched server-side:

```js
// src/store/useProductStore.js — async backend example
export const useProductStore = create((set) => ({
  products: [],
  fetchProducts: async () => {
    const data = await getProducts()
    set({ products: data })
  },
  // ...
}))
```

---

## Admin Panel

Access at `/admin/login`

Default credentials (change in `src/config.js` before going live):
- **Email:** `admin@store.com`
- **Password:** `admin123`

The admin panel lets you:
- Add / edit / delete products
- Update order statuses
- View registered customers

> **Note:** In the template, admin changes are saved to localStorage. With a real backend, replace the store methods with API calls.

---

## Project Structure

```
src/
├── api/               # Backend connection points (replace with real calls)
│   ├── auth.js
│   ├── orders.js
│   └── products.js
├── components/
│   ├── layout/        # Header, Footer, CartDrawer
│   └── ui/            # Reusable UI components
├── config.js          # ⭐ Brand & store configuration
├── data/
│   └── products.js    # Mock product catalog
├── pages/
│   ├── admin/         # Admin panel pages
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Checkout.jsx
│   ├── Wishlist.jsx
│   ├── Login.jsx
│   └── Account.jsx
├── store/             # Zustand state management
│   ├── useAuthStore.js
│   ├── useCartStore.js
│   ├── useOrderStore.js
│   ├── useProductStore.js
│   ├── useThemeStore.js
│   └── useWishlistStore.js
└── lib/               # Third-party client setup (supabase, firebase, etc.)
```

---

## License

This template is sold for use in a single project. You may not resell or redistribute the source code.
