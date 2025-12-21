import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { schools } from '../data/mockData'

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const total = getCartTotal()
  const shipping = total > 2999 ? 0 : 99
  const finalTotal = total + shipping
  const remainingForFreeShipping = Math.max(0, 2999 - total)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12 slide-up">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 gradient-text">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
              </p>
              <Link to="/uniforms" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                Continue Shopping
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text">Shopping Cart</h1>
          <span className="text-gray-600 font-semibold">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const school = schools.find(s => s.id === item.school)
              return (
                <div 
                  key={`${item.id}-${item.size}-${item.color}-${index}`} 
                  className="card p-6 slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/200x200'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold mb-1 hover:text-primary-600 transition-colors">
                            {item.name}
                          </h3>
                          {school && (
                            <p className="text-sm text-primary-600 font-semibold mb-2">{school.name}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="badge badge-primary">Size: {item.size}</span>
                        <span className="badge badge-primary">Color: {item.color}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:bg-white hover:border-primary-500 transition-all flex items-center justify-center font-bold text-gray-600 hover:text-primary-600"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:bg-white hover:border-primary-500 transition-all flex items-center justify-center font-bold text-gray-600 hover:text-primary-600"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              ₹{item.price.toLocaleString()} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="card p-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2 hover:underline"
              >
                <Trash2 size={18} />
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        FREE
                      </span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                
                {remainingForFreeShipping > 0 && (
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-primary-600 mt-0.5 flex-shrink-0" size={18} />
                      <div className="flex-grow">
                        <p className="text-sm font-semibold text-primary-800 mb-1">
                          You're almost there!
                        </p>
                        <p className="text-xs text-primary-700">
                          Add ₹{remainingForFreeShipping.toLocaleString()} more for <strong>FREE shipping</strong>!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600 text-2xl">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full text-center block mb-4"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/uniforms"
                className="btn-secondary w-full text-center block"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3 text-gray-700">Secure Checkout</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="text-green-500" size={18} />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
