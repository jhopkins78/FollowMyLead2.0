import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/login', { email, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/api/register', { username, email, password });
  return response.data;
};

// Leads
export const getLeads = async () => {
  const response = await api.get('/api/leads');
  return response.data;
};

export const uploadLeads = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateLeadStatus = async (leadId: number, status: string) => {
  const response = await api.patch(`/api/leads/${leadId}`, { status });
  return response.data;
};

// Lead Details API Endpoints
export const getLeadDetails = async (leadId: string) => {
  const response = await api.get(`/api/leads/${leadId}`);
  return response.data;
};

export const updateLeadStatusDetail = async (leadId: string, status: string) => {
  const response = await api.patch(`/api/leads/${leadId}/status`, { status });
  return response.data;
};

export const addLeadNote = async (leadId: string, content: string) => {
  const response = await api.post(`/api/leads/${leadId}/notes`, { content });
  return response.data;
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
