import { api, ApiResponse } from '../lib/api';

type Body = Record<string, unknown>;

export const authService = {
    login: (email: string, password: string) =>
        api<{ success: boolean; message: string; token: string }>('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
    logout: () => api('/auth/logout', { method: 'POST' }),
    forgotPassword: (email: string) => api('/auth/forgot-password', { method: 'POST', body: { email }, auth: false }),
    resendForgotOtp: (email: string) => api('/auth/forgot-password/resend', { method: 'POST', body: { email }, auth: false }),
    resetPassword: (body: { email: string; otpCode: string; newPassword: string; confirmPassword: string }) =>
        api('/auth/reset-password', { method: 'POST', body, auth: false }),
};

export const dashboardService = {
    summary: () => api<ApiResponse<{ totalBabies: number; needsMonitoring: number; totalCheckups: number }>>('/kader/dashboard/summary'),
    activity: () => api<ApiResponse<unknown[]>>('/kader/dashboard/activity'),
};

export const babyService = {
    list: (search?: string) => api<ApiResponse<unknown[]>>('/babies/all', { query: { search } }),
    create: (body: Body) => api('/babies', { method: 'POST', body }),
    update: (id: number, body: Body) => api(`/babies/${id}`, { method: 'PUT', body }),
    remove: (id: number) => api(`/babies/${id}`, { method: 'DELETE' }),
};

export const checkupService = {
    listByBaby: (babyId: number) => api<ApiResponse<unknown[]>>(`/babies/${babyId}/checkups`),
    create: (body: Body) => api('/checkups', { method: 'POST', body }),
    remove: (id: number) => api(`/checkups/${id}`, { method: 'DELETE' }),
};

export const recipeService = {
    listMine: (status?: 'draft' | 'terpublikasi') => api<ApiResponse<unknown[]>>('/kader/recipes', { query: { status } }),
    detail: (id: number) => api<ApiResponse<unknown>>(`/recipes/${id}`),
    create: (body: Body | FormData) => api('/recipes', { method: 'POST', body }),
    update: (id: number, body: Body | FormData) => api(`/recipes/${id}`, { method: 'PUT', body }),
    remove: (id: number) => api(`/recipes/${id}`, { method: 'DELETE' }),
};

export const notificationService = {
    list: (unreadOnly = false) =>
        api<{ success: boolean; data: unknown[]; unreadCount: number }>('/notifications', { query: { filter: unreadOnly ? 'unread' : undefined } }),
    markRead: (id: number) => api(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => api('/notifications/read-all', { method: 'PUT' }),
};

export const profileService = {
    get: () => api<ApiResponse<unknown>>('/kader/profile'),
    update: (body: Body) => api('/kader/profile', { method: 'PUT', body }),
    changePassword: (body: { oldPassword: string; newPassword: string; confirmPassword: string }) =>
        api('/kader/change-password', { method: 'PUT', body }),
};