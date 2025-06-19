from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))  # e.g. mongodb://localhost:27017
db = client["smart_prescription_db"]
prescriptions = db["prescriptions"]
