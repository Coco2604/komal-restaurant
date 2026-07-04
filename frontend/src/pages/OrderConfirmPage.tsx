import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';
import { orderApi } from '../api';
import type { Order } from '../types';

const OrderConfirmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    orderApi.getById(id!).then(r => setOrder(r.data.data || null));
  }, [id]);

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success animation */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-30" />
          <div className="relative w-28 h-28 bg-teal-500 rounded-full flex items-center justify-center shadow-glow-teal">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </div>

        <h1 className="font-serif text-4xl font-bold text-teal-700 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-1">Thank you for your order</p>
        <p className="text-sm font-mono text-gray-400 mb-8">#{order.orderId}</p>

        <div className="card p-6 text-left mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Items', `${order.items.length} item(s)`],
              ['Total', `₹${order.total}`],
              ['Payment', order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'],
              ['Est. Delivery', `~${order.estimatedDeliveryTime} mins`],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          <hr className="my-4 border-gray-100" />
          <p className="text-sm text-gray-600">
            <span className="font-medium">Delivery to:</span>{' '}
            {order.deliveryAddress.fullAddress}, {order.deliveryAddress.city}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/track/${order._id}`} className="btn-primary">
            <Package className="w-4 h-4" /> Track Order
          </Link>
          <Link to="/" className="btn-outline">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
