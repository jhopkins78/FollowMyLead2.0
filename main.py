import logging
import sys
import os
from flask import Flask
from database import db, init_db

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('flask_server.log')
    ]
)
logger = logging.getLogger(__name__)

def create_minimal_app():
    app = Flask(__name__)
    
    # Basic configuration
    app.config.update(
        SECRET_KEY=os.environ.get('FLASK_SECRET_KEY', 'dev'),
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )
    
    try:
        # Initialize database
        init_db(app)
        logger.info("Database initialized successfully")
        
        # Basic health check route
        @app.route('/health')
        def health_check():
            return {'status': 'healthy'}
            
        return app
    except Exception as e:
        logger.error(f"Application startup failed: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    try:
        logger.info("Starting minimal Flask application...")
        app = create_minimal_app()
        app.run(host="0.0.0.0", port=5001, debug=False)
    except Exception as e:
        logger.error(f"Failed to start Flask application: {str(e)}", exc_info=True)
        sys.exit(1)
