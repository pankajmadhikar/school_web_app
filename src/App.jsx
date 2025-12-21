import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import MensWear from './pages/MensWear'
import Uniforms from './pages/Uniforms'
import SizeCharts from './pages/SizeCharts'
import ProductDetail from './pages/ProductDetail'
import SchoolCollection from './pages/SchoolCollection'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import CorporateInquiry from './pages/CorporateInquiry'
import SalesReport from './pages/SalesReport'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminSchools from './pages/admin/AdminSchools'
import AdminOrders from './pages/admin/AdminOrders'
import AdminInquiries from './pages/admin/AdminInquiries'
import ProductForm from './pages/admin/ProductForm'
import SchoolForm from './pages/admin/SchoolForm'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schools"
              element={
                <ProtectedRoute>
                  <AdminSchools />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schools/new"
              element={
                <ProtectedRoute>
                  <SchoolForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schools/:id/edit"
              element={
                <ProtectedRoute>
                  <SchoolForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <ProtectedRoute>
                  <AdminInquiries />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/*"
              element={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mens-wear" element={<MensWear />} />
              <Route path="/uniforms" element={<Uniforms />} />
              <Route path="/uniforms/:schoolId" element={<SchoolCollection />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/size-charts" element={<SizeCharts />} />
              <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                      <Route path="/corporate-inquiry" element={<CorporateInquiry />} />
              <Route path="/sales-report" element={<SalesReport />} />
            </Routes>
          </main>
          <Footer />
        </div>
              }
            />
          </Routes>
      </Router>
    </CartProvider>
    </AuthProvider>
  )
}

export default App

