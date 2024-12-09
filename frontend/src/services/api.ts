import axios from 'axios';
import { LeadDetails, LeadNote, LeadStatus } from '@/types/leads';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

// Leads
export const getLeads = async (): Promise<LeadDetails[]> => {
  const response = await api.get('/leads');
  return response.data;
};

export const createLead = async (leadData: Partial<LeadDetails>): Promise<LeadDetails> => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (
  leadId: string,
  leadData: Partial<LeadDetails>
): Promise<LeadDetails> => {
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

export const uploadFile = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Lead Details
export const getLeadDetails = async (id: string): Promise<LeadDetails> => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<void> => {
  await api.patch(`/leads/${id}/status`, { status });
};

export const addLeadNote = async (id: string, content: string): Promise<LeadNote> => {
  const response = await api.post(`/leads/${id}/notes`, {
    content,
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Insights
export const getInsights = async () => {
  const response = await axios.get('https://cz0zmv145h.execute-api.us-west-1.amazonaws.com/prod/insights');
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
