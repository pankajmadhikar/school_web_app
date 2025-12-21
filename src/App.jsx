import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import MensWear from './pages/MensWear'
import Uniforms from './pages/Uniforms'
import SizeCharts from './pages/SizeCharts'
import ProductDetail from './pages/ProductDetail'
import SchoolCollection from './pages/SchoolCollection'
import Cart from './pages/Cart'
import SalesReport from './pages/SalesReport'

function App() {
  return (
    <CartProvider>
      <Router>
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
              <Route path="/sales-report" element={<SalesReport />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App

