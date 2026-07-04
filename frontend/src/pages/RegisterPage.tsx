import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, User, Mail, Phone } from 'lucide-react';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return toast.error('All fields are required');
    if (form.phone.length < 10) return toast.error('Enter valid phone number');
    
    setLoading(true);
    try {
      const res = await authApi.sendOTP({ ...form, isRegister: true });
      setOtpSent(true);
      toast.success(res.data.message || 'OTP sent to your email');

      if (res.data.devOtp) {
        toast(() => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-teal-900">DEV MODE OTP:</span>
            <span className="font-mono text-xl bg-teal-100 px-2 py-1 rounded text-center">{res.data.devOtp}</span>
            <span className="text-xs text-gray-500">Copy this code to login</span>
          </div>
        ), { duration: 15000, style: { background: 'white' } });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.verifyOTP({ email: form.email, otp });
      if (res.data.success && res.data.token && res.data.user) {
        setAuth(res.data.user, res.data.token);
        toast.success(`Welcome to KOMAL, ${res.data.user.name}! 🎉`);
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center shadow-glow">
              <ChefHat className="w-9 h-9 text-teal-900" />
            </div>
            <p className="font-serif text-2xl font-bold text-gold-400">KOMAL</p>
            <p className="text-teal-300 text-sm">Pure Vegetarian Restaurant</p>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="font-serif text-2xl font-bold text-teal-700 mb-6">Create Account</h2>

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="name-input" name="name" type="text" value={form.name} onChange={handleChange} className="input pl-11" placeholder="Your full name" required />
                </div>
              </div>
              <div>
                <label className="label">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="email-input" name="email" type="email" value={form.email} onChange={handleChange} className="input pl-11" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="label">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="phone-input" name="phone" type="tel" value={form.phone} onChange={handleChange} className="input pl-11" placeholder="9827483385" maxLength={10} required />
                </div>
              </div>
              
              <button id="register-submit" type="submit" disabled={loading} className="btn-secondary w-full justify-center disabled:opacity-60 mt-2">
                {loading ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="label">Enter OTP from Email</label>
                <input
                  id="otp-input"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="input text-center text-xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
              <button id="verify-otp" type="submit" disabled={loading} className="btn-secondary w-full justify-center disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify OTP & Log In'}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-teal-600 hover:text-teal-800 text-center w-full">
                Edit Registration Details
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-700 font-semibold hover:text-teal-800">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
