import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { ArrowLeft, Save, Loader, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

function SchoolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    image: '',
    color: '#0ea5e9',
    category: ['primary'],
    description: '',
  });

  const categories = [
    { value: 'primary', label: 'Primary' },
    { value: 'pre-primary', label: 'Pre-Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'institution', label: 'Institution' },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchSchool();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      setFetching(true);
      const response = await adminAPI.getAdminSchools();
      const school = response.data?.find(s => s._id === id);
      
      if (school) {
        // Handle both old format (string) and new format (array)
        let categories = school.category || ['primary'];
        if (!Array.isArray(categories)) {
          categories = [categories];
        }
        
        setFormData({
          name: school.name || '',
          logo: school.logo || '',
          image: school.image || '',
          color: school.color || '#0ea5e9',
          category: categories,
          description: school.description || '',
        });
      } else {
        setError('School not found');
      }
    } catch (error) {
      setError('Error fetching school: ' + error.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryValue) => {
    setFormData((prev) => {
      const currentCategories = prev.category || [];
      const isSelected = currentCategories.includes(categoryValue);
      
      let newCategories;
      if (isSelected) {
        // Remove category if already selected
        newCategories = currentCategories.filter((cat) => cat !== categoryValue);
        // Ensure at least one category is selected
        if (newCategories.length === 0) {
          newCategories = ['primary'];
        }
      } else {
        // Add category if not selected
        newCategories = [...currentCategories, categoryValue];
      }
      
      return { ...prev, category: newCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        logo: formData.logo || '🏫',
        image: formData.image || null,
        color: formData.color,
        category: formData.category,
        description: formData.description,
      };

      if (isEditMode) {
        await adminAPI.updateSchool(id, submitData);
        setSuccess('School updated successfully!');
      } else {
        await adminAPI.createSchool(submitData);
        setSuccess('School created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/schools');
      }, 1500);
    } catch (error) {
      setError(error.message || 'Error saving school');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
          <p className="text-gray-600">Loading school...</p>
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
              onClick={() => navigate('/admin/schools')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit School' : 'Add New School'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode ? 'Update school information' : 'Create a new school'}
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
          <div>
            <label className="block font-semibold mb-2">School Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g., Delhi Public School"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Categories *</label>
              <div className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
                {categories.map((cat) => {
                  const isSelected = formData.category?.includes(cat.value) || false;
                  return (
                    <label
                      key={cat.value}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(cat.value)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-gray-700 font-medium">{cat.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Select one or more categories. At least one category is required.
              </p>
              {formData.category && formData.category.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.category.map((cat) => {
                    const catLabel = categories.find((c) => c.value === cat)?.label || cat;
                    return (
                      <span
                        key={cat}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {catLabel}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Color *</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="#0ea5e9"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block font-semibold mb-2">Logo (Emoji or Icon) *</label>
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="🏫 (emoji) or icon URL"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter an emoji (e.g., 🏫, 🎓) or an image URL
            </p>
            {formData.logo && (
              <div className="mt-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg text-3xl border border-gray-300">
                  {formData.logo.startsWith('http') ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    formData.logo
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-semibold mb-2">School Image URL (Optional)</label>
            <div className="flex items-center space-x-2">
              <ImageIcon className="text-gray-400" size={20} />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="https://example.com/school-image.jpg"
              />
            </div>
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="School preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Enter school description..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/schools')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
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
                  {isEditMode ? 'Update School' : 'Create School'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default SchoolForm;

