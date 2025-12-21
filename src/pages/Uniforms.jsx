import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, schools } from '../data/mockData'
import { Filter, Search } from 'lucide-react'

function Uniforms() {
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSchoolType, setSelectedSchoolType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter((product) => {
    const matchesSchool = selectedSchool === 'all' || product.school === selectedSchool
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by school type (pre-primary/primary)
    let matchesSchoolType = true
    if (selectedSchoolType !== 'all') {
      const school = schools.find(s => s.id === product.school)
      matchesSchoolType = school?.category === selectedSchoolType
    }
    
    return matchesSchool && matchesCategory && matchesSearch && matchesSchoolType && product.school !== 'mens-wear'
  })

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'uniforms', name: 'Uniforms' },
    { id: 'sportswear', name: 'Sportswear' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'outerwear', name: 'Outerwear' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">School Uniforms</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Browse our complete collection of school uniforms, organized by school and category.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search uniforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* School Type Filter */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block font-semibold mb-2 text-gray-700">
              <Filter size={18} className="inline mr-2" />
              Filter by School Type
            </label>
            <select
              value={selectedSchoolType}
              onChange={(e) => setSelectedSchoolType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="pre-primary">Pre-Primary</option>
              <option value="primary">Primary</option>
            </select>
          </div>

          {/* School Filter */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block font-semibold mb-2 text-gray-700">
              <Filter size={18} className="inline mr-2" />
              Filter by School
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">All Schools</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block font-semibold mb-2 text-gray-700">
              <Filter size={18} className="inline mr-2" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* School Quick Links by Type */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pre-Primary Schools</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {schools.filter(s => s.category === 'pre-primary').map((school) => (
              <Link
                key={school.id}
                to={`/uniforms/${school.id}`}
                className="card p-4 text-center hover:scale-105 transition-transform"
                style={{ borderTop: `4px solid ${school.color}` }}
              >
                <div className="text-3xl mb-2">{school.logo}</div>
                <h3 className="font-semibold text-sm">{school.name}</h3>
                <span className="text-xs text-gray-500 mt-1 block">Pre-Primary</span>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Primary Schools</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {schools.filter(s => s.category === 'primary').map((school) => (
              <Link
                key={school.id}
                to={`/uniforms/${school.id}`}
                className="card p-4 text-center hover:scale-105 transition-transform"
                style={{ borderTop: `4px solid ${school.color}` }}
              >
                <div className="text-3xl mb-2">{school.logo}</div>
                <h3 className="font-semibold text-sm">{school.name}</h3>
                <span className="text-xs text-gray-500 mt-1 block">Primary</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
            {selectedSchool !== 'all' && ` for ${schools.find(s => s.id === selectedSchool)?.name}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-4">No products found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedSchool('all')
                setSelectedCategory('all')
                setSelectedSchoolType('all')
                setSearchQuery('')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Uniforms

