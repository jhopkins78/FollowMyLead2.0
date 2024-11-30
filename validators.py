import re
from errors import ValidationError

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValidationError('Invalid email format')

def validate_password(password):
    """
    Validate password strength
    - At least 8 characters long
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one number
    - Contains at least one special character
    """
    errors = []
    if len(password) < 8:
        errors.append('Password must be at least 8 characters long')
    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain at least one uppercase letter')
    if not re.search(r'[a-z]', password):
        errors.append('Password must contain at least one lowercase letter')
    if not re.search(r'\d', password):
        errors.append('Password must contain at least one number')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append('Password must contain at least one special character')
    
    if errors:
        raise ValidationError('Password validation failed', errors)

def validate_username(username):
    """
    Validate username
    - Between 3 and 30 characters
    - Only alphanumeric characters and underscores
    - Must start with a letter
    """
    if not 3 <= len(username) <= 30:
        raise ValidationError('Username must be between 3 and 30 characters')
    if not username[0].isalpha():
        raise ValidationError('Username must start with a letter')
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9_]*$', username):
        raise ValidationError('Username can only contain letters, numbers, and underscores')

def validate_lead_data(data):
    """Validate lead data"""
    errors = {}
    
    # Required fields
    required_fields = ['name']
    for field in required_fields:
        if field not in data or not data[field]:
            errors[field] = f'{field} is required'
    
    # Email validation
    if 'email' in data and data['email']:
        try:
            validate_email(data['email'])
        except ValidationError as e:
            errors['email'] = str(e.message)
    
    # Name validation
    if 'name' in data and data['name']:
        if len(data['name']) < 2:
            errors['name'] = 'Name must be at least 2 characters long'
        if len(data['name']) > 100:
            errors['name'] = 'Name must not exceed 100 characters'
    
    # Company validation
    if 'company' in data and data['company']:
        if len(data['company']) < 2:
            errors['company'] = 'Company name must be at least 2 characters long'
        if len(data['company']) > 100:
            errors['company'] = 'Company name must not exceed 100 characters'
    
    if errors:
        raise ValidationError('Lead data validation failed', errors)

def validate_registration_data(data):
    """Validate user registration data"""
    errors = {}
    
    # Required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            errors[field] = f'{field} is required'
    
    # Validate each field if present
    try:
        if 'username' in data and data['username']:
            validate_username(data['username'])
    except ValidationError as e:
        errors['username'] = e.message

    try:
        if 'email' in data and data['email']:
            validate_email(data['email'])
    except ValidationError as e:
        errors['email'] = e.message

    try:
        if 'password' in data and data['password']:
            validate_password(data['password'])
    except ValidationError as e:
        errors['password'] = e.errors if hasattr(e, 'errors') else [e.message]
    
    if errors:
        raise ValidationError('Registration data validation failed', errors)
