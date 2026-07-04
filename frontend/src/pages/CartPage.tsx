import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const deliveryCharge = subtotal > 0 ? 50 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryCharge + tax;

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 text-gray-400">
        <ShoppingBag className="w-20 h-20 opacity-20" />
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-500">Your cart is empty</p>
          <p className="mt-1">Explore our menu and add something delicious!</p>
        </div>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl font-bold text-teal-700">Your Cart</h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear All</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-3">
            {items.map(({ menuItem, quantity }) => (
              <div key={menuItem._id} className="card p-4 flex gap-4 group">
                <img
                  src={menuItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'}
                  alt={menuItem.name}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{menuItem.name}</h3>
                    <button onClick={() => removeItem(menuItem._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3.5 h-3.5 border-2 border-green-500 rounded-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-xs text-green-600">Pure Veg</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(menuItem._id, quantity - 1)} className="w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg flex items-center justify-center transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold">{quantity}</span>
                      <button onClick={() => updateQuantity(menuItem._id, quantity + 1)} className="w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-700">₹{menuItem.price * quantity}</p>
                      <p className="text-xs text-gray-400">₹{menuItem.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/menu" className="btn-ghost text-sm flex items-center gap-1 text-teal-700">
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-20">
              <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between"><span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryCharge}</span></div>
                <div className="flex justify-between"><span>GST (5%)</span><span>₹{tax}</span></div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between font-bold text-base text-teal-700"><span>Total</span><span>₹{total}</span></div>
              </div>
              <p className="text-xs text-gray-400 mb-4">Delivery charge may vary based on location. Coupon discounts applied at checkout.</p>
              <button id="checkout-btn" onClick={handleCheckout} className="btn-primary w-full justify-center">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
