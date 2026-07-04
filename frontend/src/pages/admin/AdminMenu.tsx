import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, Star, Flame } from 'lucide-react';
import { menuApi } from '../../api';
import type { MenuItem, Category } from '../../types';
import toast from 'react-hot-toast';

const BLANK_ITEM: Partial<MenuItem> & { categorySlug: string } = {
  name: '', categorySlug: '', price: 0, description: '',
  image: '', isAvailable: true, isSpecial: false, isBestseller: false, preparationTime: 20, tags: [],
};

const AdminMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> & { categorySlug: string } | null>(null);
  const [formData, setFormData] = useState({ ...BLANK_ITEM });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [itemsRes, catsRes] = await Promise.all([menuApi.getAll({ limit: '300' }), menuApi.getCategories()]);
    setItems(itemsRes.data.data || []);
    setCategories(catsRes.data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || item.categorySlug === catFilter;
    return matchSearch && matchCat;
  });

  const handleOpenForm = (item?: MenuItem) => {
    if (item) {
      setFormData({ ...item, categorySlug: item.categorySlug, tags: item.tags || [] });
      setEditingItem(item as any);
    } else {
      setFormData({ ...BLANK_ITEM });
      setEditingItem(null);
    }
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem && (editingItem as MenuItem)._id) {
        await menuApi.update((editingItem as MenuItem)._id, formData);
        toast.success('Item updated!');
      } else {
        await menuApi.create(formData);
        toast.success('Item created!');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await menuApi.delete(id);
      toast.success(`${name} deleted`);
      fetchData();
    } catch (e) { toast.error('Delete failed'); }
  };

  const handleToggle = async (id: string, field: string) => {
    try {
      await menuApi.toggle(id, field);
      setItems(prev => prev.map(item =>
        item._id === id ? { ...item, [field]: !(item as any)[field] } : item
      ));
    } catch (e) { toast.error('Toggle failed'); }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 py-2 text-sm" placeholder="Search items..." />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input py-2 text-sm w-auto">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
        <button onClick={() => handleOpenForm()} className="btn-primary btn-sm ml-auto">
          <Plus className="w-4 h-4" /> Add Item
        </button>
        <span className="text-sm text-gray-500">{filtered.length} items</span>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto pt-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-bold text-teal-700">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Item Name *</label>
                <input className="input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Category *</label>
                <select className="input" value={formData.categorySlug} onChange={e => setFormData(p => ({ ...p, categorySlug: e.target.value }))} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Price (₹) *</label>
                <input type="number" className="input" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} required min={0} />
              </div>
              <div className="col-span-2">
                <label className="label">Description</label>
                <textarea className="input resize-none" rows={2} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="label">Image URL</label>
                <input className="input" value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="label">Prep Time (min)</label>
                <input type="number" className="input" value={formData.preparationTime} onChange={e => setFormData(p => ({ ...p, preparationTime: parseInt(e.target.value) || 20 }))} />
              </div>
              <div>
                <label className="label">Tags (comma separated)</label>
                <input className="input" value={(formData.tags || []).join(', ')} onChange={e => setFormData(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="spicy, paneer..." />
              </div>
              <div className="col-span-2 flex gap-4 flex-wrap">
                {[
                  { key: 'isAvailable', label: 'Available' },
                  { key: 'isSpecial', label: "Today's Special" },
                  { key: 'isBestseller', label: 'Bestseller' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!(formData as any)[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.checked }))} className="accent-teal-700 w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-secondary flex-1 justify-center disabled:opacity-60">
                  {saving ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-6">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Available</th>
                  <th className="px-4 py-3 font-medium">Special</th>
                  <th className="px-4 py-3 font-medium">Bestseller</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="badge badge-teal">{item.categorySlug}</span></td>
                    <td className="px-4 py-3 font-semibold text-teal-700">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(item._id, 'isAvailable')} className={`transition-colors ${item.isAvailable ? 'text-green-500 hover:text-green-700' : 'text-gray-300 hover:text-gray-500'}`}>
                        {item.isAvailable ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(item._id, 'isSpecial')} className={`transition-colors ${item.isSpecial ? 'text-orange-500 hover:text-orange-700' : 'text-gray-300 hover:text-gray-500'}`}>
                        <Flame className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(item._id, 'isBestseller')} className={`transition-colors ${item.isBestseller ? 'text-gold-500 hover:text-gold-700' : 'text-gray-300 hover:text-gray-500'}`}>
                        <Star className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleOpenForm(item)} className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item._id, item.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">No items found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
