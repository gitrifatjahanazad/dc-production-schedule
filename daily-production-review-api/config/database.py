from pymongo import MongoClient

client = MongoClient("mongodb+srv://arifaaasha:admin123@cluster0.nqz2l88.mongodb.net/?retryWrites=true&w=majority")

db = client.daily_production_review_db
collection_name = db["models"]
collection_remarks_name = db["remarks"]