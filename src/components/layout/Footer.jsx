import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-950 text-dark-300 mt-24">
      {/* Newsletter */}
      <div className="bg-gradient-brand py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Join the World of Luxury
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Subscribe for exclusive access to new collections, private sales, and styling inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/25 transition-colors"
            />
            <button type="submit" className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">L</span>
              </div>
              <span className="font-display font-bold text-xl text-white">LUXE</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              LUXE is your destination for premium fashion. We curate the finest pieces from around the world, delivered with the service and discretion our discerning clients expect.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-dark-800 flex items-center justify-center text-dark-400 hover:bg-primary-600 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-sm">
              {['New Arrivals', 'Women', 'Men', 'Accessories', 'Shoes', 'Bags', 'Sale'].map((l) => (
                <li key={l}>
                  <Link to={`/shop?category=${l.toLowerCase().replace(' ', '-')}`} className="hover:text-primary-400 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-3 text-sm">
              {['FAQ', 'Shipping & Returns', 'Size Guide', 'Track Order', 'Contact Us', 'Care Instructions'].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 text-primary-400 flex-shrink-0" />
                <span>15 Rue du Faubourg Saint-Honoré, Paris, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-primary-400 flex-shrink-0" />
                <span>+1 (800) LUXE-NOW</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-primary-400 flex-shrink-0" />
                <span>concierge@luxe.com</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-dark-800 rounded-xl text-xs">
              <p className="text-white font-medium mb-1">Personal Styling</p>
              <p>Available Mon–Sat, 9AM–8PM EST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-500">
          <p>© {new Date().getFullYear()} LUXE. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Accessibility</a>
          </div>
          <div className="flex items-center gap-2">
            {['visa', 'mc', 'amex', 'pp'].map((card) => (
              <div key={card} className="px-2.5 py-1 bg-dark-800 rounded text-dark-400 text-[10px] font-bold uppercase tracking-wide">
                {card === 'mc' ? 'MC' : card === 'pp' ? 'PayPal' : card.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
