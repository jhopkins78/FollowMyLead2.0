import json
import jwt
import os
import datetime
import logging
import traceback
from lambda_db import get_db_session
from lambda_models import User

# Set up logging
log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.basicConfig(level=log_level)
logger = logging.getLogger(__name__)

def register(event, context):
    logger.info("Starting registration process")
    logger.debug(f"Event: {json.dumps(event)}")
    
    try:
        # Parse request body
        body = event['body']
        email = body.get('email')
        password = body.get('password')
        username = body.get('username')  # updated to use 'username' instead of 'name'
        
        logger.debug(f"Registration attempt for email: {email}, username: {username}")
        
        if not email or not password or not username:
            logger.warning("Missing required fields in registration request")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
                'body': json.dumps({'error': 'Email, password and username are required'})
            }
        
        try:
            # Get database session
            logger.debug("Getting database session")
            session = get_db_session()
            
            # Check if user exists
            logger.debug(f"Checking if user exists with email: {email}")
            existing_user = session.query(User).filter_by(email=email).first()
            if existing_user:
                logger.info(f"User already exists with email: {email}")
                return {
                    'statusCode': 409,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                    },
                    'body': json.dumps({'error': 'User already exists'})
                }
            
            # Create new user
            logger.debug("Creating new user")
            user = User(email=email, username=username)
            user.set_password(password)
            
            # Add to database
            logger.debug("Adding user to database")
            session.add(user)
            session.commit()
            
            logger.info(f"Successfully registered user: {email}")
            return {
                'statusCode': 201,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
                'body': json.dumps({'message': 'User registered successfully', 'user': user.to_dict()})
            }
            
        except Exception as db_error:
            logger.error(f"Database error: {str(db_error)}")
            logger.error(traceback.format_exc())
            session.rollback()
            raise
            
    except Exception as e:
        logger.error(f"Error in registration: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'error': str(e)})
        }

def login(event, context):
    logger.info("Starting login process")
    logger.debug(f"Event: {json.dumps(event)}")
    
    try:
        # Parse request body
        body = json.loads(event['body'])
        email = body.get('email')
        password = body.get('password')
        
        logger.debug(f"Login attempt for email: {email}")
        
        if not email or not password:
            logger.warning("Missing required fields in login request")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
                'body': json.dumps({'error': 'Email and password are required'})
            }
        
        # Get database session
        logger.debug("Getting database session")
        session = get_db_session()
        
        try:
            # Find user
            logger.debug(f"Finding user with email: {email}")
            user = session.query(User).filter_by(email=email).first()
            if not user or not user.check_password(password):
                logger.info(f"Invalid email or password for email: {email}")
                return {
                    'statusCode': 401,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True,
                    },
                    'body': json.dumps({'error': 'Invalid email or password'})
                }
            
            # Generate token
            logger.debug("Generating JWT token")
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
            }, os.environ['JWT_SECRET_KEY'], algorithm='HS256')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
                'body': json.dumps({
                    'token': token,
                    'user': user.to_dict()
                })
            }
        except Exception as e:
            session.rollback()
            logger.error(f"Database error: {str(e)}")
            logger.error(traceback.format_exc())
            raise e
            
    except Exception as e:
        logger.error(f"Error in login: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'error': str(e)})
        }
    finally:
        logger.debug("Closing database session")
        session.close()
