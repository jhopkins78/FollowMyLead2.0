const API_BASE_URL = import.meta.env.VITE_LEADS_API_URL || 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod';

// Auth APIs
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Lead APIs
export const getLeads = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leads');
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch leads error:', error);
    throw error;
  }
};

export const createLead = async (leadData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(leadData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create lead');
    }
    
    return response.json();
  } catch (error) {
    console.error('Create lead error:', error);
    throw error;
  }
};

export const updateLead = async (leadId, leadData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(leadData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update lead');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update lead error:', error);
    throw error;
  }
};

export const updateLeadStatus = async (leadId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update lead status');
    }
    
    return response.json();
  } catch (error) {
    console.error('Update lead status error:', error);
    throw error;
  }
};

export const uploadLeads = async (file) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/leads/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload leads');
    }
    
    return response.json();
  } catch (error) {
    console.error('Upload leads error:', error);
    throw error;
  }
};

export const deleteLead = async (leadId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete lead');
    }
    
    return response.json();
  } catch (error) {
    console.error('Delete lead error:', error);
    throw error;
  }
};

export const getLeadDetails = async (leadId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch lead details');
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch lead details error:', error);
    throw error;
  }
};
