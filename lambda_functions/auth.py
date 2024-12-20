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

# Verify required environment variables
required_env_vars = ['DATABASE_URL', 'JWT_SECRET_KEY']
missing_vars = [var for var in required_env_vars if not os.environ.get(var)]
if missing_vars:
    error_msg = f"Missing required environment variables: {', '.join(missing_vars)}"
    logger.error(error_msg)
    raise ValueError(error_msg)

def register(event, context):
    logger.info("Starting registration process")
    logger.debug(f"Event: {json.dumps(event)}")
    session = None
    
    try:
        # Parse request body
        if not event.get('body'):
            raise ValueError("Request body is missing")
            
        body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        email = body.get('email')
        password = body.get('password')
        username = body.get('username')
        
        logger.debug(f"Registration attempt for email: {email}, username: {username}")
        
        if not email or not password or not username:
            logger.warning("Missing required fields in registration request")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
                'body': json.dumps({'message': 'Email, password and username are required'})
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
                    'body': json.dumps({'message': 'User already exists'})
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
            if session:
                session.rollback()
            logger.error(f"Database error: {str(db_error)}")
            logger.error(traceback.format_exc())
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True,
                },
                'body': json.dumps({'message': 'Database error occurred', 'error': str(db_error)})
            }
            
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'message': str(ve)})
        }
    except json.JSONDecodeError as je:
        logger.error(f"JSON decode error: {str(je)}")
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'message': 'Invalid JSON in request body'})
        }
    except Exception as e:
        logger.error(f"Error in registration: {str(e)}")
        logger.error(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({'message': 'Internal server error', 'error': str(e)})
        }
    finally:
        if session:
            logger.debug("Closing database session")
            session.close()

def login(event, context):
    logger.info("Starting login process")
    logger.debug(f"Event: {json.dumps(event)}")
    
    try:
        # Parse request body
        body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
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
