import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://lh20kdxm6g.execute-api.us-west-1.amazonaws.com/$default';

const api = axios.create({
  baseURL: `${API_URL}/FollowMyLead-API`,
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
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

// Leads
export const getLeads = async () => {
  const response = await api.get('/leads');
  return response.data;
};

export const createLead = async (leadData: {
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
}) => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (leadId: string, leadData: {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
}) => {
  const response = await api.put(`/leads/${leadId}`, leadData);
  return response.data;
};

export const deleteLead = async (leadId: string) => {
  const response = await api.delete(`/leads/${leadId}`);
  return response.data;
};

export const uploadLeads = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/leads/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
