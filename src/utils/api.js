const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('adminToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Public API calls
export const publicAPI = {
  // Products
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getProduct: (id) => apiCall(`/products/${id}`),

  // Schools
  getSchools: () => apiCall('/schools'),
  getSchool: (id) => apiCall(`/schools/${id}`),

  // Orders
  createOrder: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: orderData,
  }),
  getOrder: (orderNumber) => apiCall(`/orders/${orderNumber}`),

  // Inquiries
  createInquiry: (inquiryData) => apiCall('/inquiries', {
    method: 'POST',
    body: inquiryData,
  }),
};

// Admin API calls
export const adminAPI = {
  // Auth
  login: (email, password) => apiCall('/admin/login', {
    method: 'POST',
    body: { email, password },
  }),
  getMe: () => apiCall('/admin/me'),
  registerAdmin: (adminData) => apiCall('/admin/register', {
    method: 'POST',
    body: adminData,
  }),

  // Products
  getAdminProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products/admin/all${queryString ? `?${queryString}` : ''}`);
  },
  createProduct: (productData) => apiCall('/products', {
    method: 'POST',
    body: productData,
  }),
  updateProduct: (id, productData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: productData,
  }),
  deleteProduct: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
  updateProductStock: (id, stockData) => apiCall(`/products/admin/${id}/stock`, {
    method: 'PUT',
    body: stockData,
  }),

  // Schools
  getAdminSchools: () => apiCall('/schools/admin/all'),
  createSchool: (schoolData) => apiCall('/schools', {
    method: 'POST',
    body: schoolData,
  }),
  updateSchool: (id, schoolData) => apiCall(`/schools/${id}`, {
    method: 'PUT',
    body: schoolData,
  }),
  deleteSchool: (id) => apiCall(`/schools/${id}`, {
    method: 'DELETE',
  }),

  // Orders
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  },
  updateOrder: (id, orderData) => apiCall(`/orders/admin/${id}`, {
    method: 'PUT',
    body: orderData,
  }),
  getOrderStats: () => apiCall('/orders/admin/stats'),

  // Inquiries
  getInquiries: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/inquiries/admin/all${queryString ? `?${queryString}` : ''}`);
  },
  getInquiry: (id) => apiCall(`/inquiries/admin/${id}`),
  updateInquiry: (id, inquiryData) => apiCall(`/inquiries/admin/${id}`, {
    method: 'PUT',
    body: inquiryData,
  }),
  getInquiryStats: () => apiCall('/inquiries/admin/stats'),
};

export default apiCall;

