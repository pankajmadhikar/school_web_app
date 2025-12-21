import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart, Share2, ArrowLeft, Check, Truck, Shield, RotateCcw, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProducts'
import { useSchools } from '../hooks/useSchools'

function ProductDetail() {
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const { schools } = useSchools()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0])
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0])
      }
    }
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center card p-12 max-w-md">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/uniforms" className="btn-primary inline-flex items-center">
            <ArrowLeft className="mr-2" size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const school = typeof product.school === 'object' 
    ? product.school 
    : schools.find(s => (s._id || s.id) === product.school)
  
  const isOutOfStock = product.isOutOfStock
  const stockStatus = product.stockStatus || []
  const availableSizes = stockStatus
    .filter(item => item.inStock)
    .map(item => item.size)
    .filter((size, index, self) => self.indexOf(size) === index)
  
  // Check if selected size/color is in stock
  const selectedStockItem = stockStatus.find(
    item => item.size === selectedSize && item.color === (selectedColor || 'Default')
  )
  const isSelectedInStock = selectedStockItem?.inStock || false
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto container-padding">
        <Link
          to="/uniforms"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-semibold group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="card overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner">
                <img
                  src={product.images[currentImage] || 'https://via.placeholder.com/600x600'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        currentImage === idx 
                          ? 'border-primary-600 ring-2 ring-primary-200 scale-105' 
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <img
                        src={img || 'https://via.placeholder.com/150x150'}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {school && (
                <Link
                  to={`/uniforms/${school.id}`}
                  className="inline-block badge badge-primary hover:scale-105 transition-transform"
                >
                  {school.name}
                </Link>
              )}
              
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg">
                    <Star size={18} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-bold text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border-2 border-primary-200">
                <div className="flex items-baseline space-x-4">
                  <span className="text-4xl font-extrabold text-primary-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="badge bg-red-500 text-white text-lg px-3 py-1">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>

              {/* Size Selection */}
              <div>
                <label className="block font-bold text-gray-900 mb-3 text-lg">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-600 scale-105 shadow-lg'
                          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              {product.colors.length > 1 && (
                <div>
                  <label className="block font-bold text-gray-900 mb-3 text-lg">Select Color</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-primary-600 bg-primary-50 text-primary-600 scale-105 shadow-lg'
                            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block font-bold text-gray-900 mb-3 text-lg">Quantity</label>
                <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-2 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:bg-white hover:border-primary-500 transition-all flex items-center justify-center font-bold text-gray-600 hover:text-primary-600"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:bg-white hover:border-primary-500 transition-all flex items-center justify-center font-bold text-gray-600 hover:text-primary-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addedToCart}
                  className={`btn-primary flex-1 flex items-center justify-center text-lg py-4 ${
                    addedToCart ? 'bg-green-500 hover:bg-green-600' : ''
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} className="mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`btn-secondary flex items-center justify-center px-6 ${
                    isWishlisted ? 'bg-red-50 border-red-500 text-red-600' : ''
                  }`}
                >
                  <Heart size={20} className={`mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  Wishlist
                </button>
                <button className="btn-secondary flex items-center justify-center px-6">
                  <Share2 size={20} className="mr-2" />
                  Share
                </button>
              </div>

              {!product.inStock && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-600 font-semibold">⚠️ Out of Stock</p>
                </div>
              )}

              {/* Product Features */}
              <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Truck className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over ₹2,999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <RotateCcw className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
