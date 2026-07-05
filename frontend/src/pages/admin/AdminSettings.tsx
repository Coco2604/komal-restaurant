import React, { useEffect, useState } from 'react';
import { Save, Globe, Clock, Truck, Percent, ToggleLeft, ToggleRight } from 'lucide-react';
import { settingsApi } from '../../api';
import type { Settings } from '../../types';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.get().then(r => {
      setSettings(r.data.data || {});
      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: { ...(prev as any)[parent], [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      toast.success('Settings saved!');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full" /></div>;

  const s = settings as any;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Restaurant Status Toggle */}
      <div className="admin-card flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Restaurant Status</h3>
          <p className="text-sm text-gray-500">{s.isOpen ? '🟢 Currently accepting orders' : '🔴 Orders paused'}</p>
        </div>
        <button onClick={() => handleChange('isOpen', !s.isOpen)} className={`transition-colors ${s.isOpen ? 'text-green-500' : 'text-gray-300'}`}>
          {s.isOpen ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="admin-card">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Globe className="w-5 h-5 text-teal-600" /> Restaurant Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'restaurantName', label: 'Restaurant Name', placeholder: 'KOMAL Juice Restaurant' },
            { key: 'tagline', label: 'Tagline', placeholder: 'Pure Vegetarian' },
            { key: 'phone', label: 'Phone', placeholder: '9827483385' },
            { key: 'email', label: 'Email', placeholder: 'komal@restaurant.com' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input className="input" value={s[key] || ''} onChange={e => handleChange(key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="label">Address</label>
            <textarea className="input resize-none" rows={2} value={s.address || ''} onChange={e => handleChange('address', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Google Maps URL</label>
            <input className="input" value={s.googleMapsUrl || ''} onChange={e => handleChange('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </div>

      {/* Delivery Charges */}
      <div className="admin-card">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Truck className="w-5 h-5 text-teal-600" /> Delivery Charges</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Within Bhatapara (0–1 km) ₹</label>
            <input type="number" className="input" value={s.deliveryCharges?.upTo1km || 50} onChange={e => handleNestedChange('deliveryCharges', 'upTo1km', parseInt(e.target.value))} />
          </div>
          <div>
            <label className="label">Nearby Areas (above 1 km) ₹</label>
            <input type="number" className="input" value={s.deliveryCharges?.above1km || 80} onChange={e => handleNestedChange('deliveryCharges', 'above1km', parseInt(e.target.value))} />
          </div>
          <div>
            <label className="label">Minimum Order Amount ₹</label>
            <input type="number" className="input" value={s.minOrderAmount || 100} onChange={e => handleChange('minOrderAmount', parseInt(e.target.value))} />
          </div>
          <div>
            <label className="label">Preparation Time (min)</label>
            <input type="number" className="input" value={s.preparationTime || 25} onChange={e => handleChange('preparationTime', parseInt(e.target.value))} />
          </div>
        </div>
      </div>



      {/* Operating Hours */}
      <div className="admin-card">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-teal-600" /> Operating Hours</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Opening Time</label>
            <input type="time" className="input" value={s.operatingHours?.open || '09:00'} onChange={e => handleNestedChange('operatingHours', 'open', e.target.value)} />
          </div>
          <div>
            <label className="label">Closing Time</label>
            <input type="time" className="input" value={s.operatingHours?.close || '23:00'} onChange={e => handleNestedChange('operatingHours', 'close', e.target.value)} />
          </div>
          <div>
            <label className="label">Operating Days</label>
            <input className="input" value={s.operatingHours?.days || 'Monday - Sunday'} onChange={e => handleNestedChange('operatingHours', 'days', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="admin-card">
        <h3 className="font-semibold text-gray-800 mb-4">Social Media</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { key: 'whatsapp', label: 'WhatsApp', placeholder: '9827483385' },
            { key: 'instagram', label: 'Instagram', placeholder: '@komal.restaurant' },
            { key: 'facebook', label: 'Facebook', placeholder: 'komalrestaurant' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input className="input" value={s.socialMedia?.[key] || ''} onChange={e => handleNestedChange('socialMedia', key, e.target.value)} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60 w-full sm:w-auto justify-center">
        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
};

export default AdminSettings;
