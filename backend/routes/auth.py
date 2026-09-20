from flask import Blueprint, request, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import hash_password, check_password, generate_jwt, jwt_required
from utils.helpers import parse_object_id, format_doc

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'student').lower()
    full_name = data.get('full_name', '').strip()
    
    if not email or not password or not full_name:
        return jsonify({'message': 'Full name, email, and password are required.'}), 400
    
    if role not in ['student', 'recruiter']:
        return jsonify({'message': 'Invalid role. Must be student or recruiter.'}), 400

    db = get_db()
    existing_user = db.users.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'An account with this email already exists.'}), 400

    hashed_pwd = hash_password(password)
    user_doc = {
        'email': email,
        'password': hashed_pwd,
        'role': role,
        'full_name': full_name,
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    user_result = db.users.insert_one(user_doc)
    user_id_str = str(user_result.inserted_id)

    # If role is student, create student profile
    if role == 'student':
        student_doc = {
            'user_id': user_id_str,
            'email': email,
            'personal_info': {
                'full_name': full_name,
                'email': email,
                'phone': data.get('phone', ''),
                'dob': data.get('dob', ''),
                'gender': data.get('gender', ''),
                'address': data.get('address', '')
            },
            'academic_info': {
                'college': data.get('college', 'Institute of Technology & Science'),
                'department': data.get('department', 'CSE'),
                'graduation_year': data.get('graduation_year', '2027'),
                'tenth_percentage': float(data.get('tenth_percentage') or 85.0),
                'twelfth_percentage': float(data.get('twelfth_percentage') or 82.0),
                'diploma_percentage': float(data.get('diploma_percentage') or 0.0),
                'cgpa': float(data.get('cgpa') or 8.0),
                'active_backlogs': int(data.get('active_backlogs') or 0),
                'total_backlogs': int(data.get('total_backlogs') or 0)
            },
            'professional_info': {
                'skills': data.get('skills', ['Python', 'React', 'JavaScript', 'SQL']),
                'certifications': data.get('certifications', []),
                'projects': data.get('projects', []),
                'internships': data.get('internships', []),
                'github_url': data.get('github_url', ''),
                'linkedin_url': data.get('linkedin_url', ''),
                'portfolio_url': data.get('portfolio_url', ''),
                'resume_url': data.get('resume_url', '')
            },
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        db.students.insert_one(student_doc)
        
    elif role == 'recruiter':
        company_doc = {
            'user_id': user_id_str,
            'company_name': data.get('company_name', full_name + ' Tech'),
            'logo_url': data.get('logo_url', ''),
            'description': data.get('description', ''),
            'industry': data.get('industry', 'Information Technology'),
            'website': data.get('website', ''),
            'location': data.get('location', 'Bangalore, India'),
            'hr_name': full_name,
            'hr_email': email,
            'hr_phone': data.get('phone', ''),
            'status': 'pending',  # Needs admin approval
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        db.companies.insert_one(company_doc)

    token = generate_jwt(user_id_str, email, role)
    return jsonify({
        'message': 'User registered successfully.',
        'token': token,
        'user': {
            'id': user_id_str,
            'email': email,
            'role': role,
            'full_name': full_name
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    db = get_db()
    user = db.users.find_one({'email': email})

    if not user or not check_password(password, user.get('password', '')):
        return jsonify({'message': 'Invalid email or password.'}), 401

    if not user.get('is_active', True):
        return jsonify({'message': 'Your account is deactivated.'}), 403

    user_id_str = str(user['_id'])
    role = user.get('role')
    email = user.get('email')
    full_name = user.get('full_name')

    token = generate_jwt(user_id_str, email, role)

    # Fetch associated profile information
    company_status = None
    if role == 'recruiter':
        company = db.companies.find_one({'user_id': user_id_str})
        if company:
            company_status = company.get('status', 'pending')

    return jsonify({
        'message': 'Login successful.',
        'token': token,
        'user': {
            'id': user_id_str,
            'email': email,
            'role': role,
            'full_name': full_name,
            'company_status': company_status
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required
def get_me():
    user = g.current_user
    user_id = g.current_user_id
    role = g.user_role
    db = get_db()
    
    profile = None
    if role == 'student':
        profile_doc = db.students.find_one({'user_id': user_id})
        profile = format_doc(profile_doc)
    elif role == 'recruiter':
        profile_doc = db.companies.find_one({'user_id': user_id})
        profile = format_doc(profile_doc)

    return jsonify({
        'user': user,
        'profile': profile
    }), 200
