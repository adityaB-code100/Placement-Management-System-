from flask import Blueprint, request, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import jwt_required, role_required
from utils.helpers import parse_object_id, format_doc

company_bp = Blueprint('company', __name__)

@company_bp.route('', methods=['GET'])
@jwt_required
def get_companies():
    db = get_db()
    status_filter = request.args.get('status')
    
    query = {}
    if g.user_role == 'student':
        query['status'] = 'approved'
    elif status_filter:
        query['status'] = status_filter

    companies = list(db.companies.find(query).sort('created_at', -1))
    return jsonify(format_doc(companies)), 200

@company_bp.route('/<company_id>', methods=['GET'])
@jwt_required
def get_company(company_id):
    db = get_db()
    c_oid = parse_object_id(company_id)
    if not c_oid:
        return jsonify({'message': 'Invalid company ID'}), 400

    company = db.companies.find_one({'_id': c_oid})
    if not company:
        return jsonify({'message': 'Company not found'}), 404

    return jsonify(format_doc(company)), 200

@company_bp.route('', methods=['POST'])
@jwt_required
@role_required(['recruiter', 'admin'])
def create_company():
    data = request.get_json() or {}
    db = get_db()

    company_name = data.get('company_name', '').strip()
    if not company_name:
        return jsonify({'message': 'Company name is required'}), 400

    # If recruiter, check existing profile
    if g.user_role == 'recruiter':
        existing = db.companies.find_one({'user_id': g.current_user_id})
        if existing:
            return jsonify({'message': 'Company profile already exists for this user'}), 400

    status = 'approved' if g.user_role == 'admin' else 'pending'
    company_doc = {
        'user_id': g.current_user_id,
        'company_name': company_name,
        'logo_url': data.get('logo_url', ''),
        'description': data.get('description', ''),
        'industry': data.get('industry', 'Technology'),
        'website': data.get('website', ''),
        'location': data.get('location', ''),
        'hr_name': data.get('hr_name', g.current_user.get('full_name', '')),
        'hr_email': data.get('hr_email', g.current_user.get('email', '')),
        'hr_phone': data.get('hr_phone', ''),
        'status': status,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }

    result = db.companies.insert_one(company_doc)
    created = db.companies.find_one({'_id': result.inserted_id})
    return jsonify(format_doc(created)), 201

@company_bp.route('/<company_id>', methods=['PUT'])
@jwt_required
@role_required(['recruiter', 'admin'])
def update_company(company_id):
    data = request.get_json() or {}
    db = get_db()
    c_oid = parse_object_id(company_id)
    if not c_oid:
        return jsonify({'message': 'Invalid company ID'}), 400

    company = db.companies.find_one({'_id': c_oid})
    if not company:
        return jsonify({'message': 'Company not found'}), 404

    # Ensure recruiter only updates their own company
    if g.user_role == 'recruiter' and company.get('user_id') != g.current_user_id:
        return jsonify({'message': 'Forbidden. You can only edit your company profile.'}), 403

    update_fields = {
        'company_name': data.get('company_name', company.get('company_name')),
        'logo_url': data.get('logo_url', company.get('logo_url')),
        'description': data.get('description', company.get('description')),
        'industry': data.get('industry', company.get('industry')),
        'website': data.get('website', company.get('website')),
        'location': data.get('location', company.get('location')),
        'hr_name': data.get('hr_name', company.get('hr_name')),
        'hr_email': data.get('hr_email', company.get('hr_email')),
        'hr_phone': data.get('hr_phone', company.get('hr_phone')),
        'updated_at': datetime.utcnow()
    }

    db.companies.update_one({'_id': c_oid}, {'$set': update_fields})
    updated = db.companies.find_one({'_id': c_oid})
    return jsonify(format_doc(updated)), 200

@company_bp.route('/<company_id>/approve', methods=['PUT'])
@jwt_required
@role_required('admin')
def approve_company(company_id):
    data = request.get_json() or {}
    status = data.get('status', 'approved').lower()
    
    if status not in ['approved', 'rejected']:
        return jsonify({'message': 'Invalid status. Must be approved or rejected'}), 400

    db = get_db()
    c_oid = parse_object_id(company_id)
    if not c_oid:
        return jsonify({'message': 'Invalid company ID'}), 400

    company = db.companies.find_one({'_id': c_oid})
    if not company:
        return jsonify({'message': 'Company not found'}), 404

    db.companies.update_one({'_id': c_oid}, {'$set': {'status': status, 'updated_at': datetime.utcnow()}})
    
    # Notify recruiter
    recruiter_user_id = company.get('user_id')
    if recruiter_user_id:
        db.notifications.insert_one({
            'user_id': recruiter_user_id,
            'title': f'Company Status Updated: {status.title()}',
            'message': f'Your company account "{company.get("company_name")}" has been {status} by the Placement Cell.',
            'type': 'company_status',
            'is_read': False,
            'created_at': datetime.utcnow()
        })

    return jsonify({
        'message': f'Company has been {status} successfully.',
        'company_id': company_id,
        'status': status
    }), 200
