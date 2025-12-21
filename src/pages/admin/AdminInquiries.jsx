import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { MessageSquare, Search, Loader, Filter, Mail, Phone, Building, FileText } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await adminAPI.getInquiries(params);
      setInquiries(response.data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus, notes = '') => {
    try {
      await adminAPI.updateInquiry(inquiryId, { status: newStatus, notes });
      fetchInquiries();
      setSelectedInquiry(null);
    } catch (error) {
      alert('Error updating inquiry: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Corporate Inquiries</h1>
            <p className="text-gray-600 mt-2">Manage corporate uniform inquiries</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, company, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="text-center py-16">
            <Loader className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Building className="text-primary-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{inquiry.companyName}</h3>
                        <p className="text-sm text-gray-500">Contact: {inquiry.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <span>{inquiry.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={16} />
                        <span>{inquiry.phone}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <FileText size={16} className="text-gray-400 mt-1" />
                        <p className="text-sm text-gray-700 line-clamp-2">{inquiry.requirement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg mb-4">No inquiries found</p>
          </div>
        )}

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Company Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedInquiry.companyName}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Contact Name</label>
                      <p className="text-gray-900">{selectedInquiry.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                      <a href={`mailto:${selectedInquiry.email}`} className="text-primary-600 hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-primary-600 hover:underline">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedInquiry.status)}`}>
                        {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Requirement</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.requirement}</p>
                    </div>
                  </div>

                  {selectedInquiry.notes && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">Notes</label>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedInquiry.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry._id, 'contacted')}
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 font-semibold"
                    >
                      Mark as Contacted
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry._id, 'quoted')}
                      className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 font-semibold"
                    >
                      Mark as Quoted
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry._id, 'converted')}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 font-semibold"
                    >
                      Mark as Converted
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry._id, 'closed')}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-semibold"
                    >
                      Mark as Closed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInquiries;

