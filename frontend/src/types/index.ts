export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  favourites: MenuItem[];
  isVerified: boolean;
  createdAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  fullAddress: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  category: Category | string;
  categorySlug: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isSpecial: boolean;
  isBestseller: boolean;
  isVeg: boolean;
  tags: string[];
  preparationTime: number;
  rating: number;
  totalOrders: number;
  createdAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderId: string;
  user: User | string;
  items: OrderItem[];
  deliveryAddress: Address;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: OrderStatus;
  statusHistory: { status: string; timestamp: string; note?: string }[];
  estimatedDeliveryTime: number;
  specialInstructions?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface Settings {
  _id: string;
  restaurantName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  deliveryCharges: { upTo1km: number; above1km: number };
  taxRate: number;
  operatingHours: { open: string; close: string; days: string };
  isOpen: boolean;
  preparationTime: number;
  minOrderAmount: number;
  freeDeliveryAbove: number;
  socialMedia: { facebook?: string; instagram?: string; whatsapp?: string };
}

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  pages?: number;
  token?: string;
  user?: User;
}

export interface AnalyticsSummary {
  today: { orders: number; revenue: number };
  total: { orders: number; revenue: number };
  pending: number;
  customers: number;
}

export interface RevenueData {
  _id: string;
  revenue: number;
  orders: number;
}
