import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';
import { analyticsApi } from '../../api';
import type { RevenueData, MenuItem } from '../../types';

const COLORS = ['#0D4A4A', '#D4A017', '#1A7A6E', '#F5C842', '#2BA89A', '#B8860B', '#6acfca', '#ffe066'];

const AdminAnalytics: React.FC = () => {
  const [period, setPeriod] = useState('7d');
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [bestsellers, setBestsellers] = useState<MenuItem[]>([]);
  const [categoryData, setCategoryData] = useState<{ _id: string; revenue: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsApi.getRevenue(period),
      analyticsApi.getBestsellers(),
      analyticsApi.getCategoryRevenue(),
    ]).then(([revRes, bestRes, catRes]) => {
      setRevenue(revRes.data.data || []);
      setBestsellers(bestRes.data.data || []);
      setCategoryData(catRes.data.data || []);
      setLoading(false);
    });
  }, [period]);

  const totalRevenue = revenue.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = revenue.reduce((sum, r) => sum + r.orders, 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {[['7d', '7 Days'], ['30d', '30 Days'], ['90d', '90 Days']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setPeriod(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${period === val ? 'bg-teal-700 text-white' : 'bg-white text-gray-600 hover:bg-teal-50 shadow-sm'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="admin-card text-center">
          <p className="text-3xl font-bold text-teal-700">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>
        <div className="admin-card text-center">
          <p className="text-3xl font-bold text-gold-600">{totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="admin-card">
        <h3 className="font-semibold text-gray-800 mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
            <Tooltip formatter={(v: number) => [`₹${v}`, 'Revenue']} labelFormatter={l => `Date: ${l}`} />
            <Line type="monotone" dataKey="revenue" stroke="#0D4A4A" strokeWidth={2.5} dot={{ r: 4, fill: '#D4A017' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bestsellers */}
        <div className="admin-card">
          <h3 className="font-semibold text-gray-800 mb-4">🏆 Top 10 Bestsellers</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bestsellers.slice(0, 8)} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
              <Tooltip formatter={(v: number) => [v, 'Orders']} />
              <Bar dataKey="totalOrders" fill="#0D4A4A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category revenue */}
        <div className="admin-card">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData.slice(0, 8)} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {categoryData.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`₹${v}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-12 text-sm">No sales data yet</p>
          )}
        </div>
      </div>

      {/* Orders chart */}
      <div className="admin-card">
        <h3 className="font-semibold text-gray-800 mb-4">Daily Orders</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip formatter={(v: number) => [v, 'Orders']} />
            <Bar dataKey="orders" fill="#D4A017" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Category Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
                <th className="px-4 py-3 font-medium">Items Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categoryData.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 capitalize font-medium text-gray-700">{c._id.replace(/-/g, ' ')}</td>
                  <td className="px-4 py-3 font-semibold text-teal-700">₹{c.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600">{c.orders}</td>
                </tr>
              ))}
              {categoryData.length === 0 && <tr><td colSpan={3} className="text-center py-8 text-gray-400">No data yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
