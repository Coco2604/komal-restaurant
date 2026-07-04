const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categorySlug: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  isSpecial: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isVeg: { type: Boolean, default: true },
  tags: [String],
  preparationTime: { type: Number, default: 20 },
  rating: { type: Number, default: 4.2, min: 0, max: 5 },
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true });

menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
