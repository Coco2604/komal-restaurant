import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Bike, Home, Phone, ArrowRight } from 'lucide-react';
import { orderApi } from '../api';
import type { Order } from '../types';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Restaurant confirmed your order' },
  { key: 'preparing', label: 'Preparing', icon: Clock, desc: 'Our chefs are cooking your food' },
  { key: 'ready', label: 'Ready', icon: Package, desc: 'Your order is packed and ready' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'On the way to you!' },
  { key: 'delivered', label: 'Delivered', icon: Home, desc: 'Enjoy your meal! 🌿' },
];

const TrackOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await orderApi.getById(id!);
        setOrder(res.data.data || null);
      } catch (e) { /* non-auth route */ }
      setLoading(false);
    };
    fetch();
    const interval = setInterval(fetch, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <Package className="w-16 h-16 opacity-30" />
      <p className="text-lg">Order not found</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          {isCancelled ? (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-red-600">Order Cancelled</h1>
            </>
          ) : order.status === 'delivered' ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-green-600">Delivered!</h1>
              <p className="text-gray-500 mt-1">Enjoy your meal! 🌿</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-4xl">🍱</span>
                <span className="absolute inset-0 rounded-full border-4 border-teal-500 animate-ping opacity-20" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-teal-700">Tracking Order</h1>
              <p className="text-gray-500 mt-1">Est. delivery: ~{order.estimatedDeliveryTime} mins</p>
            </>
          )}
          <p className="text-sm text-gray-400 mt-1 font-mono">#{order.orderId}</p>
        </div>

        {/* Status tracker */}
        {!isCancelled && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-6">Order Progress</h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
              <div
                className="absolute left-5 top-5 w-0.5 bg-teal-500 transition-all duration-500"
                style={{ height: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              <div className="space-y-6">
                {STATUS_STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const done = idx <= currentStepIdx;
                  const active = idx === currentStepIdx;
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${done ? 'bg-teal-500 text-white shadow-glow-teal' : 'bg-white border-2 border-gray-200 text-gray-300'} ${active ? 'ring-4 ring-teal-100' : ''}`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div className="pt-1.5">
                        <p className={`font-semibold ${done ? 'text-teal-700' : 'text-gray-400'}`}>{step.label}</p>
                        <p className={`text-sm ${active ? 'text-gray-600' : 'text-gray-400'}`}>{step.desc}</p>
                        {active && (
                          <span className="inline-block mt-1 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full animate-pulse">In progress...</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Order details */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Order Details</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="border-gray-100 my-2" />
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span>₹{order.deliveryCharge}</span></div>

            {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
            <hr className="border-gray-100 my-2" />
            <div className="flex justify-between font-bold text-teal-700"><span>Total</span><span>₹{order.total}</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm text-gray-500">
            <span>Payment: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</strong></span>
            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-gold'}`}>{order.paymentStatus}</span>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Need help?</p>
            <p className="text-sm text-gray-500">Call KOMAL Restaurant</p>
          </div>
          <a href="tel:9827483385" className="btn-secondary btn-sm">
            <Phone className="w-4 h-4" /> 9827483385
          </a>
        </div>

        <div className="text-center mt-6">
          <Link to="/menu" className="btn-outline btn-sm">
            Order More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
