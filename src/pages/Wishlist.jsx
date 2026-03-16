import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, X, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '../store/useWishlistStore'
import { useCartStore } from '../store/useCartStore'
import StarRating from '../components/ui/StarRating'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { items, remove, clear } = useWishlistStore()
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (product) => {
    addItem(product, product.colors[0], product.sizes[0])
    openCart()
    toast.success(`${product.name} added to bag!`, { icon: '🛍️' })
  }

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="section-title mb-1">My Wishlist</h1>
            <p className="text-dark-400 text-sm">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="text-sm text-dark-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
              <X size={14} /> Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-red-50 dark:bg-red-950 flex items-center justify-center mb-6">
              <Heart size={40} className="text-red-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark-800 dark:text-dark-100 mb-2">Nothing saved yet</h2>
            <p className="text-dark-400 max-w-sm mb-8">
              Start adding your favorite pieces to your wishlist and find them here anytime.
            </p>
            <Link to="/shop" className="btn-primary">
              Explore Shop <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {items.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.06 }}
                    className="group"
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-dark-800">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/533` }}
                        />
                      </Link>
                      <button
                        onClick={() => remove(product.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white dark:bg-dark-900 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <X size={15} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-dark-900 text-dark-900 dark:text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-600 hover:text-white transition-colors"
                        >
                          <ShoppingBag size={15} /> Add to Bag
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 px-1">
                      <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">{product.category}</p>
                      <Link to={`/product/${product.id}`} className="font-semibold text-sm text-dark-800 dark:text-dark-100 hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                      <StarRating rating={product.rating} count={product.reviews} size={11} />
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-dark-900 dark:text-white text-sm">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-dark-400 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex justify-center mt-10">
              <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
