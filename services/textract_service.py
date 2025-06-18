# services/textract_service.py
import boto3
import base64
import os
from dotenv import load_dotenv

load_dotenv()

def extract_text_from_image_base64(base64_img):
    image_bytes = base64.b64decode(base64_img)

    textract = boto3.client(
        'textract',
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )

    response = textract.detect_document_text(Document={'Bytes': image_bytes})

    text = ''
    for item in response['Blocks']:
        if item['BlockType'] == 'LINE':
            text += item['Text'] + '\n'

    return text