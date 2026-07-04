require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');
const Coupon = require('../models/Coupon');

const CATEGORY_IMAGES = {
  starters: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400',
  snacks: 'https://images.unsplash.com/photo-1640719028782-8230f1bdc6d8?w=400',
  noodles: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400',
  'north-indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  sandwiches: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=400',
  'south-indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
  'chinese-rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  'veg-curries': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  'paneer-curries': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
  pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  soups: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  roti: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400',
  dal: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  paratha: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400',
  raita: 'https://images.unsplash.com/photo-1571197119669-9e7a86ee3ac9?w=400',
  rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
  shakes: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
  mocktails: 'https://images.unsplash.com/photo-1512025316832-8658f04f8b83?w=400',
  papad: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  kabab: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
  specials: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
};

const categories = [
  { name: 'Starters', slug: 'starters', icon: '🔥', displayOrder: 1 },
  { name: 'Snacks', slug: 'snacks', icon: '🍟', displayOrder: 2 },
  { name: 'Noodles', slug: 'noodles', icon: '🍜', displayOrder: 3 },
  { name: 'North Indian', slug: 'north-indian', icon: '🫓', displayOrder: 4 },
  { name: 'Sandwiches', slug: 'sandwiches', icon: '🥪', displayOrder: 5 },
  { name: 'South Indian', slug: 'south-indian', icon: '🫔', displayOrder: 6 },
  { name: 'Fries & Chinese Rice', slug: 'fries', icon: '🍟', displayOrder: 7 },
  { name: 'Veg Curries', slug: 'veg-curries', icon: '🥘', displayOrder: 8 },
  { name: 'Paneer Curries', slug: 'paneer-curries', icon: '🧀', displayOrder: 9 },
  { name: 'Pizza', slug: 'pizza', icon: '🍕', displayOrder: 10 },
  { name: 'Soups', slug: 'soups', icon: '🍲', displayOrder: 11 },
  { name: 'Burgers', slug: 'burgers', icon: '🍔', displayOrder: 12 },
  { name: 'Pasta', slug: 'pasta', icon: '🍝', displayOrder: 13 },
  { name: 'Salad', slug: 'salad', icon: '🥗', displayOrder: 14 },
  { name: 'Roti & Naan', slug: 'roti', icon: '🫓', displayOrder: 15 },
  { name: 'Dal', slug: 'dal', icon: '🍛', displayOrder: 16 },
  { name: 'Paratha', slug: 'paratha', icon: '🥙', displayOrder: 17 },
  { name: 'Raita', slug: 'raita', icon: '🥛', displayOrder: 18 },
  { name: 'Rice', slug: 'rice', icon: '🍚', displayOrder: 19 },
  { name: 'Shakes', slug: 'shakes', icon: '🥤', displayOrder: 20 },
  { name: 'Mocktails', slug: 'mocktails', icon: '🍹', displayOrder: 21 },
  { name: 'Papad', slug: 'papad', icon: '🫓', displayOrder: 22 },
  { name: 'Kabab', slug: 'kabab', icon: '🍢', displayOrder: 23 },
  { name: 'Biryani', slug: 'biryani', icon: '🍛', displayOrder: 24 },
  { name: "Today's Special", slug: 'specials', icon: '⭐', displayOrder: 0 },
];

const menuItems = [
  // STARTERS
  { name: 'Gulati Kabab', slug: 'starters', price: 210, tags: ['kabab', 'starter'] },
  { name: 'Harabhara Kabab', slug: 'starters', price: 190, tags: ['kabab', 'starter', 'green'] },
  { name: 'Soya Chaap Tikka', slug: 'starters', price: 300, tags: ['soya', 'tikka', 'starter'] },
  { name: 'Soya Chaap Chilly', slug: 'starters', price: 200, tags: ['soya', 'chilly', 'starter'] },
  { name: 'Jini Dosa', slug: 'starters', price: 150, tags: ['dosa', 'starter'] },
  { name: 'Cheese Corn Dosa', slug: 'starters', price: 160, tags: ['dosa', 'cheese', 'corn'] },
  { name: 'Paneer Chilly', slug: 'starters', price: 190, tags: ['paneer', 'chilly'] },
  { name: 'Paneer 65', slug: 'starters', price: 230, tags: ['paneer', 'fried'] },
  { name: 'Paneer for Spicy', slug: 'starters', price: 290, tags: ['paneer', 'spicy'] },
  { name: 'Paneer Smoky', slug: 'starters', price: 210, tags: ['paneer', 'smoky', 'grilled'] },
  { name: 'Paneer KurKure', slug: 'starters', price: 210, tags: ['paneer', 'crispy'] },
  { name: 'Paneer Dragon', slug: 'starters', price: 260, tags: ['paneer', 'dragon', 'spicy'] },
  { name: 'Paneer Pakoda', slug: 'starters', price: 140, tags: ['paneer', 'pakoda', 'fried'] },
  { name: 'Paneer Tikka Snacks', slug: 'starters', price: 310, tags: ['paneer', 'tikka'], isBestseller: true },
  { name: 'Paneer Achari Tikka', slug: 'starters', price: 320, tags: ['paneer', 'tikka', 'achari'] },
  { name: 'Paneer Hariyali Tikka', slug: 'starters', price: 320, tags: ['paneer', 'tikka', 'green'] },
  { name: 'Paneer Kaleji', slug: 'starters', price: 240, tags: ['paneer'] },
  { name: 'Garlic Paneer', slug: 'starters', price: 250, tags: ['paneer', 'garlic'] },

  // SNACKS
  { name: 'Chana Chilli', slug: 'snacks', price: 170, tags: ['chana', 'chilly', 'indo-chinese'] },
  { name: 'Gobhi Chilli', slug: 'snacks', price: 180, tags: ['gobhi', 'chilly'] },
  { name: 'Potato Chilli', slug: 'snacks', price: 170, tags: ['potato', 'chilly'] },
  { name: 'Lovely Corn', slug: 'snacks', price: 160, tags: ['corn', 'snack'] },
  { name: 'Corn Chilli', slug: 'snacks', price: 180, tags: ['corn', 'chilly'] },
  { name: 'Corn Chaat', slug: 'snacks', price: 140, tags: ['corn', 'chaat'] },
  { name: 'Babycorn Chilli', slug: 'snacks', price: 190, tags: ['babycorn', 'chilly'] },
  { name: 'Mushroom Chilli', slug: 'snacks', price: 230, tags: ['mushroom', 'chilly'] },
  { name: 'Veg Lollipop', slug: 'snacks', price: 190, tags: ['lollipop', 'snack'] },
  { name: 'Chinese Bhel', slug: 'snacks', price: 220, tags: ['chinese', 'bhel'] },
  { name: 'Crunchy Veg', slug: 'snacks', price: 240, tags: ['crispy', 'veg'] },
  { name: 'Gobhi Manchurian', slug: 'snacks', price: 180, tags: ['gobhi', 'manchurian', 'indo-chinese'] },
  { name: 'Veg Manchurian', slug: 'snacks', price: 140, tags: ['manchurian', 'indo-chinese'] },
  { name: 'Paneer Manchurian', slug: 'snacks', price: 180, tags: ['paneer', 'manchurian'] },
  { name: 'Veg Spring Roll', slug: 'snacks', price: 150, tags: ['spring roll', 'chinese'] },
  { name: 'Sahi Petro', slug: 'snacks', price: 220, tags: ['snack'] },
  { name: 'Veg Pakoda', slug: 'snacks', price: 140, tags: ['pakoda', 'fried'] },
  { name: 'French Fries', slug: 'snacks', price: 90, tags: ['fries', 'snack'] },
  { name: 'Peri Peri French Fries', slug: 'snacks', price: 110, tags: ['fries', 'peri peri', 'spicy'] },
  { name: 'Potato Pakoda', slug: 'snacks', price: 140, tags: ['potato', 'pakoda', 'fried'] },
  { name: 'Onion Rings', slug: 'snacks', price: 100, tags: ['onion rings'] },
  { name: 'Momos Manchurian', slug: 'snacks', price: 150, tags: ['momos', 'manchurian'] },
  { name: 'Momos Tikka', slug: 'snacks', price: 220, tags: ['momos', 'tikka'] },
  { name: 'Momos Chilli', slug: 'snacks', price: 190, tags: ['momos', 'chilly'] },
  { name: 'Momos Fried Rice', slug: 'snacks', price: 210, tags: ['momos', 'rice'] },
  { name: 'Triple Schezwan Rice', slug: 'snacks', price: 240, tags: ['schezwan', 'rice'] },
  { name: 'Garlic Paneer Rice', slug: 'snacks', price: 200, tags: ['garlic', 'paneer', 'rice'] },
  { name: 'Cheese Chilli Noodles', slug: 'snacks', price: 180, tags: ['cheese', 'noodles', 'chilly'] },
  { name: 'Veg Gravy Noodles', slug: 'snacks', price: 210, tags: ['veg', 'noodles', 'gravy'] },
  { name: 'Mixed Hakka Noodles', slug: 'snacks', price: 180, tags: ['hakka', 'noodles'] },
  { name: 'Crispy Chilly Potatos', slug: 'snacks', price: 190, tags: ['potato', 'crispy', 'chilly'] },
  { name: 'Crispy Chilly Babycorn', slug: 'snacks', price: 210, tags: ['babycorn', 'crispy', 'chilly'] },
  { name: 'Crispy Chilly Mushroom', slug: 'snacks', price: 250, tags: ['mushroom', 'crispy', 'chilly'] },

  // NOODLES
  { name: 'Veg Chowmein', slug: 'noodles', price: 110, tags: ['noodles', 'chowmein'] },
  { name: 'Brown Garlic Noodles', slug: 'noodles', price: 130, tags: ['noodles', 'garlic'] },
  { name: 'Schezwan Noodles', slug: 'noodles', price: 140, tags: ['noodles', 'schezwan', 'spicy'] },
  { name: 'Veg Hakka Noodles', slug: 'noodles', price: 160, tags: ['noodles', 'hakka'] },
  { name: 'Singapuri Noodles', slug: 'noodles', price: 180, tags: ['noodles', 'singapore'] },
  { name: 'American Chopsy Noodles', slug: 'noodles', price: 190, tags: ['noodles', 'american'] },
  { name: 'Maxican Noodles', slug: 'noodles', price: 160, tags: ['noodles', 'mexican'] },
  { name: 'Mix Noodles', slug: 'noodles', price: 150, tags: ['noodles', 'mixed'] },
  { name: 'Paneer Noodles', slug: 'noodles', price: 160, tags: ['noodles', 'paneer'] },
  { name: 'Crunchy Noodles', slug: 'noodles', price: 140, tags: ['noodles', 'crispy'] },
  { name: 'Choupsy Noodles', slug: 'noodles', price: 180, tags: ['noodles'] },

  // NORTH INDIAN
  { name: 'Chole Bhature', slug: 'north-indian', price: 130, tags: ['chole', 'bhature', 'punjabi'], isBestseller: true, isSpecial: true },
  { name: 'Poori Sabji', slug: 'north-indian', price: 130, tags: ['poori', 'sabji'] },
  { name: 'Finger Chips', slug: 'north-indian', price: 90, tags: ['chips', 'fries'] },
  { name: 'Paneer Pakoda', slug: 'north-indian', price: 140, tags: ['paneer', 'pakoda'] },
  { name: 'Veg Pakoda', slug: 'north-indian', price: 140, tags: ['veg', 'pakoda'] },
  { name: 'Aalu Pakoda', slug: 'north-indian', price: 120, tags: ['aloo', 'pakoda'] },
  { name: 'Corn Pakoda', slug: 'north-indian', price: 140, tags: ['corn', 'pakoda'] },
  { name: 'Chana Dry', slug: 'north-indian', price: 130, tags: ['chana', 'dry'] },
  { name: 'Chana Masala Snacks', slug: 'north-indian', price: 140, tags: ['chana', 'masala'] },

  // SANDWICHES
  { name: 'Veg Cheese Sandwich', slug: 'sandwiches', price: 120, tags: ['sandwich', 'cheese', 'veg'] },
  { name: 'Masala Sandwich', slug: 'sandwiches', price: 110, tags: ['sandwich', 'masala'] },
  { name: 'Veg Grilled Sandwich', slug: 'sandwiches', price: 120, tags: ['sandwich', 'grilled', 'veg'] },
  { name: 'Veg Sandwich Non-Grill', slug: 'sandwiches', price: 100, tags: ['sandwich', 'veg'] },
  { name: 'Paneer Masala Sandwich', slug: 'sandwiches', price: 130, tags: ['sandwich', 'paneer', 'masala'] },
  { name: 'Veg Special Sandwich', slug: 'sandwiches', price: 170, tags: ['sandwich', 'special', 'veg'] },
  { name: 'Masala Cheese Sandwich', slug: 'sandwiches', price: 130, tags: ['sandwich', 'masala', 'cheese'] },
  { name: 'Masala Triple Cheese Sandwich', slug: 'sandwiches', price: 200, tags: ['sandwich', 'triple cheese'] },
  { name: 'Maxican Sandwich', slug: 'sandwiches', price: 140, tags: ['sandwich', 'mexican'] },
  { name: 'Cheese Chilly Sandwich', slug: 'sandwiches', price: 150, tags: ['sandwich', 'cheese', 'chilly'] },
  { name: 'Cheese Corn Sandwich', slug: 'sandwiches', price: 120, tags: ['sandwich', 'cheese', 'corn'] },
  { name: 'Paneer Butter Sandwich', slug: 'sandwiches', price: 130, tags: ['sandwich', 'paneer', 'butter'] },
  { name: 'Paneer Capsicum', slug: 'sandwiches', price: 120, tags: ['sandwich', 'paneer', 'capsicum'] },
  { name: 'Paneer Capsicum Cheese', slug: 'sandwiches', price: 150, tags: ['sandwich', 'paneer', 'cheese'] },
  { name: 'Mumbaiya Sandwich', slug: 'sandwiches', price: 160, tags: ['sandwich', 'mumbai'] },
  { name: 'Chocolate Sandwich', slug: 'sandwiches', price: 140, tags: ['sandwich', 'chocolate', 'sweet'] },
  { name: 'Cheese Chatni Sandwich', slug: 'sandwiches', price: 150, tags: ['sandwich', 'cheese', 'chutney'] },
  { name: 'Schezwan Sandwich', slug: 'sandwiches', price: 130, tags: ['sandwich', 'schezwan'] },
  { name: 'Wake-Up Sandwich Non-Spicy', slug: 'sandwiches', price: 140, tags: ['sandwich', 'mild'] },
  { name: 'Break-Up Sandwich Spicy', slug: 'sandwiches', price: 150, tags: ['sandwich', 'spicy'] },
  { name: 'Paneer Makhani Sandwich', slug: 'sandwiches', price: 160, tags: ['sandwich', 'paneer', 'makhani'] },
  { name: 'Corn Onion Paneer Sandwich', slug: 'sandwiches', price: 130, tags: ['sandwich', 'corn', 'paneer'] },
  { name: 'Tandoori Paneer Chilly Sandwich', slug: 'sandwiches', price: 160, tags: ['sandwich', 'tandoori', 'paneer'] },
  { name: 'Veg Manchurian Sandwich', slug: 'sandwiches', price: 130, tags: ['sandwich', 'manchurian'] },

  // SOUTH INDIAN
  { name: 'Plain Dosa', slug: 'south-indian', price: 70, tags: ['dosa', 'south indian'] },
  { name: 'Masala Dosa', slug: 'south-indian', price: 80, tags: ['dosa', 'masala', 'south indian'], isBestseller: true },
  { name: 'Cutting Dosa', slug: 'south-indian', price: 90, tags: ['dosa', 'south indian'] },
  { name: 'Masala Butter Dosa', slug: 'south-indian', price: 90, tags: ['dosa', 'butter', 'masala'] },
  { name: 'Special Dosa', slug: 'south-indian', price: 150, tags: ['dosa', 'special'] },
  { name: 'Spring Dosa', slug: 'south-indian', price: 190, tags: ['dosa', 'spring'] },
  { name: 'Paper Dosa', slug: 'south-indian', price: 150, tags: ['dosa', 'paper', 'thin'] },
  { name: 'Indian Dosa', slug: 'south-indian', price: 190, tags: ['dosa', 'indian'] },
  { name: 'Cheese Masala Dosa', slug: 'south-indian', price: 130, tags: ['dosa', 'cheese', 'masala'] },
  { name: 'Cheese Cutting Dosa', slug: 'south-indian', price: 140, tags: ['dosa', 'cheese'] },
  { name: 'Plain Uttapam', slug: 'south-indian', price: 100, tags: ['uttapam', 'south indian'] },
  { name: 'Cheese Uttapam', slug: 'south-indian', price: 140, tags: ['uttapam', 'cheese'] },
  { name: 'Special Uttapam', slug: 'south-indian', price: 160, tags: ['uttapam', 'special'] },
  { name: 'Cheese Corn Dosa', slug: 'south-indian', price: 150, tags: ['dosa', 'cheese', 'corn'] },
  { name: 'Jini Dosa', slug: 'south-indian', price: 150, tags: ['dosa', 'jini'] },

  // FRIES & CHINESE RICE
  { name: 'Salted Fries', slug: 'fries', price: 80, tags: ['fries', 'salted'] },
  { name: 'Peri Peri Fries', slug: 'fries', price: 110, tags: ['fries', 'peri peri', 'spicy'] },
  { name: 'Peri Peri Cheese Loaded', slug: 'fries', price: 160, tags: ['fries', 'cheese', 'peri peri'] },
  { name: 'Crinkle Peri Peri', slug: 'fries', price: 100, tags: ['fries', 'crinkle', 'peri peri'] },
  { name: 'Crinkle Peri Peri Cheese Loaded', slug: 'fries', price: 170, tags: ['fries', 'crinkle', 'cheese'] },
  { name: 'Crinkle Masala Fries', slug: 'fries', price: 120, tags: ['fries', 'crinkle', 'masala'] },
  { name: 'Veg Fried Rice', slug: 'fries', price: 100, tags: ['rice', 'fried', 'chinese'] },
  { name: 'Veg Manchurian Rice/Gravy', slug: 'fries', price: 170, tags: ['rice', 'manchurian', 'gravy'] },
  { name: 'Veg Sehzwan Rice/Gravy', slug: 'fries', price: 120, tags: ['rice', 'schezwan'] },
  { name: 'Maxican Rice', slug: 'fries', price: 160, tags: ['rice', 'mexican'] },
  { name: 'Noodles Rice', slug: 'fries', price: 100, tags: ['noodles', 'rice'] },
  { name: 'Sanghai Rice', slug: 'fries', price: 170, tags: ['rice', 'shanghai', 'chinese'] },
  { name: 'Chinese Platter', slug: 'fries', price: 450, tags: ['platter', 'chinese', 'combo'], isBestseller: true },

  // VEG CURRIES
  { name: 'Veg Maharaja', slug: 'veg-curries', price: 320, tags: ['curry', 'special', 'veg'] },
  { name: 'Tapu Veg', slug: 'veg-curries', price: 280, tags: ['curry', 'veg'] },
  { name: 'Papdi Masala', slug: 'veg-curries', price: 270, tags: ['curry', 'masala'] },
  { name: 'Aloo Dum Zaika', slug: 'veg-curries', price: 180, tags: ['aloo', 'dum', 'curry'] },
  { name: 'Veg Jhal Frizy', slug: 'veg-curries', price: 190, tags: ['veg', 'curry'] },
  { name: 'Stuff Tomato Curry', slug: 'veg-curries', price: 210, tags: ['tomato', 'stuffed', 'curry'] },
  { name: 'Stuffed Aloo Dum', slug: 'veg-curries', price: 220, tags: ['aloo', 'stuffed', 'dum'] },
  { name: 'Chana Masala', slug: 'veg-curries', price: 170, tags: ['chana', 'masala', 'punjabi'] },
  { name: 'Aloo Shimla', slug: 'veg-curries', price: 170, tags: ['aloo', 'shimla', 'capsicum'] },
  { name: 'Aloo Gobhi', slug: 'veg-curries', price: 160, tags: ['aloo', 'gobhi', 'curry'] },
  { name: 'Gobhi Matar', slug: 'veg-curries', price: 180, tags: ['gobhi', 'matar'] },
  { name: 'Aloo Dum', slug: 'veg-curries', price: 170, tags: ['aloo', 'dum'] },
  { name: 'Gobhi Paneer', slug: 'veg-curries', price: 180, tags: ['gobhi', 'paneer'] },
  { name: 'Gobhi Baingan', slug: 'veg-curries', price: 160, tags: ['gobhi', 'baingan'] },
  { name: 'Baingan Masala', slug: 'veg-curries', price: 160, tags: ['baingan', 'masala'] },
  { name: 'Aloo Matar', slug: 'veg-curries', price: 150, tags: ['aloo', 'matar'] },
  { name: 'Baingan Bharta', slug: 'veg-curries', price: 180, tags: ['baingan', 'bharta'] },
  { name: 'Aloo Began', slug: 'veg-curries', price: 150, tags: ['aloo', 'baingan'] },
  { name: 'Aloo Jeera', slug: 'veg-curries', price: 110, tags: ['aloo', 'jeera'] },
  { name: 'Bhindi Masala', slug: 'veg-curries', price: 180, tags: ['bhindi', 'masala'] },
  { name: 'Bhindi Pyaj Fry Dry', slug: 'veg-curries', price: 190, tags: ['bhindi', 'onion', 'dry'] },
  { name: 'Mix Veg', slug: 'veg-curries', price: 240, tags: ['mixed veg', 'curry'] },
  { name: 'Veg Kadhai', slug: 'veg-curries', price: 250, tags: ['veg', 'kadhai'] },
  { name: 'Veg Handi', slug: 'veg-curries', price: 280, tags: ['veg', 'handi'] },
  { name: 'Bhindi Dry', slug: 'veg-curries', price: 230, tags: ['bhindi', 'dry'] },
  { name: 'Bhindi Kurkure', slug: 'veg-curries', price: 240, tags: ['bhindi', 'crispy'] },
  { name: 'Veg Hyderabadi', slug: 'veg-curries', price: 230, tags: ['veg', 'hyderabadi'] },
  { name: 'Veg Kolhapuri', slug: 'veg-curries', price: 280, tags: ['veg', 'kolhapuri', 'spicy'] },
  { name: 'Veg Bhuna', slug: 'veg-curries', price: 250, tags: ['veg', 'bhuna'] },
  { name: 'Sev Bhaji', slug: 'veg-curries', price: 200, tags: ['sev', 'bhaji'] },
  { name: 'Mushroom Masala', slug: 'veg-curries', price: 260, tags: ['mushroom', 'masala'] },
  { name: 'Mushroom Bhuna', slug: 'veg-curries', price: 280, tags: ['mushroom', 'bhuna'] },
  { name: 'Mushroom Kadhai', slug: 'veg-curries', price: 280, tags: ['mushroom', 'kadhai'] },
  { name: 'Matar Methi Malai', slug: 'veg-curries', price: 220, tags: ['matar', 'methi', 'malai'] },
  { name: 'Stuffed Capsicum Curry', slug: 'veg-curries', price: 210, tags: ['capsicum', 'stuffed'] },
  { name: 'Matar Methi Masala', slug: 'veg-curries', price: 210, tags: ['matar', 'methi', 'masala'] },
  { name: 'Palak Matar', slug: 'veg-curries', price: 190, tags: ['palak', 'matar', 'spinach'] },
  { name: 'Kaju Kari', slug: 'veg-curries', price: 290, tags: ['kaju', 'cashew', 'curry'] },
  { name: 'Kaju Butter Masala', slug: 'veg-curries', price: 290, tags: ['kaju', 'butter', 'masala'] },
  { name: 'Kaju Masala', slug: 'veg-curries', price: 290, tags: ['kaju', 'masala'] },
  { name: 'Veg Pakija', slug: 'veg-curries', price: 270, tags: ['veg', 'curry', 'special'] },
  { name: 'Veg Kofta', slug: 'veg-curries', price: 230, tags: ['kofta', 'veg', 'curry'] },

  // PANEER CURRIES
  { name: 'Matar Paneer', slug: 'paneer-curries', price: 190, tags: ['paneer', 'matar', 'curry'], isBestseller: true },
  { name: 'Paneer Bhurji', slug: 'paneer-curries', price: 180, tags: ['paneer', 'bhurji', 'scrambled'] },
  { name: 'Paneer Bhurji Masala', slug: 'paneer-curries', price: 190, tags: ['paneer', 'bhurji', 'masala'] },
  { name: 'Paneer Tikka Masala', slug: 'paneer-curries', price: 190, tags: ['paneer', 'tikka', 'masala'] },
  { name: 'Paneer Hyderabadi', slug: 'paneer-curries', price: 190, tags: ['paneer', 'hyderabadi'] },
  { name: 'Paneer Lachha Masala', slug: 'paneer-curries', price: 190, tags: ['paneer', 'lachha', 'masala'] },
  { name: 'Paneer Finger Masala', slug: 'paneer-curries', price: 200, tags: ['paneer', 'finger'] },
  { name: 'Paneer Dabang', slug: 'paneer-curries', price: 210, tags: ['paneer', 'dabang', 'spicy'] },
  { name: 'Paneer Punjabi Kali', slug: 'paneer-curries', price: 210, tags: ['paneer', 'punjabi'] },
  { name: 'Paneer Masala', slug: 'paneer-curries', price: 170, tags: ['paneer', 'masala'] },
  { name: 'Paneer Chole', slug: 'paneer-curries', price: 190, tags: ['paneer', 'chole'] },
  { name: 'Paneer Butter Masala', slug: 'paneer-curries', price: 200, tags: ['paneer', 'butter', 'masala'], isBestseller: true },
  { name: 'Paneer Kadhai', slug: 'paneer-curries', price: 220, tags: ['paneer', 'kadhai'] },
  { name: 'Paneer Handi', slug: 'paneer-curries', price: 220, tags: ['paneer', 'handi'] },
  { name: 'Palak Paneer', slug: 'paneer-curries', price: 230, tags: ['palak', 'paneer', 'spinach'], isBestseller: true },
  { name: 'Paneer Kolhapuri', slug: 'paneer-curries', price: 230, tags: ['paneer', 'kolhapuri', 'spicy'] },
  { name: 'Shahi Paneer', slug: 'paneer-curries', price: 240, tags: ['paneer', 'shahi', 'royal'] },
  { name: 'Paneer Bhuna', slug: 'paneer-curries', price: 260, tags: ['paneer', 'bhuna'] },
  { name: 'Paneer Pasanda', slug: 'paneer-curries', price: 280, tags: ['paneer', 'pasanda'] },
  { name: 'Paneer Patiyala', slug: 'paneer-curries', price: 240, tags: ['paneer', 'patiyala'] },
  { name: 'Tawa Paneer', slug: 'paneer-curries', price: 280, tags: ['paneer', 'tawa'] },
  { name: 'Paneer Kasturi', slug: 'paneer-curries', price: 230, tags: ['paneer', 'kasturi'] },
  { name: 'Malai Kofta', slug: 'paneer-curries', price: 240, tags: ['malai', 'kofta', 'curry'] },
  { name: 'Paneer Kofta', slug: 'paneer-curries', price: 260, tags: ['paneer', 'kofta'] },
  { name: 'Paneer Bharva Masala', slug: 'paneer-curries', price: 300, tags: ['paneer', 'stuffed', 'masala'] },
  { name: 'Paneer Jwalamukhi Full Spicy', slug: 'paneer-curries', price: 280, tags: ['paneer', 'very spicy'] },
  { name: 'Paneer Lakhnavi', slug: 'paneer-curries', price: 260, tags: ['paneer', 'lucknow'] },
  { name: 'Paneer Lababdar', slug: 'paneer-curries', price: 260, tags: ['paneer', 'lababdar'] },
  { name: 'Paneer Panku', slug: 'paneer-curries', price: 320, tags: ['paneer', 'special'] },
  { name: 'Paneer Amritsary', slug: 'paneer-curries', price: 280, tags: ['paneer', 'amritsar'] },
  { name: 'Paneer Laziz', slug: 'paneer-curries', price: 300, tags: ['paneer', 'laziz'] },
  { name: 'Paneer Navabi', slug: 'paneer-curries', price: 290, tags: ['paneer', 'nawabi'] },
  { name: 'Paneer Lara', slug: 'paneer-curries', price: 280, tags: ['paneer'] },
  { name: 'Paneer Korma', slug: 'paneer-curries', price: 240, tags: ['paneer', 'korma'] },
  { name: 'Paneer Tiranga', slug: 'paneer-curries', price: 280, tags: ['paneer', 'tricolor'] },
  { name: 'Paneer Jalfrezi', slug: 'paneer-curries', price: 280, tags: ['paneer', 'jalfrezi'] },
  { name: 'Saag Paneer', slug: 'paneer-curries', price: 230, tags: ['paneer', 'saag', 'spinach'] },
  { name: 'Paneer Makhani', slug: 'paneer-curries', price: 250, tags: ['paneer', 'makhani', 'butter'] },
  { name: 'Achaari Paneer Masala', slug: 'paneer-curries', price: 210, tags: ['paneer', 'achari', 'pickle'] },

  // PIZZA
  { name: 'Cheese Pizza', slug: 'pizza', price: 210, tags: ['pizza', 'cheese'] },
  { name: 'Veg Cheese Pizza', slug: 'pizza', price: 180, tags: ['pizza', 'veg', 'cheese'] },
  { name: 'Onion Capsicum Pizza', slug: 'pizza', price: 220, tags: ['pizza', 'onion', 'capsicum'] },
  { name: 'Cheese Tomato Pizza', slug: 'pizza', price: 210, tags: ['pizza', 'cheese', 'tomato'] },
  { name: 'Cheese Babycorn Pizza', slug: 'pizza', price: 220, tags: ['pizza', 'cheese', 'babycorn'] },
  { name: 'Cheese Mushroom Pizza', slug: 'pizza', price: 230, tags: ['pizza', 'cheese', 'mushroom'] },
  { name: 'Double Cheese Pizza', slug: 'pizza', price: 240, tags: ['pizza', 'double cheese'] },
  { name: 'Mexican Pizza', slug: 'pizza', price: 230, tags: ['pizza', 'mexican'] },
  { name: 'Mexican Spicy Pizza', slug: 'pizza', price: 240, tags: ['pizza', 'mexican', 'spicy'] },
  { name: 'Komal Special Pizza', slug: 'pizza', price: 290, tags: ['pizza', 'special', 'komal'], isBestseller: true },
  { name: 'Chef Special Pizza', slug: 'pizza', price: 280, tags: ['pizza', 'chef special'] },
  { name: 'Double Dekar Pizza', slug: 'pizza', price: 340, tags: ['pizza', 'loaded'] },
  { name: 'Cheese Corn Pizza', slug: 'pizza', price: 220, tags: ['pizza', 'cheese', 'corn'] },
  { name: 'Pasta Schezwan Cheese Pizza', slug: 'pizza', price: 250, tags: ['pizza', 'pasta', 'schezwan'] },
  { name: 'Extra Cheese Mozzarella Pizza', slug: 'pizza', price: 290, tags: ['pizza', 'mozzarella', 'extra cheese'] },
  { name: 'Tandori Veg Pizza', slug: 'pizza', price: 250, tags: ['pizza', 'tandoori', 'veg'] },
  { name: 'Paneer Makhani Pizza', slug: 'pizza', price: 260, tags: ['pizza', 'paneer', 'makhani'] },
  { name: 'Paneer Baby Corn Pizza', slug: 'pizza', price: 250, tags: ['pizza', 'paneer', 'babycorn'] },
  { name: 'Margherita Pizza', slug: 'pizza', price: 270, tags: ['pizza', 'margherita', 'classic'] },
  { name: 'Paneer Garlic Pizza', slug: 'pizza', price: 240, tags: ['pizza', 'paneer', 'garlic'] },
  { name: 'Peppy Paneer Pizza', slug: 'pizza', price: 260, tags: ['pizza', 'paneer', 'peppy'] },
  { name: 'Deluxe Veggie Pizza', slug: 'pizza', price: 280, tags: ['pizza', 'deluxe', 'veggie'] },

  // SOUPS
  { name: 'Veg Manchow Soup', slug: 'soups', price: 100, tags: ['soup', 'manchow', 'chinese'] },
  { name: 'Hot-N-Sour Soup', slug: 'soups', price: 110, tags: ['soup', 'hot', 'sour'] },
  { name: 'Sweet Corn Soup', slug: 'soups', price: 120, tags: ['soup', 'corn', 'sweet'] },
  { name: 'Mushroom Soup', slug: 'soups', price: 110, tags: ['soup', 'mushroom'] },
  { name: 'Tomato Soup', slug: 'soups', price: 100, tags: ['soup', 'tomato'] },

  // BURGERS
  { name: 'Aloo Tikki Burger', slug: 'burgers', price: 110, tags: ['burger', 'aloo tikki'] },
  { name: 'Veg Burger', slug: 'burgers', price: 130, tags: ['burger', 'veg'] },
  { name: 'Veg Cheese Burger', slug: 'burgers', price: 140, tags: ['burger', 'veg', 'cheese'] },
  { name: 'Veg Corn Burger', slug: 'burgers', price: 140, tags: ['burger', 'corn'] },
  { name: 'Mexican Burger', slug: 'burgers', price: 150, tags: ['burger', 'mexican'] },
  { name: 'Paneer BBQ Burger', slug: 'burgers', price: 180, tags: ['burger', 'paneer', 'bbq'] },
  { name: 'Paneer Burger', slug: 'burgers', price: 160, tags: ['burger', 'paneer'] },
  { name: 'New Komal Juice Special', slug: 'burgers', price: 200, tags: ['burger', 'special', 'komal'], isBestseller: true },

  // PASTA
  { name: 'White Sauce Pasta', slug: 'pasta', price: 150, tags: ['pasta', 'white sauce', 'italian'] },
  { name: 'Red Sauce Pasta', slug: 'pasta', price: 120, tags: ['pasta', 'red sauce', 'tomato'] },
  { name: 'Mexican Pasta', slug: 'pasta', price: 130, tags: ['pasta', 'mexican'] },
  { name: 'Sizzling Pasta', slug: 'pasta', price: 100, tags: ['pasta', 'sizzling'] },
  { name: 'Pink Sauce Pasta', slug: 'pasta', price: 100, tags: ['pasta', 'pink sauce'] },

  // SALAD
  { name: 'Green Salad', slug: 'salad', price: 70, tags: ['salad', 'green', 'fresh'] },
  { name: 'Cucumber Salad', slug: 'salad', price: 50, tags: ['salad', 'cucumber'] },
  { name: 'Onion Salad', slug: 'salad', price: 50, tags: ['salad', 'onion'] },
  { name: 'Kachumbar Salad', slug: 'salad', price: 70, tags: ['salad', 'kachumbar', 'mixed'] },
  { name: 'Tomato Salad', slug: 'salad', price: 50, tags: ['salad', 'tomato'] },

  // ROTI
  { name: 'Plain Roti', slug: 'roti', price: 15, tags: ['roti', 'plain', 'bread'] },
  { name: 'Tanduri Roti', slug: 'roti', price: 15, tags: ['roti', 'tandoor'] },
  { name: 'Butter Roti', slug: 'roti', price: 20, tags: ['roti', 'butter'] },
  { name: 'Butter Naan', slug: 'roti', price: 50, tags: ['naan', 'butter'] },
  { name: 'Plain Naan', slug: 'roti', price: 40, tags: ['naan', 'plain'] },
  { name: 'Garlic Naan', slug: 'roti', price: 80, tags: ['naan', 'garlic'] },
  { name: 'Masala Stuff Naan', slug: 'roti', price: 100, tags: ['naan', 'stuffed', 'masala'] },
  { name: 'Masala Kulcha', slug: 'roti', price: 80, tags: ['kulcha', 'masala'] },
  { name: 'Lachha Paratha', slug: 'roti', price: 60, tags: ['paratha', 'lachha', 'layered'] },
  { name: 'Mix Roti', slug: 'roti', price: 80, tags: ['roti', 'mix'] },
  { name: 'CG Naan', slug: 'roti', price: 100, tags: ['naan', 'cg', 'chhattisgarh', 'special'] },

  // DAL
  { name: 'Plain Dal', slug: 'dal', price: 80, tags: ['dal', 'plain', 'lentil'] },
  { name: 'Dal Fry', slug: 'dal', price: 120, tags: ['dal', 'fry', 'tempered'] },
  { name: 'Dal Tadka', slug: 'dal', price: 140, tags: ['dal', 'tadka'] },
  { name: 'Dal Double Tadka', slug: 'dal', price: 180, tags: ['dal', 'tadka', 'double'] },
  { name: 'Jeera Dal', slug: 'dal', price: 100, tags: ['dal', 'jeera', 'cumin'] },
  { name: 'Dal Makhani', slug: 'dal', price: 220, tags: ['dal', 'makhani', 'butter'], isBestseller: true },
  { name: 'Dal Maharani', slug: 'dal', price: 190, tags: ['dal', 'maharani'] },
  { name: 'Dal Roast', slug: 'dal', price: 180, tags: ['dal', 'roast'] },
  { name: 'Dal Snacks', slug: 'dal', price: 180, tags: ['dal', 'snack'] },
  { name: 'Dal Mastani', slug: 'dal', price: 210, tags: ['dal', 'mastani', 'special'] },
  { name: 'Dal Tadka Butter Fry', slug: 'dal', price: 200, tags: ['dal', 'tadka', 'butter'] },

  // PARATHA
  { name: 'Plain Paratha', slug: 'paratha', price: 50, tags: ['paratha', 'plain'] },
  { name: 'Aloo Paratha', slug: 'paratha', price: 80, tags: ['paratha', 'aloo', 'potato'], isBestseller: true },
  { name: 'Gobhi Paratha', slug: 'paratha', price: 90, tags: ['paratha', 'gobhi', 'cauliflower'] },
  { name: 'Paneer Paratha', slug: 'paratha', price: 110, tags: ['paratha', 'paneer'] },
  { name: 'Onion Paratha', slug: 'paratha', price: 70, tags: ['paratha', 'onion'] },
  { name: 'Mushroom Paratha', slug: 'paratha', price: 120, tags: ['paratha', 'mushroom'] },
  { name: 'Onion Capsicum Paratha', slug: 'paratha', price: 100, tags: ['paratha', 'onion', 'capsicum'] },
  { name: 'Soya Butter Paratha', slug: 'paratha', price: 100, tags: ['paratha', 'soya', 'butter'] },

  // RAITA
  { name: 'Plain Raita', slug: 'raita', price: 50, tags: ['raita', 'plain', 'yogurt'] },
  { name: 'Veg Raita', slug: 'raita', price: 60, tags: ['raita', 'veg'] },
  { name: 'Bundi Raita', slug: 'raita', price: 70, tags: ['raita', 'bundi'] },
  { name: 'Onion Raita', slug: 'raita', price: 60, tags: ['raita', 'onion'] },
  { name: 'Plain Dahi', slug: 'raita', price: 50, tags: ['dahi', 'yogurt', 'plain'] },
  { name: 'Fruit Raita', slug: 'raita', price: 120, tags: ['raita', 'fruit', 'sweet'] },

  // RICE
  { name: 'Plain Rice', slug: 'rice', price: 80, tags: ['rice', 'plain', 'steamed'] },
  { name: 'Jeera Rice', slug: 'rice', price: 120, tags: ['rice', 'jeera', 'cumin'] },
  { name: 'Onion Tomato Jeera Rice', slug: 'rice', price: 140, tags: ['rice', 'onion', 'tomato'] },
  { name: 'Onion Tomato Paneer Rice', slug: 'rice', price: 160, tags: ['rice', 'paneer', 'onion'] },
  { name: 'Onion Jeera Rice', slug: 'rice', price: 140, tags: ['rice', 'onion', 'jeera'] },
  { name: 'Veg Biryani', slug: 'rice', price: 210, tags: ['biryani', 'veg', 'rice'], isBestseller: true },
  { name: 'Veg Pulao', slug: 'rice', price: 200, tags: ['pulao', 'veg'] },
  { name: 'Paneer Pulao', slug: 'rice', price: 210, tags: ['pulao', 'paneer'] },
  { name: 'Paneer Pulao Masala', slug: 'rice', price: 220, tags: ['pulao', 'paneer', 'masala'] },
  { name: 'Masala Rice', slug: 'rice', price: 160, tags: ['rice', 'masala'] },
  { name: 'Dal Khichdi', slug: 'rice', price: 160, tags: ['khichdi', 'dal', 'comfort food'] },

  // SHAKES
  { name: 'Vanilla Shake', slug: 'shakes', price: 140, tags: ['shake', 'vanilla', 'cold'] },
  { name: 'Butterscotch Shake', slug: 'shakes', price: 140, tags: ['shake', 'butterscotch'] },
  { name: 'Strawberry Shake', slug: 'shakes', price: 140, tags: ['shake', 'strawberry'] },
  { name: 'Kit Kat Shake', slug: 'shakes', price: 140, tags: ['shake', 'kit kat', 'chocolate'] },
  { name: 'Oreo Shake', slug: 'shakes', price: 140, tags: ['shake', 'oreo'] },
  { name: 'Chocolate Shake', slug: 'shakes', price: 140, tags: ['shake', 'chocolate'] },
  { name: 'Badam Shake', slug: 'shakes', price: 140, tags: ['shake', 'badam', 'almond'] },
  { name: 'Kaju Shake', slug: 'shakes', price: 140, tags: ['shake', 'kaju', 'cashew'] },
  { name: 'Cold Coffee with Ice-cream', slug: 'shakes', price: 170, tags: ['coffee', 'cold', 'ice cream'] },
  { name: 'Cold Coffee', slug: 'shakes', price: 140, tags: ['coffee', 'cold'] },
  { name: 'Mango Shake', slug: 'shakes', price: 140, tags: ['shake', 'mango'] },
  { name: 'Black Current Shake', slug: 'shakes', price: 140, tags: ['shake', 'blackcurrant'] },
  { name: 'Choco Banana Shake', slug: 'shakes', price: 140, tags: ['shake', 'chocolate', 'banana'] },
  { name: 'Oreo Kit Kat Mix', slug: 'shakes', price: 150, tags: ['shake', 'oreo', 'kit kat', 'mixed'] },
  { name: 'Banana Shake', slug: 'shakes', price: 140, tags: ['shake', 'banana'] },
  { name: 'Brownie Shake', slug: 'shakes', price: 140, tags: ['shake', 'brownie', 'chocolate'] },
  { name: 'Nutella Shake', slug: 'shakes', price: 190, tags: ['shake', 'nutella', 'hazelnut'] },
  { name: 'Pineapple Shake', slug: 'shakes', price: 140, tags: ['shake', 'pineapple'] },
  { name: 'Grapes Shake', slug: 'shakes', price: 140, tags: ['shake', 'grapes'] },
  { name: 'Cranberry Shake', slug: 'shakes', price: 140, tags: ['shake', 'cranberry'] },
  { name: 'Apple Shake', slug: 'shakes', price: 140, tags: ['shake', 'apple'] },

  // MOCKTAILS
  { name: 'Virgin Mojito', slug: 'mocktails', price: 100, tags: ['mojito', 'lime', 'mint', 'refreshing'] },
  { name: 'Blue Lemon', slug: 'mocktails', price: 100, tags: ['mocktail', 'blue', 'lemon'] },
  { name: 'Dark Mojito', slug: 'mocktails', price: 120, tags: ['mojito', 'dark'] },
  { name: 'Blue Berry', slug: 'mocktails', price: 120, tags: ['blueberry', 'mocktail'] },
  { name: 'Kiwi Mojito', slug: 'mocktails', price: 120, tags: ['mojito', 'kiwi'] },
  { name: 'Fresh Lemon Soda Salt/Sweet', slug: 'mocktails', price: 50, tags: ['lemon', 'soda', 'refreshing'] },
  { name: 'Fresh Lemon Water Salt/Sweet', slug: 'mocktails', price: 30, tags: ['lemon', 'water', 'nimbu pani'] },
  { name: 'Masala Cold Drink', slug: 'mocktails', price: 60, tags: ['masala', 'cold drink'] },
  { name: 'Red Bull Blast', slug: 'mocktails', price: 200, tags: ['red bull', 'energy', 'mocktail'] },

  // PAPAD
  { name: 'Dried Papad', slug: 'papad', price: 30, tags: ['papad', 'dried'] },
  { name: 'Fried Papad', slug: 'papad', price: 40, tags: ['papad', 'fried'] },
  { name: 'Masala Papad', slug: 'papad', price: 60, tags: ['papad', 'masala'] },
  { name: 'Dried Masala Papad', slug: 'papad', price: 50, tags: ['papad', 'masala', 'dried'] },

  // KABAB
  { name: 'Veg Shami Kabab', slug: 'kabab', price: 190, tags: ['kabab', 'shami', 'veg'] },
  { name: 'Hara Bhara Kabab', slug: 'kabab', price: 170, tags: ['kabab', 'hara bhara', 'green'] },
  { name: 'Dahi Kabab', slug: 'kabab', price: 210, tags: ['kabab', 'dahi', 'yogurt'] },
  { name: 'Pink Kabab', slug: 'kabab', price: 180, tags: ['kabab', 'pink'] },
  { name: 'Veg Seekh Kabab', slug: 'kabab', price: 210, tags: ['kabab', 'seekh', 'veg'] },
  { name: 'Soya Kabab', slug: 'kabab', price: 190, tags: ['kabab', 'soya'] },

  // BIRYANI
  { name: 'Hyderabad Biryani', slug: 'biryani', price: 230, tags: ['biryani', 'hyderabadi', 'dum'], isBestseller: true },
  { name: 'Soya Biryani', slug: 'biryani', price: 200, tags: ['biryani', 'soya'] },
  { name: 'Veg Soya Chaap Biryani', slug: 'biryani', price: 240, tags: ['biryani', 'soya chaap'] },
  { name: 'Veg Gravy Biryani Lapeta', slug: 'biryani', price: 250, tags: ['biryani', 'gravy', 'veg'] },

  // TODAY'S SPECIALS
  { name: 'Special Pav Bhaji', slug: 'specials', price: 80, tags: ['pav bhaji', 'special', 'mumbai'], isSpecial: true },
  { name: 'Chole Kulche', slug: 'specials', price: 140, tags: ['chole', 'kulche', 'punjabi'], isSpecial: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      MenuItem.deleteMany({}),
      Settings.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('🗑️ Cleared existing data');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed menu items
    const menuDocs = menuItems.map(item => ({
      name: item.name,
      category: catMap[item.slug],
      categorySlug: item.slug,
      price: item.price,
      description: `Delicious ${item.name} made fresh with the finest ingredients.`,
      image: CATEGORY_IMAGES[item.slug] || CATEGORY_IMAGES.specials,
      isAvailable: true,
      isSpecial: item.isSpecial || false,
      isBestseller: item.isBestseller || false,
      isVeg: true,
      tags: item.tags || [],
      preparationTime: 20,
      rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
    }));
    const created = await MenuItem.insertMany(menuDocs);
    console.log(`✅ Created ${created.length} menu items`);

    // Seed admin user
    const admin = await User.create({
      name: 'KOMAL Admin',
      email: process.env.ADMIN_EMAIL || 'admin@komal.com',
      phone: process.env.ADMIN_PHONE || '9876543210',
      passwordHash: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin',
      isVerified: true,
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // Seed settings
    await Settings.create({
      restaurantName: 'KOMAL Juice Restaurant',
      tagline: 'Pure Vegetarian • Fresh & Flavorful',
      phone: '9827483385',
      email: 'komal@restaurant.com',
      address: 'PWRM+5CF, Nayapara Ward, Bhatapara, Chhattisgarh 493118',
      googleMapsUrl: 'https://maps.google.com/?q=21.7299,81.9943',
      deliveryCharges: { upTo1km: 50, above1km: 80 },
      taxRate: 5,
      operatingHours: { open: '09:00', close: '23:00', days: 'Monday - Sunday' },
      isOpen: true,
      preparationTime: 25,
      minOrderAmount: 100,
    });
    console.log('✅ Settings created');

    // Seed sample coupons
    await Coupon.insertMany([
      { code: 'WELCOME50', description: 'Welcome discount - ₹50 off on first order', discountType: 'flat', discountValue: 50, minOrderAmount: 200, usageLimit: 500, expiresAt: new Date('2027-12-31') },
      { code: 'KOMAL10', description: '10% off on orders above ₹300', discountType: 'percentage', discountValue: 10, minOrderAmount: 300, maxDiscount: 100, usageLimit: 1000, expiresAt: new Date('2027-12-31') },
      { code: 'SPECIAL20', description: '₹20 off on any order', discountType: 'flat', discountValue: 20, minOrderAmount: 150, usageLimit: 200, expiresAt: new Date('2027-06-30') },
    ]);
    console.log('✅ Sample coupons created');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Total menu items: ${created.length}`);
    console.log(`👤 Admin: ${admin.email} / Admin@1234`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
