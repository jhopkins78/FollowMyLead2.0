import os
import sys
import logging
import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_login import LoginManager
from database import db, init_db
from sqlalchemy import text
from routes import register_routes
from error_handlers import register_error_handlers
import json
from config import Config
import watchtower

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('flask_app.log')
    ]
)
logger = logging.getLogger(__name__)

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    config = Config()
    app.config.update(config.load_config())
    
    # Add request logging middleware
    @app.before_request
    def log_request_info():
        app.logger.debug('Request Headers: %s', request.headers)
        app.logger.debug('Request Body: %s', request.get_data())

    @app.after_request
    def log_response_info(response):
        app.logger.debug('Response Status: %s', response.status)
        return response

    # Error Handlers
    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(401)
    def unauthorized_error(error):
        return jsonify({"error": "Unauthorized access"}), 401

    @app.errorhandler(403)
    def forbidden_error(error):
        return jsonify({"error": "Forbidden"}), 403

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(422)
    def unprocessable_entity_error(error):
        return jsonify({"error": "Validation error"}), 422

    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.error(f'Server Error: {str(error)}')
        return jsonify({"error": "Internal server error"}), 500

    # Request logging
    @app.before_request
    def log_request():
        app.logger.debug(f"Request Headers: {dict(request.headers)}")
        if request.is_json:
            app.logger.debug(f"Request JSON: {request.get_json()}")
        elif request.form:
            app.logger.debug(f"Request Form: {dict(request.form)}")
        elif request.files:
            app.logger.debug(f"Request Files: {dict(request.files)}")

    @app.after_request
    def log_response(response):
        app.logger.debug(f"Response Status: {response.status}")
        app.logger.debug(f"Response Headers: {dict(response.headers)}")
        return response

    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # Configure static folder based on environment
    if os.environ.get('FLASK_ENV') == 'development':
        app.static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
    else:
        app.static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'dist')

    # Ensure static folder exists
    os.makedirs(app.static_folder, exist_ok=True)

    # Initialize CORS
    CORS(app)

    # Initialize database
    db.init_app(app)
    
    with app.app_context():
        db.create_all()  # Create tables if they don't exist

    # Configure logging for production
    if app.config['ENV'] == 'production':
        logging.basicConfig(level=logging.INFO)
        handler = watchtower.CloudWatchLogHandler(
            log_group='FollowMyLead20',
            stream_name=datetime.datetime.now().strftime('%Y-%m-%d'),
            create_log_group=True
        )
        app.logger.addHandler(handler)
        logging.getLogger('werkzeug').addHandler(handler)

    # Health check endpoint
    @app.route('/health')
    def health_check():
        """Health check endpoint for AWS Load Balancer"""
        try:
            # Test database connection
            with db.engine.connect() as connection:
                connection.execute('SELECT 1')
            return jsonify({'status': 'healthy'}), 200
        except Exception as e:
            app.logger.error(f"Health check failed: {str(e)}")
            return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

    # Register routes and error handlers
    register_routes(app)
    register_error_handlers(app)

    # Initialize LoginManager
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    # User loader callback
    from models import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Serve static files and handle React routing
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        # Don't handle API routes here
        if path.startswith('api/'):
            return not_found_error(None)

        # Check if file exists in static folder
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)

        # Handle different content types
        if path.endswith('.js'):
            js_path = os.path.join('js', 'bundle.js')
            if os.path.exists(os.path.join(app.static_folder, js_path)):
                return send_from_directory(app.static_folder, js_path, mimetype='application/javascript')
        elif path.endswith('.css'):
            css_path = os.path.join('assets', 'main.css')
            if os.path.exists(os.path.join(app.static_folder, css_path)):
                return send_from_directory(app.static_folder, css_path, mimetype='text/css')
        elif path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
            if os.path.exists(os.path.join(app.static_folder, path)):
                return send_from_directory(app.static_folder, path, mimetype=f'image/{path.split(".")[-1]}')
        
        # Default to serving index.html for all other non-API routes
        if not path.startswith('api/'):
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(app.static_folder, 'index.html')
            else:
                app.logger.error(f"index.html not found in {app.static_folder}")
                return jsonify({"error": "Frontend not built"}), 500
        
        return not_found_error(None)

    # Set up custom JSON encoder for datetime objects
    app.json_encoder = lambda obj: json.dumps(obj, default=json_serial)
    
    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port)
