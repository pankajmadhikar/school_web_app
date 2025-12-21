import { useState } from 'react'
import { Ruler, Shirt, Package, Users } from 'lucide-react'
import { sizeCharts } from '../data/mockData'

function SizeCharts() {
  const [activeChart, setActiveChart] = useState('shirts')

  const charts = [
    { id: 'shirts', name: 'Shirts', icon: Shirt },
    { id: 'trousers', name: 'Trousers', icon: Users },
    { id: 'footwear', name: 'Footwear', icon: Package },
    { id: 'skirts', name: 'Skirts', icon: Shirt },
  ]

  const currentChart = sizeCharts[activeChart]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-4">
            <Ruler size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Size Charts</h1>
          </div>
          <p className="text-xl text-primary-100 max-w-2xl">
            Find the perfect fit with our comprehensive size guides. Measure yourself and compare with our size charts.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Chart Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {charts.map((chart) => {
              const Icon = chart.icon
              return (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeChart === chart.id
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <span className="font-semibold">{chart.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Size Chart Table */}
        {currentChart && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-primary-600 text-white p-6">
              <h2 className="text-2xl font-bold">{currentChart.title}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Size</th>
                    {currentChart.measurements.map((measurement, idx) => (
                      <th key={idx} className="px-6 py-4 text-left font-semibold text-gray-700">
                        {measurement}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(currentChart.sizes).map(([size, measurements], idx) => (
                    <tr key={size} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-semibold text-primary-600">{size}</td>
                      {currentChart.measurements.map((measurement, mIdx) => (
                        <td key={mIdx} className="px-6 py-4 text-gray-700">
                          {measurements[measurement.toLowerCase().replace(' ', '')] || measurements[Object.keys(measurements)[mIdx]]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Measurement Guide */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">How to Measure</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">For Shirts & Tops</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Chest:</strong> Measure around the fullest part of your chest, under your arms</li>
                <li><strong>Waist:</strong> Measure around your natural waistline</li>
                <li><strong>Length:</strong> Measure from the top of the shoulder to the bottom hem</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">For Trousers & Pants</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Waist:</strong> Measure around your natural waistline where you wear your pants</li>
                <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
                <li><strong>Inseam:</strong> Measure from the crotch to the bottom of the leg</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">For Footwear</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Measure your foot length from heel to toe</li>
                <li>Measure in the evening when your feet are at their largest</li>
                <li>Refer to the size chart for accurate conversion</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Tips for Accurate Measurement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Use a flexible measuring tape</li>
                <li>Measure over light clothing</li>
                <li>Keep the tape level and snug, not tight</li>
                <li>Measure twice to ensure accuracy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Size Recommendation */}
        <div className="bg-primary-50 rounded-lg p-8 border-2 border-primary-200">
          <h2 className="text-2xl font-bold mb-4">Need Help Finding Your Size?</h2>
          <p className="text-gray-700 mb-4">
            If you're unsure about your size, our customer service team is here to help. Contact us with your measurements and we'll recommend the perfect size for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:+919876543210" className="btn-primary">
              Call Us: +91 98765 43210
            </a>
            <a href="mailto:info@uniformstore.com" className="btn-secondary">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeCharts

