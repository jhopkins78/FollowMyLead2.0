from flask import jsonify
from errors import ValidationError, AuthenticationError, ResourceNotFoundError, ResourceConflictError

def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        app.logger.warning(f"Validation error: {str(error)}")
        return jsonify({'error': str(error)}), 422

    @app.errorhandler(AuthenticationError)
    def handle_authentication_error(error):
        app.logger.warning(f"Authentication error: {str(error)}")
        return jsonify({'error': str(error)}), 401

    @app.errorhandler(ResourceNotFoundError)
    def handle_not_found_error(error):
        app.logger.warning(f"Resource not found: {str(error)}")
        return jsonify({'error': str(error)}), 404

    @app.errorhandler(ResourceConflictError)
    def handle_conflict_error(error):
        app.logger.warning(f"Resource conflict: {str(error)}")
        return jsonify({'error': str(error)}), 409

    @app.errorhandler(Exception)
    def handle_generic_error(error):
        app.logger.error(f"Unexpected error: {str(error)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
