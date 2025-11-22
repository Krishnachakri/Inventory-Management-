import axios from 'axios';
import API_BASE_URL from '../config/api';

// Remove trailing slash from API_BASE_URL if present
const cleanBaseURL = API_BASE_URL.replace(/\/$/, '');

const authApi = axios.create({
  baseURL: `${cleanBaseURL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
authApi.interceptors.request.use(
  (config) => {
    console.log('Auth API Request:', config.method?.toUpperCase(), config.url);
    console.log('Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
authApi.interceptors.response.use(
  (response) => {
    console.log('Auth API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Auth API Error:', error.response?.status, error.response?.data);
    console.error('Request URL:', error.config?.baseURL + error.config?.url);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => authApi.post('/register', userData),
  login: (credentials) => authApi.post('/login', credentials),
};

// Token management
export const tokenService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authAPI;

