import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://hyperlocalaqi_db_user:Test1234@aqiproject.7r8nvxf.mongodb.net/placement_db?retryWrites=true&w=majority")
    JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_placement_jwt_key_2026_xyz_789")
    PORT = int(os.getenv("PORT", 5000))
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
