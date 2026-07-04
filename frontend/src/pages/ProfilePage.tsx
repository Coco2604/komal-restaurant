import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, Edit2, Trash2, Plus } from 'lucide-react';
import { userApi } from '../api';
import type { User as UserType, Address, MenuItem } from '../types';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [addingAddr, setAddingAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', fullAddress: '', landmark: '', pincode: '', city: 'Bhatapara', state: 'Chhattisgarh' });

  useEffect(() => {
    userApi.getProfile().then(r => {
      const data = r.data.data;
      if (data) { setProfile(data); setForm({ name: data.name, email: data.email || '' }); }
      setLoading(false);
    });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await userApi.updateProfile(form);
      if (res.data.data) { setProfile(prev => ({ ...prev!, ...res.data.data! })); setEditing(false); toast.success('Profile updated!'); }
    } catch (e) { toast.error('Update failed'); }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await userApi.addAddress(newAddr);
      setProfile(prev => prev ? { ...prev, addresses: res.data.data || [] } : prev);
      setAddingAddr(false);
      setNewAddr({ label: 'Home', fullAddress: '', landmark: '', pincode: '', city: 'Bhatapara', state: 'Chhattisgarh' });
      toast.success('Address added!');
    } catch (e) { toast.error('Failed to add address'); }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await userApi.deleteAddress(id);
      setProfile(prev => prev ? { ...prev, addresses: res.data.data || [] } : prev);
      toast.success('Address removed');
    } catch (e) { toast.error('Failed to remove address'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="font-serif text-3xl font-bold text-teal-700">My Profile</h1>

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-serif font-bold text-teal-700">{profile?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="font-semibold text-xl text-gray-800">{profile?.name}</h2>
                <p className="text-sm text-gray-500">{profile?.email || profile?.phone}</p>
              </div>
            </div>
            <button onClick={() => setEditing(!editing)} className="btn-ghost btn-sm flex items-center gap-1">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3 mt-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary btn-sm">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-ghost btn-sm">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              {[
                [User, 'Name', profile?.name],
                [Mail, 'Email', profile?.email || '—'],
                [Phone, 'Phone', profile?.phone || '—'],
              ].map(([Icon, label, val]: any) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Icon className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-700">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-600" /> Saved Addresses</h2>
            <button onClick={() => setAddingAddr(!addingAddr)} className="btn-ghost btn-sm flex items-center gap-1 text-teal-700">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {addingAddr && (
            <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Label</label>
                  <select className="input" value={newAddr.label} onChange={e => setNewAddr(p => ({ ...p, label: e.target.value }))}>
                    {['Home', 'Work', 'Other'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Pincode</label>
                  <input className="input" value={newAddr.pincode} onChange={e => setNewAddr(p => ({ ...p, pincode: e.target.value }))} placeholder="493118" />
                </div>
              </div>
              <div>
                <label className="label">Full Address *</label>
                <textarea className="input resize-none" rows={2} value={newAddr.fullAddress} onChange={e => setNewAddr(p => ({ ...p, fullAddress: e.target.value }))} required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary btn-sm">Save Address</button>
                <button type="button" onClick={() => setAddingAddr(false)} className="btn-ghost btn-sm">Cancel</button>
              </div>
            </form>
          )}

          {(!profile?.addresses || profile.addresses.length === 0) && !addingAddr && (
            <p className="text-gray-400 text-sm">No saved addresses</p>
          )}

          <div className="space-y-3">
            {profile?.addresses.map(addr => (
              <div key={addr._id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl group">
                <div>
                  <span className="badge badge-teal mb-1">{addr.label}</span>
                  <p className="text-sm text-gray-700">{addr.fullAddress}</p>
                  <p className="text-xs text-gray-400">{addr.city}, {addr.state} — {addr.pincode}</p>
                </div>
                <button onClick={() => handleDeleteAddress(addr._id!)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Favourites */}
        {profile?.favourites && profile.favourites.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Heart className="w-5 h-5 text-red-500" /> Favourites</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(profile.favourites as MenuItem[]).map(item => (
                <div key={item._id} className="bg-gray-50 rounded-xl p-3 text-sm">
                  <p className="font-medium text-gray-700 truncate">{item.name}</p>
                  <p className="text-teal-700 font-bold">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link to="/orders" className="btn-outline w-full justify-center">View Order History →</Link>
      </div>
    </div>
  );
};

export default ProfilePage;
