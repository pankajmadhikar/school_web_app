import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { Plus, Edit, Trash2, Package, AlertCircle, Search, Loader } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filterLowStock]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = filterLowStock ? { lowStock: 'true' } : {};
      const response = await adminAPI.getAdminProducts(params);
      setProducts(response.data || response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>
          <Link
            to="/admin/products/new"
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterLowStock
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertCircle className="inline mr-2" size={18} />
              Low Stock Only
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            {product.lowStockAlert && (
                              <span className="text-xs text-yellow-600 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                Low Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {product.stock && product.stock.length > 0 ? (
                            <span className="text-green-600 font-semibold">In Stock</span>
                          ) : (
                            <span className="text-red-600 font-semibold">Out of Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <Link to="/admin/products/new" className="btn-primary inline-flex items-center">
              <Plus size={20} className="mr-2" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;

