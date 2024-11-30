import unittest
import requests
import json
import os
from datetime import datetime
from requests.exceptions import RequestException

BASE_URL = 'http://localhost:5002'

class TestLeadManagementAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test case - runs once before all tests"""
        cls.base_url = BASE_URL
        timestamp = str(int(datetime.now().timestamp()))
        cls.test_user = {
            'username': f'testuser_{timestamp}',
            'email': f'test_{timestamp}@example.com',
            'password': 'Test#Pass123!'
        }
        cls.auth_token = None
        
        print(f"\nRegistering test user: {cls.test_user['email']}")
        
        # Register and login the test user once for all tests
        register_response = requests.post(f'{cls.base_url}/api/register', json=cls.test_user)
        print(f"Registration response: {register_response.status_code} - {register_response.json()}")
        
        if register_response.status_code not in [201, 409]:
            raise Exception(f"Failed to register test user: {register_response.json()}")
            
        login_data = {
            'email': cls.test_user['email'],
            'password': cls.test_user['password']
        }
        print(f"\nLogging in test user: {login_data['email']}")
        login_response = requests.post(f'{cls.base_url}/api/login', json=login_data)
        print(f"Login response: {login_response.status_code} - {login_response.json()}")
        
        if login_response.status_code != 200:
            raise Exception(f"Failed to login test user: {login_response.json()}")
            
        cls.auth_token = login_response.json()['token']
        print(f"\nAuth token received: {cls.auth_token[:20]}...")
        
        # No need to do anything here since we handle auth in setUpClass

    def setUp(self):
        """Set up test case - runs before each test"""
        # No need to do anything here since we handle auth in setUpClass

    def test_1_server_health(self):
        """Test if server is running and healthy"""
        try:
            response = requests.get(f'{self.base_url}/api/health')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['status'], 'healthy')
        except RequestException as e:
            self.fail(f"Server health check failed: {str(e)}")

    def test_2_registration_validation(self):
        """Test user registration validation"""
        # Test missing fields
        response = requests.post(f'{self.base_url}/api/register', json={})
        self.assertEqual(response.status_code, 422)
        
        # Test invalid email
        invalid_user = self.test_user.copy()
        invalid_user['email'] = 'invalid_email'
        response = requests.post(f'{self.base_url}/api/register', json=invalid_user)
        self.assertEqual(response.status_code, 422)
        
        # Test weak password
        invalid_user = self.test_user.copy()
        invalid_user['password'] = 'weak'
        response = requests.post(f'{self.base_url}/api/register', json=invalid_user)
        self.assertEqual(response.status_code, 422)

    def test_3_registration_success(self):
        """Test successful user registration"""
        # Create a new user for this test
        timestamp = str(int(datetime.now().timestamp()))
        new_user = {
            'username': f'testuser2_{timestamp}',
            'email': f'test2_{timestamp}@example.com',
            'password': 'Test#Pass123!'
        }
        response = requests.post(f'{self.base_url}/api/register', json=new_user)
        if response.status_code != 201:
            print(f"Registration failed with status {response.status_code}")
            print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn('message', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['email'], new_user['email'])

    def test_4_login_validation(self):
        """Test login validation"""
        # Test missing fields
        response = requests.post(f'{self.base_url}/api/login', json={})
        self.assertEqual(response.status_code, 422)
        
        # Test invalid credentials
        response = requests.post(f'{self.base_url}/api/login', json={
            'email': 'nonexistent@example.com',
            'password': 'WrongPass123!'
        })
        self.assertEqual(response.status_code, 401)

    def test_5_login_success(self):
        """Test successful login"""
        login_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
        }
        print(f"Attempting login with: {json.dumps({k: v if k != 'password' else '***' for k, v in login_data.items()})}")
        
        response = requests.post(f'{self.base_url}/api/login', json=login_data)
        if response.status_code != 200:
            print(f"Login failed with status {response.status_code}")
            print(f"Response: {response.json()}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('token', data)
        self.assertIn('user', data)
        return data['token']

    def test_6_protected_routes_unauthorized(self):
        """Test protected routes without authentication"""
        endpoints = ['/api/leads', '/api/upload-csv', '/api/mock-data']
        for endpoint in endpoints:
            response = requests.get(f'{self.base_url}{endpoint}')
            if response.status_code != 401:
                print(f"Protected route {endpoint} returned unexpected status {response.status_code}")
                print(f"Response: {response.json()}")
            self.assertEqual(response.status_code, 401)
            data = response.json()
            self.assertIn('error', data)

    def test_7_lead_creation(self):
        """Test lead creation"""
        headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        # Test validation
        response = requests.post(f'{self.base_url}/api/leads', headers=headers, json={})
        if response.status_code != 422:
            print(f"Lead creation validation failed with status {response.status_code}")
            print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 422)
        
        # Test successful creation
        lead_data = {
            'name': 'Test Lead',
            'email': 'testlead@example.com',
            'company': 'Test Company',
            'phone': '1234567890',
            'status': 'new'
        }
        response = requests.post(f'{self.base_url}/api/leads', headers=headers, json=lead_data)
        if response.status_code != 201:
            print(f"Lead creation failed with status {response.status_code}")
            print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn('lead', data)
        self.assertEqual(data['lead']['email'], lead_data['email'])

    def test_8_lead_retrieval(self):
        """Test lead retrieval"""
        headers = {'Authorization': f'Bearer {self.auth_token}'}
        print(f"\nTesting lead retrieval with token: {self.auth_token[:20]}...")
        print(f"Headers: {headers}")
        
        response = requests.get(f'{self.base_url}/api/leads', headers=headers)
        print(f"Response: {response.status_code} - {response.json()}")
        
        if response.status_code != 200:
            print(f"Lead retrieval failed with status {response.status_code}")
            print(f"Response: {response.json()}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_9_csv_upload(self):
        """Test CSV upload functionality"""
        headers = {'Authorization': f'Bearer {self.auth_token}'}
        
        # Create a test CSV file
        csv_content = "name,email,company\nTest Lead,testlead@example.com,Test Company"
        with open('test_leads.csv', 'w') as f:
            f.write(csv_content)
        
        try:
            with open('test_leads.csv', 'rb') as f:
                files = {'file': ('test_leads.csv', f, 'text/csv')}
                response = requests.post(f'{self.base_url}/api/upload-csv', headers=headers, files=files)
                if response.status_code != 201:
                    print(f"CSV upload failed with status {response.status_code}")
                    print(f"Response: {response.json()}")
                self.assertEqual(response.status_code, 201)
                data = response.json()
                self.assertIn('message', data)
                self.assertIn('leads_created', data)
        finally:
            # Clean up test file
            if os.path.exists('test_leads.csv'):
                os.remove('test_leads.csv')

def run_tests():
    """Run the test suite"""
    unittest.main(argv=[''], verbosity=2, exit=False)

if __name__ == '__main__':
    run_tests()
