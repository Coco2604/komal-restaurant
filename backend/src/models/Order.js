const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: String,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    fullAddress: { type: String, required: true },
    landmark: String,
    pincode: { type: String },
    city: { type: String, default: 'Bhatapara' },
    state: { type: String, default: 'Chhattisgarh' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 50 },

  discount: { type: Number, default: 0 },
  couponCode: String,
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'razorpay'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  estimatedDeliveryTime: { type: Number, default: 45 },
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  specialInstructions: String,
  rating: { type: Number, min: 1, max: 5 },
  review: String,
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderId = `KML-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
