from functools import wraps
from flask import request, jsonify, current_app
import jwt
from models import User
import logging
import datetime

def create_token(user_id):
    """Create a JWT token for the user"""
    try:
        # Get the secret key from app config
        secret_key = current_app.config.get('SECRET_KEY')
        if not secret_key:
            raise ValueError("SECRET_KEY not configured")
            
        # Create token with 24 hour expiration
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, secret_key, algorithm='HS256')
        return token
    except Exception as e:
        current_app.logger.error(f"Error creating token: {str(e)}")
        raise

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Set up logging
        logger = logging.getLogger('auth')
        
        # Check for Authorization header
        auth_header = request.headers.get('Authorization')
        logger.info(f'Received Authorization header: {auth_header}')
        
        if not auth_header:
            logger.warning('No Authorization header present')
            return jsonify({'error': 'Token is missing'}), 401

        try:
            # Extract token
            token_parts = auth_header.split()
            logger.info(f'Token parts: {token_parts}')
            
            if len(token_parts) != 2 or token_parts[0].lower() != 'bearer':
                logger.warning('Invalid Authorization header format')
                return jsonify({'error': 'Invalid token format'}), 401
            
            token = token_parts[1]
            logger.info(f'Extracted token: {token[:20]}...')
            
            # Get secret key
            secret_key = current_app.config.get('SECRET_KEY')
            if not secret_key:
                logger.error('SECRET_KEY not configured')
                return jsonify({'error': 'Server configuration error'}), 500
                
            logger.info(f'Using SECRET_KEY: {secret_key[:10]}...')
            
            # Decode token
            try:
                data = jwt.decode(token, secret_key, algorithms=['HS256'])
                logger.info(f'Decoded token data: {data}')
            except jwt.ExpiredSignatureError:
                logger.warning('Token has expired')
                return jsonify({'error': 'Token has expired'}), 401
            except jwt.InvalidTokenError as e:
                logger.warning(f'Invalid token: {str(e)}')
                return jsonify({'error': 'Invalid token'}), 401
            
            # Get user
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                logger.warning(f'User not found for token user_id: {data.get("user_id")}')
                return jsonify({'error': 'User not found'}), 401
                
            # Add user to request context
            request.current_user = current_user
            logger.info(f'Successfully authenticated user: {current_user.username}')
            return f(current_user, *args, **kwargs)
            
        except Exception as e:
            logger.error(f'Unexpected error in token validation: {str(e)}')
            return jsonify({'error': 'Authentication error'}), 401
            
    return decorated
