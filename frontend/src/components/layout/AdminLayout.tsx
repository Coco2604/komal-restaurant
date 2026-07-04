import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart3, Settings, ChefHat, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? '' : 'hidden lg:flex'} flex-col bg-teal-900 text-white h-full w-64 shrink-0`}>
      {/* Brand */}
      <div className="p-6 border-b border-teal-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-teal-900" />
          </div>
          <div>
            <p className="font-serif font-bold text-gold-400">KOMAL</p>
            <p className="text-xs text-teal-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${active ? 'bg-gold-500 text-teal-900' : 'text-teal-300 hover:bg-teal-800 hover:text-white'}`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-teal-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-teal-900 font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-teal-400">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 h-full z-50">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white">
              <X className="w-5 h-5" />
            </button>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-serif font-bold text-xl text-teal-700">
              {navItems.find(n => n.to === location.pathname || (n.to !== '/admin' && location.pathname.startsWith(n.to)))?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">KOMAL Restaurant Management</p>
          </div>
          <Link to="/" className="text-sm text-teal-600 hover:text-teal-800 font-medium">← View Site</Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
