import unittest
import json
import os
from app import create_app
from database import db
from models import User, Lead
import io

class TestProtectedRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
            
            # Create test user
            user = User(username='testuser', email='test@example.com')
            user.set_password('testpass123')
            db.session.add(user)
            db.session.commit()
            
            # Login to get token
            response = self.client.post('/api/login',
                json={'email': 'test@example.com', 'password': 'testpass123'})
            self.token = json.loads(response.data)['token']
            self.user_id = user.id

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_get_leads_unauthorized(self):
        """Test /api/leads GET without token"""
        response = self.client.get('/api/leads')
        self.assertEqual(response.status_code, 401)
        
    def test_get_leads_authorized(self):
        """Test /api/leads GET with valid token"""
        response = self.client.get('/api/leads',
            headers={'Authorization': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(json.loads(response.data), list)

    def test_create_lead(self):
        """Test /api/leads POST with valid token"""
        lead_data = {
            'name': 'John Smith',
            'email': 'john@example.com',
            'company': 'Tech Corp',
            'status': 'new'
        }
        response = self.client.post('/api/leads',
            headers={'Authorization': f'Bearer {self.token}'},
            json=lead_data)
        self.assertEqual(response.status_code, 201)
        
        data = json.loads(response.data)
        self.assertIn('lead', data)
        self.assertEqual(data['lead']['name'], lead_data['name'])
        self.assertEqual(data['lead']['email'], lead_data['email'])

    def test_create_lead_invalid_data(self):
        """Test /api/leads POST with invalid data"""
        lead_data = {
            'email': 'invalid-email',
            'company': 'Tech Corp'
        }
        response = self.client.post('/api/leads',
            headers={'Authorization': f'Bearer {self.token}'},
            json=lead_data)
        self.assertEqual(response.status_code, 422)

    def test_upload_csv(self):
        """Test /api/upload-csv with valid CSV"""
        csv_content = b'name,email,company\nJohn Doe,john@example.com,Tech Corp'
        data = {'file': (io.BytesIO(csv_content), 'leads.csv')}
        response = self.client.post('/api/upload-csv',
            headers={'Authorization': f'Bearer {self.token}'},
            data=data,
            content_type='multipart/form-data')
        self.assertEqual(response.status_code, 201)
        
        data = json.loads(response.data)
        self.assertIn('leads_created', data)
        self.assertEqual(data['leads_created'], 1)

    def test_upload_csv_invalid_file(self):
        """Test /api/upload-csv with invalid file"""
        data = {'file': (io.BytesIO(b'invalid,csv'), 'leads.txt')}
        response = self.client.post('/api/upload-csv',
            headers={'Authorization': f'Bearer {self.token}'},
            data=data,
            content_type='multipart/form-data')
        self.assertEqual(response.status_code, 422)

    def test_expired_token(self):
        """Test access with expired token"""
        import jwt
        import datetime
        
        # Create expired token
        secret_key = self.app.config['SECRET_KEY']
        expired_payload = {
            'user_id': self.user_id,
            'exp': datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        }
        expired_token = jwt.encode(expired_payload, secret_key, algorithm='HS256')
        
        response = self.client.get('/api/leads',
            headers={'Authorization': f'Bearer {expired_token}'})
        self.assertEqual(response.status_code, 401)

    def test_invalid_token_format(self):
        """Test access with invalid token format"""
        response = self.client.get('/api/leads',
            headers={'Authorization': 'InvalidFormat token123'})
        self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
