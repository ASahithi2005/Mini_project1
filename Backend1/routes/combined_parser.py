from fastapi import APIRouter
from pydantic import BaseModel
from services.textract_service import extract_text_from_image_base64
from services.parser_service import parse_prescription_text
from db.mongo import prescriptions  
from datetime import datetime
from bson import ObjectId 

router = APIRouter()

class ImageRequest(BaseModel):
    image: str  # Base64 image input

@router.post("/")
def ocr_and_parse(request: ImageRequest):
    try:
        # Step 1: Extract raw text using AWS Textract
        ocr_text = extract_text_from_image_base64(request.image)

        # Step 2: Parse structured data using LLM
        structured = parse_prescription_text(ocr_text)

        # Handle errors from parser
        if isinstance(structured, dict) and "error" in structured:
            print("❌ Error in parser_service:", structured["error"])
            return {
                "success": False,
                "error": structured["error"],
                "ocr_text": ocr_text,
                "raw_model_output": structured.get("raw_model_output", "")
            }

        # Step 3: Add metadata and store in MongoDB
        structured["ocr_text"] = ocr_text
        structured["createdAt"] = datetime.utcnow()
        result = prescriptions.insert_one(structured)

        # Step 4: Attach MongoDB ID
        structured["_id"] = str(result.inserted_id)

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
