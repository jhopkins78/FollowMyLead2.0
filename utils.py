from datetime import datetime

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def user_to_dict(user):
    """Convert User model to dictionary"""
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'created_at': user.created_at  # This will be serialized by json_serial
    }

def lead_to_dict(lead):
    """Convert Lead model to dictionary"""
    return {
        'id': lead.id,
        'name': lead.name,
        'email': lead.email,
        'company': lead.company,
        'status': lead.status,
        'quality_score': lead.quality_score,
        'created_at': lead.created_at,  # This will be serialized by json_serial
        'user_id': lead.user_id
    }
