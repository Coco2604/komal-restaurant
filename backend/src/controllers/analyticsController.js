const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// @GET /api/analytics/summary
exports.getSummary = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrders, totalOrders, totalRevenue, pendingOrders, totalUsers] = await Promise.all([
      Order.find({ createdAt: { $gte: today, $lt: tomorrow }, status: { $ne: 'cancelled' } }),
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing'] } }),
      User.countDocuments({ role: 'customer' }),
    ]);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      success: true,
      data: {
        today: { orders: todayOrders.length, revenue: todayRevenue },
        total: { orders: totalOrders, revenue: totalRevenue[0]?.total || 0 },
        pending: pendingOrders,
        customers: totalUsers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/analytics/revenue
exports.getRevenue = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const since = new Date(); since.setDate(since.getDate() - days);

    const revenue = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data: revenue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/analytics/bestsellers
exports.getBestsellers = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ totalOrders: -1 }).limit(10).select('name totalOrders price image categorySlug');
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/analytics/categories
exports.getCategoryRevenue = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $lookup: { from: 'menuitems', localField: 'items.menuItem', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $group: { _id: '$item.categorySlug', revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, orders: { $sum: '$items.quantity' } } },
      { $sort: { revenue: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
