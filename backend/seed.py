import sys
from datetime import datetime, timedelta
from db import get_db
from middleware.auth import hash_password
from config import Config

def seed_database():
    print("==================================================")
    print("  PLACEMENT CELL SYSTEM - MONGO DB ATLAS SEEDING  ")
    print("==================================================")
    
    db = get_db()

    # Clear existing collections to ensure fresh clean state
    print("[1/7] Cleaning existing collection records...")
    db.users.delete_many({})
    db.students.delete_many({})
    db.companies.delete_many({})
    db.jobs.delete_many({})
    db.applications.delete_many({})
    db.interviews.delete_many({})
    db.notifications.delete_many({})

    # 1. Create Admin Account
    print("[2/7] Creating Admin user account...")
    admin_pwd = hash_password("Admin@123")
    admin_user = {
        'email': 'admin@placement.edu',
        'password': admin_pwd,
        'role': 'admin',
        'full_name': 'Prof. Rajesh Kumar (Placement Director)',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    admin_res = db.users.insert_one(admin_user)
    admin_id = str(admin_res.inserted_id)

    # 2. Create Recruiter / Company Accounts
    print("[3/7] Creating Recruiter and Company accounts...")
    rec_pwd = hash_password("Recruiter@123")
    
    # Company 1: TechCorp Solutions (Approved)
    c1_user = db.users.insert_one({
        'email': 'recruiter@techcorp.com',
        'password': rec_pwd,
        'role': 'recruiter',
        'full_name': 'Priya Nair (Lead Recruiter)',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    c1_id = str(c1_user.inserted_id)
    company1 = db.companies.insert_one({
        'user_id': c1_id,
        'company_name': 'TechCorp Solutions',
        'logo_url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        'description': 'TechCorp Solutions is a global leader in cloud innovation, enterprise SaaS platforms, and AI systems.',
        'industry': 'Software & Cloud Infrastructure',
        'website': 'https://techcorp.example.com',
        'location': 'Bangalore, India',
        'hr_name': 'Priya Nair',
        'hr_email': 'recruiter@techcorp.com',
        'hr_phone': '+91 9876543210',
        'status': 'approved',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    comp1_id = str(company1.inserted_id)

    # Company 2: CloudScale Systems (Approved)
    c2_user = db.users.insert_one({
        'email': 'hr@cloudscale.io',
        'password': rec_pwd,
        'role': 'recruiter',
        'full_name': 'Amitabh Roy (Talent Acquisition Head)',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    c2_id = str(c2_user.inserted_id)
    company2 = db.companies.insert_one({
        'user_id': c2_id,
        'company_name': 'CloudScale Systems',
        'logo_url': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150',
        'description': 'Next-generation DevOps and distributed database platform powering high-throughput applications worldwide.',
        'industry': 'Cloud Infrastructure & DevOps',
        'website': 'https://cloudscale.example.com',
        'location': 'Hyderabad, India',
        'hr_name': 'Amitabh Roy',
        'hr_email': 'hr@cloudscale.io',
        'hr_phone': '+91 9876543211',
        'status': 'approved',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    comp2_id = str(company2.inserted_id)

    # Company 3: InnovateSoft Labs (Pending Admin Approval)
    c3_user = db.users.insert_one({
        'email': 'careers@innovatesoft.com',
        'password': rec_pwd,
        'role': 'recruiter',
        'full_name': 'Siddharth Mehta',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    c3_id = str(c3_user.inserted_id)
    company3 = db.companies.insert_one({
        'user_id': c3_id,
        'company_name': 'InnovateSoft Labs',
        'logo_url': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
        'description': 'AI-driven analytics product startup empowering Fortune 500 retail companies.',
        'industry': 'Artificial Intelligence & Data Analytics',
        'website': 'https://innovatesoft.example.com',
        'location': 'Pune, India',
        'hr_name': 'Siddharth Mehta',
        'hr_email': 'careers@innovatesoft.com',
        'hr_phone': '+91 9876543212',
        'status': 'pending',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })

    # 3. Create Student Accounts & Detailed Profiles
    print("[4/7] Creating Student accounts & profiles...")
    std_pwd = hash_password("Student@123")

    # Student 1: Rahul Sharma (Eligible for all)
    s1_u = db.users.insert_one({
        'email': 'student@placement.edu',
        'password': std_pwd,
        'role': 'student',
        'full_name': 'Rahul Sharma',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    s1_id = str(s1_u.inserted_id)
    student1 = db.students.insert_one({
        'user_id': s1_id,
        'email': 'student@placement.edu',
        'personal_info': {
            'full_name': 'Rahul Sharma',
            'email': 'student@placement.edu',
            'phone': '+91 9123456780',
            'dob': '2005-04-12',
            'gender': 'Male',
            'address': 'Flat 402, Green Avenue, Tech City, Bangalore'
        },
        'academic_info': {
            'college': 'National Institute of Technology & Science',
            'department': 'CSE',
            'graduation_year': '2027',
            'tenth_percentage': 92.5,
            'twelfth_percentage': 90.0,
            'diploma_percentage': 0.0,
            'cgpa': 8.8,
            'active_backlogs': 0,
            'total_backlogs': 0
        },
        'professional_info': {
            'skills': ['Python', 'React', 'Node.js', 'MongoDB', 'Docker', 'REST APIs'],
            'certifications': ['AWS Certified Cloud Practitioner', 'Meta Front-End Developer Specialization'],
            'projects': [
                {
                    'title': 'AI Placement Portal',
                    'description': 'Full-stack automated eligibility checking platform built with Flask and React.',
                    'link': 'https://github.com/rahul/placement-portal'
                }
            ],
            'internships': [
                {
                    'company': 'ByteCraft Solutions',
                    'role': 'Full Stack Intern',
                    'duration': '3 Months (Summer 2025)'
                }
            ],
            'github_url': 'https://github.com/rahul-sharma-dev',
            'linkedin_url': 'https://linkedin.com/in/rahul-sharma-dev',
            'portfolio_url': 'https://rahulsharma.dev',
            'resume_url': 'https://raw.githubusercontent.com/pdf/sample-resume.pdf'
        },
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    st1_id = str(student1.inserted_id)

    # Student 2: Ananya Verma (Eligible for most)
    s2_u = db.users.insert_one({
        'email': 'ananya@placement.edu',
        'password': std_pwd,
        'role': 'student',
        'full_name': 'Ananya Verma',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    s2_id = str(s2_u.inserted_id)
    student2 = db.students.insert_one({
        'user_id': s2_id,
        'email': 'ananya@placement.edu',
        'personal_info': {
            'full_name': 'Ananya Verma',
            'email': 'ananya@placement.edu',
            'phone': '+91 9123456781',
            'dob': '2005-08-20',
            'gender': 'Female',
            'address': '12 Park Street, Cyber Hills, Hyderabad'
        },
        'academic_info': {
            'college': 'National Institute of Technology & Science',
            'department': 'IT',
            'graduation_year': '2027',
            'tenth_percentage': 88.0,
            'twelfth_percentage': 86.5,
            'diploma_percentage': 0.0,
            'cgpa': 7.9,
            'active_backlogs': 0,
            'total_backlogs': 0
        },
        'professional_info': {
            'skills': ['Java', 'Spring Boot', 'SQL', 'React', 'Git'],
            'certifications': ['Oracle Certified Associate Java Programmer'],
            'projects': [{'title': 'E-Commerce Microservices', 'description': 'Spring Boot backend with MySQL.', 'link': ''}],
            'internships': [],
            'github_url': 'https://github.com/ananya-v',
            'linkedin_url': 'https://linkedin.com/in/ananya-v',
            'portfolio_url': '',
            'resume_url': 'https://raw.githubusercontent.com/pdf/sample-resume.pdf'
        },
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    st2_id = str(student2.inserted_id)

    # Student 3: Vikram Singh (ECE, 6.4 CGPA, 1 backlog -> fails high CGPA drives)
    s3_u = db.users.insert_one({
        'email': 'vikram@placement.edu',
        'password': std_pwd,
        'role': 'student',
        'full_name': 'Vikram Singh',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    s3_id = str(s3_u.inserted_id)
    student3 = db.students.insert_one({
        'user_id': s3_id,
        'email': 'vikram@placement.edu',
        'personal_info': {
            'full_name': 'Vikram Singh',
            'email': 'vikram@placement.edu',
            'phone': '+91 9123456782',
            'dob': '2004-11-05',
            'gender': 'Male',
            'address': '45 College Road, Pune'
        },
        'academic_info': {
            'college': 'National Institute of Technology & Science',
            'department': 'ECE',
            'graduation_year': '2027',
            'tenth_percentage': 75.0,
            'twelfth_percentage': 72.0,
            'diploma_percentage': 0.0,
            'cgpa': 6.4,
            'active_backlogs': 1,
            'total_backlogs': 2
        },
        'professional_info': {
            'skills': ['C++', 'Embedded Systems', 'VLSI', 'Python'],
            'certifications': [],
            'projects': [],
            'internships': [],
            'github_url': '',
            'linkedin_url': '',
            'portfolio_url': '',
            'resume_url': ''
        },
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })

    # 4. Create Placement Drives / Job Openings
    print("[5/7] Creating Placement Drives / Job Openings...")
    job1 = db.jobs.insert_one({
        'company_id': comp1_id,
        'company_name': 'TechCorp Solutions',
        'company_logo': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        'title': 'Software Development Engineer (SDE-1)',
        'description': 'We are looking for passionate full-stack software engineers to build high-scale cloud backend services and modern frontend interfaces.',
        'job_type': 'Full Time',
        'location': 'Bangalore, India',
        'work_mode': 'Hybrid',
        'ctc': '₹12.5 LPA',
        'ctc_number': 12.5,
        'application_deadline': (datetime.utcnow() + timedelta(days=20)).strftime('%Y-%m-%d'),
        'drive_date': (datetime.utcnow() + timedelta(days=25)).strftime('%Y-%m-%d'),
        'required_skills': ['Python', 'Data Structures', 'System Design', 'React', 'PostgreSQL'],
        'eligible_branches': ['CSE', 'IT'],
        'min_cgpa': 7.5,
        'max_backlogs': 0,
        'graduation_year': '2027',
        'min_tenth_percentage': 75.0,
        'min_twelfth_percentage': 75.0,
        'other_criteria': 'Good problem solving skills and proficiency in algorithms.',
        'status': 'Active',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    j1_id = str(job1.inserted_id)

    job2 = db.jobs.insert_one({
        'company_id': comp2_id,
        'company_name': 'CloudScale Systems',
        'company_logo': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150',
        'title': 'Cloud & DevOps Engineer Intern',
        'description': 'Join our infrastructure engineering team to design CI/CD pipelines, Kubernetes deployments, and terraform scripts.',
        'job_type': 'FTE + Internship',
        'location': 'Hyderabad, India',
        'work_mode': 'Onsite',
        'ctc': '₹10.0 LPA',
        'ctc_number': 10.0,
        'application_deadline': (datetime.utcnow() + timedelta(days=15)).strftime('%Y-%m-%d'),
        'drive_date': (datetime.utcnow() + timedelta(days=18)).strftime('%Y-%m-%d'),
        'required_skills': ['Linux', 'Docker', 'Kubernetes', 'Python / Bash', 'AWS'],
        'eligible_branches': ['CSE', 'IT', 'ECE', 'EEE'],
        'min_cgpa': 7.0,
        'max_backlogs': 0,
        'graduation_year': '2027',
        'min_tenth_percentage': 70.0,
        'min_twelfth_percentage': 70.0,
        'other_criteria': 'Basic understanding of networking and Linux administration.',
        'status': 'Active',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    j2_id = str(job2.inserted_id)

    job3 = db.jobs.insert_one({
        'company_id': comp1_id,
        'company_name': 'TechCorp Solutions',
        'company_logo': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        'title': 'Data Analyst & BI Specialist',
        'description': 'Analyze business datasets, construct automated ETL pipelines, and create real-time executive dashboards.',
        'job_type': 'Full Time',
        'location': 'Remote',
        'work_mode': 'Remote',
        'ctc': '₹8.0 LPA',
        'ctc_number': 8.0,
        'application_deadline': (datetime.utcnow() + timedelta(days=10)).strftime('%Y-%m-%d'),
        'drive_date': (datetime.utcnow() + timedelta(days=14)).strftime('%Y-%m-%d'),
        'required_skills': ['SQL', 'Python', 'Pandas', 'Tableau / PowerBI', 'Excel'],
        'eligible_branches': ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'],
        'min_cgpa': 6.0,
        'max_backlogs': 1,
        'graduation_year': '2027',
        'min_tenth_percentage': 60.0,
        'min_twelfth_percentage': 60.0,
        'other_criteria': 'Open to all engineering branches with analytical skills.',
        'status': 'Active',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })
    j3_id = str(job3.inserted_id)

    # 5. Create Applications & Recruitment Pipeline Stages
    print("[6/7] Creating Applications & Pipeline histories...")
    app1 = db.applications.insert_one({
        'student_id': st1_id,
        'user_id': s1_id,
        'job_id': j1_id,
        'company_id': comp1_id,
        'company_name': 'TechCorp Solutions',
        'job_title': 'Software Development Engineer (SDE-1)',
        'status': 'Technical Interview',
        'status_history': [
            {'status': 'Applied', 'updated_at': (datetime.utcnow() - timedelta(days=5)).isoformat(), 'notes': 'Applied online.'},
            {'status': 'Shortlisted', 'updated_at': (datetime.utcnow() - timedelta(days=3)).isoformat(), 'notes': 'Profile shortlisted.'},
            {'status': 'Assessment', 'updated_at': (datetime.utcnow() - timedelta(days=2)).isoformat(), 'notes': 'Cleared coding test.'},
            {'status': 'Technical Interview', 'updated_at': (datetime.utcnow() - timedelta(days=1)).isoformat(), 'notes': 'Round 1 cleared.'}
        ],
        'student_snapshot': {
            'full_name': 'Rahul Sharma',
            'email': 'student@placement.edu',
            'phone': '+91 9123456780',
            'department': 'CSE',
            'cgpa': 8.8,
            'active_backlogs': 0,
            'resume_url': 'https://raw.githubusercontent.com/pdf/sample-resume.pdf'
        },
        'created_at': datetime.utcnow() - timedelta(days=5),
        'updated_at': datetime.utcnow() - timedelta(days=1)
    })

    app2 = db.applications.insert_one({
        'student_id': st2_id,
        'user_id': s2_id,
        'job_id': j2_id,
        'company_id': comp2_id,
        'company_name': 'CloudScale Systems',
        'job_title': 'Cloud & DevOps Engineer Intern',
        'status': 'Shortlisted',
        'status_history': [
            {'status': 'Applied', 'updated_at': (datetime.utcnow() - timedelta(days=4)).isoformat(), 'notes': 'Application submitted.'},
            {'status': 'Shortlisted', 'updated_at': (datetime.utcnow() - timedelta(days=1)).isoformat(), 'notes': 'Selected for online assessment.'}
        ],
        'student_snapshot': {
            'full_name': 'Ananya Verma',
            'email': 'ananya@placement.edu',
            'phone': '+91 9123456781',
            'department': 'IT',
            'cgpa': 7.9,
            'active_backlogs': 0,
            'resume_url': 'https://raw.githubusercontent.com/pdf/sample-resume.pdf'
        },
        'created_at': datetime.utcnow() - timedelta(days=4),
        'updated_at': datetime.utcnow() - timedelta(days=1)
    })

    # 6. Create Interviews & Notifications
    print("[7/7] Scheduling Interviews & Notifications...")
    db.interviews.insert_one({
        'student_id': st1_id,
        'student_name': 'Rahul Sharma',
        'student_email': 'student@placement.edu',
        'user_id': s1_id,
        'job_id': j1_id,
        'job_title': 'Software Development Engineer (SDE-1)',
        'company_id': comp1_id,
        'company_name': 'TechCorp Solutions',
        'round': 'Technical Interview',
        'date': (datetime.utcnow() + timedelta(days=3)).strftime('%Y-%m-%d'),
        'time': '11:00 AM',
        'meeting_link': 'https://meet.google.com/xyz-tech-corp',
        'location': 'Online / Google Meet',
        'notes': 'Focus on Data Structures, Algorithms, and System Architecture.',
        'status': 'Scheduled',
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    })

    # Notifications for Rahul
    db.notifications.insert_many([
        {
            'user_id': s1_id,
            'title': 'Interview Scheduled',
            'message': 'Your Technical Interview for SDE-1 at TechCorp Solutions is scheduled for 11:00 AM.',
            'type': 'interview',
            'is_read': False,
            'created_at': datetime.utcnow()
        },
        {
            'user_id': s1_id,
            'title': 'New Drive Announced',
            'message': 'CloudScale Systems posted Cloud & DevOps Engineer Intern position.',
            'type': 'job_drive',
            'is_read': True,
            'created_at': datetime.utcnow() - timedelta(days=2)
        }
    ])

    print("==================================================")
    print("  SEED COMPLETED SUCCESSFULLY!")
    print("--------------------------------------------------")
    print("  DEMO CREDENTIALS:")
    print("  1. Admin:      admin@placement.edu     / Admin@123")
    print("  2. Student 1:  student@placement.edu   / Student@123")
    print("  3. Student 2:  ananya@placement.edu    / Student@123")
    print("  4. Recruiter:  recruiter@techcorp.com  / Recruiter@123")
    print("==================================================")

if __name__ == '__main__':
    seed_database()
