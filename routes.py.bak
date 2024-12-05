from flask import request, jsonify, render_template
from datetime import datetime, timedelta
from models import User, Lead
from database import db
from errors import ValidationError, AuthenticationError, ResourceNotFoundError, ResourceConflictError
from validators import validate_registration_data, validate_lead_data
from utils import user_to_dict, lead_to_dict, json_serial
from auth import token_required
import jwt
import os
import json
from sqlalchemy import text

def register_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            if not data:
                raise ValidationError('No data provided')

            # Validate registration data
            validate_registration_data(data)
            
            # Check if email already exists
            if User.query.filter_by(email=data['email']).first():
                raise ResourceConflictError('Email already registered')
            
            # Create and save user
            user = User(
                username=data['username'],
                email=data['email']
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                'message': 'User registered successfully',
                'user': user_to_dict(user)
            }), 201
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f'Registration error: {str(e)}')
            raise

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            app.logger.info(f"Login attempt received with data: {json.dumps({k: '***' if k == 'password' else v for k, v in data.items()})}")
            
            if not data:
                app.logger.warning("Login attempt with no data")
                raise ValidationError('No data provided')
            
            if not data.get('email') or not data.get('password'):
                app.logger.warning("Login attempt with missing email or password")
                raise ValidationError('Email and password are required')
            
            user = User.query.filter_by(email=data['email']).first()
            if not user:
                app.logger.warning(f"Login failed: No user found with email {data['email']}")
                raise AuthenticationError('Invalid email or password')
            
            app.logger.info(f"User found for login attempt - ID: {user.id}, Username: {user.username}")
            
            try:
                password_valid = user.check_password(data['password'])
                app.logger.info(f"Password check result for user {user.username}: {'valid' if password_valid else 'invalid'}")
                
                if not password_valid:
                    app.logger.warning(f"Login failed: Invalid password for user {user.username}")
                    raise AuthenticationError('Invalid email or password')
                
            except Exception as e:
                app.logger.error(f"Error during password check for user {user.username}: {str(e)}")
                raise AuthenticationError('Error validating credentials')
            
            # Generate token
            token_payload = {
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }
            
            try:
                token = jwt.encode(token_payload, app.config['SECRET_KEY'])
                app.logger.info(f"Token generated successfully for user {user.username}")
            except Exception as e:
                app.logger.error(f"Token generation failed for user {user.username}: {str(e)}")
                raise AuthenticationError('Error generating authentication token')
            
            response_data = {
                'token': token,
                'user': user_to_dict(user)
            }
            app.logger.info(f"Login successful for user {user.username}")
            return jsonify(response_data)
            
        except ValidationError as e:
            app.logger.warning(f"Validation error during login: {str(e)}")
            raise
        except AuthenticationError as e:
            app.logger.warning(f"Authentication error during login: {str(e)}")
            raise
        except Exception as e:
            app.logger.error(f"Unexpected error during login: {str(e)}")
            raise

    @app.route('/api/leads', methods=['GET'])
    @token_required
    def get_leads(current_user):
        try:
            leads = Lead.query.filter_by(user_id=current_user.id).all()
            return jsonify([lead_to_dict(lead) for lead in leads])
        except Exception as e:
            app.logger.error(f"Error in get_leads: {str(e)}")
            raise

    @app.route('/api/leads', methods=['POST'])
    @token_required
    def create_lead(current_user):
        try:
            data = request.get_json()
            if not data:
                raise ValidationError('No data provided')
            
            validate_lead_data(data)
            
            lead = Lead(
                name=data['name'],
                email=data.get('email'),
                phone=data.get('phone'),
                status=data.get('status', 'new'),
                notes=data.get('notes'),
                user_id=current_user.id
            )
            
            db.session.add(lead)
            db.session.commit()
            
            return jsonify({'lead': lead_to_dict(lead)}), 201
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error in create_lead: {str(e)}")
            raise

    @app.route('/api/upload-csv', methods=['POST'])
    @token_required
    def upload_csv(current_user):
        try:
            if 'file' not in request.files:
                raise ValidationError('No file provided')

            file = request.files['file']
            if file.filename == '':
                raise ValidationError('No file selected')

            if not file.filename.endswith('.csv'):
                raise ValidationError('Invalid file type. Please upload a CSV file')

            # Process the CSV file
            leads = []
            for row in file:
                data = row.decode().strip().split(',')
                if len(data) >= 3:  # Assuming minimum required fields: name, email, company
                    lead = Lead(
                        name=data[0],
                        email=data[1],
                        company=data[2],
                        user_id=current_user.id,
                        status='new'
                    )
                    leads.append(lead)

            db.session.bulk_save_objects(leads)
            db.session.commit()

            return jsonify({'message': f'Successfully imported {len(leads)} leads'}), 201
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error in upload_csv: {str(e)}")
            raise

    @app.route('/api/mock-data', methods=['POST'])
    @token_required
    def generate_mock_data(current_user):
        try:
            # Create some mock leads
            mock_leads = [
                {
                    'name': 'John Smith',
                    'email': 'john.smith@example.com',
                    'phone': '123-456-7890',
                    'status': 'new',
                    'notes': 'Interested in premium package'
                },
                {
                    'name': 'Jane Doe',
                    'email': 'jane.doe@example.com',
                    'phone': '098-765-4321',
                    'status': 'contacted',
                    'notes': 'Follow up next week'
                }
            ]
            
            leads_created = []
            for lead_data in mock_leads:
                lead = Lead(
                    name=lead_data['name'],
                    email=lead_data['email'],
                    phone=lead_data['phone'],
                    status=lead_data['status'],
                    notes=lead_data['notes'],
                    user_id=current_user.id
                )
                db.session.add(lead)
                leads_created.append(lead)
            
            db.session.commit()
            return jsonify({
                'message': 'Successfully created mock data',
                'leads': [lead_to_dict(lead) for lead in leads_created]
            })
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error in create_mock_data: {str(e)}")
            raise

def calculate_lead_score(lead_data):
    """Calculate a lead score based on available data"""
    score = 0
    
    # Check for complete contact information
    if lead_data.get('email'):
        score += 20
    if lead_data.get('phone'):
        score += 20
    
    # Check for additional notes
    if lead_data.get('notes'):
        score += 10
    
    # Check engagement level based on status
    status = lead_data.get('status', '').lower()
    if status == 'contacted':
        score += 15
    elif status == 'qualified':
        score += 25
    elif status == 'converted':
        score += 30
    
    return min(score, 100)  # Cap score at 100
