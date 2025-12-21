import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addToCart(product, product.sizes[0], product.colors[0], 1)
    setTimeout(() => setIsAdding(false), 800)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="card group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400x500'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform hover:scale-105 transition-transform">
              {discount}% OFF
            </span>
          )}
          {product.inStock && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              In Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={handleWishlist}
            className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-2.5 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2.5 rounded-xl font-semibold 
                       shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 
                       active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       ${isAdding ? 'bg-green-500' : ''}`}
          >
            {isAdding ? 'Added!' : 'Quick Add'}
          </button>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-gray-700 ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-primary-600">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
            Sizes: {product.sizes.slice(0, 3).join(', ')}
            {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

