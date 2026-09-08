import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

// Certifications
export const certAPI = {
  getAll: (params) => api.get('/certifications', { params }),
  getBySlug: (slug) => api.get(`/certifications/slug/${slug}`),
  getById: (id) => api.get(`/certifications/${id}`),
};

// Tests
export const testAPI = {
  generate: (data) => api.post('/tests/generate', data),
  submitAnswer: (attemptId, data) => api.put(`/tests/attempt/${attemptId}/answer`, data),
  submitTest: (attemptId, data) => api.post(`/tests/attempt/${attemptId}/submit`, data),
  getResults: (attemptId) => api.get(`/tests/attempt/${attemptId}/results`),
  getHistory: (params) => api.get('/tests/history', { params }),
  logSuspicious: (attemptId, event) => api.post(`/tests/attempt/${attemptId}/suspicious`, { event }),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getLeaderboard: () => api.get('/dashboard/leaderboard'),
  search: (q) => api.get('/dashboard/search', { params: { q } }),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  // Questions
  getQuestions: (params) => api.get('/admin/questions', { params }),
  createQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  duplicateQuestion: (id) => api.post(`/admin/questions/${id}/duplicate`),
  bulkImport: (questions) => api.post('/admin/questions/bulk', { questions }),
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserHistory: (id) => api.get(`/admin/users/${id}/history`),
  // Certifications
  createCertification: (data) => api.post('/admin/certifications', data),
  updateCertification: (id, data) => api.put(`/admin/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/admin/certifications/${id}`),
  // Topics
  getTopics: (params) => api.get('/admin/topics', { params }),
  createTopic: (data) => api.post('/admin/topics', data),
  updateTopic: (id, data) => api.put(`/admin/topics/${id}`, data),
  deleteTopic: (id) => api.delete(`/admin/topics/${id}`),
  // Results
  getResults: (params) => api.get('/admin/results', { params }),
  // Upload
  uploadImage: (formData) => api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;
