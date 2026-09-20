from flask import Blueprint, request, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import jwt_required, role_required
from utils.helpers import parse_object_id, format_doc
from utils.eligibility import check_eligibility

job_bp = Blueprint('job', __name__)

@job_bp.route('', methods=['GET'])
@jwt_required
def get_jobs():
    db = get_db()
    search = request.args.get('search', '').strip()
    branch = request.args.get('branch', '').strip()
    job_type = request.args.get('job_type', '').strip()
    status = request.args.get('status', 'Active').strip()

    query = {}
    if status and status.lower() != 'all':
        query['status'] = status

    if search:
        query['$or'] = [
            {'title': {'$regex': search, '$options': 'i'}},
            {'company_name': {'$regex': search, '$options': 'i'}},
            {'location': {'$regex': search, '$options': 'i'}}
        ]

    if branch and branch.upper() != 'ALL':
        query['$or'] = [
            {'eligible_branches': {'$regex': branch, '$options': 'i'}},
            {'eligible_branches': {'$in': ['All', 'ANY', 'all', 'any']}}
        ]

    if job_type:
        query['job_type'] = job_type

    # Recruiters only see their posted jobs if specified
    if g.user_role == 'recruiter' and request.args.get('my_jobs') == 'true':
        company = db.companies.find_one({'user_id': g.current_user_id})
        if company:
            query['company_id'] = str(company['_id'])

    jobs = list(db.jobs.find(query).sort('created_at', -1))
    formatted_jobs = format_doc(jobs)

    # If student, attach application status & eligibility for quick UI badges
    if g.user_role == 'student':
        student = db.students.find_one({'user_id': g.current_user_id})
        student_id = str(student['_id']) if student else None
        
        applications = {}
        if student_id:
            user_apps = db.applications.find({'student_id': student_id})
            for app in user_apps:
                applications[app['job_id']] = app['status']

        for job_item in formatted_jobs:
            job_id_str = job_item['id']
            job_item['application_status'] = applications.get(job_id_str, None)
            if student:
                job_item['eligibility'] = check_eligibility(student, job_item)

    return jsonify(formatted_jobs), 200

@job_bp.route('/<job_id>', methods=['GET'])
@jwt_required
def get_job(job_id):
    db = get_db()
    j_oid = parse_object_id(job_id)
    if not j_oid:
        return jsonify({'message': 'Invalid job ID'}), 400

    job = db.jobs.find_one({'_id': j_oid})
    if not job:
        return jsonify({'message': 'Job opening not found'}), 404

    formatted = format_doc(job)

    # Attach student-specific info if requested by student
    if g.user_role == 'student':
        student = db.students.find_one({'user_id': g.current_user_id})
        if student:
            formatted['eligibility'] = check_eligibility(student, job)
            student_id = str(student['_id'])
            app = db.applications.find_one({'student_id': student_id, 'job_id': job_id})
            formatted['application'] = format_doc(app) if app else None

    return jsonify(formatted), 200

@job_bp.route('/<job_id>/check-eligibility', methods=['GET'])
@jwt_required
@role_required('student')
def check_job_eligibility(job_id):
    db = get_db()
    j_oid = parse_object_id(job_id)
    if not j_oid:
        return jsonify({'message': 'Invalid job ID'}), 400

    job = db.jobs.find_one({'_id': j_oid})
    if not job:
        return jsonify({'message': 'Job opening not found'}), 404

    student = db.students.find_one({'user_id': g.current_user_id})
    if not student:
        return jsonify({'message': 'Student profile not found'}), 404

    eligibility = check_eligibility(student, job)
    return jsonify(eligibility), 200

@job_bp.route('', methods=['POST'])
@jwt_required
@role_required(['admin', 'recruiter'])
def create_job():
    data = request.get_json() or {}
    db = get_db()

    # Recruiter check: must be approved by admin
    company_id = data.get('company_id')
    company_name = data.get('company_name', '')
    
    if g.user_role == 'recruiter':
        company = db.companies.find_one({'user_id': g.current_user_id})
        if not company:
            return jsonify({'message': 'Company profile required before posting job.'}), 400
        if company.get('status') != 'approved':
            return jsonify({'message': 'Your company account is pending admin approval.'}), 403
        company_id = str(company['_id'])
        company_name = company.get('company_name')

    title = data.get('title', '').strip()
    if not title or not company_name:
        return jsonify({'message': 'Job title and company name are required.'}), 400

    # Parse branches array or string
    eligible_branches = data.get('eligible_branches', ['CSE', 'IT', 'ECE'])
    if isinstance(eligible_branches, str):
        eligible_branches = [b.strip() for b in eligible_branches.split(',') if b.strip()]

    job_doc = {
        'company_id': company_id,
        'company_name': company_name,
        'company_logo': data.get('company_logo', ''),
        'title': title,
        'description': data.get('description', ''),
        'job_type': data.get('job_type', 'Full Time'), # Full Time, Internship, FTE + Internship
        'location': data.get('location', 'Remote / Onsite'),
        'work_mode': data.get('work_mode', 'Hybrid'), # Onsite, Hybrid, Remote
        'ctc': data.get('ctc', '₹8 LPA'),
        'ctc_number': float(data.get('ctc_number') or 8.0),
        'application_deadline': data.get('application_deadline', ''),
        'drive_date': data.get('drive_date', ''),
        'required_skills': data.get('required_skills', []),
        # Eligibility Requirements
        'eligible_branches': eligible_branches,
        'min_cgpa': float(data.get('min_cgpa') or 6.5),
        'max_backlogs': int(data.get('max_backlogs') or 0),
        'graduation_year': str(data.get('graduation_year', '2027')),
        'min_tenth_percentage': float(data.get('min_tenth_percentage') or 60.0),
        'min_twelfth_percentage': float(data.get('min_twelfth_percentage') or 60.0),
        'other_criteria': data.get('other_criteria', ''),
        'status': 'Active',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }

    result = db.jobs.insert_one(job_doc)
    created_job = db.jobs.find_one({'_id': result.inserted_id})

    # Broadcast notification to all students
    students = list(db.students.find({}, {'user_id': 1}))
    notifications = [{
        'user_id': s['user_id'],
        'title': f'New Placement Drive: {title}',
        'message': f'{company_name} is hiring for {title} (Package: {job_doc["ctc"]}). Check your eligibility and apply!',
        'type': 'job_drive',
        'job_id': str(result.inserted_id),
        'is_read': False,
        'created_at': datetime.utcnow()
    } for s in students if s.get('user_id')]
    
    if notifications:
        db.notifications.insert_many(notifications)

    return jsonify(format_doc(created_job)), 201

@job_bp.route('/<job_id>', methods=['PUT'])
@jwt_required
@role_required(['admin', 'recruiter'])
def update_job(job_id):
    data = request.get_json() or {}
    db = get_db()
    j_oid = parse_object_id(job_id)
    if not j_oid:
        return jsonify({'message': 'Invalid job ID'}), 400

    job = db.jobs.find_one({'_id': j_oid})
    if not job:
        return jsonify({'message': 'Job opening not found'}), 404

    # Recruiter ownership check
    if g.user_role == 'recruiter':
        company = db.companies.find_one({'user_id': g.current_user_id})
        if not company or str(company['_id']) != job.get('company_id'):
            return jsonify({'message': 'Forbidden. You can only edit jobs created by your company.'}), 403

    eligible_branches = data.get('eligible_branches', job.get('eligible_branches'))
    if isinstance(eligible_branches, str):
        eligible_branches = [b.strip() for b in eligible_branches.split(',') if b.strip()]

    update_fields = {
        'title': data.get('title', job.get('title')),
        'description': data.get('description', job.get('description')),
        'job_type': data.get('job_type', job.get('job_type')),
        'location': data.get('location', job.get('location')),
        'work_mode': data.get('work_mode', job.get('work_mode')),
        'ctc': data.get('ctc', job.get('ctc')),
        'ctc_number': float(data.get('ctc_number', job.get('ctc_number', 0))),
        'application_deadline': data.get('application_deadline', job.get('application_deadline')),
        'drive_date': data.get('drive_date', job.get('drive_date')),
        'required_skills': data.get('required_skills', job.get('required_skills')),
        'eligible_branches': eligible_branches,
        'min_cgpa': float(data.get('min_cgpa', job.get('min_cgpa', 0))),
        'max_backlogs': int(data.get('max_backlogs', job.get('max_backlogs', 0))),
        'graduation_year': str(data.get('graduation_year', job.get('graduation_year', ''))),
        'min_tenth_percentage': float(data.get('min_tenth_percentage', job.get('min_tenth_percentage', 0))),
        'min_twelfth_percentage': float(data.get('min_twelfth_percentage', job.get('min_twelfth_percentage', 0))),
        'other_criteria': data.get('other_criteria', job.get('other_criteria')),
        'status': data.get('status', job.get('status', 'Active')),
        'updated_at': datetime.utcnow()
    }

    db.jobs.update_one({'_id': j_oid}, {'$set': update_fields})
    updated = db.jobs.find_one({'_id': j_oid})
    return jsonify(format_doc(updated)), 200

@job_bp.route('/<job_id>', methods=['DELETE'])
@jwt_required
@role_required(['admin', 'recruiter'])
def delete_job(job_id):
    db = get_db()
    j_oid = parse_object_id(job_id)
    if not j_oid:
        return jsonify({'message': 'Invalid job ID'}), 400

    job = db.jobs.find_one({'_id': j_oid})
    if not job:
        return jsonify({'message': 'Job opening not found'}), 404

    db.jobs.delete_one({'_id': j_oid})
    return jsonify({'message': 'Job opening deleted successfully'}), 200
