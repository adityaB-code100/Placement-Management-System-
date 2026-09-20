from flask import Blueprint, request, jsonify, g
from datetime import datetime
from db import get_db
from middleware.auth import jwt_required, role_required
from utils.helpers import parse_object_id, format_doc

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('', methods=['POST'])
@jwt_required
@role_required(['admin', 'recruiter'])
def schedule_interview():
    data = request.get_json() or {}
    student_id = data.get('student_id')
    job_id = data.get('job_id')
    round_name = data.get('round', 'Technical Interview') # Online Assessment, Technical Interview, HR Interview, etc.
    date_str = data.get('date') # e.g. "2026-10-15"
    time_str = data.get('time') # e.g. "10:00 AM"

    if not student_id or not job_id or not date_str:
        return jsonify({'message': 'Student ID, Job ID, and Interview Date are required.'}), 400

    db = get_db()
    s_oid = parse_object_id(student_id)
    j_oid = parse_object_id(job_id)

    student = db.students.find_one({'_id': s_oid}) if s_oid else None
    job = db.jobs.find_one({'_id': j_oid}) if j_oid else None

    if not student or not job:
        return jsonify({'message': 'Student or Job not found.'}), 404

    interview_doc = {
        'student_id': student_id,
        'student_name': student.get('personal_info', {}).get('full_name'),
        'student_email': student.get('personal_info', {}).get('email'),
        'user_id': student.get('user_id'),
        'job_id': job_id,
        'job_title': job.get('title'),
        'company_id': job.get('company_id'),
        'company_name': job.get('company_name'),
        'round': round_name,
        'date': date_str,
        'time': time_str,
        'meeting_link': data.get('meeting_link', 'https://meet.google.com/abc-defg-hij'),
        'location': data.get('location', 'Online / Virtual'),
        'notes': data.get('notes', ''),
        'status': 'Scheduled', # Scheduled, Completed, Cancelled, Rescheduled
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }

    result = db.interviews.insert_one(interview_doc)
    created = db.interviews.find_one({'_id': result.inserted_id})

    # Update application status matching round if appropriate
    app = db.applications.find_one({'student_id': student_id, 'job_id': job_id})
    if app:
        db.applications.update_one(
            {'_id': app['_id']},
            {'$set': {'status': round_name, 'updated_at': datetime.utcnow()}}
        )

    # In-app notification for student
    if student.get('user_id'):
        db.notifications.insert_one({
            'user_id': student.get('user_id'),
            'title': f'Interview Scheduled: {round_name}',
            'message': f'Your {round_name} for {job.get("title")} at {job.get("company_name")} is scheduled on {date_str} at {time_str}.',
            'type': 'interview',
            'interview_id': str(result.inserted_id),
            'is_read': False,
            'created_at': datetime.utcnow()
        })

    return jsonify(format_doc(created)), 201

@interview_bp.route('', methods=['GET'])
@jwt_required
@role_required(['admin', 'recruiter'])
def get_all_interviews():
    db = get_db()
    query = {}
    
    if g.user_role == 'recruiter':
        company = db.companies.find_one({'user_id': g.current_user_id})
        if company:
            query['company_id'] = str(company['_id'])

    job_id = request.args.get('job_id')
    if job_id:
        query['job_id'] = job_id

    interviews = list(db.interviews.find(query).sort('created_at', -1))
    return jsonify(format_doc(interviews)), 200

@interview_bp.route('/my', methods=['GET'])
@jwt_required
@role_required('student')
def get_my_interviews():
    db = get_db()
    student = db.students.find_one({'user_id': g.current_user_id})
    if not student:
        return jsonify([]), 200

    student_id = str(student['_id'])
    interviews = list(db.interviews.find({'student_id': student_id}).sort('date', 1))
    return jsonify(format_doc(interviews)), 200

@interview_bp.route('/<interview_id>', methods=['PUT'])
@jwt_required
@role_required(['admin', 'recruiter'])
def update_interview(interview_id):
    data = request.get_json() or {}
    db = get_db()
    i_oid = parse_object_id(interview_id)
    if not i_oid:
        return jsonify({'message': 'Invalid interview ID'}), 400

    interview = db.interviews.find_one({'_id': i_oid})
    if not interview:
        return jsonify({'message': 'Interview record not found'}), 404

    update_fields = {
        'status': data.get('status', interview.get('status')),
        'date': data.get('date', interview.get('date')),
        'time': data.get('time', interview.get('time')),
        'meeting_link': data.get('meeting_link', interview.get('meeting_link')),
        'location': data.get('location', interview.get('location')),
        'notes': data.get('notes', interview.get('notes')),
        'updated_at': datetime.utcnow()
    }

    db.interviews.update_one({'_id': i_oid}, {'$set': update_fields})
    updated = db.interviews.find_one({'_id': i_oid})

    # Notify student of update
    student_user_id = interview.get('user_id')
    if student_user_id:
        db.notifications.insert_one({
            'user_id': student_user_id,
            'title': f'Interview Updated: {interview.get("round")}',
            'message': f'Your interview details for {interview.get("company_name")} have been updated to status "{update_fields["status"]}".',
            'type': 'interview_update',
            'is_read': False,
            'created_at': datetime.utcnow()
        })

    return jsonify(format_doc(updated)), 200
