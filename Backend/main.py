from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from analyzer import analyze_log


app = FastAPI(
    title="CyberSentinel API",
    description="AI-powered cybersecurity investigation engine",
    version="0.1.0"
)


# Allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "CyberSentinel",
        "status": "online",
        "version": "0.1.0"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze_security_log(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided"
        )

    allowed_extensions = [".log", ".txt"]

    if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only .log and .txt files are supported"
        )

    try:
        contents = await file.read()
        log_text = contents.decode("utf-8")

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="File must be a UTF-8 text file"
        )

    if not log_text.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded log file is empty"
        )

    try:
        analysis = analyze_log(log_text)

        return {
            "filename": file.filename,
            "analysis": analysis
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(error)}"
        )
