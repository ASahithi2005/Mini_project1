from fastapi import APIRouter
from pydantic import BaseModel
from services.parser_service import parse_prescription_text
from db.mongo import prescriptions  # 👈 MongoDB collection
from datetime import datetime
from bson import ObjectId  # To handle MongoDB _id

router = APIRouter()

class ParseRequest(BaseModel):
    text: str

@router.post("/")
def parse_text(request: ParseRequest):
    try:
        structured = parse_prescription_text(request.text)

        # 🛑 Handle errors from model
        if isinstance(structured, dict) and "error" in structured:
            print("❌ Error in parser_service:", structured["error"])
            return {
                "success": False,
                "error": structured["error"],
                "raw_model_output": structured.get("raw_model_output", "")
            }

        # 🕒 Add timestamp and store to DB
        structured["createdAt"] = datetime.utcnow()
        result = prescriptions.insert_one(structured)

        # 🆔 Add the MongoDB _id to returned data
        structured["_id"] = str(result.inserted_id)

        # ✅ Return response
        return {
            "success": True,
            "data": structured
        }

    except Exception as e:
        print("❌ Unhandled exception:", str(e))
        return {
            "success": False,
            "error": str(e)
        }
