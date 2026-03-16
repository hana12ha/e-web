import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Grid2X2, LayoutList, X, ChevronDown, Search } from 'lucide-react'
import ProductCard from '../components/products/ProductCard'
import { categories } from '../data/products'
import { useProductStore } from '../store/useProductStore'

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'new', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $200', min: 0, max: 200 },
  { label: '$200 – $400', min: 200, max: 400 },
  { label: '$400 – $700', min: 400, max: 700 },
  { label: 'Over $700', min: 700, max: Infinity },
]

function FilterSidebar({ activeCategory, setActiveCategory, activePrice, setActivePrice, showSale, setShowSale, onClose }) {
  const { products } = useProductStore()
  return (
    <div className="space-y-8">
      {onClose && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-dark-700">
          <h3 className="font-semibold text-dark-900 dark:text-white">Filters</h3>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-sm text-dark-900 dark:text-white mb-3 uppercase tracking-wide">Category</h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </span>
              <span className="text-xs text-dark-400">
                {cat.id === 'all'
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold text-sm text-dark-900 dark:text-white mb-3 uppercase tracking-wide">Price Range</h4>
        <div className="space-y-1">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setActivePrice(range)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activePrice.label === range.label
                  ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                activePrice.label === range.label ? 'border-primary-600' : 'border-gray-300 dark:border-dark-500'
              }`}>
                {activePrice.label === range.label && <span className="w-2 h-2 rounded-full bg-primary-600" />}
              </span>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sale toggle */}
      <div>
        <h4 className="font-semibold text-sm text-dark-900 dark:text-white mb-3 uppercase tracking-wide">Offers</h4>
        <button
          onClick={() => setShowSale((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            showSale
              ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 font-medium'
              : 'text-dark-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700'
          }`}
        >
          <span className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${showSale ? 'bg-red-500' : 'bg-gray-300 dark:bg-dark-600'}`}>
            <span className={`w-4 h-4 bg-white rounded-full transition-transform ${showSale ? 'translate-x-4' : 'translate-x-0'}`} />
          </span>
          Sale Items Only
        </button>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold text-sm text-dark-900 dark:text-white mb-3 uppercase tracking-wide">Availability</h4>
        {['In Stock', 'Pre-Order', 'Limited Edition'].map((av) => (
          <label key={av} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-dark-600 dark:text-dark-400">{av}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function Shop() {
  const { products, loading, error, fetchProducts } = useProductStore()

  useEffect(() => {
    if (products.length === 0) fetchProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'all'
  const searchParam = searchParams.get('search') || ''
  const saleParam = searchParams.get('sale') === 'true'
  const sortParam = searchParams.get('sort') === 'new' ? 'new' : 'default'

  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [activePrice, setActivePrice] = useState(priceRanges[0])
  const [sort, setSort] = useState(sortParam)
  const [showSale, setShowSale] = useState(saleParam)
  const [search, setSearch] = useState(searchParam)

  // Sync state when URL params change (e.g. clicking a category from the header)
  useEffect(() => { setActiveCategory(categoryParam) }, [categoryParam])
  useEffect(() => { setSearch(searchParam) }, [searchParam])
  useEffect(() => { setShowSale(saleParam) }, [saleParam])
  const [view, setView] = useState('grid')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (activePrice.max !== Infinity || activePrice.min > 0) {
      list = list.filter((p) => p.price >= activePrice.min && p.price <= activePrice.max)
    }
    if (showSale) list = list.filter((p) => p.originalPrice)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
      )
    }
    switch (sort) {
      case 'new': list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew)); break
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'popular': list.sort((a, b) => b.sold - a.sold); break
      default: break
    }
    return list
  }, [products, activeCategory, activePrice, showSale, search, sort])

  const clearFilters = () => {
    setActiveCategory('all')
    setActivePrice(priceRanges[0])
    setShowSale(false)
    setSearch('')
    setSort('default')
  }

  const hasFilters = activeCategory !== 'all' || activePrice.min > 0 || showSale || search

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-dark-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-dark-800/50 py-12 border-b border-gray-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="section-title mb-2">
            {activeCategory === 'all' ? 'All Products' : categories.find((c) => c.id === activeCategory)?.name}
          </h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            {search && ` for "${search}"`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900'
                  : 'bg-gray-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-gray-200 dark:hover:bg-dark-700'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                activePrice={activePrice}
                setActivePrice={setActivePrice}
                showSale={showSale}
                setShowSale={setShowSale}
              />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-9 py-2.5 text-sm"
                />
              </div>

              {/* Filter btn (mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden btn-ghost border border-gray-200 dark:border-dark-700 py-2.5 text-sm"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field py-2.5 text-sm pr-8 appearance-none cursor-pointer min-w-40"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
              </div>

              {/* View toggle */}
              <div className="flex border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-2.5 transition-colors ${view === 'grid' ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900' : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-700'}`}
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-2.5 transition-colors ${view === 'list' ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900' : 'bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-700'}`}
                >
                  <LayoutList size={16} />
                </button>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {/* Active filter pills */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeCategory !== 'all' && (
                  <span className="badge badge-primary gap-1.5">
                    {activeCategory}
                    <button onClick={() => setActiveCategory('all')}><X size={10} /></button>
                  </span>
                )}
                {activePrice.min > 0 && (
                  <span className="badge badge-primary gap-1.5">
                    {activePrice.label}
                    <button onClick={() => setActivePrice(priceRanges[0])}><X size={10} /></button>
                  </span>
                )}
                {showSale && (
                  <span className="badge bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 gap-1.5">
                    Sale <button onClick={() => setShowSale(false)}><X size={10} /></button>
                  </span>
                )}
                {search && (
                  <span className="badge badge-primary gap-1.5">
                    "{search}"
                    <button onClick={() => setSearch('')}><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products grid */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="font-display text-xl font-bold text-dark-800 dark:text-dark-100 mb-2">Failed to load products</h3>
                <p className="text-dark-400 text-sm mb-6 max-w-sm">{error}</p>
                <button onClick={fetchProducts} className="btn-primary">Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl font-bold text-dark-800 dark:text-dark-100 mb-2">No products found</h3>
                <p className="text-dark-400 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${view === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-900 p-6 overflow-y-auto shadow-2xl"
          >
            <FilterSidebar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activePrice={activePrice}
              setActivePrice={setActivePrice}
              showSale={showSale}
              setShowSale={setShowSale}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}
