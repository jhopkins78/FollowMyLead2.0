import os
import sys
import logging
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_login import LoginManager
from database import db, init_db
from sqlalchemy import text

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('flask_app.log')
    ]
)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    
    # Add request logging middleware
    @app.before_request
    def log_request_info():
        app.logger.debug('Request Headers: %s', request.headers)
        app.logger.debug('Request Body: %s', request.get_data())

    @app.after_request
    def log_response_info(response):
        app.logger.debug('Response Status: %s', response.status)
        return response

    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # Configure static folder based on environment
    if os.environ.get('FLASK_ENV') == 'development':
        app.static_folder = 'static'
    else:
        app.static_folder = 'static/dist'

    # Configure CORS with more specific settings
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://localhost:5001"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configure logging
    if app.debug:
        logging.getLogger('werkzeug').setLevel(logging.INFO)
        file_handler = logging.FileHandler('flask_app.log')
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        ))
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.DEBUG)
        app.logger.info('Flask app starting in debug mode')

    # Configure app
    app.config.update(
        SECRET_KEY=os.environ.get("FLASK_SECRET_KEY", os.urandom(24).hex()),
        SQLALCHEMY_DATABASE_URI=os.environ.get("DATABASE_URL"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ENGINE_OPTIONS={
            "pool_pre_ping": True,
            "pool_recycle": 300,
        }
    )

    try:
        # Initialize database with detailed logging
        logger.info("Starting database initialization...")
        logger.info(f"Database URL format: {app.config['SQLALCHEMY_DATABASE_URI'].split('@')[1] if app.config['SQLALCHEMY_DATABASE_URI'] else 'Not set'}")
        init_db(app)
        logger.info("Database initialized successfully")
        
        # Verify database connection
        with app.app_context():
            db.session.execute(text('SELECT 1'))
            logger.info("Database connection test successful")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}", exc_info=True)
        logger.error("Please check database configuration and connectivity")
        raise

    # Initialize LoginManager
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    # User loader callback
    from models import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register routes
    from routes import register_routes
    register_routes(app)

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        if request.path.startswith('/api/'):
            return jsonify({"error": "Resource not found"}), 404
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f'Server Error: {error}')
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(401)
    def unauthorized_error(error):
        return jsonify({"error": "Unauthorized"}), 401

    @app.errorhandler(403)
    def forbidden_error(error):
        return jsonify({"error": "Forbidden"}), 403

    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "database": "connected"
        })

    # Serve static files and handle React routing
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith('api/'):
            return not_found_error(None)

        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)

        # Handle different content types
        if path.endswith('.js'):
            return send_from_directory(app.static_folder, 'js/bundle.js', mimetype='application/javascript')
        elif path.endswith('.css'):
            return send_from_directory(app.static_folder, 'assets/main.css', mimetype='text/css')
        elif path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
            return send_from_directory(app.static_folder, path, mimetype=f'image/{path.split(".")[-1]}')
        
        # Default to serving index.html for all other routes (SPA routing)
        return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)
