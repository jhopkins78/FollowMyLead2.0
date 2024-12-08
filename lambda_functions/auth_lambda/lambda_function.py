import json
import jwt
import bcrypt
import os
import psycopg2
from datetime import datetime, timedelta

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        return conn
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        raise

def handle_register(event, conn, jwt_secret):
    """Handle user registration"""
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        print(f"Received registration request with body: {body}")  # Debug log
        
        email = body.get('email')
        password = body.get('password')
        name = body.get('name')
        
        if not email or not password:
            print("Missing email or password")  # Debug log
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({'message': 'Email and password are required'})
            }
        
        # Hash the password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Insert user into database
        print(f"Connecting to database...")  # Debug log
        cur = conn.cursor()
        
        try:
            # Insert the new user
            print(f"Inserting new user with email: {email}")  # Debug log
            cur.execute(
                "INSERT INTO users (email, password_hash, name, created_at) VALUES (%s, %s, %s, %s) RETURNING id",
                (email, hashed_password.decode('utf-8'), name, datetime.utcnow())
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            print(f"Successfully created user with ID: {user_id}")  # Debug log
            
            # Generate JWT token
            token = jwt.encode({
                'user_id': user_id,
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=1)
            }, jwt_secret, algorithm='HS256')
            
            return {
                'statusCode': 201,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user_id,
                        'email': email,
                        'name': name
                    }
                })
            }
            
        except psycopg2.Error as e:
            print(f"Database error: {str(e)}")  # Debug log
            conn.rollback()
            if 'unique constraint' in str(e).lower():
                return {
                    'statusCode': 409,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True
                    },
                    'body': json.dumps({'message': 'Email already exists'})
                }
            raise
            
        finally:
            cur.close()
            
    except Exception as e:
        print(f"Error in handle_register: {str(e)}")  # Debug log
        import traceback
        print(f"Traceback: {traceback.format_exc()}")  # Debug log
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'message': 'Internal Server Error'})
        }

def handle_login(event, conn, jwt_secret):
    """Handle user login"""
    try:
        body = json.loads(event['body'])
        email = body['email']
        password = body['password']
        
        # Get user from database
        cur = conn.cursor()
        cur.execute("SELECT id, email, password_hash, name FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            return {
                'statusCode': 401,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({'message': 'Invalid email or password'})
            }
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user[0],
            'email': user[1],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, jwt_secret, algorithm='HS256')
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'name': user[3]
                }
            })
        }
    except Exception as e:
        print(f"Error in login: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'message': 'Internal server error'})
        }

def lambda_handler(event, context):
    """Main Lambda handler function"""
    # Get database connection details from environment variables
    jwt_secret = os.environ['JWT_SECRET_KEY']
    
    # Parse the incoming request
    http_method = event['httpMethod']
    path = event['path']
    
    # Create database connection
    conn = get_db_connection()
    
    try:
        if path == '/auth/register' and http_method == 'POST':
            return handle_register(event, conn, jwt_secret)
        elif path == '/auth/login' and http_method == 'POST':
            return handle_login(event, conn, jwt_secret)
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps({'message': 'Not Found'})
            }
    finally:
        conn.close()
