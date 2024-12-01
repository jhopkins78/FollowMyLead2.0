from datetime import datetime
from decimal import Decimal

def user_to_dict(user):
    """Convert a user model instance to a dictionary"""
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }

def lead_to_dict(lead):
    """Convert a lead model instance to a dictionary"""
    return {
        'id': lead.id,
        'name': lead.name,
        'email': lead.email,
        'phone': lead.phone,
        'company': lead.company,
        'score': float(lead.score) if isinstance(lead.score, Decimal) else lead.score,
        'status': lead.status,
        'created_at': lead.created_at.isoformat() if lead.created_at else None,
        'notes': [note_to_dict(note) for note in lead.notes] if hasattr(lead, 'notes') else [],
        'last_contact': lead.last_contact.isoformat() if lead.last_contact else None,
        'industry': lead.industry,
        'location': lead.location,
        'source': lead.source,
        'estimated_value': float(lead.estimated_value) if isinstance(lead.estimated_value, Decimal) else lead.estimated_value
    }

def note_to_dict(note):
    """Convert a note model instance to a dictionary"""
    return {
        'id': note.id,
        'content': note.content,
        'created_at': note.created_at.isoformat() if note.created_at else None,
        'created_by': note.created_by
    }

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")
