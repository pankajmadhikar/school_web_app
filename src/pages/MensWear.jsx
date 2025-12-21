import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/mockData'
import { Filter, Grid, List, Briefcase } from 'lucide-react'

function MensWear() {
  const mensProducts = products.filter(p => p.school === 'mens-wear')
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState('grid')

  // Client logos/names for marquee
  const clients = [
    { name: 'TechCorp Solutions', logo: '💼' },
    { name: 'Global Finance Ltd', logo: '🏦' },
    { name: 'Apex Consulting', logo: '📊' },
    { name: 'Prime Industries', logo: '🏭' },
    { name: 'Elite Services', logo: '⭐' },
    { name: 'Corporate Dynamics', logo: '🚀' },
    { name: 'Business Partners Inc', logo: '🤝' },
    { name: 'Executive Solutions', logo: '💡' },
    { name: 'Professional Group', logo: '👔' },
    { name: 'Enterprise Corp', logo: '🏢' },
    { name: 'Success Partners', logo: '🎯' },
    { name: 'Innovation Hub', logo: '💻' },
  ]

  const sortedProducts = [...mensProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Men's Wear Business</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Premium business attire for professionals. Quality formal shirts, trousers, blazers, and accessories.
          </p>
        </div>
      </div>

      {/* Client Marquee */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-50 border-y border-gray-200 py-8 overflow-hidden">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold text-gray-700 flex items-center justify-center gap-2">
            <Briefcase size={20} className="text-primary-600" />
            Trusted by Leading Corporations
          </h3>
        </div>
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="inline-flex items-center mx-8 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mr-3">{client.logo}</span>
                <span className="text-gray-700 font-semibold text-lg">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-700">Filters</span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{sortedProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        {/* Business Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Why Choose Our Men's Wear?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We source only the finest fabrics and materials for our business wear collection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Perfect Fit</h3>
              <p className="text-gray-600">
                Multiple size options and detailed size charts ensure the perfect fit for every professional.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Professional Look</h3>
              <p className="text-gray-600">
                Designed to help you make a great impression in any professional setting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MensWear

