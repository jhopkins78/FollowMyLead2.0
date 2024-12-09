import axios from 'axios';
import { LeadDetails, LeadNote, LeadStatus } from '@/types/leads';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const INSIGHTS_API_URL = process.env.NEXT_PUBLIC_INSIGHTS_API_URL || 'https://cz0zmv145h.execute-api.us-west-1.amazonaws.com/prod';

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

interface ApiResponse<T> {
  data: {
    data: T;
    message?: string;
  };
}

// Authentication
export const login = async (data: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: { username: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Leads
export const getLeads = async (): Promise<ApiResponse<LeadDetails[]>> => {
  const response = await api.get('/leads');
  return response.data;
};

export const createLead = async (leadData: Partial<LeadDetails>): Promise<ApiResponse<LeadDetails>> => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (
  leadId: string,
  leadData: Partial<LeadDetails>
): Promise<ApiResponse<LeadDetails>> => {
  const response = await api.put(`/leads/${leadId}`, leadData);
  return response.data;
};

export const deleteLead = async (leadId: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/leads/${leadId}`);
  return response.data;
};

export const uploadLeads = async (file: File): Promise<ApiResponse<void>> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/leads/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadFile = async (file: File): Promise<ApiResponse<void>> => {
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
export const getLeadDetails = async (id: string): Promise<ApiResponse<LeadDetails>> => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<ApiResponse<void>> => {
  await api.patch(`/leads/${id}/status`, { status });
  return { data: { data: undefined } };
};

export const addLeadNote = async (id: string, content: string): Promise<ApiResponse<LeadNote>> => {
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
export interface InsightData {
  leadSourceDistribution: { [key: string]: number };
  conversionRates: { [key: string]: number };
  engagementMetrics: {
    averageTimeSpent: number;
    averagePageViews: number;
    totalVisits: { [key: string]: number };
  };
  qualityMetrics: {
    leadQualityDistribution: { [key: string]: number };
    profileScoreDistribution: { [key: string]: number };
  };
}

export const getInsights = async (): Promise<ApiResponse<InsightData>> => {
  const response = await axios.get(`${INSIGHTS_API_URL}/insights`);
  return { data: { data: response.data } };
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
