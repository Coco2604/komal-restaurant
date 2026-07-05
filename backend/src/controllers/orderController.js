const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');
const Coupon = require('../models/Coupon');
const { calculateDeliveryCharge } = require('../utils/delivery');
const { sendEmail, orderConfirmationEmail, restaurantOrderNotificationEmail } = require('../utils/email');
const User = require('../models/User');

let Razorpay;
try { Razorpay = require('razorpay'); } catch (e) { Razorpay = null; }

// @POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, couponCode, specialInstructions } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items in order' });

    const settings = await Settings.findOne() || {};
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `${item.name || 'Item'} is not available` });
      }
      const lineTotal = menuItem.price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({ menuItem: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: item.quantity, image: menuItem.image });
    }

    const deliveryCharge = calculateDeliveryCharge(deliveryAddress?.pincode, settings, deliveryAddress?.lat, deliveryAddress?.lng);

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiresAt: { $gt: new Date() } });
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'flat') {
          discount = coupon.discountValue;
        } else {
          discount = Math.min(Math.round(subtotal * coupon.discountValue / 100), coupon.maxDiscount || Infinity);
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const total = subtotal + deliveryCharge - discount;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: couponCode?.toUpperCase(),
      total,
      paymentMethod: paymentMethod || 'cod',
      specialInstructions,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    // Increment item orders
    for (const item of orderItems) {
      await MenuItem.findByIdAndUpdate(item.menuItem, { $inc: { totalOrders: item.quantity } });
    }

    // Send confirmation email
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        // Send to customer
        if (user.email) {
          const emailData = orderConfirmationEmail(order, user);
          await sendEmail({ to: user.email, ...emailData });
        }
        
        // Send to restaurant (admin)
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        if (adminEmail) {
          const adminEmailData = restaurantOrderNotificationEmail(order, user);
          await sendEmail({ to: adminEmail, ...adminEmailData });
        }
      }
    } catch (e) { console.error('Email error:', e); }

    // If razorpay, create payment order
    if (paymentMethod === 'razorpay' && Razorpay && process.env.RAZORPAY_KEY_ID) {
      try {
        const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        const rpOrder = await razorpay.orders.create({ amount: total * 100, currency: 'INR', receipt: order.orderId });
        order.razorpayOrderId = rpOrder.id;
        await order.save();
        return res.status(201).json({ success: true, data: order, razorpayOrderId: rpOrder.id, razorpayKeyId: process.env.RAZORPAY_KEY_ID });
      } catch (e) {
        console.error('Razorpay error:', e.message);
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ $or: [{ _id: req.params.id }, { orderId: req.params.id }] })
      .populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Allow access to own order or admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, date } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data: orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PATCH /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note: note || '', timestamp: new Date() });
    if (status === 'delivered') { order.deliveredAt = new Date(); order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus; }
    if (status === 'cancelled') { order.cancelledAt = new Date(); order.cancellationReason = note; }
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/orders/:id/payment-verify (razorpay)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const crypto = require('crypto');
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    
    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { paymentStatus: 'paid', razorpayPaymentId: razorpay_payment_id, status: 'confirmed' },
      { new: true }
    );
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
