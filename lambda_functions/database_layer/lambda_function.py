import json
import os
import psycopg2
from datetime import datetime

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        return conn
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        raise

def execute_query(conn, query, params=None):
    """Execute a database query and return results"""
    try:
        cur = conn.cursor()
        if params:
            cur.execute(query, params)
        else:
            cur.execute(query)
        
        if query.strip().upper().startswith('SELECT'):
            results = cur.fetchall()
            column_names = [desc[0] for desc in cur.description]
            return [dict(zip(column_names, row)) for row in results]
        else:
            conn.commit()
            return None
    except Exception as e:
        conn.rollback()
        raise

def lambda_handler(event, context):
    """Main Lambda handler function"""
    try:
        conn = get_db_connection()
        
        operation = event.get('operation')
        query = event.get('query')
        params = event.get('params')
        
        if not operation or not query:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing required parameters'})
            }
        
        try:
            results = execute_query(conn, query, params)
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'success': True,
                    'data': results
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'success': False,
                    'error': str(e)
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'success': False,
                'error': f'Database connection error: {str(e)}'
            })
        }
    finally:
        if 'conn' in locals():
            conn.close()
