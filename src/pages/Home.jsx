import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, ShieldCheck, RefreshCw, Truck, Headphones, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import ProductCard from '../components/products/ProductCard'
import { heroSlides, categories, testimonials } from '../data/products'
import { useProductStore } from '../store/useProductStore'

// Hero
function Hero() {
  const [current, setCurrent] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => setCurrent((c) => (c + 1) % heroSlides.length), 5500)
    return () => clearTimeout(t)
  }, [current, auto])

  const slide = heroSlides[current]

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse-slow" />
              {slide.tag}
            </motion.span>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
              {slide.title}
            </h1>

            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={slide.ctaLink} className="btn-primary text-base px-8 py-4 group">
                {slide.cta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <Play size={16} fill="currentColor" />
                </div>
                <span className="text-sm font-medium">Watch Film</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide controls */}
        <div className="absolute bottom-12 left-4 sm:left-6 flex items-center gap-4">
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setAuto(false) }}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => { setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length); setAuto(false) }}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => { setCurrent((c) => (c + 1) % heroSlides.length); setAuto(false) }}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-12 right-4 sm:right-6 hidden md:flex gap-8"
        >
          {[{ n: '10K+', l: 'Happy Clients' }, { n: '500+', l: 'Products' }, { n: '50+', l: 'Brands' }].map((s) => (
            <div key={s.l} className="text-right">
              <p className="text-white font-display font-bold text-2xl">{s.n}</p>
              <p className="text-white/60 text-xs">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
        <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  )
}

// Categories Section
function CategoriesSection() {
  const { products } = useProductStore()
  const cats = categories.filter((c) => c.id !== 'all')
  const catImages = {
    women: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80',
    men: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&q=80',
    accessories: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    bags: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Explore</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-primary-600 transition-colors">
          View All <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cats.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/shop?category=${cat.id}`}
              className="group relative block overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100 dark:bg-dark-800"
            >
              <img
                src={catImages[cat.id]}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${cat.id}/300/400` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                <span className="text-2xl mb-1">{cat.icon}</span>
                <p className="font-display font-semibold text-lg">{cat.name}</p>
                <p className="text-xs text-white/70 mt-0.5 group-hover:text-white transition-colors">
                  {products.filter((p) => p.category === cat.id).length} items
                </p>
              </div>
              <div className="absolute inset-0 ring-2 ring-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// Featured Products
function FeaturedProducts() {
  const { products } = useProductStore()
  const featured = products.filter((p) => p.isBestSeller).slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 bg-gray-50 dark:bg-dark-800/30 rounded-3xl">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Curated Picks</p>
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle mt-2">The pieces our clients love most</p>
        </div>
        <Link to="/shop" className="hidden sm:flex btn-secondary text-sm py-2.5">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

// New Arrivals
function NewArrivals() {
  const { products } = useProductStore()
  const newProds = products.filter((p) => p.isNew).slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Just In</p>
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle mt-2">Fresh from the ateliers and designer studios</p>
        </div>
        <Link to="/shop?sort=new" className="hidden sm:flex btn-secondary text-sm py-2.5">
          See More
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {newProds.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}

// Trust badges
function TrustSection() {
  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'Complimentary shipping on all orders over $150' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns and exchanges' },
    { icon: ShieldCheck, title: 'Authentic Guarantee', desc: 'Every piece is authenticated and guaranteed genuine' },
    { icon: Headphones, title: 'Personal Stylist', desc: 'Dedicated styling service available 7 days a week' },
  ]

  return (
    <section className="bg-dark-900 dark:bg-dark-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center">
                <f.icon size={22} className="text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="text-dark-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Promo Banner
function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
            Limited Time
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            End of Season Sale
          </h2>
          <p className="text-white/80 max-w-lg">
            Up to 40% off on selected items. Don't miss our most coveted pieces at exceptional prices.
          </p>
        </div>
        <Link
          to="/shop?sale=true"
          className="relative flex-shrink-0 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl hover:bg-white/90 transition-colors text-base shadow-glow-lg whitespace-nowrap"
        >
          Shop the Sale
        </Link>
      </motion.div>
    </section>
  )
}

// Testimonials
function Testimonials() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center mb-12">
        <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Social Proof</p>
        <h2 className="section-title">What Our Clients Say</h2>
      </div>
      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="card p-8 md:p-12 text-center"
          >
            <Quote size={36} className="text-primary-200 dark:text-primary-900 mx-auto mb-6" />
            <p className="text-dark-700 dark:text-dark-200 text-lg leading-relaxed italic mb-8">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <img
              src={testimonials[current].avatar}
              alt={testimonials[current].name}
              className="w-14 h-14 rounded-full object-cover mx-auto mb-3 border-2 border-primary-200 dark:border-primary-800"
            />
            <p className="font-semibold text-dark-900 dark:text-white">{testimonials[current].name}</p>
            <p className="text-sm text-dark-400">{testimonials[current].role}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${i === current ? 'w-8 h-2 bg-primary-600' : 'w-2 h-2 bg-gray-300 dark:bg-dark-600'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <TrustSection />
      <NewArrivals />
      <PromoBanner />
      <Testimonials />
    </div>
  )
}
