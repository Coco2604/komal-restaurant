const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { generateOTP } = require('../utils/otp');
const { sendEmail, otpEmail } = require('../utils/email');

// @POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  try {
    const { email, phone, name, isRegister } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    let user = await User.findOne({ email });

    if (isRegister) {
      if (user && user.isVerified) {
        return res.status(400).json({ success: false, message: 'Account already exists. Please log in instead.' });
      }
      if (!phone || !name) {
        return res.status(400).json({ success: false, message: 'Name and Phone required for registration' });
      }
    } else {
      if (!user || !user.isVerified) {
        return res.status(400).json({ success: false, message: 'Account not found. Please sign up first.' });
      }
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (!user) {
      user = await User.create({ email, phone, name, otp, otpExpiry, isVerified: false });
    } else {
      if (isRegister) {
        user.name = name;
        user.phone = phone;
      }
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    }

    await sendEmail({
      to: email,
      ...otpEmail(otp, user)
    });

    const isDev = !process.env.SMTP_USER || process.env.SMTP_USER.includes('xxxx') || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'your_16_digit_app_password_here';
    res.json({ 
      success: true, 
      message: 'If this email is registered (or if you are signing up), an OTP has been sent to your inbox.',
      devOtp: isDev ? otp : undefined
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Successfully logged in!',
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
