from .textract_service import extract_text_from_image_base64

def run_ocr_with_textract(base64_image):
    return extract_text_from_image_base64(base64_image)