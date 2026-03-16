import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Heart, User, Search, Moon, Sun, Menu, X, ChevronDown
} from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useThemeStore } from '../../store/useThemeStore'
import { useProductStore } from '../../store/useProductStore'
import { categories } from '../../data/products'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop', hasDropdown: true },
  { label: 'Collections', path: '/shop?sort=new' },
  { label: 'Sale', path: '/shop?sale=true' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [shopDropdown, setShopDropdown] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const { openCart } = useCartStore()
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const { isAuthenticated, user, loading: authLoading } = useAuthStore()
  const { products } = useProductStore()
  const { dark, toggle: toggleTheme } = useThemeStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location])

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return }
    const q = searchQuery.toLowerCase()
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    ).slice(0, 5)
    setSearchResults(results)
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100)
  }, [searchOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled && !mobileOpen && !searchOpen

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? 'bg-transparent'
            : 'glass border-b border-white/10 dark:border-dark-700/50'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
                <span className="text-white font-display font-bold text-lg leading-none">L</span>
              </div>
              <span className={`font-display font-bold text-xl tracking-wide transition-colors ${transparent ? 'text-white' : 'text-dark-900 dark:text-white'}`}>
                LUXE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group/nav">
                  <Link
                    to={link.path}
                    onMouseEnter={() => link.hasDropdown && setShopDropdown(true)}
                    onMouseLeave={() => link.hasDropdown && setShopDropdown(false)}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      transparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : location.pathname === link.path
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                        : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={13} className="mt-0.5" />}
                  </Link>

                  {/* Shop Dropdown */}
                  {link.hasDropdown && (
                    <div
                      onMouseEnter={() => setShopDropdown(true)}
                      onMouseLeave={() => setShopDropdown(false)}
                      className={`absolute top-full left-0 mt-1 w-48 card p-2 shadow-card-hover transition-all duration-200 ${shopDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                    >
                      {categories.filter(c => c.id !== 'all').map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors capitalize"
                        >
                          <span className="text-base">{cat.icon}</span>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  transparent
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                <Search size={19} />
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 hidden sm:flex items-center justify-center rounded-xl transition-all duration-200 ${
                  transparent
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                {dark ? <Sun size={19} /> : <Moon size={19} />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className={`relative w-10 h-10 hidden sm:flex items-center justify-center rounded-xl transition-all duration-200 ${
                  transparent
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              <Link
                to={!authLoading && isAuthenticated ? '/account' : '/login'}
                className={`w-10 h-10 hidden sm:flex items-center justify-center rounded-xl transition-all duration-200 ${
                  transparent
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                {isAuthenticated && user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <User size={19} />
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  transparent
                    ? 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-glow'
                }`}
              >
                <ShoppingBag size={17} />
                <span className="hidden sm:block">Bag</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-white text-primary-700 text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl ml-1 transition-all duration-200 ${
                  transparent
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSearchSubmit} className="pb-4 relative">
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, brands, styles..."
                      className="input-field pl-12 pr-12"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 card mt-2 p-2 shadow-card-hover z-10">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-12 h-14 object-cover rounded-lg"
                            onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/48/56` }}
                          />
                          <div>
                            <p className="text-sm font-medium text-dark-800 dark:text-dark-100">{product.name}</p>
                            <p className="text-xs text-dark-400 capitalize">{product.category}</p>
                            <p className="text-sm font-bold text-primary-600">${product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden glass border-t border-white/10 dark:border-dark-700/50"
            >
              <nav className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-3 text-sm font-medium text-dark-700 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-dark-700 my-2 pt-2 flex gap-2">
                  <Link to="/wishlist" className="flex-1 btn-ghost text-sm justify-center"><Heart size={16} /> Wishlist ({wishlistCount})</Link>
                  <Link to={!authLoading && isAuthenticated ? '/account' : '/login'} className="flex-1 btn-ghost text-sm justify-center"><User size={16} />{isAuthenticated ? 'Account' : 'Login'}</Link>
                  <button onClick={toggleTheme} className="btn-ghost text-sm"><Sun size={16} /></button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
