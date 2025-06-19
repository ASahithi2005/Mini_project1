# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ocr, parse, combined_parser  # ✅ make sure combined_parser.py is in routes

app = FastAPI(title="Smart Prescription Companion API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registrations
app.include_router(ocr.router, prefix="/ocr")
app.include_router(parse.router, prefix="/parse")
app.include_router(combined_parser.router, prefix="/parse-image")  # ✅ New route added
