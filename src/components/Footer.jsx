import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto container-padding py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-3xl">🎓</div>
                <h3 className="text-xl font-bold">Uniform Store</h3>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Your trusted partner for premium school uniforms and apparel. Quality products for students across India.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/mens-wear', label: "Men's Wear" },
                  { path: '/uniforms', label: 'Uniforms' },
                  { path: '/corporate-inquiry', label: 'Corporate Inquiry' },
                  { path: '/size-charts', label: 'Size Charts' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Service</h3>
              <ul className="space-y-3">
                {[
                  { path: '#', label: 'Contact Us' },
                  { path: '#', label: 'Shipping Policy' },
                  { path: '#', label: 'Returns & Exchanges' },
                  { path: '#', label: 'FAQ' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-600/20 rounded-lg mt-0.5">
                    <Phone size={18} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <a href="tel:+919876543210" className="text-white hover:text-primary-400 transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-600/20 rounded-lg mt-0.5">
                    <Mail size={18} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <a href="mailto:info@uniformstore.com" className="text-white hover:text-primary-400 transition-colors">
                      info@uniformstore.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-600/20 rounded-lg mt-0.5">
                    <MapPin size={18} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white text-sm">
                      123 Education Street,<br />
                      New Delhi, India 110001
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Uniform Store. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  )
}

export default Footer
