const axios = require('axios');

// API URLs from environment
const AUTH_API_URL = 'https://cz0zmv145h.execute-api.us-west-1.amazonaws.com/dev';  
const LEADS_API_URL = 'https://lh20kdxm6g.execute-api.us-west-1.amazonaws.com/dev'; 

// Common headers for all requests
const commonHeaders = {
  'Content-Type': 'application/json',
  'Origin': 'https://follow-my-lead20.vercel.app',
  'Access-Control-Allow-Origin': '*'
};

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123',
  username: 'testuser'
};

// Test lead data
const testLead = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  status: 'NEW',
  source: 'Website'
};

async function registerUser() {
  console.log('\n1. Testing POST /register...');
  console.log('Request URL:', `${AUTH_API_URL}/register`);
  console.log('Request Headers:', commonHeaders);
  console.log('Request Body:', testUser);
  
  try {
    const response = await axios.post(
      `${AUTH_API_URL}/register`,
      testUser,  
      { headers: commonHeaders }
    );
    console.log('✅ Registration successful');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else {
      console.error('Error:', error.message);
    }
    if (error.response?.status === 409) {
      console.log('User already exists, proceeding with login...');
      return null;
    }
    throw error;
  }
}

async function loginUser() {
  console.log('\n2. Testing POST /login...');
  try {
    const response = await axios.post(
      `${AUTH_API_URL}/login`,
      {
        email: testUser.email,
        password: testUser.password
      },
      { headers: commonHeaders }
    );
    console.log('✅ Login successful');
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createLead(token) {
  console.log('\n3. Testing POST /leads...');  
  try {
    const response = await axios.post(
      `${LEADS_API_URL}/leads`,  
      testLead,
      {
        headers: {
          ...commonHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Lead creation successful');
    return response.data;
  } catch (error) {
    console.error('❌ Lead creation failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getLeads(token) {
  console.log('\n4. Testing GET /leads...');  
  try {
    const response = await axios.get(
      `${LEADS_API_URL}/leads`,  
      {
        headers: {
          ...commonHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Leads retrieval successful');
    return response.data;
  } catch (error) {
    console.error('❌ Leads retrieval failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getLeadDetails(token, leadId) {
  console.log('\n5. Testing GET /leads/{leadId}...');  
  try {
    const response = await axios.get(
      `${LEADS_API_URL}/leads/${leadId}`,  
      {
        headers: {
          ...commonHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Lead details retrieval successful');
    return response.data;
  } catch (error) {
    console.error('❌ Lead details retrieval failed:', error.response?.data || error.message);
    throw error;
  }
}

async function updateLeadStatus(token, leadId) {
  console.log('\n6. Testing PATCH /leads/{leadId}/status...');  
  try {
    const response = await axios.patch(
      `${LEADS_API_URL}/leads/${leadId}/status`,  
      { status: 'IN_PROGRESS' },
      {
        headers: {
          ...commonHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Lead status update successful');
    return response.data;
  } catch (error) {
    console.error('❌ Lead status update failed:', error.response?.data || error.message);
    throw error;
  }
}

async function addLeadNote(token, leadId) {
  console.log('\n7. Testing POST /leads/{leadId}/notes...');  
  try {
    const response = await axios.post(
      `${LEADS_API_URL}/leads/${leadId}/notes`,  
      {
        content: 'Test note from automated testing'
      },
      {
        headers: {
          ...commonHeaders,
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Lead note addition successful');
    return response.data;
  } catch (error) {
    console.error('❌ Lead note addition failed:', error.response?.data || error.message);
    throw error;
  }
}

async function runAllTests() {
  try {
    // Step 1: Register (or skip if exists)
    await registerUser();
    
    // Step 2: Login
    const token = await loginUser();
    
    // Step 3: Create a new lead
    const newLead = await createLead(token);
    const leadId = newLead.id;
    
    // Step 4: Get all leads
    await getLeads(token);
    
    // Step 5: Get specific lead details
    await getLeadDetails(token, leadId);
    
    // Step 6: Update lead status
    await updateLeadStatus(token, leadId);
    
    // Step 7: Add a note to the lead
    await addLeadNote(token, leadId);
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run all tests
runAllTests();
