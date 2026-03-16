import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, CreditCard, Check, ShieldCheck, Lock } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import toast from 'react-hot-toast'

const steps = ['Cart', 'Shipping', 'Payment', 'Review']

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            i < current
              ? 'text-primary-600 dark:text-primary-400'
              : i === current
              ? 'bg-primary-600 text-white'
              : 'text-dark-300 dark:text-dark-600'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              i < current ? 'bg-primary-100 dark:bg-primary-950 text-primary-700' :
              i === current ? 'bg-white/20' : 'bg-gray-100 dark:bg-dark-700'
            }`}>
              {i < current ? <Check size={12} /> : i + 1}
            </div>
            <span className="hidden sm:block">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-12 h-px ${i < current ? 'bg-primary-400' : 'bg-gray-200 dark:bg-dark-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function ShippingForm({ data, onChange }) {
  const fields = [
    { id: 'firstName', label: 'First Name', half: true },
    { id: 'lastName', label: 'Last Name', half: true },
    { id: 'email', label: 'Email Address', type: 'email' },
    { id: 'phone', label: 'Phone Number', type: 'tel' },
    { id: 'address', label: 'Street Address' },
    { id: 'apt', label: 'Apartment, Suite, etc. (optional)' },
    { id: 'city', label: 'City', half: true },
    { id: 'state', label: 'State / Province', half: true },
    { id: 'zip', label: 'ZIP / Postal Code', half: true },
    { id: 'country', label: 'Country', half: true },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((f) => (
        <div key={f.id} className={f.half ? 'col-span-1' : 'col-span-2'}>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">{f.label}</label>
          <input
            type={f.type || 'text'}
            value={data[f.id] || ''}
            onChange={(e) => onChange(f.id, e.target.value)}
            className="input-field"
            placeholder={f.label}
          />
        </div>
      ))}
    </div>
  )
}

function PaymentForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 mb-6">
        {['credit-card', 'paypal', 'apple-pay'].map((method) => (
          <button
            key={method}
            onClick={() => onChange('method', method)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
              data.method === method
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-dark-700 text-dark-500 hover:border-gray-300'
            }`}
          >
            {method === 'credit-card' && '💳 Card'}
            {method === 'paypal' && '🅿️ PayPal'}
            {method === 'apple-pay' && '🍎 Apple Pay'}
          </button>
        ))}
      </div>
      {data.method === 'credit-card' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Card Number</label>
            <div className="relative">
              <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="input-field pr-12" value={data.cardNumber || ''} onChange={(e) => onChange('cardNumber', e.target.value)} />
              <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400" />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Cardholder Name</label>
            <input type="text" placeholder="Name on card" className="input-field" value={data.cardName || ''} onChange={(e) => onChange('cardName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">Expiry Date</label>
            <input type="text" placeholder="MM / YY" maxLength={7} className="input-field" value={data.expiry || ''} onChange={(e) => onChange('expiry', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1.5">CVC</label>
            <input type="text" placeholder="•••" maxLength={4} className="input-field" value={data.cvc || ''} onChange={(e) => onChange('cvc', e.target.value)} />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-dark-400 mt-4">
        <Lock size={12} /> <span>Your payment information is encrypted and secure</span>
      </div>
    </div>
  )
}

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [shipping, setShipping] = useState({ country: 'United States' })
  const [payment, setPayment] = useState({ method: 'credit-card' })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const { items, clearCart } = useCartStore()
  const navigate = useNavigate()

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping_cost = subtotal >= 150 ? 0 : 12.95
  const tax = subtotal * 0.08
  const total = subtotal + shipping_cost + tax

  const handlePlaceOrder = () => {
    setOrderPlaced(true)
    clearCart()
    setTimeout(() => navigate('/'), 5000)
  }

  if (orderPlaced) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-dark-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6"
          >
            <Check size={48} className="text-green-600" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-dark-900 dark:text-white mb-3">Order Confirmed!</h2>
          <p className="text-dark-500 dark:text-dark-400 mb-2">Thank you for shopping with LUXE.</p>
          <p className="text-dark-500 dark:text-dark-400 text-sm mb-8">Your order will be delivered within 3–5 business days. A confirmation has been sent to your email.</p>
          <p className="text-xs text-dark-400">Redirecting to home in 5 seconds...</p>
          <Link to="/" className="btn-primary mt-4 inline-flex">Back to Home</Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-dark-900">
        <div className="text-center">
          <p className="text-dark-500 mb-4">Your cart is empty</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="section-title text-center mb-2">Checkout</h1>
        <p className="text-center text-dark-400 text-sm mb-8">Secure checkout powered by LUXE</p>

        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-semibold text-lg text-dark-900 dark:text-white mb-6">Shipping Information</h2>
                  <ShippingForm data={shipping} onChange={(k, v) => setShipping((s) => ({ ...s, [k]: v }))} />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-semibold text-lg text-dark-900 dark:text-white mb-6">Payment Details</h2>
                  <PaymentForm data={payment} onChange={(k, v) => setPayment((p) => ({ ...p, [k]: v }))} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-semibold text-lg text-dark-900 dark:text-white mb-6">Review Your Order</h2>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.key} className="flex gap-4 p-3 bg-gray-50 dark:bg-dark-800 rounded-xl">
                        <img src={item.images?.[0]} alt="" className="w-16 h-20 object-cover rounded-lg flex-shrink-0" onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/64/80` }} />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-dark-800 dark:text-dark-100">{item.name}</p>
                          <p className="text-xs text-dark-400 mt-0.5">Size: {item.selectedSize} | Qty: {item.qty}</p>
                          <p className="font-bold text-sm mt-1 text-dark-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl text-sm space-y-2">
                    <div className="flex justify-between text-dark-600 dark:text-dark-400">
                      <span>Shipping to</span>
                      <span>{shipping.city || 'N/A'}, {shipping.country}</span>
                    </div>
                    <div className="flex justify-between text-dark-600 dark:text-dark-400">
                      <span>Payment</span>
                      <span className="capitalize">{payment.method?.replace('-', ' ')}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">Back</button>
                )}
                {step < 3 ? (
                  <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 group">
                    Continue <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} className="btn-primary flex-1">
                    <ShieldCheck size={16} /> Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.images?.[0]} alt="" className="w-14 h-16 object-cover rounded-lg" onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/56/64` }} />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-dark-800 text-white text-xs rounded-full flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dark-700 dark:text-dark-200 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-dark-400">{item.selectedSize}</p>
                    </div>
                    <p className="text-sm font-semibold text-dark-900 dark:text-white flex-shrink-0">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-dark-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-dark-500 dark:text-dark-400">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-500 dark:text-dark-400">
                  <span>Shipping</span>
                  <span className={shipping_cost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping_cost === 0 ? 'Free' : `$${shipping_cost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-dark-500 dark:text-dark-400">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-dark-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-dark-800">
                  <span>Total</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
