import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Headphones, Sparkles, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products, schools } from '../data/mockData'
import { useState, useEffect } from 'react'

function Home() {
  const featuredProducts = products.slice(0, 8)
  const featuredSchools = schools.slice(0, 4)

  // Slideshow state
  const slides = [
    {
      title: "Premium School Uniforms",
      subtitle: "Quality You Can Trust",
      description: "Shop from our extensive collection of school uniforms for all ages",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop",
      cta: "Shop Uniforms",
      link: "/uniforms"
    },
    {
      title: "Professional Men's Wear",
      subtitle: "Corporate Excellence",
      description: "Premium business attire for the modern professional",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=600&fit=crop",
      cta: "Shop Men's Wear",
      link: "/mens-wear"
    },
    {
      title: "Sports & Activewear",
      subtitle: "Performance Meets Comfort",
      description: "High-quality sportswear for all your athletic needs",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop",
      cta: "View Collection",
      link: "/uniforms?category=sportswear"
    },
    {
      title: "Complete Accessories",
      subtitle: "Perfect Your Look",
      description: "Belts, ties, shoes and more to complete your uniform",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop",
      cta: "Browse Accessories",
      link: "/uniforms?category=accessories"
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="fade-in">
      {/* Image Slideshow */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                filter: 'brightness(0.6)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="relative h-full container mx-auto container-padding flex items-center">
              <div className="max-w-2xl text-white">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Sparkles size={18} />
                  <span className="text-sm font-semibold">{slide.subtitle}</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {slide.description}
                </p>
                <Link 
                  to={slide.link}
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center justify-center text-lg px-8 py-4"
                >
                  {slide.cta}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container mx-auto container-padding section-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles size={18} />
              <span className="text-sm font-semibold">Premium Quality Guaranteed</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Premium School
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                Uniforms & Apparel
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Quality uniforms for every school. Shop school-specific collections, sportswear, footwear, and accessories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/uniforms" 
                className="group btn-primary bg-white text-primary-600 hover:bg-gray-50 inline-flex items-center justify-center text-lg px-8 py-4 z-10"
              >
                Shop Uniforms
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                to="/mens-wear" 
                className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-primary-600 inline-flex items-center justify-center text-lg px-8 py-4 z-10"
              >
                Shop Men's Wear
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b shadow-sm">
        <div className="container mx-auto container-padding py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Secure Payment', desc: '100% Secure', color: 'text-green-500' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick Shipping', color: 'text-blue-500' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always Here', color: 'text-purple-500' },
              { icon: TrendingUp, title: 'Easy Returns', desc: 'Hassle-Free', color: 'text-orange-500' },
            ].map((badge, idx) => {
              const Icon = badge.icon
              return (
                <div 
                  key={idx}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className={`p-3 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform ${badge.color}`}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{badge.title}</h3>
                    <p className="text-sm text-gray-600">{badge.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Schools */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto container-padding">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-3 gradient-text">Shop by School</h2>
              <p className="text-gray-600 text-lg">Browse our curated collections for each school</p>
            </div>
            <Link 
              to="/uniforms" 
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredSchools.map((school) => (
              <Link
                key={school.id}
                to={`/uniforms/${school.id}`}
                className="card p-6 text-center group hover:scale-105 transition-all duration-300"
                style={{ 
                  borderTop: `4px solid ${school.color}`,
                  background: `linear-gradient(to bottom, ${school.color}05, white)`
                }}
              >
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {school.logo}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                  {school.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">View Collection</p>
                <div className="flex items-center justify-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-3 gradient-text">Featured Products</h2>
              <p className="text-gray-600 text-lg">Handpicked quality products for you</p>
            </div>
            <Link 
              to="/uniforms" 
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={product.id} className="slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 gradient-text">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { id: 'uniforms', name: 'Uniforms', icon: '👔', color: 'from-blue-500 to-blue-600' },
              { id: 'sportswear', name: 'Sportswear', icon: '⚽', color: 'from-green-500 to-green-600' },
              { id: 'footwear', name: 'Footwear', icon: '👟', color: 'from-purple-500 to-purple-600' },
              { id: 'accessories', name: 'Accessories', icon: '🎒', color: 'from-orange-500 to-orange-600' },
              { id: 'outerwear', name: 'Outerwear', icon: '🧥', color: 'from-red-500 to-red-600' },
            ].map((category) => (
              <Link
                key={category.id}
                to={`/uniforms?category=${category.id}`}
                className="card p-8 text-center group hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto container-padding text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Need Help Finding the Right Size?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Check out our comprehensive size charts to find the perfect fit for your uniform.
          </p>
          <Link to="/size-charts" className="btn-primary bg-white text-primary-600 hover:bg-gray-50 inline-flex items-center text-lg px-8 py-4">
            View Size Charts
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
