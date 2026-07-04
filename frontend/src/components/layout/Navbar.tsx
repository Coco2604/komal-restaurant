import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChefHat, Search, LogOut, Settings, Package } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import CartDrawer from '../cart/CartDrawer';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const itemCount = getItemCount();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-teal-700 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <ChefHat className="w-6 h-6 text-gold-400" />
              </div>
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-xl text-teal-700">KOMAL</span>
                <span className="block text-xs text-gray-500 -mt-1">Pure Vegetarian</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}>Home</Link>
              <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'nav-link-active' : ''}`}>Menu</Link>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'nav-link-active' : ''}`}>Contact</Link>
              {isAdmin() && (
                <Link to="/admin" className="nav-link text-gold-600 hover:text-gold-700 hover:bg-gold-50">Admin</Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button onClick={() => navigate('/menu')} className="p-2 rounded-lg text-gray-500 hover:text-teal-700 hover:bg-teal-50 transition-all">
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button id="cart-button" onClick={() => setCartOpen(true)} className="relative p-2 rounded-lg text-gray-500 hover:text-teal-700 hover:bg-teal-50 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-teal-900 text-xs font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {isAuthenticated() ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    id="user-menu-button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-teal-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 font-semibold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-slide-up z-50">
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {isAdmin() && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-600 hover:bg-gold-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <Settings className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" id="login-button" className="btn-secondary btn-sm hidden md:flex">
                  <User className="w-4 h-4" /> Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-teal-50 transition-all" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 animate-slide-up">
            <div className="flex flex-col gap-1">
              <Link to="/" className="nav-link text-base">🏠 Home</Link>
              <Link to="/menu" className="nav-link text-base">🍽️ Menu</Link>
              <Link to="/contact" className="nav-link text-base">📍 Contact</Link>
              {!isAuthenticated() && (
                <Link to="/login" className="btn-secondary mt-2 justify-center">Login / Sign Up</Link>
              )}
              {isAuthenticated() && (
                <>
                  <Link to="/orders" className="nav-link text-base">📦 My Orders</Link>
                  {isAdmin() && <Link to="/admin" className="nav-link text-base text-gold-600">⚙️ Admin</Link>}
                  <button onClick={handleLogout} className="nav-link text-base text-red-600 text-left">🚪 Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
