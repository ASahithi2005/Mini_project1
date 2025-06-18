from fastapi import FastAPI
from routes import ocr
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Prescription Companion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router, prefix="/ocr")
