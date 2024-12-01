from flask import request, jsonify, render_template, current_app
from datetime import datetime, timedelta
from models import User, Lead
from database import db
from errors import ValidationError, AuthenticationError, ResourceNotFoundError, ResourceConflictError
from validators import validate_registration_data, validate_lead_data
from utils import user_to_dict, lead_to_dict, json_serial
from auth import token_required, create_token
from services import LeadScoringService
import jwt
import os
import json
from sqlalchemy import text
import csv
from io import StringIO

# Initialize lead scoring service
lead_scorer = LeadScoringService()

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
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
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
            
            # Log password hash details for debugging
            stored_hash = user.password_hash.encode('utf-8') if user.password_hash else None
            app.logger.debug(f"Stored password hash exists: {bool(stored_hash)}")
            
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
            try:
                token = create_token(user.id)
                app.logger.info(f"Token generated successfully for user {user.username}")
            except Exception as e:
                app.logger.error(f"Token generation failed for user {user.username}: {str(e)}")
                raise AuthenticationError('Error generating authentication token')
            
            response_data = {
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
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
            return jsonify([{
                'id': lead.id,
                'name': lead.name,
                'email': lead.email,
                'company': lead.company,
                'quality_score': lead.quality_score,
                'status': lead.status,
                'created_at': lead.created_at.isoformat()
            } for lead in leads])
        except Exception as e:
            app.logger.error(f'Error fetching leads: {str(e)}')
            raise

    @app.route('/api/leads', methods=['POST'])
    @token_required
    def create_lead(current_user):
        try:
            data = request.get_json()
            if not data:
                raise ValidationError('No data provided')
            
            validate_lead_data(data)
            
            # Calculate lead quality score
            quality_score = lead_scorer.score_lead(data)
            
            lead = Lead(
                name=data['name'],
                email=data.get('email'),
                phone=data.get('phone'),
                company=data.get('company'),
                status=data.get('status', 'new'),
                notes=data.get('notes'),
                quality_score=quality_score,
                user_id=current_user.id
            )
            
            db.session.add(lead)
            db.session.commit()
            
            current_app.logger.info(f"Lead created successfully: {lead.id} with quality score: {quality_score}")
            return jsonify({'lead': lead_to_dict(lead)}), 201
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f'Error creating lead: {str(e)}')
            raise

    @app.route('/api/check-users', methods=['GET'])
    def check_users():
        try:
            users = User.query.all()
            return jsonify({
                'user_count': len(users),
                'users': [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
            })
        except Exception as e:
            app.logger.error(f'Error checking users: {str(e)}')
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
                        # Calculate lead quality score
                        quality_score = lead_scorer.score_lead(data)
                        
                        lead = Lead(
                            name=data['name'],
                            email=data.get('email'),
                            company=data.get('company'),
                            user_id=current_user.id,
                            status='new',
                            quality_score=quality_score
                        )
                        leads.append(lead)
                        leads_created += 1
                    except ValidationError:
                        continue  # Skip invalid rows

                db.session.bulk_save_objects(leads)
                db.session.commit()
                
                current_app.logger.info(f"Successfully created {leads_created} leads from CSV")
                return jsonify({
                    'message': f'Successfully created {leads_created} leads from CSV',
                    'leads_created': leads_created
                }), 201
                
            except Exception as e:
                db.session.rollback()
                app.logger.error(f'Error processing CSV: {str(e)}')
                raise
        except Exception as e:
            app.logger.error(f'Error processing CSV: {str(e)}')
            raise

    @app.route('/api/mock-data', methods=['POST'])
    @token_required
    def generate_mock_data(current_user):
        try:
            mock_leads = [
                {
                    'name': 'John Smith',
                    'email': 'john.smith@techcorp.com',
                    'phone': '123-456-7890',
                    'company': 'Tech Corp Solutions',
                    'status': 'new',
                },
                {
                    'name': 'Jane Doe',
                    'email': 'jane.doe@innovation.io',
                    'phone': '098-765-4321',
                    'company': 'Innovation Software Inc',
                    'status': 'contacted',
                }
            ]
            
            leads_created = []
            for lead_data in mock_leads:
                # Calculate lead quality score
                quality_score = lead_scorer.score_lead(lead_data)
                
                lead = Lead(
                    name=lead_data['name'],
                    email=lead_data['email'],
                    phone=lead_data['phone'],
                    company=lead_data['company'],
                    status=lead_data['status'],
                    quality_score=quality_score,
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
            db.session.rollback()
            app.logger.error(f'Error generating mock data: {str(e)}')
            raise

    @app.route('/api/leads/download', methods=['GET'])
    @token_required
    def download_leads(current_user):
        try:
            # Get leads for the current user
            leads = Lead.query.filter_by(user_id=current_user.id).all()
            
            # Define CSV fields based on Lead model
            fieldnames = ['name', 'email', 'phone', 'company', 'status', 'quality_score', 'notes', 'created_at', 'updated_at']
            
            # Create a string buffer to write CSV data
            si = StringIO()
            writer = csv.DictWriter(si, fieldnames=fieldnames)
            
            # Write headers
            writer.writeheader()
            
            # Write lead data
            for lead in leads:
                lead_dict = {
                    'name': lead.name,
                    'email': lead.email,
                    'phone': lead.phone,
                    'company': lead.company,
                    'status': lead.status,
                    'quality_score': lead.quality_score,
                    'notes': lead.notes,
                    'created_at': lead.created_at.isoformat() if lead.created_at else '',
                    'updated_at': lead.updated_at.isoformat() if lead.updated_at else ''
                }
                writer.writerow(lead_dict)
            
            # Create the response
            output = si.getvalue()
            si.close()
            
            # Generate filename with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'leads_export_{timestamp}.csv'
            
            response = current_app.make_response(output)
            response.headers["Content-Disposition"] = f"attachment; filename={filename}"
            response.headers["Content-type"] = "text/csv"
            return response
            
        except Exception as e:
            current_app.logger.error(f'Error generating CSV file: {str(e)}')
            return jsonify({'error': 'Failed to generate leads export'}), 500