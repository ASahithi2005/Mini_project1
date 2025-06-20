from pymongo import MongoClient

uri = "mongodb://localhost:27017/"
try:
    client = MongoClient(uri, tls=True, serverSelectionTimeoutMS=5000)
    dbs = client.list_database_names()
    print("✅ Connected! Databases:", dbs)
except Exception as e:
    print("❌ Connection failed:", e)
