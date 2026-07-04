const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  fullAddress: { type: String, required: true },
  landmark: String,
  pincode: { type: String },
  city: { type: String, default: 'Bhatapara' },
  state: { type: String, default: 'Chhattisgarh' },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, sparse: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, sparse: true, unique: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [addressSchema],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  if (this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
