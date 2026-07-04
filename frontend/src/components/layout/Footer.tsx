import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ChefHat, Heart } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-teal-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-teal-900" />
            </div>
            <div>
              <p className="font-serif font-bold text-xl text-gold-400">KOMAL</p>
              <p className="text-xs text-teal-300">Pure Vegetarian</p>
            </div>
          </div>
          <p className="text-teal-300 text-sm leading-relaxed">
            Serving fresh, flavorful vegetarian cuisine in Bhatapara since years. Every dish made with love and the finest ingredients.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-teal-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">
              IG
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 bg-teal-800 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">
              FB
            </a>
            <a href="https://wa.me/919827483385" target="_blank" rel="noreferrer" className="w-9 h-9 bg-teal-800 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors text-sm font-bold">
              W
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gold-400 mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/menu', 'Full Menu'], ['/menu?special=true', "Today's Specials"], ['/cart', 'Cart'], ['/contact', 'Contact Us']].map(([to, label]) => (
              <Link key={to} to={to} className="text-teal-300 hover:text-gold-400 text-sm transition-colors">{label}</Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gold-400 mb-4">Our Menu</h4>
          <div className="flex flex-col gap-2">
            {['Starters', 'Paneer Curries', 'Pizza', 'Biryani', 'Burgers', 'Shakes', 'South Indian', 'Noodles'].map(cat => (
              <Link key={cat} to={`/menu?category=${cat.toLowerCase().replace(/ /g, '-')}`} className="text-teal-300 hover:text-gold-400 text-sm transition-colors">{cat}</Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-gold-400 mb-4">Contact</h4>
          <div className="flex flex-col gap-3">
            <a href="tel:9827483385" className="flex items-start gap-2 text-teal-300 hover:text-gold-400 text-sm transition-colors">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" />
              <span>+91 9827483385</span>
            </a>
            <div className="flex items-start gap-2 text-teal-300 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>PWRM+5CF, Nayapara Ward, Bhatapara, Chhattisgarh 493118</span>
            </div>
            <div className="flex items-start gap-2 text-teal-300 text-sm">
              <Clock className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Mon–Sun: 9:00 AM – 11:00 PM</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-teal-800 rounded-xl">
            <p className="text-xs text-teal-400 mb-1">Delivery Charges</p>
            <p className="text-sm text-white">Within Bhatapara: <span className="text-gold-400 font-semibold">₹50</span></p>
            <p className="text-sm text-white">Nearby areas: <span className="text-gold-400 font-semibold">₹80</span></p>
          </div>
        </div>
      </div>

      <hr className="border-teal-800 my-8" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-teal-400">
        <p>© {new Date().getFullYear()} KOMAL Juice Restaurant. All rights reserved.</p>
        <p className="flex items-center gap-1">Made with <Heart className="w-4 h-4 text-red-400" /> in Bhatapara, CG 🌿</p>
      </div>
    </div>
  </footer>
);

export default Footer;
