import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import Config

client = None
db = None

def get_db():
    global client, db
    if db is None:
        try:
            client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
            # Test connection
            client.admin.command('ping')
            
            # Extract database name from URI or fallback to placement_db
            db_name = Config.MONGO_URI.split('/')[-1].split('?')[0] or 'placement_db'
            db = client[db_name]
            print(f"[DB] Successfully connected to MongoDB Atlas database: {db_name}")
            setup_indexes(db)
        except ConnectionFailure as e:
            print(f"[DB ERROR] Could not connect to MongoDB Atlas: {e}", file=sys.stderr)
            raise e
        except Exception as e:
            print(f"[DB ERROR] Connection error: {e}", file=sys.stderr)
            raise e
    return db

def setup_indexes(database):
    try:
        # Users collection
        database.users.create_index("email", unique=True)
        # Students collection
        database.students.create_index("user_id", unique=True)
        database.students.create_index("email", unique=True)
        # Companies collection
        database.companies.create_index("user_id", unique=True)
        # Applications collection
        database.applications.create_index([("student_id", 1), ("job_id", 1)], unique=True)
        print("[DB] Collections and indexes initialized successfully.")
    except Exception as e:
        print(f"[DB INDEX NOTICE] Index creation status: {e}")
