import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

function AuthInput({ icon: Icon, type, placeholder, value, onChange, toggle, show }) {
  return (
    <div className="relative">
      <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
      <input
        type={show !== undefined ? (show ? 'text' : type) : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field pl-12 py-3.5"
        required
      />
      {toggle && (
        <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  )
}

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    const result = mode === 'login'
      ? login(email, password)
      : register(name, email, password)

    setLoading(false)
    if (result.success) {
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!', { icon: '✨' })
      navigate('/')
    } else {
      toast.error(result.message, { style: { borderRadius: '12px' } })
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-purple-900/60" />
        <div className="relative flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="font-display font-bold text-xl">L</span>
            </div>
            <span className="font-display font-bold text-2xl">LUXE</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold mb-4 leading-tight">
              The World's Finest Fashion, Delivered.
            </h2>
            <p className="text-white/70 text-lg">
              Join thousands of discerning fashion lovers who trust LUXE for their most coveted pieces.
            </p>
            <div className="flex gap-6 mt-8">
              {[['10K+', 'Happy Clients'], ['500+', 'Luxury Items'], ['50+', 'Designer Brands']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display font-bold text-2xl">{n}</p>
                  <p className="text-white/60 text-sm">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">L</span>
            </div>
            <span className="font-display font-bold text-xl text-dark-900 dark:text-white">LUXE</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-dark-900 dark:text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm mb-8">
            {mode === 'login'
              ? 'Sign in to access your account and orders'
              : 'Join LUXE and start your luxury shopping journey'}
          </p>

          {/* Mode toggle */}
          <div className="flex bg-gray-100 dark:bg-dark-800 rounded-xl p-1 mb-8">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                  mode === m
                    ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-sm'
                    : 'text-dark-500 dark:text-dark-400'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <AuthInput icon={User} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <AuthInput icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <AuthInput icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} toggle={() => setShowPass(v => !v)} show={showPass} />

            {mode === 'login' && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700" />
            <span className="text-xs text-dark-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700" />
          </div>

          <div className="flex gap-3 mt-4">
            {['Google', 'Apple', 'Facebook'].map((provider) => (
              <button
                key={provider}
                className="flex-1 py-3 border border-gray-200 dark:border-dark-700 rounded-xl text-sm font-medium text-dark-600 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                {provider === 'Google' && 'G'}{provider === 'Apple' && '🍎'}{provider === 'Facebook' && 'f'}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-8">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
