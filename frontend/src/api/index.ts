import api from './client';
import type { ApiResponse, MenuItem, Category } from '../types';

export const menuApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<ApiResponse<MenuItem[]>>('/menu', { params }),

  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/menu/categories'),

  getById: (id: string) =>
    api.get<ApiResponse<MenuItem>>(`/menu/${id}`),

  create: (data: Partial<MenuItem>) =>
    api.post<ApiResponse<MenuItem>>('/menu', data),

  update: (id: string, data: Partial<MenuItem>) =>
    api.put<ApiResponse<MenuItem>>(`/menu/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/menu/${id}`),

  toggle: (id: string, field: string) =>
    api.patch<ApiResponse<MenuItem>>(`/menu/${id}/toggle`, { field }),

  createCategory: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/menu/categories', data),
};

export const authApi = {
  sendOTP: (data: { email: string; phone?: string; name?: string; isRegister?: boolean }) =>
    api.post<ApiResponse<any>>('/auth/send-otp', data),

  verifyOTP: (data: { email: string; otp: string }) =>
    api.post<ApiResponse<any>>('/auth/verify-otp', data),

  getMe: () =>
    api.get<ApiResponse<any>>('/auth/me'),
};

export const orderApi = {
  place: (data: object) =>
    api.post<ApiResponse<import('../types').Order>>('/orders', data),

  getMyOrders: () =>
    api.get<ApiResponse<import('../types').Order[]>>('/orders/my'),

  getById: (id: string) =>
    api.get<ApiResponse<import('../types').Order>>(`/orders/${id}`),

  getAll: (params?: Record<string, string>) =>
    api.get<ApiResponse<import('../types').Order[]>>('/orders', { params }),

  updateStatus: (id: string, status: string, note?: string) =>
    api.patch<ApiResponse<import('../types').Order>>(`/orders/${id}/status`, { status, note }),

  verifyPayment: (id: string, data: object) =>
    api.post(`/orders/${id}/verify-payment`, data),
};

export const userApi = {
  getProfile: () =>
    api.get<ApiResponse<import('../types').User>>('/users/profile'),

  updateProfile: (data: { name?: string; email?: string }) =>
    api.put<ApiResponse<import('../types').User>>('/users/profile', data),

  addAddress: (data: object) =>
    api.post<ApiResponse<import('../types').Address[]>>('/users/address', data),

  deleteAddress: (id: string) =>
    api.delete<ApiResponse<import('../types').Address[]>>(`/users/address/${id}`),

  toggleFavourite: (itemId: string) =>
    api.post<ApiResponse<string[]>>(`/users/favourite/${itemId}`),

  getAllUsers: () =>
    api.get<ApiResponse<import('../types').User[]>>('/users'),
};

export const settingsApi = {
  get: () =>
    api.get<ApiResponse<import('../types').Settings>>('/settings'),

  update: (data: object) =>
    api.put<ApiResponse<import('../types').Settings>>('/settings', data),
};

export const couponApi = {
  validate: (code: string, orderAmount: number) =>
    api.post<ApiResponse<{ code: string; discount: number; description: string }>>('/coupons/validate', { code, orderAmount }),

  getAll: () =>
    api.get<ApiResponse<import('../types').Coupon[]>>('/coupons'),

  create: (data: object) =>
    api.post<ApiResponse<import('../types').Coupon>>('/coupons', data),

  update: (id: string, data: object) =>
    api.put<ApiResponse<import('../types').Coupon>>(`/coupons/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/coupons/${id}`),
};

export const analyticsApi = {
  getSummary: () =>
    api.get<ApiResponse<import('../types').AnalyticsSummary>>('/analytics/summary'),

  getRevenue: (period: string) =>
    api.get<ApiResponse<import('../types').RevenueData[]>>('/analytics/revenue', { params: { period } }),

  getBestsellers: () =>
    api.get<ApiResponse<import('../types').MenuItem[]>>('/analytics/bestsellers'),

  getCategoryRevenue: () =>
    api.get<ApiResponse<{ _id: string; revenue: number; orders: number }[]>>('/analytics/categories'),
};
