import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderApi, settingsApi, couponApi } from '../api';
import type { Settings } from '../types';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [address, setAddress] = useState({ fullAddress: '', landmark: '', pincode: '493118', city: 'Bhatapara', state: 'Chhattisgarh', lat: undefined as number | undefined, lng: undefined as number | undefined });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [couponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    settingsApi.get().then(r => setSettings(r.data.data || null));
    if (items.length === 0) navigate('/menu');
  }, []);

  const RESTAURANT_LAT = 21.7299;
  const RESTAURANT_LNG = 81.9943;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; 
  };

  const getDeliveryCharge = () => {
    const upTo1km = settings?.deliveryCharges?.upTo1km || 50;
    const above1km = settings?.deliveryCharges?.above1km || 80;
    
    if (address.lat && address.lng) {
      const distance = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, address.lat, address.lng);
      return distance <= 1.5 ? upTo1km : above1km;
    }
    return address.pincode === '493118' ? upTo1km : above1km;
  };

  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();
  const total = subtotal + deliveryCharge - couponDiscount;

  const isTooFar = !!(address.lat && address.lng && calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, address.lat, address.lng) > 15);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    const toastId = toast.loading('Detecting your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss(toastId);
        const { latitude, longitude } = position.coords;
        setAddress(prev => ({ ...prev, lat: latitude, lng: longitude }));
        
        const dist = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, latitude, longitude);
        if (dist > 15) {
          toast.error(`You are ${dist.toFixed(1)}km away. This is outside our 15km delivery radius!`);
        } else {
          toast.success(`Location found! Delivery fee updated based on distance (${dist.toFixed(1)}km)`);
        }
      },
      () => {
        toast.dismiss(toastId);
        toast.error('Unable to retrieve your location. Please check browser permissions.');
      }
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await couponApi.validate(couponCode, subtotal);
      if (res.data.success && res.data.data) {
        setCouponDiscount(res.data.data.discount);
        setCouponApplied(couponCode.toUpperCase());
        toast.success(`🎉 Coupon applied! ₹${res.data.data.discount} off`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  // Prevent TS unused warning for handleApplyCoupon
  useEffect(() => {
    if (false) handleApplyCoupon();
  }, []);

  const handlePlaceOrder = async () => {
    if (!address.fullAddress) return toast.error('Please enter delivery address');
    if (!address.lat || !address.lng) return toast.error('Please detect or enter your exact location coordinates (Latitude and Longitude)');
    if (isTooFar) return toast.error('Sorry, your location is outside our delivery radius.');
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({ menuItemId: i.menuItem._id, name: i.menuItem.name, quantity: i.quantity })),
        deliveryAddress: address,
        paymentMethod,
        couponCode: couponApplied || undefined,
        specialInstructions,
      };
      const res = await orderApi.place(orderData);
      if (res.data.success && res.data.data) {
        clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate(`/order/${res.data.data._id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-teal-700 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Address + Payment */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-700" />
                  <h2 className="font-semibold text-lg text-gray-800">Delivery Address</h2>
                </div>
                {address.lat && address.lng ? (
                  <button 
                    onClick={() => setAddress(p => ({ ...p, lat: undefined, lng: undefined }))}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-red-100 text-red-700 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Clear Location
                  </button>
                ) : (
                  <button 
                    onClick={handleDetectLocation}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-teal-100 text-teal-800 px-3 py-1.5 rounded-full hover:bg-teal-200 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Detect Location
                  </button>
                )}
              </div>

              {/* Saved addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="mb-4">
                  <button onClick={() => setShowSaved(!showSaved)} className="text-sm text-teal-700 font-medium flex items-center gap-1 mb-2">
                    Use saved address {showSaved ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showSaved && user.addresses.map(addr => (
                    <button key={addr._id} onClick={() => { setAddress({ fullAddress: addr.fullAddress, landmark: addr.landmark || '', pincode: addr.pincode, city: addr.city, state: addr.state, lat: addr.lat, lng: addr.lng }); setShowSaved(false); }}
                      className="w-full text-left p-3 border rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all mb-2 text-sm text-gray-700">
                      <span className="font-medium text-teal-700">{addr.label}</span> — {addr.fullAddress}, {addr.city}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="label">Full Address *</label>
                  <textarea id="address-input" value={address.fullAddress} onChange={e => setAddress(p => ({ ...p, fullAddress: e.target.value }))}
                    className="input resize-none" rows={3} placeholder="House no., Street, Area..." required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Landmark</label>
                    <input type="text" value={address.landmark} onChange={e => setAddress(p => ({ ...p, landmark: e.target.value }))} className="input" placeholder="Near..." />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input type="text" value={address.city} onChange={e => setAddress(p => ({ ...p, city: e.target.value }))} className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Latitude</label>
                    <input type="number" step="any" value={address.lat || ''} onChange={e => setAddress(p => ({ ...p, lat: e.target.value ? parseFloat(e.target.value) : undefined }))} className="input" placeholder="21.7299" />
                  </div>
                  <div>
                    <label className="label">Longitude</label>
                    <input type="number" step="any" value={address.lng || ''} onChange={e => setAddress(p => ({ ...p, lng: e.target.value ? parseFloat(e.target.value) : undefined }))} className="input" placeholder="81.9943" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-teal-700" />
                <h2 className="font-semibold text-lg text-gray-800">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'razorpay', label: 'Online Payment', icon: '💳', desc: 'UPI, Cards, Net Banking via Razorpay' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}>
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value as any)} className="mt-1 accent-teal-700" />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>



            {/* Special instructions */}
            <div className="card p-6">
              <label className="label text-base mb-3">Special Instructions (Optional)</label>
              <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)}
                className="input resize-none" rows={2} placeholder="No spice, extra gravy, etc." />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="card p-6 sticky top-20">
              <h2 className="font-semibold text-lg text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {items.map(({ menuItem, quantity }) => (
                  <div key={menuItem._id} className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1 mr-2">{menuItem.name} × {quantity}</span>
                    <span className="text-gray-800 font-medium shrink-0">₹{menuItem.price * quantity}</span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Delivery</span>
                  <span>₹{deliveryCharge}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>−₹{couponDiscount}</span></div>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between text-teal-700 font-bold text-base"><span>Total</span><span>₹{total}</span></div>
              </div>

              <button
                id="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={loading || isTooFar}
                className={`btn-primary w-full justify-center mt-6 ${isTooFar ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'disabled:opacity-60'}`}
              >
                {loading ? 'Placing Order...' : isTooFar ? 'Out of Delivery Area' : `Place Order ₹${total}`}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Est. delivery: ~{settings?.preparationTime || 25}–{(settings?.preparationTime || 25) + 15} mins
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
