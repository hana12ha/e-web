import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useWishlistStore } from '../../store/useWishlistStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const { addItem, openCart } = useCartStore()
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, product.colors[0], product.sizes[0])
    openCart()
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
      style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', {
      icon: wishlisted ? '💔' : '❤️',
      style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div
          className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-dark-800 aspect-[3/4]"
          onMouseEnter={() => { setHovered(true); setImgIdx(1) }}
          onMouseLeave={() => { setHovered(false); setImgIdx(0) }}
        >
          {/* Image */}
          <img
            src={product.images[imgIdx] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/533` }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-lg">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2.5 py-1 bg-yellow-500 text-white text-xs font-bold rounded-lg">
                BEST SELLER
              </span>
            )}
            {discount && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`
              absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full
              transition-all duration-200 backdrop-blur-sm
              ${wishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 dark:bg-dark-800/90 text-dark-600 dark:text-dark-300 opacity-0 group-hover:opacity-100'
              }
            `}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Hover actions */}
          <div className={`absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-dark-900 text-dark-900 dark:text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-colors duration-200"
            >
              <ShoppingBag size={15} />
              Add to Bag
            </button>
            <Link
              to={`/product/${product.id}`}
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-900 text-dark-900 dark:text-white rounded-xl hover:bg-primary-600 hover:text-white transition-colors duration-200"
            >
              <Eye size={15} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 px-1">
          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium capitalize mb-0.5">
            {product.category}
          </p>
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 text-sm leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-dark-400">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-bold text-dark-900 dark:text-white text-sm">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-dark-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {/* Color dots */}
          <div className="flex gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <div
                key={c}
                className="w-3 h-3 rounded-full border border-gray-200 dark:border-dark-600"
                style={{ backgroundColor: c }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-dark-400">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
