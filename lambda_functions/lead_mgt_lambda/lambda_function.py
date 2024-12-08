import json
import os
import psycopg2
from datetime import datetime
import jwt

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        return conn
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        raise

def verify_token(token):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, os.environ['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')

def get_leads(conn, user_id):
    """Get all leads for a user"""
    cur = conn.cursor()
    cur.execute("""
        SELECT id, name, email, phone, status, notes, created_at, updated_at 
        FROM leads 
        WHERE user_id = %s 
        ORDER BY created_at DESC
    """, (user_id,))
    
    columns = [desc[0] for desc in cur.description]
    results = []
    for row in cur.fetchall():
        results.append(dict(zip(columns, row)))
    return results

def create_lead(conn, user_id, lead_data):
    """Create a new lead"""
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO leads (user_id, name, email, phone, status, notes, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, name, email, phone, status, notes, created_at, updated_at
    """, (
        user_id,
        lead_data.get('name'),
        lead_data.get('email'),
        lead_data.get('phone'),
        lead_data.get('status', 'new'),
        lead_data.get('notes'),
        datetime.utcnow(),
        datetime.utcnow()
    ))
    conn.commit()
    
    columns = [desc[0] for desc in cur.description]
    result = dict(zip(columns, cur.fetchone()))
    return result

def update_lead(conn, user_id, lead_id, lead_data):
    """Update an existing lead"""
    cur = conn.cursor()
    cur.execute("""
        UPDATE leads 
        SET name = %s, email = %s, phone = %s, status = %s, notes = %s, updated_at = %s
        WHERE id = %s AND user_id = %s
        RETURNING id, name, email, phone, status, notes, created_at, updated_at
    """, (
        lead_data.get('name'),
        lead_data.get('email'),
        lead_data.get('phone'),
        lead_data.get('status'),
        lead_data.get('notes'),
        datetime.utcnow(),
        lead_id,
        user_id
    ))
    conn.commit()
    
    if cur.rowcount == 0:
        raise Exception('Lead not found or unauthorized')
    
    columns = [desc[0] for desc in cur.description]
    result = dict(zip(columns, cur.fetchone()))
    return result

def delete_lead(conn, user_id, lead_id):
    """Delete a lead"""
    cur = conn.cursor()
    cur.execute("""
        DELETE FROM leads 
        WHERE id = %s AND user_id = %s
        RETURNING id
    """, (lead_id, user_id))
    conn.commit()
    
    if cur.rowcount == 0:
        raise Exception('Lead not found or unauthorized')
    
    return {'id': lead_id}

def lambda_handler(event, context):
    """Main Lambda handler function"""
    try:
        # Extract authorization header
        headers = event.get('headers', {})
        auth_header = headers.get('Authorization') or headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Missing or invalid authorization header'})
            }
        
        # Verify token and get user_id
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        # Get database connection
        conn = get_db_connection()
        
        try:
            method = event['httpMethod']
            path = event['path']
            
            # Handle different HTTP methods
            if method == 'GET' and path == '/leads':
                result = get_leads(conn, user_id)
            elif method == 'POST' and path == '/leads':
                body = json.loads(event['body'])
                result = create_lead(conn, user_id, body)
            elif method == 'PUT' and path.startswith('/leads/'):
                lead_id = int(path.split('/')[-1])
                body = json.loads(event['body'])
                result = update_lead(conn, user_id, lead_id, body)
            elif method == 'DELETE' and path.startswith('/leads/'):
                lead_id = int(path.split('/')[-1])
                result = delete_lead(conn, user_id, lead_id)
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Not Found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result)
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': str(e)})
            }
            
    except Exception as e:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': str(e)})
        }
    finally:
        if 'conn' in locals():
            conn.close()
