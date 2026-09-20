from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from db import get_db

# Import Blueprints
from routes.auth import auth_bp
from routes.student import student_bp
from routes.company import company_bp
from routes.job import job_bp
from routes.application import application_bp
from routes.interview import interview_bp
from routes.notification import notification_bp
from routes.admin import admin_bp

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS for Vercel / Render deployment compatibility
allowed_origins = [
    Config.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "*"
]

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(student_bp, url_prefix='/api/students')
app.register_blueprint(company_bp, url_prefix='/api/companies')
app.register_blueprint(job_bp, url_prefix='/api/jobs')
app.register_blueprint(application_bp, url_prefix='/api/applications')
app.register_blueprint(interview_bp, url_prefix='/api/interviews')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

@app.route('/', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        db = get_db()
        db.command('ping')
        db_status = "Connected to MongoDB Atlas"
    except Exception as e:
        db_status = f"Database connection warning: {str(e)}"

    return jsonify({
        'status': 'online',
        'app_name': 'Cloud-Based Placement Management and Recruitment System API',
        'database': db_status,
        'version': '1.0.0'
    }), 200

@app.errorhandler(404)
def not_found(e):
    return jsonify({'message': 'Resource or endpoint not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'message': 'An unexpected server error occurred'}), 500

if __name__ == '__main__':
    try:
        get_db()
    except Exception as e:
        print(f"Warning on startup: {e}")
    
    app.run(host='0.0.0.0', port=Config.PORT, debug=True)
