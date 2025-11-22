import axios from 'axios';

// API base URL - change this to your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// User API
export const userAPI = {
  getMe: () => api.get('/user/me'),
  updateProfile: (data) => api.put('/user/update', data),
  updateProgress: (dayCompleted) => api.put('/user/progress', { dayCompleted }),
};

// AI API
export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  generateBio: (data) => api.post('/ai/generate-bio', data),
  analyzeImage: (imageBase64) => api.post('/ai/analyze-image', { imageBase64 }),
  chatCoach: (data) => api.post('/ai/chat-coach', data),
  chatCustomer: (data) => api.post('/ai/chat-customer', data),
  generateScenario: () => api.post('/ai/generate-scenario'),
  generateHashtags: (data) => api.post('/ai/generate-hashtags', data),
  evaluateStory: (imageBase64) => api.post('/ai/evaluate-story', { imageBase64 }),
};

export default api;
