import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useSchools } from '../hooks/useSchools'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSchoolsOpen, setIsMobileSchoolsOpen] = useState(false)
  const [expandedSchoolId, setExpandedSchoolId] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isShopBySchoolOpen, setIsShopBySchoolOpen] = useState(false)
  const [hoveredSchool, setHoveredSchool] = useState(null)
  const [closeTimeout, setCloseTimeout] = useState(null)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const location = useLocation()
  const { schools } = useSchools()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
      }
    }
  }, [closeTimeout])

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    setIsShopBySchoolOpen(true)
  }

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow cursor movement
    const timeout = setTimeout(() => {
      setIsShopBySchoolOpen(false)
      setHoveredSchool(null)
    }, 200) // 200ms delay
    setCloseTimeout(timeout)
  }

  const categoryLabels = {
    'pre-primary': 'Pre-Primary',
    'primary': 'Primary',
    'secondary': 'Secondary',
    'institution': 'Institution',
  }

  const navLinks = [
    { path: '/mens-wear', label: "Men's Wear" },
    { path: '/corporate-inquiry', label: 'Corporate Inquiry' },
    { path: '/size-charts', label: 'Size Charts' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-white shadow-md'
        }`}
    >
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group shrink-0"
          >
            <div className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300">
              🎓
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-2xl font-bold gradient-text leading-tight">Uniform Store</h1>
              <p className="text-[10px] sm:text-xs text-gray-500">School Apparel & More</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
            {/* Home Link First */}
            <Link
              to="/"
              className={`relative px-1.5 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${location.pathname === '/'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
              )}
            </Link>

            {/* Shop by School Second */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`relative px-1.5 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 flex items-center space-x-1 ${location.pathname.startsWith('/uniforms')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
              >
                <span>Shop by School</span>
                <ChevronDown size={14} className={`transition-transform ${isShopBySchoolOpen ? 'rotate-180' : ''}`} />
                {location.pathname.startsWith('/uniforms') && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                )}
              </button>

              {/* Main Dropdown */}
              {isShopBySchoolOpen && (
                <div
                  className="main-dropdown absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  style={{ marginTop: '0px' }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {schools.map((school, index) => (
                    <div
                      key={school._id || school.id}
                      className="school-item-wrapper relative w-full"
                      onMouseEnter={() => {
                        if (closeTimeout) {
                          clearTimeout(closeTimeout)
                          setCloseTimeout(null)
                        }
                        setHoveredSchool(school._id || school.id)
                        setIsShopBySchoolOpen(true)
                      }}
                      onMouseLeave={(e) => {
                        const relatedTarget = e.relatedTarget
                        if (relatedTarget) {
                          const isMovingToSideDropdown = relatedTarget.closest('.side-dropdown')
                          const isMovingToSchoolWrapper = relatedTarget.closest('.school-item-wrapper')
                          const isMovingToMainDropdown = relatedTarget.closest('.main-dropdown')
                          if (!isMovingToSideDropdown && !isMovingToSchoolWrapper && !isMovingToMainDropdown) {
                            const timeout = setTimeout(() => {
                              setHoveredSchool(null)
                            }, 200)
                            setCloseTimeout(timeout)
                          }
                        } else {
                          const timeout = setTimeout(() => {
                            setHoveredSchool(null)
                          }, 200)
                          setCloseTimeout(timeout)
                        }
                      }}
                    >
                      <Link
                        to={`/uniforms/${school.slug || school._id || school.id}`}
                        className="school-item flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setIsShopBySchoolOpen(false)
                          setHoveredSchool(null)
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-lg"
                          style={{ backgroundColor: (school.color || '#0ea5e9') + '20', color: school.color || '#0ea5e9' }}
                        >
                          {school.logo || '🏫'}
                        </div>
                        <span className="flex-1 text-gray-700 font-medium text-sm">{school.name}</span>
                        <ChevronDown size={14} className="text-gray-400 -rotate-90" />
                      </Link>

                      {/* Side Dropdown */}
                      {hoveredSchool === (school._id || school.id) && (
                        <div
                          className="side-dropdown absolute left-full top-0 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                          style={{ marginLeft: '-2px' }}
                          onMouseEnter={() => {
                            if (closeTimeout) {
                              clearTimeout(closeTimeout)
                              setCloseTimeout(null)
                            }
                            setHoveredSchool(school._id || school.id)
                            setIsShopBySchoolOpen(true)
                          }}
                        >
                          <Link
                            to={`/uniforms/${school.slug || school._id || school.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-semibold border-b border-gray-100"
                            onClick={() => {
                              setIsShopBySchoolOpen(false)
                              setHoveredSchool(null)
                            }}
                          >
                            All Products
                          </Link>
                          {((Array.isArray(school.category) && school.category.length > 0)
                            ? school.category
                            : ['uniforms', 'sportswear', 'footwear', 'accessories', 'outerwear']
                          ).map((catId) => (
                            <Link
                              key={catId}
                              to={`/uniforms/${school.slug || school._id || school.id}?productCategory=${catId}`}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                              onClick={() => {
                                setIsShopBySchoolOpen(false)
                                setHoveredSchool(null)
                              }}
                            >
                              {categoryLabels[catId] || catId.charAt(0).toUpperCase() + catId.slice(1)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1.5 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 ${location.pathname === link.path
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-primary-600 transition-all duration-200 group shrink-0"
          >
            <div className="relative p-1.5 sm:p-2 rounded-lg hover:bg-primary-50 transition-colors">
              <ShoppingCart size={20} className="sm:hidden group-hover:scale-110 transition-transform" />
              <ShoppingCart size={24} className="hidden sm:block group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline font-medium">Cart</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-y-auto transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[calc(100vh-80px)] opacity-100 pb-10' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="py-2 border-t flex flex-col space-y-1">
            {/* Home First */}
            <Link
              to="/"
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${location.pathname === '/'
                ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* Shop by School Collapsible */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsMobileSchoolsOpen(!isMobileSchoolsOpen)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${location.pathname.startsWith('/uniforms')
                  ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
              >
                <span>Shop by School</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isMobileSchoolsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileSchoolsOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-6 pr-4 py-2 space-y-2">
                  {schools.map((school) => {
                    const schoolId = school._id || school.id;
                    const isExpanded = expandedSchoolId === schoolId;
                    return (
                      <div key={schoolId} className="flex flex-col">
                        <div
                          className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer ${isExpanded ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'}`}
                          onClick={() => setExpandedSchoolId(isExpanded ? null : schoolId)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{school.logo || '🏫'}</span>
                            <span className="font-medium text-sm">{school.name}</span>
                          </div>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-64 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                          <div className="pl-11 pr-4 py-1 flex flex-col">
                            <Link
                              to={`/uniforms/${school.slug || schoolId}`}
                              className="py-2 text-xs font-semibold text-gray-500 hover:text-primary-600 border-b border-gray-100"
                              onClick={() => {
                                setIsMenuOpen(false)
                                setIsMobileSchoolsOpen(false)
                                setExpandedSchoolId(null)
                              }}
                            >
                              All Products
                            </Link>
                            {((Array.isArray(school.category) && school.category.length > 0)
                              ? school.category
                              : ['uniforms', 'sportswear', 'footwear', 'accessories', 'outerwear']
                            ).map((catId) => (
                              <Link
                                key={catId}
                                to={`/uniforms/${school.slug || schoolId}?productCategory=${catId}`}
                                className="py-2 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  setIsMobileSchoolsOpen(false)
                                  setExpandedSchoolId(null)
                                }}
                              >
                                {categoryLabels[catId] || catId.charAt(0).toUpperCase() + catId.slice(1)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Other Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${location.pathname === link.path
                  ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
