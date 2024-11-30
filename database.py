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
    
    try:
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(app)
        with app.app_context():
            # Test database connection with timeout
            db.session.execute(text('SELECT 1'))
            logger.info("Database connection test successful")
            
            # Create tables if they don't exist
            db.create_all()
            logger.info("Database tables created successfully")
            
            # Verify tables and log their structure
            tables_info = db.session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            logger.info("Database tables: %s", [table[0] for table in tables_info])
            
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise
