from flask import Blueprint, request, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import jwt_required, role_required
from utils.helpers import parse_object_id, format_doc
from utils.eligibility import check_eligibility

student_bp = Blueprint('student', __name__)

def calculate_completion_percentage(student):
    if not student:
        return 0

    personal = student.get('personal_info', {})
    academic = student.get('academic_info', {})
    prof = student.get('professional_info', {})

    checks = [
        bool(personal.get('full_name')),
        bool(personal.get('email')),
        bool(personal.get('phone')),
        bool(personal.get('dob')),
        bool(personal.get('gender')),
        bool(personal.get('address')),
        bool(academic.get('college')),
        bool(academic.get('department')),
        bool(academic.get('graduation_year')),
        academic.get('tenth_percentage') is not None and academic.get('tenth_percentage') != '',
        academic.get('twelfth_percentage') is not None or academic.get('diploma_percentage') is not None,
        academic.get('cgpa') is not None and academic.get('cgpa') != '',
        academic.get('active_backlogs') is not None,
        len(prof.get('skills') or []) > 0,
        len(prof.get('certifications') or []) > 0,
        len(prof.get('projects') or []) > 0,
        bool(prof.get('github_url')),
        bool(prof.get('linkedin_url')),
        bool(prof.get('resume_url'))
    ]

    filled = sum(1 for c in checks if c)
    return round((filled / len(checks)) * 100)

@student_bp.route('/profile', methods=['GET'])
@jwt_required
@role_required('student')
def get_profile():
    db = get_db()
    student = db.students.find_one({'user_id': g.current_user_id})
    if not student:
        return jsonify({'message': 'Student profile not found'}), 404
    
    formatted = format_doc(student)
    formatted['completion_percentage'] = calculate_completion_percentage(student)
    return jsonify(formatted), 200

@student_bp.route('/profile', methods=['PUT'])
@jwt_required
@role_required('student')
def update_profile():
    data = request.get_json() or {}
    db = get_db()
    
    student = db.students.find_one({'user_id': g.current_user_id})
    if not student:
        return jsonify({'message': 'Student profile not found'}), 404

    # Extract update sections
    personal_info = data.get('personal_info', student.get('personal_info', {}))
    academic_info = data.get('academic_info', student.get('academic_info', {}))
    professional_info = data.get('professional_info', student.get('professional_info', {}))

    # Convert numeric fields properly
    if 'cgpa' in academic_info:
        academic_info['cgpa'] = float(academic_info['cgpa'] or 0.0)
    if 'active_backlogs' in academic_info:
        academic_info['active_backlogs'] = int(academic_info['active_backlogs'] or 0)
    if 'total_backlogs' in academic_info:
        academic_info['total_backlogs'] = int(academic_info['total_backlogs'] or 0)
    if 'tenth_percentage' in academic_info:
        academic_info['tenth_percentage'] = float(academic_info['tenth_percentage'] or 0.0)
    if 'twelfth_percentage' in academic_info:
        academic_info['twelfth_percentage'] = float(academic_info['twelfth_percentage'] or 0.0)
    if 'diploma_percentage' in academic_info:
        academic_info['diploma_percentage'] = float(academic_info['diploma_percentage'] or 0.0)

    db.students.update_one(
        {'user_id': g.current_user_id},
        {
            '$set': {
                'personal_info': personal_info,
                'academic_info': academic_info,
                'professional_info': professional_info,
                'updated_at': datetime.utcnow()
            }
        }
    )

    # Update full name in user document if changed
    if personal_info.get('full_name'):
        db.users.update_one(
            {'_id': parse_object_id(g.current_user_id)},
            {'$set': {'full_name': personal_info['full_name']}}
        )

    updated_student = db.students.find_one({'user_id': g.current_user_id})
    formatted = format_doc(updated_student)
    formatted['completion_percentage'] = calculate_completion_percentage(updated_student)
    
    return jsonify({
        'message': 'Profile updated successfully',
        'profile': formatted
    }), 200

@student_bp.route('/stats', methods=['GET'])
@jwt_required
@role_required('student')
def get_student_stats():
    db = get_db()
    student = db.students.find_one({'user_id': g.current_user_id})
    student_id = str(student['_id']) if student else None

    if not student_id:
        return jsonify({'message': 'Student record not found'}), 404

    # Count applications
    total_applications = db.applications.count_documents({'student_id': student_id})
    shortlisted_count = db.applications.count_documents({
        'student_id': student_id,
        'status': {'$in': ['Shortlisted', 'Assessment', 'Technical Interview', 'HR Interview', 'Selected']}
    })
    selected_count = db.applications.count_documents({'student_id': student_id, 'status': 'Selected'})

    # Upcoming interviews
    upcoming_interviews = db.interviews.count_documents({
        'student_id': student_id,
        'status': 'Scheduled'
    })

    # Total active eligible jobs
    active_jobs = list(db.jobs.find({'status': 'Active'}))
    eligible_jobs_count = 0
    for job in active_jobs:
        eligibility = check_eligibility(student, job)
        if eligibility['is_eligible']:
            eligible_jobs_count += 1

    completion_pct = calculate_completion_percentage(student)

    return jsonify({
        'total_applications': total_applications,
        'shortlisted_count': shortlisted_count,
        'selected_count': selected_count,
        'upcoming_interviews': upcoming_interviews,
        'eligible_jobs_count': eligible_jobs_count,
        'completion_percentage': completion_pct,
        'is_placed': selected_count > 0
    }), 200
