// resources/js/utils/api.js - Enhanced API utility with better error handling

import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Add CSRF token
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    api.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('token');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response?.status === 422) {
            // Validation errors
            const errors = error.response.data.errors || {};
            const message = error.response.data.message || 'Validation failed';
            console.error('Validation errors:', errors);
        } else if (error.response?.status === 403) {
            // Authorization error
            console.error('Authorization failed:', error.response.data.message);
        }
        return Promise.reject(error);
    }
);

export default api;

// API service functions
export const departmentAPI = {
    getAll: () => api.get('/departments'),
    get: (id) => api.get(`/departments/${id}`),
    create: (data) => api.post('/departments', data),
    update: (id, data) => api.put(`/departments/${id}`, data),
    delete: (id) => api.delete(`/departments/${id}`)
};

export const workTypeAPI = {
    getAll: () => api.get('/work-types'),
    get: (id) => api.get(`/work-types/${id}`),
    create: (data) => api.post('/work-types', data),
    update: (id, data) => api.put(`/work-types/${id}`, data),
    delete: (id) => api.delete(`/work-types/${id}`)
};

export const statusAPI = {
    getAll: () => api.get('/statuses'),
    get: (id) => api.get(`/statuses/${id}`),
    create: (data) => api.post('/statuses', data),
    update: (id, data) => api.put(`/statuses/${id}`, data),
    delete: (id) => api.delete(`/statuses/${id}`)
};

export const userAPI = {
    getAll: (params) => api.get('/users', { params }),
    get: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`)
};

export const workEntryAPI = {
    getAll: (params) => api.get('/work-entries', { params }),
    get: (id) => api.get(`/work-entries/${id}`),
    create: (data) => {
        // Convert FormData if needed
        if (data instanceof FormData) {
            return api.post('/work-entries', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
        }
        return api.post('/work-entries', data);
    },
    update: (id, data) => api.put(`/work-entries/${id}`, data),
    delete: (id) => api.delete(`/work-entries/${id}`),
    summary: (params) => api.get('/work-entries/summary', { params })
};