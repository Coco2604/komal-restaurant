import React, { useState } from 'react';
import { Plus, Minus, Star, Clock, Flame, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import type { MenuItem } from '../../types';
import toast from 'react-hot-toast';

interface MenuCardProps {
  item: MenuItem;
  onFavourite?: (id: string) => void;
  isFavourite?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onFavourite, isFavourite }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find(i => i.menuItem._id === item._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(item);
    toast.success(`${item.name} added to cart! 🛒`, { duration: 1500 });
  };

  const handleIncrease = () => updateQuantity(item._id, quantity + 1);
  const handleDecrease = () => updateQuantity(item._id, quantity - 1);

  const fallbackImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

  return (
    <div className="card card-hover group relative flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex gap-1.5">
        {item.isSpecial && (
          <span className="bg-gold-500 text-teal-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" /> Special
          </span>
        )}
        {item.isBestseller && (
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            🏆 Bestseller
          </span>
        )}
      </div>

      {/* Favourite */}
      {onFavourite && (
        <button
          onClick={() => onFavourite(item._id)}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      )}

      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={imgError ? fallbackImg : (item.image || fallbackImg)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1 rounded-full">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Veg indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
          </div>
          <span className="text-xs text-green-600 font-medium">Pure Veg</span>
        </div>

        <h3 className="font-serif font-semibold text-gray-800 text-base leading-tight mb-1 group-hover:text-teal-700 transition-colors">{item.name}</h3>

        {item.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-gold-400 text-gold-400" />{item.rating}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.preparationTime}–{item.preparationTime + 10} min</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-teal-700">₹{item.price}</span>

          {!item.isAvailable ? (
            <span className="text-sm text-gray-400 font-medium">Unavailable</span>
          ) : quantity === 0 ? (
            <button
              id={`add-${item._id}`}
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-teal-700">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
