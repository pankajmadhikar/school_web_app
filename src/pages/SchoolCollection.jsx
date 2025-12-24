import { useParams, Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useSchool } from '../hooks/useSchools'
import { ArrowLeft, Loader } from 'lucide-react'
import { useMemo } from 'react'

function SchoolCollection() {
  const { schoolId } = useParams()
  const [searchParams] = useSearchParams()
  const productCategory = searchParams.get('productCategory')
  const { products, loading: productsLoading } = useProducts()
  const { school, loading: schoolLoading } = useSchool(schoolId)
  
  const schoolProducts = useMemo(() => {
    if (!school || !products || products.length === 0) return []
    
    let filtered = products.filter((product) => {
      // Check if product belongs to this school
      let matchesSchool = false
      
      if (product.school) {
        if (typeof product.school === 'object') {
          matchesSchool = (product.school._id === school._id || product.school.slug === school.slug || product.school.id === school._id)
        } else if (typeof product.school === 'string') {
          matchesSchool = (product.school === school._id || product.school === school.slug || product.school === school.id)
        }
      }
      
      if (!matchesSchool) return false
      
      // Filter by product category if specified
      if (productCategory) {
        return product.category === productCategory
      }
      
      return true
    })
    
    return filtered
  }, [products, school, productCategory])

  if (schoolLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Loading school collection...</p>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">School Not Found</h2>
          <Link to="/uniforms" className="btn-primary">
            Back to Uniforms
          </Link>
        </div>
      </div>
    )
  }

  const categories = ['uniforms', 'sportswear', 'footwear', 'accessories', 'outerwear']
  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = schoolProducts.filter(p => p.category === category)
      return acc
    }, {})
  }, [schoolProducts])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="text-white py-16"
        style={{ background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 100%)` }}
      >
        <div className="container mx-auto px-4">
          <Link
            to="/uniforms"
            className="inline-flex items-center text-white hover:text-gray-200 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to All Schools
          </Link>
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-6xl">{school.logo || '🏫'}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">{school.name}</h1>
              <p className="text-xl mt-2 opacity-90">
                {productCategory 
                  ? `${productCategory.charAt(0).toUpperCase() + productCategory.slice(1)} Collection`
                  : 'Complete Uniform Collection'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">About {school.name} Collection</h2>
          <p className="text-gray-700">
            Browse our complete collection of official {school.name} uniforms. We offer everything from
            shirts and trousers to sportswear, footwear, and accessories - all designed to meet the
            school's uniform requirements.
          </p>
        </div>

        {/* Category Filter Badge */}
        {productCategory && (
          <div className="mb-6">
            <Link
              to={`/uniforms/${school.slug || school._id}`}
              className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2">Filtered by: {productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}</span>
              <span className="text-primary-600">× Clear</span>
            </Link>
          </div>
        )}

        {/* Products by Category (only show if no specific category filter) */}
        {!productCategory && categories.map((category) => {
          const categoryProducts = productsByCategory[category]
          if (categoryProducts.length === 0) return null

          const categoryNames = {
            uniforms: 'Uniforms',
            sportswear: 'Sportswear',
            footwear: 'Footwear',
            accessories: 'Accessories',
            outerwear: 'Outerwear',
          }

          return (
            <div key={category} className="mb-12">
              <h2 className="text-3xl font-bold mb-6">{categoryNames[category]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}

        {/* All Products (show filtered or all) */}
        {schoolProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              {productCategory 
                ? `${productCategory.charAt(0).toUpperCase() + productCategory.slice(1)} Products`
                : 'All Products'
              }
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {schoolProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {schoolProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-4">No products available for this school yet.</p>
            <Link to="/uniforms" className="btn-primary">
              Browse Other Schools
            </Link>
          </div>
        )}

        {/* Size Guide CTA */}
        <div className="bg-primary-50 rounded-lg p-8 border-2 border-primary-200">
          <h2 className="text-2xl font-bold mb-4">Need Help with Sizing?</h2>
          <p className="text-gray-700 mb-6">
            Check out our comprehensive size charts to find the perfect fit for your {school.name} uniform.
          </p>
          <Link to="/size-charts" className="btn-primary">
            View Size Charts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SchoolCollection

