from flask import Blueprint, request, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import jwt_required, role_required
from utils.helpers import parse_object_id, format_doc
from utils.eligibility import check_eligibility

application_bp = Blueprint('application', __name__)

VALID_STATUSES = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Assessment',
    'Technical Interview',
    'HR Interview',
    'Selected',
    'Rejected'
]

@application_bp.route('', methods=['POST'])
@jwt_required
@role_required('student')
def apply_job():
    data = request.get_json() or {}
    job_id = data.get('job_id')

    if not job_id:
        return jsonify({'message': 'Job ID is required'}), 400

    db = get_db()
    j_oid = parse_object_id(job_id)
    if not j_oid:
        return jsonify({'message': 'Invalid job ID'}), 400

    job = db.jobs.find_one({'_id': j_oid})
    if not job:
        return jsonify({'message': 'Job opening not found'}), 404

    if job.get('status') != 'Active':
        return jsonify({'message': 'This placement drive is no longer active'}), 400

    student = db.students.find_one({'user_id': g.current_user_id})
    if not student:
        return jsonify({'message': 'Student profile not found. Please complete your profile first.'}), 404

    student_id_str = str(student['_id'])

    # Check if already applied
    existing_app = db.applications.find_one({'student_id': student_id_str, 'job_id': job_id})
    if existing_app:
        return jsonify({'message': 'You have already applied to this placement opportunity.'}), 400

    # Mandatory Automatic Eligibility Check
    eligibility = check_eligibility(student, job)
    if not eligibility['is_eligible']:
        return jsonify({
            'message': 'You are not eligible to apply for this position.',
            'eligibility': eligibility
        }), 400

    app_doc = {
        'student_id': student_id_str,
        'user_id': g.current_user_id,
        'job_id': job_id,
        'company_id': job.get('company_id'),
        'company_name': job.get('company_name'),
        'job_title': job.get('title'),
        'status': 'Applied',
        'status_history': [
            {
                'status': 'Applied',
                'updated_at': datetime.utcnow().isoformat(),
                'notes': 'Application submitted successfully.'
            }
        ],
        'student_snapshot': {
            'full_name': student.get('personal_info', {}).get('full_name'),
            'email': student.get('personal_info', {}).get('email'),
            'phone': student.get('personal_info', {}).get('phone'),
            'department': student.get('academic_info', {}).get('department'),
            'cgpa': student.get('academic_info', {}).get('cgpa'),
            'active_backlogs': student.get('academic_info', {}).get('active_backlogs'),
            'resume_url': student.get('professional_info', {}).get('resume_url')
        },
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }

    result = db.applications.insert_one(app_doc)
    created = db.applications.find_one({'_id': result.inserted_id})

    # In-app notification for student
    db.notifications.insert_one({
        'user_id': g.current_user_id,
        'title': 'Application Submitted',
        'message': f'Your application for {job.get("title")} at {job.get("company_name")} has been submitted successfully.',
        'type': 'application',
        'is_read': False,
        'created_at': datetime.utcnow()
    })

    return jsonify(format_doc(created)), 201

@application_bp.route('/my', methods=['GET'])
@jwt_required
@role_required('student')
def get_my_applications():
    db = get_db()
    student = db.students.find_one({'user_id': g.current_user_id})
    if not student:
        return jsonify([]), 200

    student_id = str(student['_id'])
    applications = list(db.applications.find({'student_id': student_id}).sort('created_at', -1))
    
    formatted_apps = format_doc(applications)
    
    # Enrich with job details
    for app in formatted_apps:
        job_id_str = app.get('job_id')
        j_oid = parse_object_id(job_id_str)
        if j_oid:
            job = db.jobs.find_one({'_id': j_oid})
            app['job_details'] = format_doc(job)

    return jsonify(formatted_apps), 200

@application_bp.route('/job/<job_id>', methods=['GET'])
@jwt_required
@role_required(['admin', 'recruiter'])
def get_job_applications(job_id):
    db = get_db()
    j_oid = parse_object_id(job_id)
    if not j_oid:
        return jsonify({'message': 'Invalid job ID'}), 400

    job = db.jobs.find_one({'_id': j_oid})
    if not job:
        return jsonify({'message': 'Job opening not found'}), 404

    # Recruiter check
    if g.user_role == 'recruiter':
        company = db.companies.find_one({'user_id': g.current_user_id})
        if not company or str(company['_id']) != job.get('company_id'):
            return jsonify({'message': 'Forbidden. You do not own this job posting.'}), 403

    status_filter = request.args.get('status')
    query = {'job_id': job_id}
    if status_filter:
        query['status'] = status_filter

    applications = list(db.applications.find(query).sort('created_at', -1))
    formatted_apps = format_doc(applications)

    # Attach full student profile info to each application
    for app in formatted_apps:
        student_id_str = app.get('student_id')
        s_oid = parse_object_id(student_id_str)
        if s_oid:
            student_doc = db.students.find_one({'_id': s_oid})
            app['student_profile'] = format_doc(student_doc)

    return jsonify(formatted_apps), 200

@application_bp.route('/<application_id>/status', methods=['PUT'])
@jwt_required
@role_required(['admin', 'recruiter'])
def update_application_status(application_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    notes = data.get('notes', f'Status updated to {new_status}')

    if new_status not in VALID_STATUSES:
        return jsonify({'message': f'Invalid status. Allowed: {", ".join(VALID_STATUSES)}'}), 400

    db = get_db()
    app_oid = parse_object_id(application_id)
    if not app_oid:
        return jsonify({'message': 'Invalid application ID'}), 400

    app = db.applications.find_one({'_id': app_oid})
    if not app:
        return jsonify({'message': 'Application not found'}), 404

    # Verify authorization
    if g.user_role == 'recruiter':
        company = db.companies.find_one({'user_id': g.current_user_id})
        if not company or str(company['_id']) != app.get('company_id'):
            return jsonify({'message': 'Forbidden'}), 403

    history = app.get('status_history', [])
    history.append({
        'status': new_status,
        'updated_at': datetime.utcnow().isoformat(),
        'notes': notes
    })

    db.applications.update_one(
        {'_id': app_oid},
        {
            '$set': {
                'status': new_status,
                'status_history': history,
                'updated_at': datetime.utcnow()
            }
        }
    )

    # Notify student
    student_user_id = app.get('user_id')
    if student_user_id:
        db.notifications.insert_one({
            'user_id': student_user_id,
            'title': f'Application Status Update: {new_status}',
            'message': f'Your status for {app.get("job_title")} at {app.get("company_name")} has been updated to "{new_status}".',
            'type': 'status_update',
            'application_id': application_id,
            'is_read': False,
            'created_at': datetime.utcnow()
        })

    updated_app = db.applications.find_one({'_id': app_oid})
    return jsonify(format_doc(updated_app)), 200
