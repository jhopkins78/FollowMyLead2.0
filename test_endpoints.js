const axios = require('axios');

// Your actual API URLs
const AUTH_API_URL = 'https://80vsbsh9p5.execute-api.us-west-1.amazonaws.com';     // Auth API endpoint
const LEADS_API_URL = 'https://lh20kdxm6g.execute-api.us-west-1.amazonaws.com';    // Existing Leads API endpoint

// Common headers for all requests
const commonHeaders = {
  'Content-Type': 'application/json',
  'Origin': 'https://follow-my-lead20.vercel.app',
  'Access-Control-Request-Method': 'POST',
  'Access-Control-Request-Headers': 'content-type,authorization'
};

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123',
  username: 'Test User'
};

async function registerUser() {
  console.log('\n1. Testing POST /auth/register...');
  console.log('Request URL:', `${AUTH_API_URL}/auth/register`);
  console.log('Request Body:', testUser);

  try {
    const response = await axios.post(
      `${AUTH_API_URL}/auth/register`,
      testUser,
      { headers: commonHeaders }
    );
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function loginUser() {
  console.log('\n2. Testing POST /auth/login...');
  console.log('Request URL:', `${AUTH_API_URL}/auth/login`);
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  console.log('Request Body:', loginData);

  try {
    const response = await axios.post(
      `${AUTH_API_URL}/auth/login`,
      loginData,
      { headers: commonHeaders }
    );
    console.log('Login successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function getLeads(token) {
  console.log('\n3. Testing GET /leads...');
  console.log('Request URL:', `${LEADS_API_URL}/leads`);
  console.log('Using token:', token.substring(0, 20) + '...');

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
    console.log('Leads retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Getting leads failed:');
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run all tests in sequence
async function runAllTests() {
  try {
    console.log('Starting API endpoint tests...');
    
    // Step 1: Register a new user
    await registerUser();
    
    // Step 2: Login with the new user
    const token = await loginUser();
    
    // Step 3: Get leads using the token
    if (token) {
      await getLeads(token);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nTest sequence failed:', error.message);
  }
}

// Run the tests
runAllTests();
