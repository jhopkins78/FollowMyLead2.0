import psycopg2
import os

def create_tables():
    # Get the database URL from environment variable
    db_url = "postgresql://neondb_owner:IDCWalcNg8H3@ep-frosty-sky-a4shi2fp.us-east-1.aws.neon.tech/neondb?sslmode=require"
    
    # Connect to the database
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        # Create users table if it doesn't exist
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Commit the changes
        conn.commit()
        print("Tables created successfully")
        
    except Exception as e:
        print(f"Error creating tables: {str(e)}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    create_tables()
