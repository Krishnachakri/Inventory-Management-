import axios from 'axios';
import API_BASE_URL from '../config/api';
import { tokenService } from './auth';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      tokenService.removeToken();
      tokenService.removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  search: (name) => api.get(`/products/search?name=${encodeURIComponent(name)}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getHistory: (id) => api.get(`/products/${id}/history`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  exportCSV: () => api.get('/products/export', { responseType: 'blob' }),
};

export default api;


