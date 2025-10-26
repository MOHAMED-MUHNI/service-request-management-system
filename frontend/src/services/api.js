import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Service Requests API
export const serviceRequestAPI = {
  create: (data) => api.post('/service-requests', data),
  getAll: (params) => api.get('/service-requests', { params }),
  getById: (id) => api.get(`/service-requests/${id}`),
  update: (id, data) => api.put(`/service-requests/${id}`, data),
  delete: (id) => api.delete(`/service-requests/${id}`),
  updateStatus: (id, status) => api.patch(`/service-requests/${id}/status`, { status }),
};

// Assignments API
export const assignmentAPI = {
  create: (data) => api.post('/assignments', data),
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Drivers API
export const driverAPI = {
  getAll: () => api.get('/drivers'),
  getAvailable: () => api.get('/drivers/available'),
  getById: (id) => api.get(`/drivers/${id}`),
};

// Vehicles API
export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  getAvailable: () => api.get('/vehicles/available'),
  getById: (id) => api.get(`/vehicles/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRequestsByDay: (days = 7) => api.get('/analytics/requests-by-day', { params: { days } }),
};

export default api;
