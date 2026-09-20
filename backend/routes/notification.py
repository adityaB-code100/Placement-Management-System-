from flask import Blueprint, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import jwt_required
from utils.helpers import parse_object_id, format_doc

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('', methods=['GET'])
@jwt_required
def get_notifications():
    db = get_db()
    notifications = list(db.notifications.find({'user_id': g.current_user_id}).sort('created_at', -1))
    unread_count = db.notifications.count_documents({'user_id': g.current_user_id, 'is_read': False})
    
    return jsonify({
        'notifications': format_doc(notifications),
        'unread_count': unread_count
    }), 200

@notification_bp.route('/<notification_id>/read', methods=['PUT'])
@jwt_required
def mark_as_read(notification_id):
    db = get_db()
    n_oid = parse_object_id(notification_id)
    if not n_oid:
        return jsonify({'message': 'Invalid notification ID'}), 400

    db.notifications.update_one(
        {'_id': n_oid, 'user_id': g.current_user_id},
        {'$set': {'is_read': True, 'read_at': datetime.utcnow()}}
    )
    return jsonify({'message': 'Notification marked as read'}), 200

@notification_bp.route('/read-all', methods=['PUT'])
@jwt_required
def mark_all_read():
    db = get_db()
    db.notifications.update_many(
        {'user_id': g.current_user_id, 'is_read': False},
        {'$set': {'is_read': True, 'read_at': datetime.utcnow()}}
    )
    return jsonify({'message': 'All notifications marked as read'}), 200
