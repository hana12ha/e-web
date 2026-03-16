import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-dark-900 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-dark-800">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-primary-600" />
                <div>
                  <h2 className="font-display font-bold text-lg text-dark-900 dark:text-white">Your Bag</h2>
                  <p className="text-xs text-dark-400">{count} item{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-dark-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear all
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-64 gap-4 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                      <ShoppingBag size={36} className="text-gray-300 dark:text-dark-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark-700 dark:text-dark-200">Your bag is empty</p>
                      <p className="text-sm text-dark-400 mt-1">Add some luxury to your life</p>
                    </div>
                    <button onClick={closeCart} className="btn-primary text-sm px-5 py-2.5">
                      Explore Products
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3 p-3 bg-gray-50 dark:bg-dark-800 rounded-2xl"
                    >
                      <Link to={`/product/${item.id}`} onClick={closeCart} className="flex-shrink-0">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded-xl"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/80/96` }}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={closeCart}
                            className="font-semibold text-sm text-dark-800 dark:text-dark-100 hover:text-primary-600 transition-colors leading-tight"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.key)}
                            className="ml-2 text-dark-300 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="badge badge-primary text-[10px]">{item.selectedSize}</span>
                          <span
                            className="w-4 h-4 rounded-full border-2 border-white dark:border-dark-700 inline-block shadow-sm"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-0 border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(item.key, item.qty - 1)}
                              className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2.5 py-1 text-xs font-bold border-x border-gray-200 dark:border-dark-600">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.key, item.qty + 1)}
                              className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="font-bold text-sm text-dark-900 dark:text-white">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 dark:border-dark-800 space-y-4">
                {/* Promo */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="input-field pl-9 py-2.5 text-sm"
                    />
                  </div>
                  <button className="btn-secondary py-2.5 px-4 text-sm">Apply</button>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-dark-500 dark:text-dark-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-dark-500 dark:text-dark-400">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-dark-900 dark:text-white pt-2 border-t border-gray-100 dark:border-dark-800">
                    <span>Total</span>
                    <span className="text-gradient">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full group"
                >
                  Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button onClick={closeCart} className="w-full text-center text-sm text-dark-500 hover:text-primary-600 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
