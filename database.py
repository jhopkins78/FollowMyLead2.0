import logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

def init_db(app):
    logger = logging.getLogger(__name__)
    logger.info("Initializing database connection...")
    
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            db.init_app(app)
            with app.app_context():
                # Test database connection with timeout
                db.session.execute(text('SELECT 1'))
                logger.info("Database connection test successful")
                
                # Create tables if they don't exist
                db.create_all()
                logger.info("Database tables created successfully")
                
                # Verify tables and log their structure
                tables_info = db.session.execute(
                    text("""
                    SELECT 
                        t.table_name,
                        array_agg(c.column_name::text) as columns
                    FROM information_schema.tables t
                    JOIN information_schema.columns c 
                        ON c.table_name = t.table_name
                    WHERE t.table_schema = 'public'
                    GROUP BY t.table_name
                    """)
                ).fetchall()
                
                for table_info in tables_info:
                    logger.info(f"Table {table_info[0]} exists with columns: {table_info[1]}")
                
                # Ensure indexes exist
                db.session.execute(text("""
                    CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
                    CREATE INDEX IF NOT EXISTS idx_leads_quality_score ON leads(quality_score);
                    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
                """))
                db.session.commit()
                
                return True
                
        except Exception as e:
            retry_count += 1
            logger.warning(f"Database initialization attempt {retry_count} failed: {str(e)}")
            if retry_count >= max_retries:
                logger.error("Database initialization failed after maximum retries", exc_info=True)
                raise
            import time
            time.sleep(2 ** retry_count)  # Exponential backoff
            
    return False
