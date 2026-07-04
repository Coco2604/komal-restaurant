import React, { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Users, Clock, ArrowUp, Package } from 'lucide-react';
import { analyticsApi, orderApi } from '../../api';
import type { AnalyticsSummary, Order } from '../../types';
import { Link } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  pending: 'status-pending', confirmed: 'status-confirmed', preparing: 'status-preparing',
  ready: 'status-ready', out_for_delivery: 'status-out_for_delivery', delivered: 'status-delivered', cancelled: 'status-cancelled',
};

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getSummary(),
      orderApi.getAll({ limit: '5' }),
    ]).then(([summaryRes, ordersRes]) => {
      setSummary(summaryRes.data.data || null);
      setRecentOrders(ordersRes.data.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full" /></div>;

  const stats = [
    { label: "Today's Orders", value: summary?.today.orders || 0, icon: ShoppingBag, color: 'bg-blue-100 text-blue-700', change: '+Today' },
    { label: "Today's Revenue", value: `₹${summary?.today.revenue || 0}`, icon: TrendingUp, color: 'bg-green-100 text-green-700', change: '+Today' },
    { label: 'Pending Orders', value: summary?.pending || 0, icon: Clock, color: 'bg-yellow-100 text-yellow-700', change: 'Active' },
    { label: 'Total Customers', value: summary?.customers || 0, icon: Users, color: 'bg-purple-100 text-purple-700', change: 'All time' },
    { label: 'Total Orders', value: summary?.total.orders || 0, icon: Package, color: 'bg-teal-100 text-teal-700', change: 'All time' },
    { label: 'Total Revenue', value: `₹${summary?.total.revenue || 0}`, icon: ArrowUp, color: 'bg-gold-100 text-gold-700', change: 'All time' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="admin-stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-400">{change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['/admin/orders?status=pending', '🕐 Pending Orders', 'Review new orders', 'bg-yellow-50 border-yellow-200'],
          ['/admin/menu', '➕ Add Menu Item', 'Add a new dish', 'bg-teal-50 border-teal-200'],
          ['/admin/analytics', '📊 View Analytics', 'Sales & trends', 'bg-blue-50 border-blue-200'],
          ['/admin/settings', '⚙️ Settings', 'Configure restaurant', 'bg-gray-50 border-gray-200'],
        ].map(([to, title, desc, cls]) => (
          <Link key={to} to={to} className={`admin-card border ${cls} hover:shadow-card-hover transition-all`}>
            <p className="font-semibold text-gray-800 text-sm">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-lg">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-teal-700 hover:text-teal-800 font-medium">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 font-mono text-teal-700 font-medium">#{order.orderId}</td>
                  <td className="py-3 text-gray-700">{(order.user as any)?.name || 'Customer'}</td>
                  <td className="py-3 font-semibold text-gray-800">₹{order.total}</td>
                  <td className="py-3"><span className={STATUS_COLORS[order.status] || 'badge badge-teal'}>{order.status.replace(/_/g, ' ')}</span></td>
                  <td className="py-3 text-gray-400">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <p className="text-center text-gray-400 py-8">No orders yet</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
