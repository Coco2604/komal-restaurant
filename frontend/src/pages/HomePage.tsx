import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin, Phone, Truck, Leaf, Flame } from 'lucide-react';
import { menuApi } from '../api';
import type { MenuItem, Category } from '../types';
import MenuCard from '../components/menu/MenuCard';

const HERO_BG = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&q=90';

const HomePage: React.FC = () => {
  const [specials, setSpecials] = useState<MenuItem[]>([]);
  const [bestsellers, setBestsellers] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [specialsRes, bestsellersRes, catsRes] = await Promise.all([
          menuApi.getAll({ special: 'true', available: 'true', limit: '8' }),
          menuApi.getAll({ bestseller: 'true', available: 'true', limit: '8' }),
          menuApi.getCategories(),
        ]);
        setSpecials(specialsRes.data.data || []);
        setBestsellers(bestsellersRes.data.data || []);
        setCategories((catsRes.data.data || []).slice(0, 12));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const features = [
    { icon: Leaf, title: '100% Vegetarian', desc: 'All our dishes are purely vegetarian, fresh and wholesome.' },
    { icon: Clock, title: '25 Min Delivery', desc: 'Fast delivery right to your doorstep within Bhatapara.' },
    { icon: Star, title: 'Premium Quality', desc: 'Finest ingredients, authentic recipes, unforgettable taste.' },
    { icon: Truck, title: 'Easy Ordering', desc: 'Order online in seconds. Track your order in real time.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-900/70 to-teal-900/30" />
        </div>

        {/* Hero pattern overlay */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 text-gold-300 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Flame className="w-4 h-4 text-gold-400" />
              Pure Vegetarian • Bhatapara, CG
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="text-gold-400">KOMAL</span>
              <br />
              <span className="text-3xl md:text-4xl font-normal text-teal-200">Juice Restaurant</span>
            </h1>

            <p className="text-teal-100 text-lg md:text-xl mb-8 leading-relaxed">
              Savor the finest vegetarian cuisine — from sizzling North Indian curries and crispy starters to wood-fired pizzas and refreshing shakes. Order now and taste the difference.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/menu" id="hero-order-btn" className="btn-primary text-base px-8 py-4">
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/menu?special=true" className="border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-sm">
                <Star className="w-5 h-5 text-gold-400" /> Today's Specials
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[['200+', 'Menu Items'], ['4.8★', 'Rating'], ['25 min', 'Delivery']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-gold-400">{val}</p>
                  <p className="text-teal-300 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-4 hover:bg-teal-50 rounded-2xl transition-colors group">
                <div className="w-14 h-14 bg-teal-100 group-hover:bg-teal-200 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-7 h-7 text-teal-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">From snacks to main course — we've got it all</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => navigate(`/menu?category=${cat.slug}`)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:bg-teal-50 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      {(specials.length > 0 || loading) && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Limited Time</span>
                </div>
                <h2 className="section-title">Today's Specials</h2>
              </div>
              <Link to="/menu?special=true" className="btn-outline btn-sm">View All →</Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {specials.slice(0, 8).map(item => <MenuCard key={item._id} item={item} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="py-14 bg-gradient-to-b from-cream to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-gold-500" />
                  <span className="text-sm font-semibold text-gold-600 uppercase tracking-wide">Most Loved</span>
                </div>
                <h2 className="section-title">Bestsellers</h2>
              </div>
              <Link to="/menu?bestseller=true" className="btn-outline btn-sm">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestsellers.slice(0, 8).map(item => <MenuCard key={item._id} item={item} />)}
            </div>
          </div>
        </section>
      )}

      {/* Location CTA */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Visit Us or Order Online</h2>
              <p className="text-teal-200 mb-6 text-lg">Experience the taste of authentic vegetarian cuisine. Dine in or get it delivered to your door.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-teal-100">
                  <MapPin className="w-5 h-5 text-gold-400 mt-0.5 shrink-0" />
                  <span>PWRM+5CF, Nayapara Ward, Bhatapara, Chhattisgarh 493118</span>
                </div>
                <div className="flex items-center gap-3 text-teal-100">
                  <Phone className="w-5 h-5 text-gold-400" />
                  <a href="tel:9827483385" className="hover:text-white">+91 9827483385</a>
                </div>
                <div className="flex items-center gap-3 text-teal-100">
                  <Clock className="w-5 h-5 text-gold-400" />
                  <span>Open daily: 9:00 AM – 11:00 PM</span>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Link to="/menu" className="btn-primary">Order Online</Link>
                <Link to="/contact" className="border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-all">Get Directions</Link>
              </div>
            </div>
            {/* Map embed placeholder */}
            <div className="rounded-2xl overflow-hidden shadow-2xl h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.0!2d81.99!3d21.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDQzJzQ3LjYiTiA4McKwNTknMjMuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="KOMAL Restaurant Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
