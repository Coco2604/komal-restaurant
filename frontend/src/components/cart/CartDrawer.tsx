import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
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
      onClose();
      navigate('/login');
      return;
    }
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif font-bold text-lg">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-gold-500 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-full">{items.reduce((s, i) => s + i.quantity, 0)}</span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-teal-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingBag className="w-16 h-16 opacity-30" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add some delicious items!</p>
              <button onClick={onClose} className="btn-primary">Browse Menu</button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map(({ menuItem, quantity }) => (
                <div key={menuItem._id} className="flex gap-3 bg-gray-50 rounded-xl p-3 group">
                  <img
                    src={menuItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'}
                    alt={menuItem.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-gray-800 leading-tight">{menuItem.name}</p>
                      <button onClick={() => removeItem(menuItem._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gold-600 font-semibold text-sm mt-1">₹{menuItem.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(menuItem._id, quantity - 1)} className="w-7 h-7 bg-teal-100 hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                        <Minus className="w-3 h-3 text-teal-700" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                      <button onClick={() => updateQuantity(menuItem._id, quantity + 1)} className="w-7 h-7 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="ml-auto font-semibold text-sm">₹{menuItem.price * quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>₹{deliveryCharge}</span></div>
              <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>₹{tax}</span></div>
              <hr className="border-gray-200" />
              <div className="flex justify-between font-bold text-base text-teal-700"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full justify-center">
              Proceed to Checkout →
            </button>
            <button onClick={clearCart} className="w-full text-sm text-red-500 hover:text-red-700 py-1 transition-colors">Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
