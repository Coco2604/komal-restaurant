const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'KOMAL Juice Restaurant' },
  tagline: { type: String, default: 'Pure Vegetarian • Fresh & Flavorful' },
  phone: { type: String, default: '9827483385' },
  email: { type: String, default: 'komal@restaurant.com' },
  address: { type: String, default: 'PWRM+5CF, Nayapara Ward, Bhatapara, Chhattisgarh 493118' },
  googleMapsUrl: { type: String, default: 'https://maps.google.com/?q=21.7299,81.9943' },
  deliveryCharges: {
    upTo1km: { type: Number, default: 50 },
    above1km: { type: Number, default: 80 },
  },

  operatingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '23:00' },
    days: { type: String, default: 'Monday - Sunday' },
  },
  isOpen: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 25 },
  minOrderAmount: { type: Number, default: 100 },
  freeDeliveryAbove: { type: Number, default: 0 },
  socialMedia: {
    facebook: String,
    instagram: String,
    whatsapp: { type: String, default: '9827483385' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
