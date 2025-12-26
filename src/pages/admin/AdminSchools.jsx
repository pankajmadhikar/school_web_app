import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { Plus, Edit, Trash2, School, Search, Loader, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAdminSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this school? This will not delete associated products.')) return;

    try {
      await adminAPI.deleteSchool(id);
      fetchSchools();
    } catch (error) {
      alert('Error deleting school: ' + error.message);
    }
  };

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
            <p className="text-gray-600 mt-2">Manage schools and institutions</p>
          </div>
          <Link
            to="/admin/schools/new"
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add School
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schools by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Schools Grid */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
            <p className="text-gray-600">Loading schools...</p>
          </div>
        ) : filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div key={school._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: school.color + '20', color: school.color }}
                    >
                      {school.logo || '🏫'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{school.name}</h3>
                      <p className="text-sm text-gray-500">Slug: {school.slug}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Categories:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {(() => {
                        const categories = Array.isArray(school.category) 
                          ? school.category 
                          : school.category 
                            ? [school.category] 
                            : ['primary'];
                        return categories.length > 0 ? (
                          categories.map((cat, idx) => (
                            <span key={idx} className="font-semibold capitalize px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="font-semibold text-gray-400">N/A</span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-semibold">{school.productCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${school.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Link
                    to={`/admin/schools/${school._id}/edit`}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold flex items-center justify-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(school._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <School className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg mb-4">No schools found</p>
            <Link
              to="/admin/schools/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Your First School
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminSchools;

