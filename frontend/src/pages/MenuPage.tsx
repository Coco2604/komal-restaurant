import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { menuApi } from '../api';
import type { MenuItem, Category } from '../types';
import MenuCard from '../components/menu/MenuCard';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api';

const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [showSpecial, setShowSpecial] = useState(searchParams.get('special') === 'true');
  const [showBestseller, setShowBestseller] = useState(searchParams.get('bestseller') === 'true');
  const [favourites, setFavourites] = useState<string[]>([]);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    menuApi.getCategories().then(r => {
      setCategories(r.data.data || []);
    });
    if (isAuthenticated()) {
      userApi.getProfile().then(r => {
        const favs = (r.data.data?.favourites || []) as any[];
        setFavourites(favs.map((f: any) => f._id || f));
      }).catch(() => {});
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { available: 'true', limit: '200' };
      if (activeCategory !== 'all') params.category = activeCategory;
      if (search) params.search = search;
      if (showSpecial) params.special = 'true';
      if (showBestseller) params.bestseller = 'true';
      const res = await menuApi.getAll(params);
      setItems(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search, showSpecial, showBestseller]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setShowSpecial(false);
    setShowBestseller(false);
    setSearchParams(slug !== 'all' ? { category: slug } : {});
  };

  const handleToggleFavourite = async (itemId: string) => {
    if (!isAuthenticated()) return;
    try {
      await userApi.toggleFavourite(itemId);
      setFavourites(prev =>
        prev.includes(itemId) ? prev.filter(f => f !== itemId) : [...prev, itemId]
      );
    } catch (e) {}
  };

  // Group items by category for display
  const groupedItems: Record<string, MenuItem[]> = {};
  items.forEach(item => {
    const cat = item.categorySlug;
    if (!groupedItems[cat]) groupedItems[cat] = [];
    groupedItems[cat].push(item);
  });

  const allCategories = [{ name: 'All', slug: 'all', icon: '🍽️', _id: 'all', displayOrder: -1, isActive: true }, ...categories];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Our Menu</h1>
          <p className="text-teal-200">200+ pure vegetarian dishes crafted with love</p>

          {/* Search */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="menu-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search paneer, pizza, biryani..."
              className="w-full pl-12 pr-4 py-3 bg-white text-charcoal rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-lg"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category tabs */}
        <div className="overflow-x-auto scrollbar-hide pb-2 mb-4">
          <div className="flex gap-2 min-w-max">
            {allCategories.map(cat => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.slug
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700 shadow-sm'
                }`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setShowSpecial(!showSpecial); setShowBestseller(false); }}
            className={`badge px-3 py-1.5 cursor-pointer transition-all ${showSpecial ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            🔥 Today's Special
          </button>
          <button
            onClick={() => { setShowBestseller(!showBestseller); setShowSpecial(false); }}
            className={`badge px-3 py-1.5 cursor-pointer transition-all ${showBestseller ? 'bg-gold-500 text-teal-900' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            🏆 Bestsellers
          </button>
          <span className="ml-auto text-sm text-gray-500 flex items-center">{items.length} items</span>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-6xl mb-4 block">🍽️</span>
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : activeCategory === 'all' && !search && !showSpecial && !showBestseller ? (
          // Grouped view when showing all
          Object.entries(groupedItems).map(([slug, catItems]) => {
            const cat = categories.find(c => c.slug === slug);
            return (
              <div key={slug} className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{cat?.icon || '🍽️'}</span>
                  <h2 className="text-xl font-serif font-bold text-teal-700">{cat?.name || slug}</h2>
                  <span className="text-sm text-gray-400">({catItems.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catItems.map(item => (
                    <MenuCard
                      key={item._id}
                      item={item}
                      onFavourite={isAuthenticated() ? handleToggleFavourite : undefined}
                      isFavourite={favourites.includes(item._id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <MenuCard
                key={item._id}
                item={item}
                onFavourite={isAuthenticated() ? handleToggleFavourite : undefined}
                isFavourite={favourites.includes(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
