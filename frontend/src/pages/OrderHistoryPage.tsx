import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock } from 'lucide-react';
import { orderApi } from '../api';
import type { Order } from '../types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  preparing: 'status-preparing',
  ready: 'status-ready',
  out_for_delivery: 'status-out_for_delivery',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders().then(r => {
      setOrders(r.data.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-teal-700 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No orders yet</p>
            <Link to="/menu" className="btn-primary mt-4 inline-flex">Order Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="card p-5 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm text-gray-400">#{order.orderId}</p>
                    <p className="font-semibold text-gray-800">{order.items.length} item(s)</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-700 text-lg">₹{order.total}</p>
                    <span className={STATUS_COLORS[order.status] || 'badge badge-teal'}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3 truncate">
                  {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" /> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                  </span>
                  {!['delivered', 'cancelled'].includes(order.status) && (
                    <Link to={`/track/${order._id}`} className="btn-ghost btn-sm flex items-center gap-1 text-teal-700">
                      Track <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
