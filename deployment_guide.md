# 🚀 Deployment Guide: Vercel (Frontend) & Render (Backend)

This document provides a step-by-step walkthrough for deploying the **Cloud-Based Placement Management and Recruitment System** to production.

---

## 🔐 1. Security & Sensitive Files Checklist

Before pushing code to GitHub or deploying, verify that all sensitive credentials and environment files are safely excluded from source control:

- [x] `.gitignore` excludes `.env`, `backend/.env`, `frontend/.env`, `node_modules/`, `mongodb connection.txt`, and log files.
- [x] Sanitized `.env.example` templates are provided in both `backend/` and `frontend/`.
- [x] Passwords are strictly hashed with `bcrypt` salt rounds.
- [x] JWT tokens use environment-driven secret keys (`JWT_SECRET`).

---

## 🍃 2. MongoDB Atlas Configuration

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create or select a Cluster.
3. Under **Database Access**:
   - Click **Add New Database User**.
   - Set Authentication Method to **Password**.
   - Grant role **Read and write to any database**.
4. Under **Network Access**:
   - Click **Add IP Address**.
   - Add `0.0.0.0/0` (Allow Access from Anywhere) so Render web services can connect securely.
5. Click **Connect** on your cluster -> Select **Drivers (Python)** -> Copy the SRV connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster.mongodb.net/placement_db?retryWrites=true&w=majority
   ```

---

## 🖥️ 3. Backend Deployment on Render

1. Log in to [Render](https://render.com/).
2. Click **New +** -> Select **Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Name**: `placement-backend-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest region (e.g. Singapore / Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (or leave default if using `Procfile`)
5. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `MONGO_URI` | `mongodb+srv://<username>:<password>@cluster.mongodb.net/placement_db?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `generate_a_random_32_character_secret_key` |
   | `PORT` | `5000` |
   | `FRONTEND_URL` | `https://your-app-name.vercel.app` (Your Vercel deployment URL) |

6. Click **Create Web Service**.
7. Once deployed, note down your Render backend API URL (e.g., `https://placement-backend-api.onrender.com`).

---

## ⚡ 4. Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> Select **Project**.
3. Import your GitHub repository.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://placement-backend-api.onrender.com/api` (Render API URL + `/api`) |

6. **SPA Routing Notice**:
   The `frontend/vercel.json` file automatically handles single-page application client-side rewrites:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   This ensures direct access to routes like `/student/dashboard`, `/login`, or `/admin/companies` works without returning 404 errors.

7. Click **Deploy**.

---

## 🧪 5. Post-Deployment Verification Checklist

1. **Database Seeding**: Run `python backend/seed.py` locally or against Atlas URI to seed initial accounts.
2. **Backend Health Check**: Open `https://placement-backend-api.onrender.com/api/health` in your browser. Verify it responds with status `200 OK` and `"database": "Connected to MongoDB Atlas"`.
3. **Frontend Login**: Open your Vercel deployment URL, navigate to `/login`, and test logging in with demo credentials:
   - **Admin**: `admin@placement.edu` / `Admin@123`
   - **Student**: `student@placement.edu` / `Student@123`
   - **Recruiter**: `recruiter@techcorp.com` / `Recruiter@123`
4. **Eligibility Checking**: Apply to a drive as a student and verify real-time eligibility evaluation logic.
