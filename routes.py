from flask import request, jsonify, render_template
from datetime import datetime, timedelta
from models import User, Lead
from database import db
import jwt
import os

def register_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400
            
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            
            return jsonify({'token': token})
        
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/api/leads', methods=['GET'])
    def get_leads():
        from auth import token_required
        @token_required
        def protected_get_leads(current_user):
            leads = Lead.query.filter_by(user_id=current_user.id).all()
            return jsonify([{
                'id': lead.id,
                'name': lead.name,
                'email': lead.email,
                'company': lead.company,
                'quality_score': lead.quality_score,
                'status': lead.status,
                'created_at': lead.created_at
            } for lead in leads])
        return protected_get_leads()

    @app.route('/api/leads', methods=['POST'])
    def create_lead():
        from auth import token_required
        @token_required
        def protected_create_lead(current_user):
            data = request.get_json()
            
            lead = Lead(
                name=data['name'],
                email=data['email'],
                company=data['company'],
                quality_score=calculate_lead_score(data),
                status='new',
                user_id=current_user.id
            )
            
            db.session.add(lead)
            db.session.commit()
            
            return jsonify({
                'message': 'Lead created successfully',
                'lead_id': lead.id
            }), 201
        return protected_create_lead()

def calculate_lead_score(lead_data):
    import json
    import os
    from difflib import SequenceMatcher

    # Load mock data
    try:
        with open('mock_data.json', 'r') as f:
            mock_leads = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        mock_leads = []

    # Check for exact matches in mock data
    for mock_lead in mock_leads:
        if (mock_lead['email'].lower() == lead_data.get('email', '').lower() or
            mock_lead['company'].lower() == lead_data.get('company', '').lower()):
            return mock_lead['score']

    # Initialize base score
    score = 0.0

    # Email scoring
    email = lead_data.get('email', '').lower()
    if email:
        score += 0.3
        # Bonus for business email domains
        business_domains = ['com', 'org', 'net', 'io', 'co']
        if any(email.endswith('.' + domain) for domain in business_domains):
            score += 0.1

    # Company scoring
    company = lead_data.get('company', '').lower()
    if company:
        score += 0.3
        # Bonus for technology or innovation related terms
        tech_terms = ['tech', 'solutions', 'digital', 'software', 'innovations', 'systems']
        if any(term in company.lower() for term in tech_terms):
            score += 0.1

    # Name scoring
    name = lead_data.get('name', '')
    if name:
        score += 0.2

    # Find best match with mock data for additional context
    best_match_score = 0
    for mock_lead in mock_leads:
        name_ratio = SequenceMatcher(None, name.lower(), mock_lead['name'].lower()).ratio()
        company_ratio = SequenceMatcher(None, company, mock_lead['company'].lower()).ratio()
        match_score = (name_ratio + company_ratio) / 2
        best_match_score = max(best_match_score, match_score)

    # Apply similarity bonus
    score += best_match_score * 0.1

    # Ensure score is between 0 and 1
    return min(max(score, 0.0), 1.0)


    @app.route('/api/leads/download', methods=['GET'])
    def download_leads():
        from auth import token_required
        import csv
        from io import StringIO
        
        @token_required
        def protected_download_leads(current_user):
            try:
                # Create a string buffer to write CSV data
                si = StringIO()
                writer = csv.DictWriter(si, fieldnames=['name', 'email', 'company', 'score'])
                
                # Write headers
                writer.writeheader()
                
                # Load and write mock data
                with open('mock_data.json', 'r') as f:
                    mock_leads = json.load(f)
                    writer.writerows(mock_leads)
                
                # Create the response
                output = si.getvalue()
                si.close()
                
                response = app.make_response(output)
                response.headers["Content-Disposition"] = "attachment; filename=sample_leads.csv"
                response.headers["Content-type"] = "text/csv"
                return response
                
            except Exception as e:
                return jsonify({'error': 'Failed to generate CSV file'}), 500
                
        return protected_download_leads()