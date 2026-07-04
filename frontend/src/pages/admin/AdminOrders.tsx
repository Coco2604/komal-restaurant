import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Eye } from 'lucide-react';
import { orderApi } from '../../api';
import type { Order, OrderStatus } from '../../types';
import toast from 'react-hot-toast';

const STATUSES: { value: string; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const NEXT_STATUS: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'status-pending', confirmed: 'status-confirmed', preparing: 'status-preparing',
  ready: 'status-ready', out_for_delivery: 'status-out_for_delivery',
  delivered: 'status-delivered', cancelled: 'status-cancelled',
};

const AdminOrders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '50' };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await orderApi.getAll(params);
      setOrders(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success(`Order status updated to ${status.replace(/_/g, ' ')}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: status as OrderStatus } : null);
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === s.value ? 'bg-teal-700 text-white' : 'bg-white text-gray-600 hover:bg-teal-50 shadow-sm'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={fetchOrders} className="ml-auto btn-ghost btn-sm flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
        <span className="text-sm text-gray-500">{total} orders</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Orders list */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-card text-center py-12 text-gray-400">
              <p className="text-lg font-medium">No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order._id}
                  className={`admin-card cursor-pointer hover:border-teal-200 border transition-all ${selectedOrder?._id === order._id ? 'border-teal-400 bg-teal-50' : 'border-transparent'}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-teal-700">#{order.orderId}</span>
                        <span className={STATUS_COLORS[order.status] || 'badge badge-teal'}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{(order.user as any)?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-400">{(order.user as any)?.phone || (order.user as any)?.email || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.total}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
                      <p className="text-xs text-gray-400">{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 truncate">{order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}</p>

                  {/* Quick actions */}
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={e => { e.stopPropagation(); handleStatusUpdate(order._id, NEXT_STATUS[order.status]); }}
                      className="mt-2 btn-primary btn-sm text-xs"
                    >
                      Mark as {NEXT_STATUS[order.status].replace(/_/g, ' ')} →
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      onClick={e => { e.stopPropagation(); handleStatusUpdate(order._id, 'cancelled'); }}
                      className="mt-2 ml-2 btn-danger btn-sm text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        <div className="sticky top-4">
          {selectedOrder ? (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Order Detail</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <p><span className="text-gray-500">ID:</span> <span className="font-mono font-bold text-teal-700">#{selectedOrder.orderId}</span></p>
                <p><span className="text-gray-500">Customer:</span> {(selectedOrder.user as any)?.name}</p>
                <p><span className="text-gray-500">Phone:</span> {(selectedOrder.user as any)?.phone || '—'}</p>
                <p><span className="text-gray-500">Address:</span> {selectedOrder.deliveryAddress?.fullAddress}, {selectedOrder.deliveryAddress?.city}</p>
                <p><span className="text-gray-500">Payment:</span> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'} ({selectedOrder.paymentStatus})</p>
                {selectedOrder.specialInstructions && (
                  <p><span className="text-gray-500">Note:</span> {selectedOrder.specialInstructions}</p>
                )}
              </div>

              <hr className="border-gray-100 mb-4" />

              <div className="space-y-2 mb-4">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <hr className="border-gray-100" />
                <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>₹{selectedOrder.subtotal}</span></div>
                <div className="flex justify-between text-xs text-gray-500"><span>Delivery</span><span>₹{selectedOrder.deliveryCharge}</span></div>
                <div className="flex justify-between text-xs text-gray-500"><span>Tax</span><span>₹{selectedOrder.tax}</span></div>
                {selectedOrder.discount > 0 && <div className="flex justify-between text-xs text-green-600"><span>Discount</span><span>-₹{selectedOrder.discount}</span></div>}
                <div className="flex justify-between font-bold text-teal-700"><span>Total</span><span>₹{selectedOrder.total}</span></div>
              </div>

              {/* Status update */}
              <div className="space-y-2">
                <label className="label text-xs">Update Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleStatusUpdate(selectedOrder._id, e.target.value)}
                  className="input text-sm"
                >
                  {STATUSES.filter(s => s.value !== 'all').map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Status history */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Status History</p>
                  <div className="space-y-1">
                    {selectedOrder.statusHistory.slice(-5).map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{h.status.replace(/_/g, ' ')}</span>
                        <span>{new Date(h.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="admin-card text-center py-12 text-gray-400">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
