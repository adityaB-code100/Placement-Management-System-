import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, g
from config import Config
from db import get_db
from utils.helpers import parse_object_id, format_doc

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def generate_jwt(user_id: str, email: str, role: str) -> str:
    payload = {
        'sub': str(user_id),
        'email': email,
        'role': role,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Authorization header missing'}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'message': 'Invalid token format. Format: Bearer <token>'}), 401
        
        token = parts[1]
        payload = decode_jwt(token)
        if not payload:
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        user_id = payload.get('sub')
        db = get_db()
        user = db.users.find_one({'_id': parse_object_id(user_id)})
        
        if not user:
            return jsonify({'message': 'User not found'}), 401
        
        if not user.get('is_active', True):
            return jsonify({'message': 'Account has been deactivated'}), 403

        g.current_user = format_doc(user)
        g.current_user_id = user_id
        g.user_role = user.get('role')
        
        return f(*args, **kwargs)
    return decorated

def role_required(allowed_roles):
    if isinstance(allowed_roles, str):
        allowed_roles = [allowed_roles]
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'user_role') or g.user_role not in allowed_roles:
                return jsonify({
                    'message': f'Access forbidden. Required role: {", ".join(allowed_roles)}'
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
