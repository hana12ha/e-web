import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, ShoppingBag, Share2, ChevronRight, Minus, Plus,
  Star, Check, Truck, RefreshCw, ShieldCheck, ZoomIn
} from 'lucide-react'
import { useProductStore } from '../store/useProductStore'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import ProductCard from '../components/products/ProductCard'
import StarRating from '../components/ui/StarRating'
import ColorSwatch from '../components/ui/ColorSwatch'
import SizeSelector from '../components/ui/SizeSelector'
import QuantitySelector from '../components/ui/QuantitySelector'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { products } = useProductStore()
  const { id } = useParams()
  const product = products.find((p) => p.id === parseInt(id))
  const related = products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4)

  const [imgIdx, setImgIdx] = useState(0)
  const [color, setColor] = useState(product?.colors[0] || '')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [zoomed, setZoomed] = useState(false)

  const { addItem, openCart } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()

  if (!product) {
    return (
      <div className="pt-32 text-center py-24">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const wishlisted = isWishlisted(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    if (!size) { toast.error('Please select a size', { icon: '📏' }); return }
    addItem(product, color, size, qty)
    openCart()
    toast.success(`Added to bag!`, { icon: '🛍️', style: { borderRadius: '12px' } })
  }

  const handleBuyNow = () => {
    if (!size) { toast.error('Please select a size', { icon: '📏' }); return }
    addItem(product, color, size, qty)
    window.location.href = '/checkout'
  }

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-dark-900">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-dark-400">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary-600 transition-colors capitalize">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-dark-600 dark:text-dark-300 truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="hidden sm:flex flex-col gap-3 w-20 flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    imgIdx === i ? 'border-primary-500 shadow-glow' : 'border-transparent hover:border-gray-300 dark:hover:border-dark-600'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}${i}/80/80` }}
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative">
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-dark-800 cursor-zoom-in"
                onClick={() => setZoomed(!zoomed)}
              >
                <motion.img
                  key={imgIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={product.images[imgIdx]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${zoomed ? 'scale-150' : 'hover:scale-105'}`}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/600/800` }}
                />
                <button className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 dark:bg-dark-900/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ZoomIn size={16} className="text-dark-600 dark:text-dark-300" />
                </button>
                {product.isNew && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-lg">NEW</div>
                )}
                {discount && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">-{discount}%</div>
                )}
              </div>

              {/* Mobile thumbnails */}
              <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-16 aspect-square rounded-xl overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-primary-500' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}${i}/64/64` }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="py-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {/* Category & badges */}
              <div className="flex items-center gap-2 mb-3">
                <Link to={`/shop?category=${product.category}`} className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide capitalize hover:underline">
                  {product.category}
                </Link>
                {product.isBestSeller && <span className="badge badge-warning">Best Seller</span>}
                {product.stock <= 5 && <span className="badge bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">Only {product.stock} left</span>}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <StarRating rating={product.rating} count={product.reviews} size={16} />
                <span className="text-sm text-dark-500 dark:text-dark-400">{product.sold} sold</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-3xl font-bold text-dark-900 dark:text-white">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-dark-400 line-through">${product.originalPrice}</span>
                    <span className="badge bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-sm">Save ${product.originalPrice - product.price}</span>
                  </>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-dark-800 mb-6" />

              {/* Color */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-dark-800 dark:text-dark-200">Color</span>
                  <span className="text-xs text-dark-400" style={{ color }}>{color}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <ColorSwatch key={c} color={c} selected={color === c} onClick={() => setColor(c)} />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-dark-800 dark:text-dark-200">Size</span>
                  <button className="text-xs text-primary-600 dark:text-primary-400 underline">Size Guide</button>
                </div>
                <SizeSelector sizes={product.sizes} selected={size} onChange={setSize} />
                {!size && <p className="text-xs text-red-500 mt-2">Please select a size</p>}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <span className="font-semibold text-sm text-dark-800 dark:text-dark-200 block mb-3">Quantity</span>
                <QuantitySelector qty={qty} onChange={setQty} max={product.stock} />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 text-base py-4 group"
                >
                  <ShoppingBag size={18} />
                  Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-dark-900 dark:bg-white text-white dark:text-dark-900 font-semibold rounded-xl hover:bg-dark-700 dark:hover:bg-gray-100 transition-colors text-base"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => { toggle(product); toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', { icon: wishlisted ? '💔' : '❤️' }) }}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all flex-shrink-0 ${
                    wishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 dark:border-dark-700 text-dark-600 dark:text-dark-300 hover:border-red-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-dark-800 rounded-2xl mb-6">
                {[
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: RefreshCw, text: '30-day returns' },
                  { icon: ShieldCheck, text: 'Authentic' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                    <Icon size={18} className="text-primary-600" />
                    <span className="text-xs text-dark-500 dark:text-dark-400">{text}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <button className="flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 transition-colors">
                <Share2 size={14} /> Share this product
              </button>
            </motion.div>
          </div>
        </div>

        {/* Product info tabs */}
        <div className="mt-16 border-b border-gray-200 dark:border-dark-800">
          <div className="flex gap-0">
            {['description', 'features', 'reviews'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-semibold capitalize border-b-2 transition-all -mb-px ${
                  tab === t
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="py-10">
          {tab === 'description' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
              <p className="text-dark-600 dark:text-dark-300 leading-relaxed text-base">{product.description}</p>
            </motion.div>
          )}
          {tab === 'features' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-600 dark:text-dark-300">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {tab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-8 mb-8">
                <div className="text-center">
                  <p className="font-display text-6xl font-bold text-dark-900 dark:text-white">{product.rating}</p>
                  <StarRating rating={product.rating} size={20} />
                  <p className="text-sm text-dark-400 mt-1">{product.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs w-4 text-right text-dark-500">{star}</span>
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 dark:bg-dark-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 bg-yellow-400 rounded-full"
                          style={{ width: `${star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-dark-500 text-sm">Showing {Math.min(5, product.reviews)} of {product.reviews} reviews</p>
            </motion.div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="section-title text-2xl">You May Also Like</h2>
              <Link to={`/shop?category=${product.category}`} className="text-sm text-primary-600 hover:underline">See All</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
