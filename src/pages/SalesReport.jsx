import { useState, useMemo } from 'react'
import { Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Filter } from 'lucide-react'
import { products, schools } from '../data/mockData'

function SalesReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSchool, setSelectedSchool] = useState('all')

  // Generate mock sales data
  const generateMockSales = () => {
    const sales = []
    const today = new Date(selectedDate)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 30) // Last 30 days

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      // Generate random sales for each day
      const numOrders = Math.floor(Math.random() * 20) + 5
      
      for (let j = 0; j < numOrders; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        const school = schools.find(s => s.id === product.school) || schools[0]
        
        if (selectedSchool !== 'all' && product.school !== selectedSchool) continue
        
        sales.push({
          date: date.toISOString().split('T')[0],
          orderId: `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(j + 1).padStart(4, '0')}`,
          productName: product.name,
          school: school.name,
          category: product.category,
          quantity,
          unitPrice: product.price,
          total: product.price * quantity,
          customerName: `Customer ${j + 1}`,
        })
      }
    }
    
    return sales.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const salesData = useMemo(() => generateMockSales(), [selectedDate, selectedSchool])
  
  const filteredSales = salesData.filter(sale => {
    const saleDate = new Date(sale.date)
    const filterDate = new Date(selectedDate)
    return saleDate <= filterDate
  })

  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    const totalOrders = new Set(filteredSales.map(s => s.orderId)).size
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalRevenue,
      totalOrders,
      totalItems,
      avgOrderValue,
    }
  }, [filteredSales])

  const exportToCSV = () => {
    const headers = ['Date', 'Order ID', 'Product Name', 'School', 'Category', 'Quantity', 'Unit Price', 'Total', 'Customer Name']
    const csvContent = [
      headers.join(','),
      ...filteredSales.map(sale => [
        sale.date,
        sale.orderId,
        `"${sale.productName}"`,
        `"${sale.school}"`,
        sale.category,
        sale.quantity,
        sale.unitPrice,
        sale.total,
        `"${sale.customerName}"`,
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `sales-report-${selectedDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 rounded-xl mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Sales Report</h1>
              <p className="text-primary-100">Daily online sales analytics and reports</p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              <Download size={20} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                <Calendar size={18} className="inline mr-2" />
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                <Filter size={18} className="inline mr-2" />
                Filter by School
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="input-field"
              >
                <option value="all">All Schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-semibold">Total Revenue</h3>
              <DollarSign className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-semibold">Total Orders</h3>
              <ShoppingBag className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-semibold">Items Sold</h3>
              <TrendingUp className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.totalItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-semibold">Avg Order Value</h3>
              <DollarSign className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-orange-600">
              ₹{Math.round(stats.avgOrderValue).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Sales Details</h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredSales.length} sales records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">School</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Qty</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Unit Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Customer</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-gray-700">{sale.date}</td>
                      <td className="px-6 py-4 text-gray-700 font-mono text-sm">{sale.orderId}</td>
                      <td className="px-6 py-4 text-gray-700">{sale.productName}</td>
                      <td className="px-6 py-4 text-gray-700">{sale.school}</td>
                      <td className="px-6 py-4 text-gray-700 capitalize">{sale.category}</td>
                      <td className="px-6 py-4 text-gray-700">{sale.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">₹{sale.unitPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold text-primary-600">₹{sale.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{sale.customerName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      No sales data found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesReport

