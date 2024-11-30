from flask import jsonify
from werkzeug.http import HTTP_STATUS_CODES

class APIError(Exception):
    """Base exception class for API errors"""
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['error'] = HTTP_STATUS_CODES.get(self.status_code, 'Unknown error')
        rv['status_code'] = self.status_code
        return rv

class ValidationError(APIError):
    """Raised when input validation fails"""
    def __init__(self, message, errors=None):
        super().__init__(message, status_code=422)
        self.errors = errors
        if errors:
            self.payload = {'errors': errors}

class AuthenticationError(APIError):
    """Raised when authentication fails"""
    def __init__(self, message):
        super().__init__(message, status_code=401)

class AuthorizationError(APIError):
    """Raised when user doesn't have permission"""
    def __init__(self, message):
        super().__init__(message, status_code=403)

class ResourceNotFoundError(APIError):
    """Raised when a resource is not found"""
    def __init__(self, message):
        super().__init__(message, status_code=404)

class ResourceConflictError(APIError):
    """Raised when there's a conflict with existing resource"""
    def __init__(self, message):
        super().__init__(message, status_code=409)

def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({
            'message': 'Bad request',
            'error': str(error),
            'status_code': 400
        }), 400

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'message': 'Resource not found',
            'error': str(error),
            'status_code': 404
        }), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            'message': 'An internal server error occurred',
            'error': str(error),
            'status_code': 500
        }), 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.error(f'Unexpected error: {str(error)}')
        return jsonify({
            'message': 'An unexpected error occurred',
            'error': str(error),
            'status_code': 500
        }), 500
