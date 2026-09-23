# 🎓 Cloud-Based Placement Management and Recruitment System

A complete, production-ready, full-stack campus placement application built for colleges and universities. It streamlines the recruitment ecosystem by connecting **Students**, **Placement Officers (Admins)**, and **Corporate Recruiters**.

---
## Live URL :  https://frontend-opal-tau-kjcer8fkaw.vercel.app/
## 🌟 Key Features

### 👨‍🎓 Student Role
* **Authentication**: Register, login, and secure JWT persistent session.
* **Detailed Profile Management**: Edit Personal Info, Academic Info (10th/12th/Diploma %, CGPA, Active & Total backlogs), Skills, Projects, Certifications, and Resume URL.
* **Live Profile Completeness**: Real-time completeness gauge calculator (0-100%).
* **Placement Drives Catalog**: Search & filter placement opportunities by role, company, location, CTC, and branch.
* **Automatic Eligibility Checker**: Instant real-time evaluation comparing student CGPA, backlogs, branch, and 10th/12th scores against job requirements with detailed failure breakdown.
* **One-Click Applications**: Submit applications to eligible drives.
* **Visual Progress Stepper**: Track recruitment pipeline stage (`Applied` ➔ `Shortlisted` ➔ `Assessment` ➔ `Technical Interview` ➔ `HR Interview` ➔ `Selected`).
* **Interview Schedule**: View scheduled assessment/interview slots with date, time, and Google Meet video link.
* **In-App Notifications**: Real-time notification drawer with unread count badge.

### 🛡️ Placement Officer / Admin Role
* **Analytics Dashboard**: Real-time metrics for total students, registered accounts, approved companies, active drives, total placed, placement %, and CTC averages.
* **Interactive Recharts Analytics**:
  1. Branch-wise placement distribution (Bar Chart)
  2. Top company selections (Horizontal Bar Chart)
  3. Monthly application trends (Area Chart)
  4. Recruitment pipeline stage breakdown (Pie Chart)
  5. Salary package distribution (Range Chart)
* **Company Approvals**: Review recruiter registrations and approve/reject company accounts before they can post drives.
* **Placement Drive Creator**: Modal builder for job openings with mandatory eligibility thresholds.
* **Student Directory**: Searchable student table with CGPA and backlog metrics.
* **Global Pipeline Manager**: Update candidate status stages across all drives.

### 🏢 Recruiter / Corporate Role
* **Company Account Registration**: Register company profile (pending admin approval).
* **Opportunity Posting**: Create drive postings with role description, CTC, and eligibility criteria.
* **Applicant Evaluation**: Filter eligible applicants for company drives, view resume links, and update recruitment stages.
* **Interview Scheduler**: Schedule assessment and interview rounds (date, time, meeting link, candidate instructions) with automated student notifications.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React Icons, Recharts Analytics.
* **Backend**: Python 3.12, Flask, Flask-CORS, PyMongo (MongoDB Atlas), PyJWT, bcrypt, Gunicorn.
* **Database**: MongoDB Atlas (`placement_db`).
* **Deployment**: Render (Separate Frontend & Backend Web Services).

---

## 📁 Directory Structure

```text
Cloud Project/
├── README.md
├── .gitignore
├── backend/
│   ├── app.py                 # Main Flask application & Blueprints
│   ├── seed.py                # Database seed script for MongoDB Atlas
│   ├── config.py              # Configuration & Environment loader
│   ├── db.py                  # PyMongo client manager & Index creator
│   ├── Procfile               # Production startup command for Render
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Backend environment template
│   ├── middleware/
│   │   └── auth.py            # JWT authentication & Role authorization
│   ├── utils/
│   │   ├── eligibility.py     # Automatic eligibility checking engine
│   │   └── helpers.py         # ObjectId & BSON JSON formatters
│   └── routes/
│       ├── auth.py
│       ├── student.py
│       ├── company.py
│       ├── job.py
│       ├── application.py
│       ├── interview.py
│       ├── notification.py
│       └── admin.py
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── NotificationContext.jsx
        ├── services/
        │   └── api.js
        ├── components/
        │   └── common/        # Navbar, Sidebar, EligibilityBadge, ApplicationStepper, StatCard
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── student/       # Student Dashboard, Profile, Drives, Applications, Interviews
            ├── admin/         # Admin Analytics, Students, Companies, Drives, Applications
            └── recruiter/     # Recruiter Dashboard, Company, PostJob, Applicants
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Placement Admin** | `admin@placement.edu` | `Admin@123` | Placement Director (Full Analytics & Company Approval) |
| **Student 1** | `student@placement.edu` | `Student@123` | Rahul Sharma (CSE, 8.8 CGPA, 0 Backlogs - Eligible) |
| **Student 2** | `ananya@placement.edu` | `Student@123` | Ananya Verma (IT, 7.9 CGPA, 0 Backlogs) |
| **Student 3** | `vikram@placement.edu` | `Student@123` | Vikram Singh (ECE, 6.4 CGPA, 1 Backlog - Reduced Eligibility) |
| **Recruiter** | `recruiter@techcorp.com` | `Recruiter@123` | TechCorp Solutions (Approved Corporate Account) |

---

## ⚙️ Environment Variables

### Backend `.env` (`backend/.env`)
```env
MONGO_URI=
JWT_SECRET=super_secret_placement_jwt_key_2026_xyz_789
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run seed script to populate demo data in MongoDB Atlas
python seed.py

# Start Flask local development server
python app.py
```
The Flask REST API will start at `http://localhost:5000`.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Launch Vite development server
npm run dev
```
The React web app will start at `http://localhost:5173`.

---

## 🌐 MongoDB Atlas Setup Instructions

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with read/write permissions.
3. Under **Network Access**, add `0.0.0.0/0` to allow connections from Render.
4. Copy your SRV connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/placement_db?retryWrites=true&w=majority`.
5. Paste this connection string as the `MONGO_URI` environment variable in both your local `.env` and Render backend environment configuration.

---

## 🚀 Render Deployment Instructions

### Service 1: Backend Web Service (Flask API)
* **Root Directory**: `backend`
* **Environment**: `Python 3`
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `gunicorn app:app`
* **Environment Variables**:
  * `MONGO_URI`: Your MongoDB Atlas connection URI
  * `JWT_SECRET`: A secure random secret key
  * `FRONTEND_URL`: URL of your deployed frontend Render service (e.g. `https://placement-frontend.onrender.com`)

### Service 2: Frontend Static Site (React + Vite)
* **Root Directory**: `frontend`
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **Environment Variables**:
  * `VITE_API_URL`: URL of your deployed backend Render service (e.g. `https://placement-backend.onrender.com/api`)

---

## 🔒 Security Best Practices

* Passwords are strictly hashed using **bcrypt** salt routines.
* Protected endpoints enforce role authorization middleware (`@jwt_required`, `@role_required`).
* Strict CORS configuration ensuring frontend and backend communicate securely.
* MongoDB connection strings and JWT secrets are managed strictly through environment variables.
#
