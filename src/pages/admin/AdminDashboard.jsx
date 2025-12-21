import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { Package, ShoppingBag, MessageSquare, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, inquiriesRes, orderStatsRes] = await Promise.all([
        adminAPI.getAdminProducts({ limit: 1 }),
        adminAPI.getOrders({ limit: 1 }),
        adminAPI.getInquiries({ limit: 1 }),
        adminAPI.getOrderStats(),
      ]);

      // Get low stock products
      const lowStockProductsRes = await adminAPI.getAdminProducts({ lowStock: 'true', limit: 100 });
      
      setStats({
        totalProducts: productsRes.total || productsRes.count || 0,
        totalOrders: ordersRes.total || ordersRes.count || 0,
        totalInquiries: inquiriesRes.total || inquiriesRes.count || 0,
        totalRevenue: orderStatsRes.data?.totalRevenue || 0,
        pendingOrders: orderStatsRes.data?.pendingOrders || 0,
        lowStockProducts: lowStockProductsRes.count || lowStockProductsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: 'bg-purple-500',
      link: '/admin/inquiries',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/admin/orders',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your store</p>
        </div>

        {/* Alerts */}
        {stats.lowStockProducts > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div className="flex-grow">
              <p className="font-semibold text-yellow-800">
                {stats.lowStockProducts} products have low stock
              </p>
              <p className="text-sm text-yellow-700">Please review and update inventory</p>
            </div>
            <Link
              to="/admin/products?lowStock=true"
              className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              View Products
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <ArrowRight className="text-gray-400" size={20} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/products/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <Package className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-semibold text-gray-700">Add New Product</p>
            </Link>
            <Link
              to="/admin/schools/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <ShoppingBag className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-semibold text-gray-700">Add New School</p>
            </Link>
            <Link
              to="/admin/orders?status=pending"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <TrendingUp className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-semibold text-gray-700">View Pending Orders ({stats.pendingOrders})</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

