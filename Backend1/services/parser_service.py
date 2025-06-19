import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    api_key=os.getenv("GROQ_API_KEY")
)

# Prompt
prompt_template = ChatPromptTemplate.from_template("""
You are a medical AI. Extract structured fields from the following prescription. Follow these rules:
1. Return ONLY a valid JSON object (no markdown or extra text).
2. Keep all fields present. If any value is missing, set it as "unspecified" or a safe default.

Prescription:
{prescriptionText}

Required JSON Format:
{{
  "doctorName": "Dr. John Doe",
  "doctorLicense": "MD12345",
  "patientName": "Jane Smith",
  "patientAge": 35,
  "patientGender": "Female",
  "diagnosis": "Common Cold",
  "date": "2024-10-18",
  "medicines": [
    {{
      "name": "Acetaminophen",
      "dosage": "500mg",
      "frequency": "Every 6 hours",
      "duration": "5 days"
    }}
  ]
}}
""")

output_parser = StrOutputParser()
chain = prompt_template | llm | output_parser

# Optional preprocessing to clean OCR text
def preprocess_text(text: str) -> str:
    keywords_to_skip = ["EMERGENCY", "REGISTRATION", "HOSPITAL", "DELHI", "NCT", "MLC", "CARD"]
    lines = text.split("\n")
    cleaned_lines = [line for line in lines if not any(k in line.upper() for k in keywords_to_skip)]
    return "\n".join(cleaned_lines)

def parse_prescription_text(raw_text):
    try:
        cleaned = preprocess_text(raw_text)
        result = chain.invoke({"prescriptionText": cleaned})

        # Extract valid JSON block from result
        json_start = result.find("{")
        json_end = result.rfind("}") + 1
        parsed = json.loads(result[json_start:json_end])

        # Fallbacks for missing fields
        parsed["doctorName"] = parsed.get("doctorName", "unspecified")
        parsed["doctorLicense"] = parsed.get("doctorLicense", "unspecified")
        parsed["medicines"] = parsed.get("medicines", [])

        for med in parsed["medicines"]:
            med["duration"] = med.get("duration", "unspecified")

        return parsed

    except Exception as e:
        return {
            "error": str(e),
            "raw_model_output": result if 'result' in locals() else ""
        }
