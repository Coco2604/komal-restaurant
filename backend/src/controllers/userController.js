const User = require('../models/User');

// @GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -otp -otpExpiry').populate('favourites', 'name price image categorySlug');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true }).select('-passwordHash -otp');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/users/address
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/users/address/:id
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/users/favourite/:itemId
exports.toggleFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const itemId = req.params.itemId;
    const idx = user.favourites.findIndex(f => f.toString() === itemId);
    if (idx === -1) user.favourites.push(itemId);
    else user.favourites.splice(idx, 1);
    await user.save();
    res.json({ success: true, favourites: user.favourites, added: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-passwordHash -otp').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
