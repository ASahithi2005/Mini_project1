from fastapi import APIRouter
from pydantic import BaseModel
from services.ocr_service import run_ocr_with_textract

router = APIRouter()

class OCRRequest(BaseModel):
    image: str  # base64 image

@router.post("/scan")
def scan_prescription(request: OCRRequest):
    extracted_text = run_ocr_with_textract(request.image)
    return {"text": extracted_text}
