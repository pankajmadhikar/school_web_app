import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI, publicAPI } from '../../utils/api';
import { ArrowLeft, Save, Loader, Plus, X, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [schools, setSchools] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'uniforms',
    school: '',
    institution: '',
    price: '',
    originalPrice: '',
    sizes: [],
    colors: [],
    images: [],
    stock: [], // Array of { size, color, quantity }
  });

  const [currentSize, setCurrentSize] = useState('');
  const [currentColor, setCurrentColor] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [newStockEntry, setNewStockEntry] = useState({ size: '', color: 'Default', quantity: 0 });

  const categories = [
    { value: 'uniforms', label: 'Uniforms' },
    { value: 'sportswear', label: 'Sportswear' },
    { value: 'footwear', label: 'Footwear' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'outerwear', label: 'Outerwear' },
  ];

  useEffect(() => {
    fetchSchools();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchSchools = async () => {
    try {
      const response = await publicAPI.getSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setFetching(true);
      // Fetch all products and find the one we need
      const response = await adminAPI.getAdminProducts({ limit: 1000 });
      const product = response.data?.find(p => p._id === id);
      
      if (product) {
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          category: product.category || 'uniforms',
          school: product.school?._id || product.school || '',
          institution: product.institution || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          sizes: product.sizes || [],
          colors: product.colors || [],
          images: product.images || [],
          stock: product.stock || [],
        });
      } else {
        setError('Product not found');
      }
    } catch (error) {
      setError('Error fetching product: ' + error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSize = () => {
    if (currentSize && !formData.sizes.includes(currentSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, currentSize],
      });
      setCurrentSize('');
    }
  };

  const handleRemoveSize = (size) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(s => s !== size),
      stock: formData.stock.filter(s => s.size !== size),
    });
  };

  const handleAddColor = () => {
    if (currentColor && !formData.colors.includes(currentColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, currentColor],
      });
      setCurrentColor('');
    }
  };

  const handleRemoveColor = (color) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(c => c !== color),
      stock: formData.stock.filter(s => s.color !== color),
    });
  };

  const handleAddImage = () => {
    if (currentImageUrl && !formData.images.includes(currentImageUrl)) {
      setFormData({
        ...formData,
        images: [...formData.images, currentImageUrl],
      });
      setCurrentImageUrl('');
    }
  };

  const handleRemoveImage = (imageUrl) => {
    setFormData({
      ...formData,
      images: formData.images.filter(img => img !== imageUrl),
    });
  };

  const handleAddStock = () => {
    if (newStockEntry.size && newStockEntry.quantity >= 0) {
      const existingIndex = formData.stock.findIndex(
        s => s.size === newStockEntry.size && s.color === newStockEntry.color
      );

      if (existingIndex >= 0) {
        const updatedStock = [...formData.stock];
        updatedStock[existingIndex] = { ...newStockEntry, quantity: Number(newStockEntry.quantity) };
        setFormData({ ...formData, stock: updatedStock });
      } else {
        setFormData({
          ...formData,
          stock: [...formData.stock, { ...newStockEntry, quantity: Number(newStockEntry.quantity) }],
        });
      }
      setNewStockEntry({ size: '', color: 'Default', quantity: 0 });
    }
  };

  const handleRemoveStock = (size, color) => {
    setFormData({
      ...formData,
      stock: formData.stock.filter(s => !(s.size === size && s.color === color)),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data
      const submitData = {
        name: formData.name,
        sku: formData.sku.toUpperCase(),
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        sizes: formData.sizes,
        colors: formData.colors,
        images: formData.images,
        stock: formData.stock.map(s => ({
          size: s.size,
          color: s.color || 'Default',
          quantity: Number(s.quantity),
        })),
      };

      if (formData.originalPrice) {
        submitData.originalPrice = Number(formData.originalPrice);
      }

      if (formData.school) {
        submitData.school = formData.school;
      } else if (formData.institution) {
        submitData.institution = formData.institution;
      }

      if (isEditMode) {
        await adminAPI.updateProduct(id, submitData);
        setSuccess('Product updated successfully!');
      } else {
        await adminAPI.createProduct(submitData);
        setSuccess('Product created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (error) {
      setError(error.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode ? 'Update product information' : 'Create a new product'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                placeholder="PRODUCT-SKU-001"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          {/* Category and School */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">School (Optional)</label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">Select School</option>
                {schools.map((school) => (
                  <option key={school._id} value={school._id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Institution (e.g., mens-wear)</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Leave empty if school selected"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Original Price (₹) - Optional</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block font-semibold mb-2">Sizes *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                placeholder="Enter size (e.g., S, M, L, 28, 30)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block font-semibold mb-2">Colors</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                placeholder="Enter color (e.g., White, Black, Navy Blue)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image URLs */}
          <div>
            <label className="block font-semibold mb-2">Product Images (URLs) *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={currentImageUrl}
                onChange={(e) => setCurrentImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                placeholder="Enter image URL (https://...)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {formData.images.map((imgUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imgUrl}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Error';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imgUrl)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formData.images.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Add at least one image URL</p>
            )}
          </div>

          {/* Stock Management */}
          <div>
            <label className="block font-semibold mb-2">Stock Management</label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid md:grid-cols-4 gap-2">
                <select
                  value={newStockEntry.size}
                  onChange={(e) => setNewStockEntry({ ...newStockEntry, size: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select Size</option>
                  {formData.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newStockEntry.color}
                  onChange={(e) => setNewStockEntry({ ...newStockEntry, color: e.target.value })}
                  placeholder="Color (Default)"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <input
                  type="number"
                  value={newStockEntry.quantity}
                  onChange={(e) => setNewStockEntry({ ...newStockEntry, quantity: e.target.value })}
                  placeholder="Quantity"
                  min="0"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddStock}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Stock
                </button>
              </div>

              {formData.stock.length > 0 && (
                <div className="mt-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left">Size</th>
                        <th className="px-4 py-2 text-left">Color</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {formData.stock.map((stockItem, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{stockItem.size}</td>
                          <td className="px-4 py-2">{stockItem.color}</td>
                          <td className="px-4 py-2">{stockItem.quantity}</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveStock(stockItem.size, stockItem.color)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.images.length === 0}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default ProductForm;

