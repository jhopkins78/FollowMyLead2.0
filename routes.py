from flask import request, jsonify, render_template, current_app
from datetime import datetime, timedelta
from models import User, Lead
from database import db
from errors import ValidationError, AuthenticationError, ResourceNotFoundError, ResourceConflictError
from validators import validate_registration_data, validate_lead_data
from utils import user_to_dict, lead_to_dict, json_serial
from auth import token_required, create_token
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
            current_app.logger.error(f'Registration error: {str(e)}')
            raise

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            if not data:
                current_app.logger.warning("Login attempt with no data")
                raise ValidationError('No data provided')
            
            if not data.get('email') or not data.get('password'):
                current_app.logger.warning("Login attempt with missing email or password")
                raise ValidationError('Email and password are required')
            
            user = User.query.filter_by(email=data['email']).first()
            if not user:
                current_app.logger.warning(f"Login failed: No user found with email {data['email']}")
                raise AuthenticationError('Invalid email or password')
            
            try:
                password_valid = user.check_password(data['password'])
                if not password_valid:
                    current_app.logger.warning(f"Login failed: Invalid password for user {user.username}")
                    raise AuthenticationError('Invalid email or password')
                
            except Exception as e:
                current_app.logger.error(f"Error during password check for user {user.username}: {str(e)}")
                raise AuthenticationError('Error validating credentials')
            
            try:
                # Use our new create_token function
                token = create_token(user.id)
                current_app.logger.info(f"Token generated successfully for user {user.username}")
            except Exception as e:
                current_app.logger.error(f"Token generation failed for user {user.username}: {str(e)}")
                raise AuthenticationError('Error generating authentication token')
            
            return jsonify({
                'token': token,
                'user': user_to_dict(user)
            })
            
        except ValidationError as e:
            current_app.logger.warning(f"Validation error during login: {str(e)}")
            raise
        except AuthenticationError as e:
            current_app.logger.warning(f"Authentication error during login: {str(e)}")
            raise
        except Exception as e:
            current_app.logger.error(f"Unexpected error during login: {str(e)}")
            raise

    @app.route('/api/leads', methods=['GET'])
    @token_required
    def get_leads(current_user):
        try:
            leads = Lead.query.filter_by(user_id=current_user.id).all()
            return jsonify([lead_to_dict(lead) for lead in leads])
        except Exception as e:
            current_app.logger.error(f"Error in get_leads: {str(e)}")
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
                company=data.get('company'),
                status=data.get('status', 'new'),
                notes=data.get('notes'),
                user_id=current_user.id
            )
            
            db.session.add(lead)
            db.session.commit()
            
            current_app.logger.info(f"Lead created successfully: {lead.id}")
            return jsonify({'lead': lead_to_dict(lead)}), 201
            
        except ValidationError as e:
            current_app.logger.warning(f"Validation error in create_lead: {str(e)}")
            db.session.rollback()
            raise
        except Exception as e:
            current_app.logger.error(f"Error in create_lead: {str(e)}")
            db.session.rollback()
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

            leads_created = 0
            leads = []
            
            try:
                lines = file.read().decode().splitlines()
                if not lines:
                    raise ValidationError('CSV file is empty')
                
                # Get headers from first line
                headers = [h.strip().lower() for h in lines[0].split(',')]
                required_fields = {'name'}
                if not required_fields.issubset(set(headers)):
                    raise ValidationError('CSV must contain required column: name')
                
                # Process data rows
                for line in lines[1:]:  # Skip header row
                    if not line.strip():  # Skip empty lines
                        continue
                        
                    values = line.strip().split(',')
                    if len(values) != len(headers):
                        continue  # Skip malformed lines
                        
                    # Create dict from headers and values
                    data = dict(zip(headers, values))
                    
                    # Validate data
                    try:
                        validate_lead_data(data)
                        lead = Lead(
                            name=data['name'],
                            email=data.get('email'),
                            company=data.get('company'),
                            user_id=current_user.id,
                            status='new'
                        )
                        leads.append(lead)
                        leads_created += 1
                    except ValidationError:
                        continue  # Skip invalid rows
                
                if not leads:
                    raise ValidationError('No valid leads found in CSV')

                db.session.bulk_save_objects(leads)
                db.session.commit()
                
                current_app.logger.info(f"Successfully imported {leads_created} leads for user {current_user.id}")
                return jsonify({
                    'message': f'Successfully imported {leads_created} leads',
                    'leads_created': leads_created
                }), 201
                
            except ValidationError:
                raise
            except Exception as e:
                current_app.logger.error(f"Error processing CSV data: {str(e)}")
                raise ValidationError('Error processing CSV file. Please check the file format.')
                
        except ValidationError as e:
            current_app.logger.warning(f"Validation error in upload_csv: {str(e)}")
            db.session.rollback()
            raise
        except Exception as e:
            current_app.logger.error(f"Error in upload_csv: {str(e)}")
            db.session.rollback()
            raise

    @app.route('/api/mock-data', methods=['POST'])
    @token_required
    def generate_mock_data(current_user):
        try:
            mock_leads = [
                {
                    'name': 'John Smith',
                    'email': 'john.smith@example.com',
                    'phone': '123-456-7890',
                    'company': 'Tech Corp',
                    'status': 'new',
                },
                {
                    'name': 'Jane Doe',
                    'email': 'jane.doe@example.com',
                    'phone': '098-765-4321',
                    'company': 'Innovation Inc',
                    'status': 'contacted',
                }
            ]
            
            leads_created = []
            for lead_data in mock_leads:
                lead = Lead(
                    name=lead_data['name'],
                    email=lead_data['email'],
                    phone=lead_data['phone'],
                    company=lead_data['company'],
                    status=lead_data['status'],
                    user_id=current_user.id
                )
                leads_created.append(lead)
                
            db.session.bulk_save_objects(leads_created)
            db.session.commit()
            
            current_app.logger.info(f"Generated {len(leads_created)} mock leads for user {current_user.id}")
            return jsonify({
                'message': f'Successfully generated {len(leads_created)} mock leads',
                'leads': [lead_to_dict(lead) for lead in leads_created]
            }), 201
            
        except Exception as e:
            current_app.logger.error(f"Error generating mock data: {str(e)}")
            db.session.rollback()
            raise

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        try:
            # Test database connection
            db.session.execute(text('SELECT 1'))
            return jsonify({'status': 'healthy', 'database': 'connected'}), 200
        except Exception as e:
            current_app.logger.error(f"Health check failed: {str(e)}")
            return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

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
